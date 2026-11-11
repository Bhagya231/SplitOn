import { useState, useEffect } from "react";
import { Form, Link, useNavigate, useLocation} from "react-router-dom";

import FormInput from "../components/common/FormInput";
import Img from "../assets/loginbg.png";
import api from "../util/Api";
import { Card } from "react-bootstrap";

import ToastMessage from "../components/common/ToastMessage";

function LoginPage() 
{
  
  const navigate = useNavigate();
  const location = useLocation();

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [formData, setFormData] = useState({
      email: "",
      password: "",
    });

    useEffect(() => {
      if (!serverError) return;

      const timer = setTimeout(() => {
        setServerError("");
      }, 3000);

      return () => clearTimeout(timer);
    }, [serverError]);
    

    const [toast, setToast] = useState(null);

  useEffect(() => {
      if (location.state?.toast) {
          setToast(location.state.toast);

         
          navigate(location.pathname, {
              replace: true,
              state: null
          });
      }
  }, [location, navigate]);

  function handleFieldChange(fieldName, value) 
  {
    console.log("Field changed:", fieldName, value);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));

    setServerError("");
  }

  function validateForm() 
  {
    const newErrors = {};
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) 
    {
      newErrors.email = "Email is required.";

    } else if (!validEmail.test(formData.email.trim()))
       {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) 
    {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) 
    {
      newErrors.password =  "Password must contain at least 8 characters.";
       
    }

    return newErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setServerError("");

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0)
    {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/login", {
            email: formData.email.trim(),
            password: formData.password,
          });

      const data = response.data;

      if (!data.token) 
      {
        setServerError("Login response did not contain an authentication token.");
        return;
      }

              

        localStorage.setItem("token", data.token);

        const member = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };

        localStorage.setItem("member", JSON.stringify(member));
    


      navigate("/app", { replace: true });

    } catch (error) {
      console.error("Login API error:", error);

      setServerError( error.response?.data?.message || error.response?.data?.error ||
        (error.response ? "Login failed. Please check your email and password." : "Cannot connect to the server. Please try again.") );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container-fluid min-vh-100  bg-primary bg-opacity-10 p-0 m-0">
      <div className="row g-0 min-vh-100">
        {/* left side */}
        <div className="col-md-6  px-4 px-lg-5  py-3 d-flex flex-column justify-content-center">
          <Link  to="/login" className="d-flex align-items-center gap-2 text-decoration-none text-dark fw-bold fs-4 mb-4">
            <span className="bg-primary text-white rounded-3 px-3 py-1">
              ₹ </span>
            Split Expense
          </Link>

          <div className="text-center my-1">
            <h1 className="fw-bold text-dark display-6">
              Track. Share. <span className="text-primary">Save.</span>
            </h1>

            <p className="text-secondary mt-3">
              Easily split expenses with your friends and family.
              Keep shared expenses organized in one place.
            </p>

            <img  src={Img}  alt="Friends managing and splitting shared expenses" className="img-fluid mt-3"

              style={{ maxHeight: "350px", objectFit: "contain" }}
            />
          </div>

          <p className="text-secondary text-center small mb-0">
            Less money stress. More memories together.
          </p>
        </div>

        {/* right side  */}
            <div className="col-md-6 px-4 px-lg-5 py-3 d-flex align-items-center justify-content-center">
            <Card className="w-100 p-3">
             <div className="px-4 px-lg-5 py-5" >
              
              <h1 className="text-center mb-3">Login</h1>
              <h5 className="text-secondary mb-4">
                Sign in to your Split Expense account.
              </h5>

              {serverError && (
                <div className="alert alert-danger" role="alert">
                  {serverError}
                </div>
              )}

            

            <Form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <FormInput
                  label="Email address"
                  name="email"
                  type="email"
                  value={formData.email}
                  placeholder="you@example.com"
                  error={errors.email}
                  required
                  onChange={(event) => handleFieldChange("email", event.target.value) }
                />

                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  placeholder="Enter your password"
                  error={errors.password}
                  required
                  onChange={(event) => handleFieldChange("password", event.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2" aria-hidden="true"/>
                    Signing in...
                  </>
                ) : (
                  "Sign in →"
                )}
              </button>
            </Form>

            
            <p className="text-center text-secondary mt-4 mb-0">
              Don't have an account?{" "}
              <Link to="/register"  className="text-primary fw-semibold text-decoration-none">
                Create an account
              </Link>
            </p>
          </div>
            </Card>

          </div>
          
        

      </div>

      <ToastMessage
          show={!!toast}
          message={toast?.message || ""}
          type={toast?.type || "success"}
          onClose={() => setToast(null)}
      />
      </div>
      
    
  );
}

export default LoginPage;