import db from "@/lib/db";
import { logUserIn } from "@/lib/session";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return notFound();
  }
  // TODO make fetch function named getAccessToken
  let accessTokenURL = "https://github.com/login/oauth/access_token";
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  accessTokenURL = `${accessTokenURL}?${accessTokenParams}`;
  const { access_token, error } = await (
    await fetch(accessTokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }
  // TODO make fetch function named getUserProfile
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  // TODO make fetch function named getUserEmail
  // TODO get an email by requesting /user/emails
  const { id, avatar_url, login } = await userProfileResponse.json();
  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });
  if (user) {
    return await logUserIn(user.id);
  }
  // TODO check duplicate username & give random username
  const newUser = await db.user.create({
    data: {
      github_id: id + "",
      avatar: avatar_url,
      username: login,
    },
    select: {
      id: true,
    },
  });
  return await logUserIn(newUser.id);
}
