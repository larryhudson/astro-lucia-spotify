import Redis from "ioredis";

const redis = new Redis(); // default connects to 127.0.0.1:6379
const cacheKeyPrefix = "serperCache:"; // Define a prefix for your keys

export async function fetchFromSerper(searchQuery) {
  const apiKey = import.meta.env.SERPER_API_KEY;
  const serperUrl = "https://google.serper.dev/search";
  const cacheKey = cacheKeyPrefix + searchQuery;

  // Check cache first
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    console.log(`Returning cached search results for ${searchQuery}`);
    return JSON.parse(cachedData);
  }

  console.log(`Fetching search results for ${searchQuery} from Serper`);
  // If not in cache, make a request
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

  // Cache the response with an expiration (1 week)
  await redis.setex(cacheKey, 604800, JSON.stringify(serperData));

  return serperData;
}
