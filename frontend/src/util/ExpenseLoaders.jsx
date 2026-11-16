
import api  from "./Api";

export async function ExpenseDetailsLoader({ params })
 {
     const { groupId, id } = params;

    try {
        const response = await api.get(  `/groups/${groupId}/expenses/${id}` );
        return response.data;
    } catch (error) 
    {
        console.error("Failed to load expense details:", error);

        throw new Response("Failed to load expense details", { status: error.response?.status || 500, statusText: "Failed to load expense details",  });
    }
}
