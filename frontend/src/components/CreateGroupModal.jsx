
import { useState } from "react";
import Select from "react-select";
import FormInput from "./common/FormInput";

export default function CreateGroupModal({show,onClose, onCreate,members = [],loading = false})
 {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);

    const [errors, setErrors] = useState({});


    
    const memberOptions = members.map(member => ({value: member.id,label: `${member.name} (${member.email})`}));


    function handleSubmit(e) 
    {

        e.preventDefault();

        const validationErrors = {};

    

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        
        const memberIds = [ ...selectedMembers.map(member => member.value)];

        if (currentMember?.id && !memberIds.includes(currentMember.id)) {
            memberIds.push(currentMember.id);
        }

        const request = {
            name: name.trim(),
            description: description.trim(),
            groupMembers: memberIds.map(memberId => ({
                memberId
            }))
        };

        onCreate(request);
    }


    if (!show) return null;


    return (

        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1055
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >

            <div className="modal-dialog modal-dialog-centered modal-lg">

                <div className="modal-content border-0 shadow rounded-4">

                    {/* Modal Header */}

                    <div className="modal-header border-0 px-4 pt-4">

                        <div>
                            <h5 className="modal-title fw-bold">
                                Create New Group
                            </h5>

                            <p className="text-secondary small mb-0">
                                Create a group and add members to start
                                sharing expenses.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={loading}
                        />

                    </div>


                    {/* Modal Body */}

                    <form onSubmit={handleSubmit}>

                        <div className="modal-body px-4">

                            <FormInput
                                label="Group Name"
                                name="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrors(prev => ({ ...prev, name: "" }));
                                }}
                                placeholder="Enter group name"
                                error={errors.name}
                                required
                            />


                            <FormInput
                                label="Description"
                                name="description"
                                inputType="textarea"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setErrors(prev => ({
                                        ...prev,
                                        description: ""
                                    }));
                                }}
                                placeholder="Enter group description"
                                rows={3}
                                error={errors.description}
                                required
                            />


                            

                            <div className="mb-3">

                                <label className="form-label fw-semibold">
                                    Add Members
                                    <span className="text-danger ms-1">*</span>
                                </label>

                                <Select
                                    isMulti
                                    options={memberOptions}
                                    value={selectedMembers}
                                    onChange={(value) => {
                                        setSelectedMembers(value || []);
                                        setErrors(prev => ({
                                            ...prev,
                                            members: ""
                                        }));
                                    }}
                                    placeholder="Search and select members..."
                                    noOptionsMessage={() => "No members found"}
                                    isClearable
                                    closeMenuOnSelect={false}
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            minHeight: "42px",
                                            borderColor: errors.members
                                                ? "#dc3545"
                                                : state.isFocused
                                                    ? "#86b7fe"
                                                    : "#dee2e6",
                                            boxShadow: state.isFocused
                                                ? "0 0 0 0.2rem rgba(13,110,253,.15)"
                                                : "none",
                                            "&:hover": {
                                                borderColor: "#86b7fe"
                                            }
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            zIndex: 1100
                                        }),
                                        multiValue: (base) => ({
                                            ...base,
                                            backgroundColor: "#e7efff",
                                            borderRadius: "5px"
                                        }),
                                        multiValueLabel: (base) => ({
                                            ...base,
                                            color: "#244B9B"
                                        })
                                    }}
                                />

                                {errors.members && (
                                    <div className="text-danger small mt-1">
                                        {errors.members}
                                    </div>
                                )}

                                <small className="text-secondary">
                                    You will automatically be included in
                                    this group.
                                </small>

                            </div>

                        </div>


                        {/* Modal Footer */}

                        <div className="modal-footer border-0 px-4 pb-4">

                            <button
                                type="button"
                                className="btn btn-light px-4"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn text-white px-4"
                                style={{ backgroundColor: "#244B9B" }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-plus-lg me-2"></i>
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
