import api from "./Api";

export async function AddExpenseLoader({ params }) 
{
    const { groupId } = params;

    try {
        const response = await api.get(`/groups/${groupId}`);

        return {
            members: response.data.groupMembers || [],
            groupId
        };

    } catch (error) {
        console.error("Failed to fetch group members:", error);
        throw new Error( error.response?.data?.message || "Failed to load groups. Please try again." || { status: error.response.status || 500 } );
    }
}