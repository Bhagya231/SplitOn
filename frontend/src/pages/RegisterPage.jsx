
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import FormInput from "../components/common/FormInput";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

import api from "../util/Api";
import { validateRegisterForm } from "../util/validations";
import registerBg from "../assets/registerbg.png";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  
    async function handleSubmit(event)
    {
        event.preventDefault();

        const validationErrors = validateRegisterForm(formData);

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
        return;
        }

        try {
        setIsSubmitting(true);
        setServerError("");

        const response = await api.post("/auth/register", formData);
        const data = response.data;

        
       
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("name",data.name);
        

        navigate(data.token ? "/" : "/login", { replace: true });
        } catch (error) {
        setServerError(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Registration failed. Please try again."
        );
        } finally {
        setIsSubmitting(false);
        }
    };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundImage: `url(${registerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <div className="row justify-content-end">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7">

            <Card>
              <div className="p-2 p-md-3">

               
                <div className="text-center mb-2">
                  <h3 className="fw-bold text-primary mb-2">
                    Split Expense
                  </h3>

                  <h2 className="fw-bold mb-1">
                    Create an Account
                  </h2>

                  <p className="text-secondary mb-0">
                    Register to start sharing expenses.
                  </p>
                </div>

               
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-2">

                    <div className="col-12 col-md-6">
                      <FormInput
                        label="Full name"
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <FormInput
                        label="Email address"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <FormInput
                        label="Phone number"
                        name="phone"
                        type="tel"
                        placeholder="10-digit phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        required
                      />
                    </div>


                    <div className="col-12 col-md-6">
                      <FormInput
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <FormInput
                        label="Confirm password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        required
                      />
                    </div>

                    {serverError && (
                      <div className="col-12">
                        <div className="alert alert-danger py-2 mb-0">
                          {serverError}
                        </div>
                      </div>
                    )}

                    <div className="col-12 mt-4">
                      <Button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Creating Account..."
                          : "Create Account"}
                      </Button>
                    </div>

                  </div>
                </form>

                <p className="text-center text-secondary mt-3 mb-0">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-decoration-none fw-semibold"
                  >
                    Sign in
                  </Link>
                </p>

              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
