
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import FormInput from "./common/FormInput";
import Button from "./common/Button";
import SplitTable from "./splitTable";
import DatePicker from "./common/DatePicker";
import { toast } from "react-toastify";


import api from "../util/Api";
import { validateExpense } from "../util/validations";



export default function ExpenseForm({ members = [],expense = null, groupId,onCancel,})
 {
  const navigate = useNavigate();

  const isEdit = Boolean(expense);

  const [form, setForm] = useState({title: "", amount: "",date: "",});
    
   

  const [payer, setPayer] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [splitType, setSplitType] = useState("EQUAL");
  const [percentages, setPercentages] = useState({});
  const [manualPercentages, setManualPercentages] = useState({});

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

 
  const memberOptions = useMemo(() =>
      members.map((member) => ({
        value: member.memberId,
        label: member.memberName,
      })),
    [members]
  );

  const amount = form.amount;
  
  useEffect(() => {
        if (!errorMessage) return;

        const timer = setTimeout(() => {
        setErrorMessage("");
        }, 4000);

        return () => clearTimeout(timer);
    }, [errorMessage]);


    const selectAllOption = { value: "__select_all__", label: "Select All",  };

    const optionsWithSelectAll = [  selectAllOption, ...memberOptions, ];

    useEffect(() => {

        if (!expense) return;

        setForm({
        title: expense.title ?? "",
        amount: String(expense.amount ?? ""),
        date: expense.date?.slice(0, 10) ?? "",
        });

        const payerOption = memberOptions.find(
        (member) => member.value === expense.payerId
        );

        setPayer(payerOption ?? null);

        const selected = (expense.splitMembers ?? []).map((splitMember) => {
            const memberId = splitMember.memberId ?? splitMember.id;

            return memberOptions.find( (member) => member.value === memberId);
        })
        .filter(Boolean);

        setSelectedMembers(selected);
        setSplitType(expense.splitType ?? "EQUAL");

        const values = {};

        (expense.splitMembers ?? []).forEach((splitMember) => {
        const memberId = splitMember.memberId ?? splitMember.id;

        values[memberId] = splitMember.percentage ?? "";
        });

        setPercentages(values);
        setManualPercentages({});

    }, [expense, memberOptions]);


    function calculateEqualShares(amount, members) 
    {
        if (!members.length) return {};

        const totalPaise = Math.round(Number(amount) * 100);

        const equalShare = Math.floor(totalPaise / members.length);
        const remainder = totalPaise % members.length;

        const result = {};

        members.forEach((member, index) => {
            const share = equalShare + (index < remainder ? 1 : 0);

            result[member.value] = share / 100;
        });

        return result;
    }


    function redistributePercentages(members, manualValues) 
    {

        const result = {};

        
        const manualIds = Object.keys(manualValues);

       
        const manualTotal = manualIds.reduce( (total, id) => total + Math.round(Number(manualValues[id]) * 100), 0);

        
        const remaining = 100 - manualTotal;

        
        const automaticMembers = members.filter( member => !manualIds.includes(String(member.value)));

        
        manualIds.forEach(id => { result[id] = Number(manualValues[id]);});

        
        if (automaticMembers.length > 0)
        {

            const equalShare = Math.floor(  remaining / automaticMembers.length);

            const remainder = remaining % automaticMembers.length;

            automaticMembers.forEach((member, index) => {

                const share = equalShare + (index < remainder ? 1 : 0);

                result[member.value] = share;

            });

        }

        return result;
    }

  
  function handleChange(event) 
  {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setErrorMessage("");
  }


  
  function handleMembersChange(options) 
  {
        const selected = options ?? [];

        const isSelectAllClicked = selected.some((option) => option.value === "__select_all__");

        const updatedMembers = isSelectAllClicked ? memberOptions : selected;

        setSelectedMembers(updatedMembers);
        

        if (splitType === "PERCENTAGE")
        {
             const selectedIds = updatedMembers.map(
            member => String(member.value)
        );

        const updatedManual = Object.fromEntries(
            Object.entries(manualPercentages).filter(
                ([id]) => selectedIds.includes(id)
            )
        );

        setManualPercentages(updatedManual);
         setPercentages(redistributePercentages(updatedMembers, updatedManual));
    
        }

        setErrors((previous) => ({
            ...previous,
            splitMembers: "",
            percentage: "",
        }));
        }


 
    function handlePayerChange(option) 
    {
        setPayer(option);

        if (option)
        {
            const updatedMembers = selectedMembers.some(member => member.value === option.value) ? selectedMembers : [...selectedMembers, option];

            setSelectedMembers(updatedMembers);

            if (splitType === "PERCENTAGE") 
            {

                const selectedIds = updatedMembers.map(member => String(member.value));

                const updatedManual = Object.fromEntries( Object.entries(manualPercentages).filter(([id]) => selectedIds.includes(id)));

                setManualPercentages(updatedManual);

                setPercentages(  redistributePercentages(updatedMembers, updatedManual) );
            }
        }

        setErrors((previous) => ({...previous, payerId: "",}));
    }


  
  function handlePercentageChange(memberId, value)
   {

     const newValue = value === "" ? 0 : Number(value);

    
    if (!Number.isFinite(newValue) || newValue < 0 || newValue > 100) {
        return;
    }

    
    const updatedManual = { ...manualPercentages, [memberId]: newValue};

     const manualTotal = Object.values(updatedManual).reduce( (total, percentage) => total + Math.round(Number(percentage) * 100), 0);


      const automaticMembers = selectedMembers.filter(
        member => !Object.prototype.hasOwnProperty.call(
            updatedManual,
            String(member.value)
        )
    );



     setManualPercentages(updatedManual);

   
    const updatedPercentages = redistributePercentages( selectedMembers, updatedManual);
   

     setPercentages(updatedPercentages);

    setErrors(prev => ({...prev,percentage: ""}));
   
  }


 
    function handleSplitTypeChange(value) 
    {
        setSplitType(value);

        setErrors((previous) => ({
            ...previous,
            percentage: "",
        }));

        setManualPercentages({});

        if (value === "PERCENTAGE") {

            setPercentages( calculateEqualPercentages(selectedMembers));

        } else {

            setPercentages({});
        }
    }


  
  async function handleSubmit(event) 
  {
    event.preventDefault();

    if (submitting) return;

    
    const expenseData = {
      title: form.title,
      amount: form.amount,
      date: form.date,
      payerId: payer?.value ?? "",
      splitType,
      splitMembers: selectedMembers.map((member) => ({ id: member.value,
        ...(splitType === "PERCENTAGE"? {
              percentage: Number(percentages[member.value] || 0 ),
            }
          : {}),
      })),
    };

   
    const validationErrors = validateExpense(expenseData);

    setErrors(validationErrors);
    setErrorMessage("");

    if (Object.keys(validationErrors).length > 0)
    {
        setErrors(validationErrors);
        return;
    }
    setSubmitting(true);

    try {
    
      if (isEdit) {
        await api.put( `/groups/${groupId}/expenses/${expense.id}`, expenseData);

        toast.success("Expense edited successfully");

        navigate(`/app/groups/${groupId}/expenses/${expense.id}`);
        
      
      } else {
        await api.post(`/groups/${groupId}/expenses/add`,expenseData );

        toast.success("Expense added successfully!");

        navigate(`/app/groups/${groupId}`);

      }

      
      

    } catch (error) {
      console.error("Expense submission failed:", error);

      toast.error( error.response?.data?.message || "Something went wrong. Please try again.");

    } finally {
      setSubmitting(false);
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      <div className="card border-0 shadow-sm rounded-4 ">
        <div className="card-body p-3 p-md-4 mx-2">

          <div className="mb-4">
            <h4 className="fw-bold mb-1">
              {isEdit ? "Edit Expense" : "Add New Expense"}
            </h4>

            <p className="text-muted mb-0">
              Enter expense details and select how to split it.
            </p>
          </div>

          {errorMessage && (
            <div className="alert alert-danger py-2">
              {errorMessage}
            </div>
          )}

          <div className="row ">
            <div className="col-md-12">
              <FormInput
                label="Description"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter expense description"
                required
                error={errors.title}
              />
            </div>

            <div className="col-md-6">
              <FormInput
                label="Amount"
                name="amount"
                type="number"
                min={1}
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
                error={errors.amount}
              />
            </div>

            <div className="col-md-6">
                <DatePicker
                    label="Expense Date"
                    name="date"
                    value={form.date}
                    onChange={(value) =>
                        setForm(prev => ({
                            ...prev,
                            date: value
                        }))
                    }
                    error={errors.date}
                    required
                />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Paid By <span className="text-danger">*</span>
              </label>

              <Select
                options={memberOptions}
                value={payer}
                onChange={handlePayerChange}
                placeholder="Select who paid"
                isClearable
              />

              {errors.payerId && (
                <div className="text-danger small mt-1">
                  {errors.payerId}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Split Type
              </label>

              <div className="d-flex flex-wrap gap-4 mt-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="splitType"
                    id="equalSplit"
                    checked={splitType === "EQUAL"}
                    onChange={() => handleSplitTypeChange("EQUAL")}
                  />

                  <label className="form-check-label" htmlFor="equalSplit">
                    Equal Split
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="splitType"
                    id="percentageSplit"
                    checked={splitType === "PERCENTAGE"}
                    onChange={() => handleSplitTypeChange("PERCENTAGE")}
                  />

                  <label className="form-check-label" htmlFor="percentageSplit">
                    Percentage Split
                  </label>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h5 className="fw-semibold mb-1">Participants</h5>

              <span className="text-muted small">
                {selectedMembers.length} of {memberOptions.length} selected
              </span>
            </div>

            {/* <div className="d-flex gap-2">
              <Button type="button" size="small" variant="outline-primary"
                onClick={() => handleMembersChange(memberOptions)}
                disabled={selectedMembers.length === memberOptions.length} >
                Select All
              </Button>


            </div> */}
          </div>

          <Select
            isMulti
            options={optionsWithSelectAll}
            value={selectedMembers}
            onChange={handleMembersChange}
            placeholder="Search and select participants"
            closeMenuOnSelect={false}
            noOptionsMessage={() => "All group members have been added!"}
            menuPortalTarget={document.body}
            styles={{
              valueContainer: (base) => ({
                ...base,
                maxHeight: "90px",
                overflowY: "auto",
              }),
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
          />

          {errors.splitMembers && (
            <div className="text-danger small mt-1">
              {errors.splitMembers}
            </div>
          )}

          <div className="mt-4">
            <h5 className="fw-semibold mb-3">Expense Split</h5>

            <SplitTable
                members={selectedMembers}
                amount={form.amount}
                splitType={splitType}
                percentages={percentages}
                onPercentageChange={handlePercentageChange}
            />

            {errors.percentage && (
              <div className="text-danger small mt-2">
                {errors.percentage}
              </div>
            )}
          </div>

          <div className="d-flex flex-wrap gap-2 justify-content-end mt-4">
            <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting} >
                Cancel
            </Button>

            <Button  type="submit"  loading={submitting} disabled={submitting} >
              {isEdit ? "Update Expense" : "Add Expense"}
            </Button>
          </div>

        </div>
      </div>
    </form>
  );
}
