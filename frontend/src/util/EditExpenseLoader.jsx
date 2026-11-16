import api from "./Api";

export async function EditExpenseLoader({ params }) 
{

    const { groupId, id } = params;

    try {
        const [expenseResponse, groupResponse] = await Promise.all([
            api.get(`/groups/${groupId}/expenses/${id}`),
            api.get(`/groups/${groupId}`)
        ]);

        return {
            expense: expenseResponse.data,
            members: groupResponse.data.groupMembers || [],
            groupId
        };

    } catch (error) {
        console.error("Failed to fetch edit expense data:", error);
        throw error;
    }
}