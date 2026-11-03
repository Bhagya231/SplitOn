
import { useState , useEffect} from "react";
import { Form } from "react-router-dom";
import Select from "react-select";
import FormInput from "./common/FormInput";
import Button from "./common/Button";
import { validateExpense } from "../util/validations";



function AddExpense({members=[], expense = null, onAddExpense, onEditExpense,onCancel})
{

    const isEdit = Boolean(expense);
    const [form , setForm] = useState({title:"",amount: "", date: ""});

    const [payer,setPayer] = useState(null);
    const [selectedMember, setSelectedMember] = useState([]);

    const [splitType, setSplitType] = useState("EQUAL");
    const [percentages, setPercentages] = useState({});
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);


     const memberOptions = members.map((member) => ({value: member.id,label: member.name, }));

     function handleChange(event)
     {
        const {name, value }= event.target;

        setForm((prev) => ({...prev,[name]: value}));

        setErrors((prev) => ({...prev, [name]: "",}));

        setErrorMessage("");

     }

     function handleMembersChange(selectedOptions)
     {
         const selected = selectedOptions || [];

         setSelectedMember(selected);

         setPercentages((prev) => {
            const updated = {};

            selected.forEach((member) => {
                updated[member.value] = prev[member.value] ?? "";
            })

            return updated;

         });
         setErrors((prev) => ({...prev,splitMembers: "", percentage: "",}));

     }


      const totalPercentage = selectedMember.reduce((total, member) => total + Number(percentages[member.value] || 0), 0);

     function handlePercentageChange(memberId, value) 
     {
        setPercentages((prev) => ({...prev, [memberId]: value, }));

        setErrors((prev) => ({ ...prev, percentage: "",}));
    }



    useEffect(() => {
        if (!expense) {
            setForm({ title: "", amount: "", date: "" });
            setPayer(null);
            setSelectedMember([]);
            setSplitType("EQUAL");
            setPercentages({});
            setErrors({});
            setErrorMessage("");
            return;
        }

        setForm({
            title: expense.title ?? "",
            amount: String(expense.amount ?? ""),
            date: expense.date ? expense.date.slice(0, 10) : "",
        });

        setPayer(
            members.find((member) => member.id === expense.payerId)
            ? {
                value: expense.payerId,
                label: members.find(
                    (member) => member.id === expense.payerId
                ).name,
                }
            : null
        );

        const selected = (expense.splitMembers ?? [])
            .map((splitMember) => {
            const member = members.find(
                (item) => item.id === splitMember.id
            );

            return member
                ? { value: member.id, label: member.name }
                : null;
            })
            .filter(Boolean);

        setSelectedMember(selected);
        setSplitType(expense.splitType ?? "EQUAL");

        const percentageValues = {};

        (expense.splitMembers ?? []).forEach((member) => {
            percentageValues[member.id] = member.percentage ?? "";
        });

        setPercentages(percentageValues);
        setErrors({});
        setErrorMessage("");
        }, [expense, members]);


   async function handleSubmit(event) 
   {
        event.preventDefault();

        if (submitting) {
            return;
        }

        const expenseData = {
            title: form.title,
            amount: form.amount,
            date: form.date,
            payerId: payer?.value || "",
            splitType,
            splitMembers: selectedMember.map((member) => {
            if (splitType === "EQUAL") {
                return { id: member.value };
            }

            return {
                id: member.value,
                percentage: Number(percentages[member.percentage]),
            };
            }),
        };

        const validationErrors = validateExpense(expenseData);
        setErrors(validationErrors);
        setErrorMessage("");

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            const res = expense ? await onEditExpense(expense.id, expenseData) : await onAddExpense(expenseData);

            if (!res)
            {
                setErrorMessage(`Failed to ${isEdit ? "update" : "add"} expense. Please try again.` );
                return;
            }

            if (res) {
            setErrorMessage("");

            if (expense) {
                onCancel?.();
            } else {
                setForm({ title: "", amount: "", date: "" });
                setPayer(null);
                setSelectedMember([]);
                setSplitType("EQUAL");
                setPercentages({});
                setErrors({});
            }
            } 
        } catch (error) {
            console.error("Expense submission failed:", error);
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
        }


    return (
        <Form onSubmit={handleSubmit} noValidate>
            <div className="row mx-3">

                <div className="col-md-4">

                    <FormInput label="Description" name="title" 
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter expense description"
                        required
                        error={errors.title}
                        />

                </div>

                <div className="col-md-4">
                    <FormInput
                        label="Amount"
                        name="amount"
                        type="number"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        min="0.01"
                        step="0.01"
                        required
                        error={errors.amount}
                    />
                </div>

                 <div className="col-md-4">
                    <FormInput
                        label="Expense Date"
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                        error={errors.date}
                    />
                </div>




            </div>

            <div className="row mx-3">


                <div className="mb-3 col-md-4  ">

                    <label className="form-label fw-semibold">
                        Paid By <span className="text-danger">*</span>
                    </label>

                    <Select options={memberOptions}
                        value={payer}
                        onChange={(option) => {
                            setPayer(option);
                                if (option) {
                                    setSelectedMember((prev) => {
                                        const otherMembers = prev.filter(
                                            (member) => member.value !== payer?.value);
                                        return [...otherMembers,option,];
                                    });
                                } else {
                                    setSelectedMember((prev) =>prev.filter((member) => member.value !== payer?.value));
                                }
                            setErrors((prev) => ({...prev,payerId: "",splitMembers: "",}));

                            
                        }}
                        placeholder="Select who paid"
                        isClearable
                        />


                    {errors.payerId && (
                        <div className="text-danger small mt-1">
                            {errors.payerId}
                        </div>
                    )}


                </div>

                <div className="mb-3 col-md-4">

                   
                    <div className="mt-1">
                         <label className="form-label fw-semibold">
                        Split Type
                    </label>
                    </div>
                    <div className="mt-1">

                    <div className="d-flex gap-4">
                        <div className="form-check">
                            <input className="form-check-input"
                                type="radio"
                                name="splitType"
                                id="equalSplit"
                                value="EQUAL"
                                checked={splitType === "EQUAL"}
                                onChange={() => {
                                    setSplitType("EQUAL");
                                    setErrors((prev) => ({...prev,percentages: ""}));
                                }}
                            />

                            <label className="form-check-label" htmlFor="equalSplit">
                                Equal Split
                            </label>

                        </div>

                        <div className="form-check">
                            <input  className="form-check-input"
                                type="radio"
                                name="splitType"
                                id="percentageSplit"
                                value="PERCENTAGE"
                                checked={splitType === "PERCENTAGE"}
                                onChange={() => setSplitType("PERCENTAGE")}
                            />
                            <label className="form-check-label" htmlFor="percentageSplit">
                                Percentage Split
                            </label>
                        </div>
                   </div>

                    </div>


                </div>


            


            <div className="mb-3 col-md-6 ">
                <label className="form-label fw-semibold">
                    Participants <span className="text-danger">*</span>
                </label>

                <Select
                    isMulti
                    options={memberOptions}
                    value={selectedMember}
                    onChange={handleMembersChange}
                    placeholder="Select participants"
                    closeMenuOnSelect={false}
                />

                {errors.splitMembers && (
                    <div className="text-danger small mt-1">
                        {errors.splitMembers}
                    </div>
                )}



                  <div className="d-flex justify-content-start my-4 ">
                    <Button
                        type="submit"
                        className="btn btn-primary "
                        size="medium"
                        variant="primary"
                        loading={submitting}
                        disabled={submitting}
                    >

                        {submitting ? isEdit ? "Editing..." : "Adding..." : isEdit ? "Edit Expense" : "+ Add expense"}
                        
                    </Button>


                    {expense && (
                        <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={submitting}
                        >
                        Cancel
                        </Button> 
                    )}
                </div>

            </div>


          


            {splitType === "PERCENTAGE" && selectedMember.length > 0 && (
                <div className="table-reponsive mt-3 col-md-4">
                    <table className="table table-bordered align-middle">

                        <thead className="table-light">
                            <tr>
                                <th>Member Name</th>
                                <th style={{ width: "220px" }}>
                                    Percentage (%)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedMember.map((member) => (
                                <tr key={member.value}>
                                    <td>{member.label}</td> 
                                    <td className="d-flex">
                                        <FormInput 
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={percentages[member.value]}
                                            onChange={(event) =>
                                                handlePercentageChange(
                                                    member.value,
                                                    event.target.value
                                                )
                                            }
                                            style={{width:"200px"}}
                                            placeholder="Enter percentage"
                                        />
                                        <span className="mt-2 ms-1">%</span>

                                    </td>

                                </tr>
                            ))}
                        </tbody>
                        <tfoot >
                            <tr >
                                 <th className="bg-success text-white">Total</th>
                                <th className="bg-success text-white">
                                    {totalPercentage.toFixed(2)}%
                                </th>
                            </tr>
                        </tfoot>



                    </table>

                     {errors.percentage && (
                        <div className="text-danger small">
                            {errors.percentage}
                        </div>
                    )}


                </div>
            )}

            </div>


             {errorMessage && (
                <div className="alert alert-danger py-2">
                    {errorMessage}
                </div>
            )}

            





        </Form>
    )




}


export default AddExpense;