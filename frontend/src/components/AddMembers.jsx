import { useState } from "react";
import FormInput from "../components/common/FormInput";
import Button from "./common/Button";

function AddMember({  onAddMember })
{
    const [form, setForm] = useState({ name: "", email: "" });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);      
    

    function handleChange(event) 
    {
        const { name, value } = event.target;

        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));

        setSuccessMessage("");
    };

    function validate(formData) 
    {
        const errors = {};

        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            errors.name = "Full name is required.";
        } else if (formData.name.trim().length < 3) {
            errors.name = "Name must contain at least 3 characters.";
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required.";
        } else if (!validEmail.test(formData.email.trim())) {
            errors.email = "Enter a valid email address.";
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    }


  async function handleSubmit(event)
   {
    event.preventDefault();

     setSuccessMessage("");

    if (submitting  || !validate(form)) 
    {
        return;
    }

    setSubmitting(true);

    try{

        const res = await onAddMember({
            name: form.name.trim(),
            email: form.email.trim(),
        });


         if (res) {
            setForm({ name: "", email: "" });
            setErrors({});
            setSuccessMessage("Member added successfully!");
        }else{
            setErrors({error :"failed to add member. Please try again."})
        }
    }catch(error)
    {
        setErrors({error: error.message ||" Something went wrong. Please try again.  "})
    }finally{
        setSubmitting(false);
    }

   
   
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row mx-2 g-3 align-items-start">
        <div className="col-md-5">
          <FormInput
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter name"
            error={errors.name}
            required
          />
        </div>

        <div className="col-md-5">
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email address"
            error={errors.email}
            required
          />
        </div>
        
      </div>

      <div className="col-md-2 d-flex align-items-end">

            <Button type="submit" className="btn btn-primary mx-3" disabled={submitting}>
                {submitting ? "Adding..." : "+ Add Member"}
            </Button>

      </div>

      {errors.error && (
                <div className="alert alert-danger mt-2 mx-3 mb-0">
                    {errors.error}
                </div>
            )}


         {successMessage && (
                <div className="alert alert-success mt-2 mx-3 mb-0">
                    {successMessage}
                </div>
            )}

      

      
    </form>
  );
}

export default AddMember;