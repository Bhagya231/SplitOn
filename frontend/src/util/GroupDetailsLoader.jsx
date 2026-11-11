import api from "./Api";

export async function GroupDetailsLoader({ params }) 
{
    const groupId = params.groupId;

    try {
        const [groupResponse, expenseResponse] = await Promise.all([
            api.get(`/groups/${groupId}`),
            api.get(`/groups/${groupId}/expenses`, {
                params: {
                    page: 0,
                    size: 5
                }
            })
        ]);

        console.log("group " , groupResponse.data);
        console.log("expense ", expenseResponse.data);

        return {
            group: groupResponse.data,
            expenses: expenseResponse.data.content || [],
            expensePage: expenseResponse.data
        };

    } catch (error) {
        console.error("Failed to load group details:", error);

        throw new Response("Failed to load group details", { status: error.response?.status || 500,  statusText: "Failed to load group details" });
    }
}