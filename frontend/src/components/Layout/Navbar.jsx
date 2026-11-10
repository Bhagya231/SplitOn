import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Users, Wallet, UserRound,LogOut } from "lucide-react";
import { Collapse } from "bootstrap";
import api from "../../util/Api";
import LogoutModal from "../common/LogoutModal";
import ProfileModal  from "../common/ProfileModal"


export default function Navbar()
{
  
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
     const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState("");
    const [showProfileModal, setShowProfileModal] = useState(false);


    const member = JSON.parse(localStorage.getItem("member") || "null");

    function closeMobileMenu() 
    {
        const menu = document.getElementById("expenseNavbar");

        if (menu) {
            const collapse = Collapse.getOrCreateInstance(menu, {toggle: false,});

            collapse.hide();
            setIsOpen(false);
        }
    }

    function handleToggle() 
    {
        const menu = document.getElementById("expenseNavbar");

        if (menu) 
        {
            const collapse = Collapse.getOrCreateInstance(menu, {toggle: false,});
   
            if (menu.classList.contains("show"))
            {
                collapse.hide();
                setIsOpen(false);
            } else {
                collapse.show();
                setIsOpen(true);
            }
        }
    }

    async function handleLogout() 
    {
        setLoggingOut(true);
        setLogoutError(""); 
    try {
        const response = await api.post("/auth/logout");

        console.log("Logout response:", response.data);
       

        localStorage.removeItem("token");
        localStorage.removeItem("member");

        setShowLogoutModal(false);

        navigate("/login", { replace: true });

    } catch (error) 
    {
        setLogoutError(error.response?.data?.message || "Unable to logout. Please try again.");

        console.error("Logout status:", error.response?.status);
        console.error("Logout error:", error.response?.data);
    } finally {
        setLoggingOut(false);
    }
    }
   
 
  return (
    
       <nav className="navbar navbar-dark navbar-expand-lg bg-black  px-2 px-md-4 py-3 shadow-sm">
            <div className="container-fluid ">
                <NavLink to="/" className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2">
                <Wallet size={26} />
                SplitExpense
                </NavLink>

                 
                <button className="navbar-toggler"                    
                    type="button"
                    onClick={handleToggle}
                    aria-controls="expenseNavbar"
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse  justify-content-end" id="expenseNavbar">

                    {/* <div className="navbar-nav align-items-lg-center gap-lg-3 mt-3 mt-lg-0">

                         <NavLink to="/" onClick={closeMobileMenu} className={({ isActive }) => `  px-3 py-2 text-decoration-none   ${ isActive ? "text-white fw-bold border-bottom border-3 border-primary" : "text-white-50 "}` }>
                            <Users size={20} />
                            <span>Members&Expenses</span>
                        </NavLink>

                        <NavLink to="/balance" onClick={closeMobileMenu} className={({ isActive }) => ` px-3 py-2 text-decoration-none  ${isActive ? "text-white fw-bold border-bottom border-3 border-primary" : "text-white-50"}`}>
                            <Wallet size={20} />
                            <span>Balances</span>
                        </NavLink>

                        {/* <NavLink to="/login" className={({ isActive }) => ` px-3 py-2 text-decoration-none  ${isActive ? "text-white fw-bold border-bottom border-3 border-primary" : "text-white-50"}`}>
                                <span>Logout</span>
                        </NavLink> */}

                        {/* <button type="button"  className="btn btn-outline-light" onClick={() => {setLogoutError("");setShowLogoutModal(true); }}>
                            Logout
                        </button>

                    </div> */} 


                     <div className="row g-2 mt-3 mt-lg-0">
                        <div className="col-6 col-lg-auto">

                            <NavLink to="/app" end onClick={closeMobileMenu} className={({isActive}) => `btn w-100 justify-content-center rounded-3 px-3 py-2 d-flex align-items-center gap-2 fw-semibold ${isActive ? "btn-primary shadow" : "btn-outline-light"}` }><Users size={19} /> Groups</NavLink>

                        </div>
                        <div className="col-6 col-lg-auto">
                            <NavLink to="/balance" end onClick={closeMobileMenu} className={({isActive}) => `btn w-100 justify-content-center rounded-3 px-3 py-2 d-flex align-items-center gap-2 fw-semibold ${isActive ? "btn-primary shadow" : "btn-outline-light"}` }><Wallet size={19} /> Balances</NavLink>

                        </div>
                        <div className="col-6 col-lg-auto">

                            <button className="btn btn-light rounded-3 d-flex align-items-center gap-2"
                                    onClick={() => { closeMobileMenu(); setShowProfileModal(true);}}>
                                <span className="badge rounded-circle bg-primary">
                                    {member?.name?.charAt(0).toUpperCase() || "U"}
                                </span>
                                Profile
                            </button>

                        </div>

                        <div className="col-6 col-lg-auto">

                                <button type="button"  className="btn btn-outline-light w-100 rounded-3 px-3 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                                         onClick={() => {
                                            closeMobileMenu();
                                            setLogoutError("");
                                            setShowLogoutModal(true);
                                        }} >
                                    <LogOut size={18} />
                                    Logout
                                </button>

                            </div>

                     </div>




                </div>

                
               
            </div>

            <LogoutModal
                show={showLogoutModal}
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                loading={loggingOut}/>

            {logoutError && (
                <div className="alert alert-danger mt-2" role="alert">
                    {logoutError}
                </div>
            )}


            <ProfileModal
                show={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                member={member}
            />

  
    </nav>
  );
}