import { lucia } from "lucia";
import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import { spotify } from "@lucia-auth/oauth/providers";
import { astro } from "lucia/middleware";

import sqlite from "better-sqlite3";
import fs from "fs";

const db = sqlite(":memory:");
db.exec(fs.readFileSync("schema.sql", "utf8"));

export const auth = lucia({
  adapter: betterSqlite3(db, {
    user: "user",
    session: "user_session",
    key: "user_key",
  }),
  middleware: astro(),
  env: import.meta.env.DEV ? "DEV" : "PROD",
  getUserAttributes: (data) => {
    return {
      spotifyUserId: data.spotifyUserId,
    };
  },
  getSessionAttributes: (data) => {
    return {
      accessToken: data.access_token,
    };
  },
});

export const spotifyAuth = spotify(auth, {
  clientId: import.meta.env.SPOTIFY_CLIENT_ID,
  clientSecret: import.meta.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: import.meta.env.SPOTIFY_REDIRECT_URI,
});

export type Auth = typeof auth;
