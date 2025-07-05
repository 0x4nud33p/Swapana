

export const fetchTokens = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_JUPITER_API_URL}/recent`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      throw new Error("Failed to fetch tokens"); // toast
    }
    console.log("response",response);
    const data = await response.json();
    console.log("data",data);
    return data;
  }