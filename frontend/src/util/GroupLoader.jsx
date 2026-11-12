
import api from "./Api";
import { redirect } from "react-router-dom";

export async function GroupLoader({request})
{
    try {

         const token = localStorage.getItem("token");

        if (!token) {
            return redirect("/login");
        }

        const url = new URL(request.url);

        const search = url.searchParams.get("search") || "";
        const page = Number(url.searchParams.get("page") || 0);
        const size = Number(url.searchParams.get("size") || 8);

        const response = await api.get("/groups", {
            params: {
                search,
                page,
                size
            }
        });

        return response.data;

    } catch (error) 
    {
        console.error("Error fetching groups:", error);

         if (error.response?.status === 401) {
            return redirect("/login");
        }

        throw new Error( error.response?.data?.message || "Failed to load groups. Please try again." || { status: error.response.status || 500 } );
    }
}
