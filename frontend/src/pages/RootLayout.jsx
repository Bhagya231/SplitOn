import { Outlet } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";


function RootLayout() {
  return (
    
        <>
            
        <Navbar/>
        <main className="min-vh-100">
            <Outlet />
        </main>

        
        </>
            
              
           
            
   
  );
}

export default RootLayout;