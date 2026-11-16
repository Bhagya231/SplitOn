
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";

import FormInput from "./common/FormInput";
import Button from "./common/Button";
import SplitTable from "./splitTable";
import { validateExpense } from "../util/validations";

function getLocalToday() {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function ExpenseForm({
  members = [],
  expense = null,
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(expense);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
  });

  console.log("members ", members);

  const [payer, setPayer] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [splitType, setSplitType] = useState("EQUAL");
  const [percentages, setPercentages] = useState({});

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const memberOptions = useMemo(
    () =>
      members.map((member) => ({
        value: member.memberId,
        label: member.memberName,
      })),
    [members]
  );

  const localToday = getLocalToday();

  // Load existing expense when editing.
  useEffect(() => {
    if (!expense) {
      setForm({ title: "", amount: "", date: "" });
      setPayer(null);
      setSelectedMembers([]);
      setSplitType("EQUAL");
      setPercentages({});
      setErrors({});
      setErrorMessage("");
      return;
    }

    setForm({
      title: expense.title ?? "",
      amount: String(expense.amount ?? ""),
      date: expense.date?.slice(0, 10) ?? "",
    });

    const payerOption = memberOptions.find(
      (member) => member.value === expense.payerId
    );

    setPayer(payerOption ?? null);

    const selected = (expense.splitMembers ?? [])
      .map((splitMember) => {
        const memberId = splitMember.memberId ?? splitMember.id;

        return memberOptions.find(
          (option) => option.value === memberId
        );
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
    setErrors({});
    setErrorMessage("");
  }, [expense, memberOptions]);

  function handleChange(event) {
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

  function handleMembersChange(options) {
    const selected = options ?? [];

    setSelectedMembers(selected);

    setPercentages((previous) => {
      const updated = {};

      selected.forEach((member) => {
        updated[member.value] = previous[member.value] ?? "";
      });

      return updated;
    });

    setErrors((previous) => ({
      ...previous,
      splitMembers: "",
      percentage: "",
    }));
  }

  function handlePayerChange(option) {
    setPayer(option);

    if (option) {
      setSelectedMembers((previous) => {
        if (previous.some((member) => member.value === option.value)) {
          return previous;
        }

        return [...previous, option];
      });
    }

    setErrors((previous) => ({
      ...previous,
      payerId: "",
    }));
  }

  function handlePercentageChange(memberId, value) {
    setPercentages((previous) => ({
      ...previous,
      [memberId]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      percentage: "",
    }));
  }

  function handleSplitTypeChange(value) {
    setSplitType(value);
    setErrors((previous) => ({
      ...previous,
      percentage: "",
    }));

    if (value === "PERCENTAGE" && selectedMembers.length > 0) {
      const equalPercentage = (
        100 / selectedMembers.length
      ).toFixed(2);

      const updated = {};

      selectedMembers.forEach((member) => {
        updated[member.value] = equalPercentage;
      });

      setPercentages(updated);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    const expenseData = {
      title: form.title,
      amount: form.amount,
      date: form.date,
      payerId: payer?.value ?? "",
      splitType,
      splitMembers: selectedMembers.map((member) => ({
        id: member.value,
        ...(splitType === "PERCENTAGE"
          ? { percentage: Number(percentages[member.value]) }
          : {}),
      })),
    };

    const validationErrors = validateExpense(expenseData);

    setErrors(validationErrors);
    setErrorMessage("");

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      const savedExpense = await onSubmit(expenseData);

      if (!savedExpense) {
        setErrorMessage("Unable to save expense. Please try again.");
      }
    } catch (error) {
      console.error("Expense submission failed:", error);

      setErrorMessage(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (

    
    
    <form onSubmit={handleSubmit}>
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3 p-md-4">

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

          <div className="row">
            <div className="col-md-8">
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
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
                error={errors.amount}
              />
            </div>

            <div className="col-md-6">
              <FormInput
                label="Expense Date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                max={localToday}
                required
                error={errors.date}
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

            <div className="d-flex gap-2">
              <Button
                type="button"
                size="small"
                variant="outline-primary"
                onClick={() => handleMembersChange(memberOptions)}
                disabled={selectedMembers.length === memberOptions.length}
              >
                Select All
              </Button>

              <Button
                type="button"
                size="small"
                variant="outline-secondary"
                onClick={() => handleMembersChange([])}
                disabled={selectedMembers.length === 0}
              >
                Clear All
              </Button>
            </div>
          </div>

          <Select
            isMulti
            options={memberOptions}
            value={selectedMembers}
            onChange={handleMembersChange}
            placeholder="Search and select participants"
            closeMenuOnSelect={false}
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
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={submitting}
              disabled={submitting}
            >
              {isEdit ? "Update Expense" : "Add Expense"}
            </Button>
          </div>

        </div>
      </div>
    </form>

  
  );
}
