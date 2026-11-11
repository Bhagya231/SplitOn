
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { UserRound, LogOut, User } from "lucide-react";
import api from "../../util/Api";
import LogoutModal from "../common/LogoutModal";
import ProfileModal from "../common/ProfileModal";
import ToastMessage from "../common/ToastMessage";

export default function Navbar() {

    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const menuRef = useRef(null);

    const member = JSON.parse(localStorage.getItem("member") || "null");

    
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    function showNotification(message, type = "success")
     {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    async function handleLogout() {
        setLoggingOut(true);

        try {
            await api.post("/auth/logout");

            localStorage.removeItem("token");
            localStorage.removeItem("member");

            setShowLogoutModal(false);
            navigate("/login", { replace: true, state: {toast: {  message: "Logged out successfully!",  type: "success"}}
        });

        } catch (error) {
            console.error("Logout error:", error.response?.data);
            const message = error.response?.data?.message ||  "Unable to logout. Please try again.";

            showNotification(message, "danger");

        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <>
            <nav className="navbar navbar-dark  px-3 px-md-4 py-3 shadow-sm" style={{ backgroundColor: "#062169" }}>
                <div className="container-fluid">

                    
                    <a href="/app" className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2">
                        <img src="/splitFab.png" alt="logo" width="35" height="35" />
                        SplitExpense
                    </a>

                    
                    <div className="position-relative" ref={menuRef}>

                        <button
                            type="button"
                            className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center p-2"
                            style={{ width: "42px", height: "42px" }}
                            onClick={() => setShowMenu(prev => !prev)}
                        >
                            <UserRound size={22} />
                        </button>

                        {showMenu && (
                            <div
                                className="position-absolute end-0 mt-2 bg-white rounded-3 shadow border py-2"
                                style={{ width: "190px", zIndex: 1050 }}
                            >

                                <button
                                    type="button "
                                    className="btn btn-outline-primary dropdown-item d-flex align-items-center gap-2 px-3 py-2"
                                    onClick={() => {
                                        setShowMenu(false);
                                        setShowProfileModal(true);
                                    }}
                                >
                                    <User size={18} />
                                    Profile
                                </button>

                                <hr className="dropdown-divider my-2" />

                                <button
                                    type="button"
                                    className="btn btn-sm w-100 text-start btn-outline-danger px-3 py-2 border-0 rounded-0 dropdown-item "
                                    onClick={() => {
                                        setShowMenu(false);
                                        setShowLogoutModal(true);
                                    }}
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>

                            </div>
                        )}

                    </div>

                </div>
            </nav>

            <LogoutModal
                show={showLogoutModal}
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                loading={loggingOut}
            />

            <ProfileModal
                show={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                member={member}
            />

            <ToastMessage
                show={showToast}
                message={toastMessage}
                type={toastType}
                onClose={() => setShowToast(false)}
            />
        </>
    );
}
