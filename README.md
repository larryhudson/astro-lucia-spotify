# Read about artist while you listen

This is a web app that allows the user to read about a Spotify artist while they listen.

Using the Spotify API, we get the current track that the user is listening to.

Then we allow the user to search the web for articles about the artist using the Serper API.

Then the user can read the content of these articles using Mozilla's Readability library. It can also generate a summary of each article using GPT-4.

This was based on the [Lucia GitHub example](https://github.com/lucia-auth/examples/tree/main/astro/github-oauth).

This example uses SQLite3 with `better-sqlite3`. Make sure to setup your `.env` file.

```bash
# install dependencies
pnpm i

# run dev server
pnpm dev
```

## Setup Spotify OAuth

[Create a new Spotify OAuth app](https://developer.spotify.com/). The redirect uri should be set to `localhost:4321/login/spotify/callback`. Copy and paste the client id and secret into `.env`.

Create a new API at Serper.dev.

Create a new API key at OpenAI.

```bash
SPOTIFY_CLIENT_ID=""
SPOTIFY_CLIENT_SECRET=""
SPOTIFY_REDIRECT_URI="http://localhost:4321/login/spotify/callback"
SERPER_API_KEY=""
OPENAI_API_KEY=""
```

## User schema

| id              | type     | unique |
| --------------- | -------- | :----: |
| `id`            | `string` |        |
| `spotifyUserId` | `string` |        |
