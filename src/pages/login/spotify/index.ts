import { spotifyAuth } from "../../../lib/lucia";

import type { APIRoute } from "astro";

export const get: APIRoute = async (context) => {
  const session = await context.locals.auth.validate();
  if (session) {
    return context.redirect("/", 302); // redirect to profile page
  }
  const [url, state] = await spotifyAuth.getAuthorizationUrl();
  context.cookies.set("spotify_oauth_state", state, {
    httpOnly: true,
    secure: !import.meta.env.DEV,
    path: "/",
    maxAge: 60 * 60,
  });
  return context.redirect(url.toString(), 302);
};
