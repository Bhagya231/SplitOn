import api from "../util/Api";

export async function GroupBalanceLoader({ params })
 {
    const { groupId } = params;

    if (!groupId) {
        throw new Response("Group ID is required", { status: 400});
    }

    const response = await api.get(`/groups/${groupId}/balances`);

    return response.data;
}