import { createBrowserRouter, RouterProvider } from "react-router-dom";



import RootLayout from "./pages/RootLayout";
import MembersPage from "./pages/Members";
import { BalanceLoader} from "./util/BalanceLoader";
import BalancesPage from "./pages/Balance";
import ExpenseDetails from "./pages/ExpenseDetailsPage";
import {MemberLoader} from "./util/memberLoader"
import { ExpenseDetailsLoader } from "./util/ExpenseLoaders";
import RegisterPage from "./pages/RegisterPage";


import LoginPage from "./pages/LoginPage";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    id: "root",
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <MembersPage />,
        loader: MemberLoader,
        HydrateFallback: () => <p>Loading members...</p>,
      },
      {
        path: "balance",
        element: <BalancesPage />,
        loader: BalanceLoader,
      },
      {
        path: "expenses/:id",
        element: <ExpenseDetails />,
        loader: ExpenseDetailsLoader,
        HydrateFallback: () => (
            <p className="text-center mt-4">
                Loading expense details...
            </p>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;