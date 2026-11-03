
import api from "./Api";

export async function MemberLoader() {
  try {
    const response = await api.get("members/getAll");
    const res = await api.get("expense/getAll")

    return {
        members: response.data,
        expenses: res.data,
    }
  } catch (error) {
    if (error.response) {
      throw new Response(error.response.data?.message || "Failed to load balances", { status: error.response.status || 500 });
    }

   
  }
}
