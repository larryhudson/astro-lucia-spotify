export async function fetchFromSerper(searchQuery) {
  const apiKey = import.meta.env.SERPER_API_KEY;
  const serperUrl = "https://google.serper.dev/search";
  const serperResponse = await fetch(serperUrl, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: searchQuery,
      gl: "au",
    }),
  });

  if (!serperResponse.ok) {
    const errorText = await serperResponse.text();
    throw new Error("Failed to fetch from Serper, " + errorText);
  }

  const serperData = await serperResponse.json();

  return serperData;
}

export async function getSearchResults(query) {
  const serperData = await fetchFromSerper(query);
  return serperData;
}
