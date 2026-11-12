import api from "./Api";

export async function GroupDetailsLoader({ params, request }) 
{
        const groupId = params.groupId;

        const url = new URL(request.url);

        const search = url.searchParams.get("search") || "";
        const page = Number(url.searchParams.get("page") || 0);

    try {
        const [groupResponse, expenseResponse] = await Promise.all([
            api.get(`/groups/${groupId}`),
            api.get(`/groups/${groupId}/expenses`, {
                params: {
                    search,
                    page,
                    size: 5
                }
            })
        ]);

        console.log("group " , groupResponse.data);
        console.log("expense ", expenseResponse.data);

        return {
            group: groupResponse.data,
            expenses: expenseResponse.data.content || [],
            expensePage: expenseResponse.data,
            search
        };

    } catch (error) {
        console.error("Failed to load group details:", error);

        throw new Response("Failed to load group details", { status: error.response?.status || 500,  statusText: "Failed to load group details" });
    }
}