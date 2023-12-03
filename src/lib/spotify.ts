export async function getCurrentUser(accessToken) {
  const spotifyResponse = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!spotifyResponse.ok) {
    const errorText = await spotifyResponse.text();
    throw new Error("Failed to fetch user, " + errorText);
  }
  const spotifyUser = await spotifyResponse.json();

  return spotifyUser;
}
