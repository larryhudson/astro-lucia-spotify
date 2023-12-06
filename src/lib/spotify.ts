import pMap from "p-map";

export async function fetchFromSpotify(
  accessToken,
  url,
  options = { method: "GET" },
) {
  const baseUrl = "https://api.spotify.com/v1/";
  const fullUrl = url.startsWith("http") ? url : baseUrl + url;
  const spotifyResponse = await fetch(fullUrl, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const is204 = spotifyResponse.status === 204;
  if (is204) {
    return null;
  }
  if (!spotifyResponse.ok) {
    const errorText = await spotifyResponse.text();
    throw new Error("Failed to fetch from Spotify, " + errorText);
  }
  try {
    const spotifyData = await spotifyResponse.json();
    return spotifyData;
  } catch (error) {
    console.error(error);
    const errorText = await spotifyResponse.text();
    console.log(errorText);
    return null;
  }
}

export async function getCurrentUser(accessToken) {
  const user = await fetchFromSpotify(accessToken, "me");
  return user;
}

export async function getArtist(accessToken, artistId) {
  const artist = await fetchFromSpotify(accessToken, `artists/${artistId}`);
  return artist;
}

export async function getCurrentTrack(accessToken) {
  const spotifyData = await fetchFromSpotify(
    accessToken,
    "me/player/currently-playing",
  );
  if (!spotifyData) {
    return null;
  }
  const track = spotifyData.item;

  const artists = await pMap(
    track.artists,
    async (artist) => {
      const artistData = await getArtist(accessToken, artist.id);
      return artistData;
    },
    { concurrency: 1 },
  );

  const album = {
    name: track.album.name,
    id: track.album.id,
    href: track.album.href,
    imageUrl: track.album.images[0].url,
  };

  const searchQueries = [
    { label: "Artist", query: `music ${track.artists[0].name}` },
    {
      label: "Artist and album",
      query: `music ${track.artists[0].name} ${track.album.name}`,
    },
    {
      label: "Album reviews",
      query: `music ${track.artists[0].name} ${track.album.name} review`,
    },
  ];

  const trackData = {
    name: track.name,
    id: track.id,
    href: track.href,
    album: album,
    artists: artists,
    searchQueries,
  };

  return trackData;
}
