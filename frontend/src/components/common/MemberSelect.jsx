
import Select, { components } from "react-select";
import { Users } from "lucide-react";

function CheckboxOption(props) {

    const { data, isSelected, selectProps  } = props;

    const realOptions = selectProps.options.filter(opt => opt.value !== "select_all");

    const isAllSelected = realOptions.length > 0 && realOptions.every(option => selectProps.value.some( selected => selected.value === option.value));

    const checked = data.value === "select_all" ? isAllSelected : isSelected;


    return (
        <components.Option {...props}>

            <div className="d-flex align-items-center">

               
                <div className="rounded-circle border d-flex align-items-center bg-info-subtle justify-content-center me-3 overflow-hidden"
                    style={{ width: "38px", height: "38px", flexShrink: 0 }} >
                    {data.value === "select_all" ? (
                         <Users size={19} />) : (
                        <span className="small fw-medium ">
                            {data.initials}
                        </span>
                    )}
                </div>

                <span>{data.label}</span>

                <input type="checkbox" className="form-check-input ms-auto" checked={checked} onChange={() => {}} 
                    style={{ pointerEvents: "none" }}
                />

            </div>

        </components.Option>
    );
}

export default function MemberSelect({ options = [],value = [],onChange,placeholder = "Select Members"}) {

    return (
        <Select
            isMulti
            options={options}
            value={value}
            onChange={onChange}
            getOptionValue={(option) => option.value} 
            placeholder={placeholder}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{
                Option: CheckboxOption
            }}

            styles={{
                option: (base, state) => ({
                    ...base,
                    backgroundColor: "white",
                    color: "#333",
                    cursor: "pointer",
                    ":hover": {
                        backgroundColor: "#b5d3f1"
                    }
                }),

                multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#f1f3f5"
                }),

                multiValueLabel: (base) => ({
                    ...base,
                    color: "#333"
                }),

                menu: (base) => ({
                    ...base,
                    zIndex: 1000
                })
            }}
        />
    );
}
