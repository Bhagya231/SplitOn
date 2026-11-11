
import api from "./Api";

export async function GroupLoader()
{
    try {

        const token = localStorage.getItem('token');
        if(!token)
        {
            
        }

        const response = await api.get("/groups", {
            params: {
                page: 0,
                size: 6
            }
        });

        return response.data;

    } catch (error) 
    {
        console.error("Error fetching groups:", error);

        throw new Error( error.response?.data?.message || "Failed to load groups. Please try again." || { status: error.response.status || 500 } );
    }
}
