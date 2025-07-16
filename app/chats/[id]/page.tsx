import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = room.users.find((user) => user.id === session.id);
    if (!canSee) {
      return null;
    }
  }
  return room;
}

async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id!,
    },
    select: {
      username: true,
      avatar: true,
    },
  });
  return user;
}

async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const id = (await params).id;
  const room = await getRoom(id);
  if (!room) {
    return notFound();
  }
  const initialMessages = await getMessages(id);
  const session = await getSession();
  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }
  return (
    <ChatMessagesList
      chatRoomId={room.id}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar ?? ""}
      initialMessages={initialMessages}
    />
  );
}
