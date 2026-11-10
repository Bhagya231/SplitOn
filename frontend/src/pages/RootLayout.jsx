import { Outlet } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";


function RootLayout() {
  return (
    
        <>

        <Outlet />
            
        {/* <Navbar/>
        <main className="min-vh-100">
            
        </main> */}

        
        </>
            
              
           
            
   
  );
}

export default RootLayout;