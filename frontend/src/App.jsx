import { createBrowserRouter, RouterProvider } from "react-router-dom";



import RootLayout from "./pages/RootLayout";
import DashboardLayout from "./pages/DashboardLayout";
import { Navigate } from "react-router-dom";
import GroupsPage from "./pages/GroupsPage";
import { BalanceLoader} from "./util/BalanceLoader";
import BalancesPage from "./pages/Balance";
import ExpenseDetails from "./pages/ExpenseDetailsPage";
import { ExpenseDetailsLoader } from "./util/ExpenseLoaders";
import RegisterPage from "./pages/RegisterPage";
import { GroupLoader } from "./util/GroupLoader";
import GroupDetailsPage from "./pages/GroupDetailsPage";
import { AuthLoader } from "./util/AuthLoader";
import { GroupDetailsLoader } from "./util/GroupDetailsLoader";


import LoginPage from "./pages/LoginPage";


const router = createBrowserRouter([
    {
        id: "root",
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/login" replace />
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
            {
                path: "app",
                element: <DashboardLayout />,
                loader: AuthLoader,
                children: [
                    {
                        index: true,
                        element: <GroupsPage />,
                        loader: GroupLoader,
                        HydrateFallback: () => <p>Loading groups...</p>
                    },
                    {
                        path: "groups/:groupId",
                        element: <GroupDetailsPage />,
                        loader: GroupDetailsLoader
                    },
                     {
                        path: "expenses/:id",
                        element: <ExpenseDetails />,
                        loader: ExpenseDetailsLoader
                    },
                    {
                        path: ":groupId/balance",
                        element: <BalancesPage />,
                        loader: BalanceLoader
                    },                    
                   
                ]
            }
        ]
    }
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;