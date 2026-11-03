
import api from "./Api";

export async function BalanceLoader() {
  try {
    const response = await api.get("expense/balance");
    const res = await api.get("expense/total")

    return {
        balances: response.data,
        total: res.data,
    }
  } catch (error) {
    if (error.response) {
      throw new Response(error.response.data?.message || "Failed to load balances", { status: error.response.status || 500 });
    }

   
  }
}
