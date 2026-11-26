
import api from "./Api";

export async function BalanceLoader({ params }) 
{
  const { groupId } = params;

  try {
    
      const [balanceResponse,summary] = await Promise.all([
            api.get(`/groups/${groupId}/expenses/balance`),
            api.get(`/groups/${groupId}/balance`)

    ]);

    console.log(summary.data);

    return {
        balance: balanceResponse.data,
        groupBalance: summary.data
    };
  } catch (error) {
    if (error.response) {
      throw new Response(error.response.data?.message || "Failed to load balances", { status: error.response.status || 500 });
    }

   
  }
}
