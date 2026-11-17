
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePicker({label = "Date",name = "date", value,onChange,error,required = false,disabled = false,}) 
{
    
    const selectedDate = value ? (() => {
            const [year, month, day] = value.split("-").map(Number);
            return new Date(year, month - 1, day);
        })()
        : null;

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    function handleDateChange(date) 
    {
        if (!date) 
        {
            onChange("");
            return;
        }

        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        onChange(`${year}-${month}-${day}`);
    }

    return (
        <div className="mb-3">
            <label className="form-label fw-semibold">
                {label}
                {required && <span className="text-danger ms-1">*</span>}
            </label>

            <ReactDatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                maxDate={today}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select expense date"
                className={`form-control ${error ? "is-invalid" : ""}`}
                wrapperClassName="w-100"
                showPopperArrow={false}
                autoComplete="off"
                required={required}
                disabled={disabled}
            />

            {error && (
                <div className="text-danger small mt-1">
                    {error}
                </div>
            )}
        </div>
    );
}
