"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function getOrCreateChatRoom(formData: FormData) {
  const productId = Number(formData.get("productId"));
  const userId = Number(formData.get("userId"));
  const session = await getSession();
  const chatRoom = await db.chatRoom.findFirst({
    where: {
      productId,
      users: {
        some: {
          id: session.id!,
        },
      },
    },
    select: {
      id: true,
    },
  });
  if (chatRoom) {
    return redirect(`/chats/${chatRoom.id}`);
  }
  const room = await db.chatRoom.create({
    data: {
      users: {
        connect: [
          {
            id: userId,
          },
          {
            id: session.id,
          },
        ],
      },
      product: {
        connect: {
          id: productId,
        },
      },
    },
    select: {
      id: true,
    },
  });
  return redirect(`/chats/${room.id}`);
}
