import { redirect } from "react-router-dom";

export function AuthLoader() {

    const token = localStorage.getItem("token");

    if (!token) {
        return redirect("/login");
    }

    return null;
}