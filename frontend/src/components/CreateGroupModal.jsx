
import { useState } from "react";
import Select, { components } from "react-select";
import { Check } from "lucide-react";
import FormInput from "./common/FormInput";


function MemberOption(props) 
{
    const { data, isSelected } = props;

    const initials = data.name.split(" ").slice(0, 2).map(word => word.charAt(0)).join("").toUpperCase();

    return (
        <components.Option {...props}>
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary bg-primary-subtle"
                        style={{ width: "40px",height: "40px",flexShrink: 0}}>
                        {initials}
                    </div>

                    <div>
                        <div className="fw-semibold text-dark">
                            {data.name}
                        </div>
                        <small className="text-secondary">
                            {data.email}
                        </small>
                    </div>
                </div>

                {isSelected && (
                    <Check size={18} className="text-primary" />
                )}
            </div>
        </components.Option>
    );
}

export default function CreateGroupModal({show,onClose,onCreate,members = [],loading = false})
 {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [errors, setErrors] = useState({});

    const memberOptions = members.map(member => ({
        value: member.id,
        name: member.name,
        email: member.email,
        label: `${member.name} (${member.email})`
    }));

    function resetForm()
    {
        setName("");
        setDescription("");
        setSelectedMembers([]);
        setErrors({});
    }

    function handleClose() 
    {
        if (loading) 
        {
            return;
        }
        resetForm();
        onClose();
    }

   async function handleSubmit(e) 
    {
        e.preventDefault();

        const validationErrors = {};

        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        if (!trimmedName) {
            validationErrors.name = "Group name is required";
        } else if (trimmedName.length < 3) {
            validationErrors.name = "Group name must contain at least 3 characters";
        } else if (trimmedName.length > 30) {
            validationErrors.name = "Group name cannot exceed 30 characters";
        }

        if (!trimmedDescription) {
            validationErrors.description = "Description is required";
        } else if (trimmedDescription.length < 5) {
            validationErrors.description = "Description must contain at least 5 characters";
        } else if (trimmedDescription.length > 100) {
            validationErrors.description = "Description cannot exceed 100 characters";
        }

        if (selectedMembers.length === 0) {
            validationErrors.members = "Please select at least one member";
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const request = {
            name: trimmedName,
            description: trimmedDescription,
            groupMembers: selectedMembers.map(member => ({
                memberId: member.value
            }))
        };

        const success = await onCreate(request);

        if (success) 
        {
            resetForm();
            onClose();
        }
    }

    if (!show)
    {
       return null; 
    } 

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{  backgroundColor: "rgba(0,0,0,0.5)",  zIndex: 1055 }}
            onClick={e => {if (e.target === e.currentTarget) handleClose(); }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow rounded-4">

                    <div className="modal-header border-0 px-4 pt-4">
                        <div>
                            <h5 className="modal-title fw-bold">
                                Create New Group
                            </h5>
                            <p className="text-secondary small mb-0">
                                Create a group and invite members to share expenses.
                            </p>
                        </div>

                        <button type="button" className="btn-close" onClick={handleClose} disabled={loading}/>

                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body px-4">

                            <FormInput
                                label="Group Name"
                                name="name"
                                value={name}
                                onChange={e => {
                                    setName(e.target.value);
                                    setErrors(prev => ({ ...prev, name: "" }));
                                }}
                                placeholder="e.g. Goa Trip, Family, Roommates"
                                error={errors.name}
                                required
                            />

                            <FormInput
                                label="Description"
                                name="description"
                                inputType="textarea"
                                value={description}
                                onChange={e => {
                                    setDescription(e.target.value);
                                    setErrors(prev => ({ ...prev,description: ""}));}}
                                placeholder="What is this group for?"
                                rows={3}
                                error={errors.description}
                                required
                            />

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Select Group Members
                                    <span className="text-danger ms-1">*</span>
                                </label>

                                <Select
                                    isMulti
                                    options={memberOptions}
                                    value={selectedMembers}
                                    onChange={value => {
                                        setSelectedMembers(value || []);
                                        setErrors(prev => ({ ...prev, members: "" })); }}
                                    components={{ Option: MemberOption  }}
                                    placeholder="Search members by name or email..."
                                    noOptionsMessage={() => "No members found"}
                                    closeMenuOnSelect={false}
                                    hideSelectedOptions={false}
                                    isClearable
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            minHeight: "48px",
                                            borderRadius: "8px",
                                            borderColor: errors.members ? "#dc3545" : state.isFocused ? "#244B9B" : "#dee2e6",    
                                            boxShadow: state.isFocused  ? "0 0 0 3px rgba(36,75,155,0.12)"  : "none",                                                                                             
                                            "&:hover": { borderColor: "#244B9B"}
                                        }),
                                        menu: base => ({
                                            ...base,
                                            zIndex: 1100,
                                            borderRadius: "10px",
                                            overflow: "hidden"
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            padding: "12px",
                                            backgroundColor: state.isSelected ? "#eaf0ff" : state.isFocused ? "#f5f7fc" : "white",  cursor: "pointer"}),
                                        multiValue: base => ({
                                            ...base,
                                            backgroundColor: "#eaf0ff",
                                            borderRadius: "6px",
                                            padding: "2px 4px"
                                        }),
                                        multiValueLabel: base => ({
                                            ...base,
                                            color: "#244B9B",
                                            fontWeight: 600
                                        }),
                                        multiValueRemove: base => ({
                                            ...base,
                                            color: "#244B9B",
                                            borderRadius: "4px",
                                            ":hover": { backgroundColor: "#d5e1ff",  color: "#dc3545"}
                                        }),
                                        placeholder: base => ({
                                            ...base,
                                            color: "#8a929d",
                                            fontSize: "14px"
                                        })
                                    }}
                                />

                                {errors.members && (
                                    <div className="text-danger small mt-1">
                                        {errors.members}
                                    </div>
                                )}

                                <small className="text-secondary d-block mt-2">
                                    Search and select the members you want to add.
                                </small>
                            </div>
                        </div>

                        <div className="modal-footer border-0 px-4 pb-4">
                            <button type="button" className="btn btn-light px-4" onClick={handleClose}  disabled={loading} >
                                Cancel
                            </button>

                            <button type="submit" className="btn text-white px-4" style={{ backgroundColor: "#244B9B" }} disabled={loading}  >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-plus-lg me-2" />
                                        Create Group
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
