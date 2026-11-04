
import api from "./Api";

export async function MemberLoader() {
  try {
    const response = await api.get("members/getAll");
    const res = await api.get("expense/getAll")

    return {
        members: response.data,
        expenses: res.data,
    }
  } catch (error)
   {
    if (error.response) {
        throw new Response( error.response.data?.message || "Failed to load members and expenses",
            {status: error.response.status || 500});
    }

    throw new Response("Unable to connect to the server. Please try again.",  {status: 500});
}
}
