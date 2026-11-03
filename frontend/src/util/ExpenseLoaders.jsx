
import api  from "./Api";

export async function ExpenseDetailsLoader({ params })
 {
    const id = params.id;

    try {
        const response = await api.get(`/expense/details/${params.id}`);
        return response.data;
    } catch (error) 
    {
        console.error("Failed to load expense details:", error);

        throw new Response("Failed to load expense details", {
            status: error.response?.status || 500,
            statusText: "Failed to load expense details",
        });
    }
}
