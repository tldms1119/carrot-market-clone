import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface SessionContent {
  id?: number;
}

export async function getSession() {
  return getIronSession<SessionContent>(await cookies(), {
    cookieName: "carrot",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function logUserIn(userId: number) {
  const session = await getSession();
  session.id = userId;
  await session.save();
  return redirect("/profile");
}
