import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    return user;
  }
  notFound();
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div className="p-5 flex justify-between">
      <h1 className="text-xl">
        Welcome! <span className="font-semibold">{user?.username} 🙂</span>
      </h1>
      {/* using form not to make this component to client component */}
      <form action={logOut}>
        <button
          className="bg-orange-500 px-5 py-2 text-white
        rounded-md font-semibold"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
