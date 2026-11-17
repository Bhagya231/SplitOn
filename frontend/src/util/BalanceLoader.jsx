
import api from "./Api";

export async function BalanceLoader({ params }) 
{
  const { groupId } = params;

  try {
    
      const [balanceResponse, totalResponse] = await Promise.all([
          
            api.get(`/groups/${groupId}/expenses/balance`),
            api.get(`/groups/${groupId}/expenses/total`)
    ]);

    return {
        balance: balanceResponse.data,
        total: totalResponse.data
    };
  } catch (error) {
    if (error.response) {
      throw new Response(error.response.data?.message || "Failed to load balances", { status: error.response.status || 500 });
    }

   
  }
}
