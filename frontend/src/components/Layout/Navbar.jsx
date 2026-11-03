import { NavLink } from "react-router-dom";
import { Users,Wallet } from "lucide-react";

export default function Navbar()
{
  

  return (
    
       <nav className="navbar  navbar-expand-lg bg-black  px-4 px-md-4 py-3">
            <div className="container-fluid ">
                <NavLink to="/" className="navbar-brand fw-bold  text-white   gap-2">
                Expense Tracker
                </NavLink>

                <div className=" d-flex align-items-center  gap-4">

                     <NavLink to="/" className={({ isActive }) => `  px-3 py-2 text-decoration-none   ${ isActive ? "text-white fw-bold border-bottom border-3 border-primary" : "text-white-50 "}` }>
                        <Users size={20} />
                        <span>Members&Expenses</span>
                    </NavLink>

                    <NavLink to="/balance" className={({ isActive }) => ` px-3 py-2 text-decoration-none  ${isActive ? "text-white fw-bold border-bottom border-3 border-primary" : "text-white-50"}`}>
                        <Wallet size={20} />
                        <span>Balances</span>
                    </NavLink>

                </div>
               
            </div>
  
    </nav>
  );
}