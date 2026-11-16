import { Outlet } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";


export default function DashboardLayout() {
    return (
        <>
            <div className="page-background">
                 <Navbar />
                <main className="min-vh-100">
                    <Outlet />
                </main>

            </div>
           
        </>
    );
}