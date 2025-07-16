import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react";

async function getChatRooms(userId: number) {
  let chatRooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      created_at: true,
      users: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      product: {
        select: {
          id: true,
          title: true,
        },
      },
      message: {
        select: {
          created_at: true,
        },
        orderBy: {
          created_at: "desc",
        },
        take: 1,
      },
    },
  });
  if (chatRooms.length > 0) {
    // 0. remove chatroom if there is only me
    chatRooms = chatRooms.filter((room) => room.users.length > 1);
    // 1. sort chatroom by recent message
    chatRooms = chatRooms.sort((a, b) => {
      const aTime = a.message[0].created_at.getTime() ?? 0;
      const bTime = b.message[0].created_at.getTime() ?? 0;
      return bTime - aTime;
    });
  }
  return chatRooms;
}

export const metadata = {
  title: "Chats",
};

export default async function Chats() {
  const session = await getSession();
  const chatRooms = await getChatRooms(session.id!);
  return (
    <>
      {chatRooms.length === 0 ? (
        <div className="p-5">There isn't any Chat Rooms</div>
      ) : null}
      {chatRooms.map((room) => (
        <Link
          key={room.id}
          href={`/chats/${room.id}`}
          className="px-5 py-2 border-b border-neutral-300 flex cursor-pointer
          last:pb-0 last:border-b-0"
        >
          <div className="p-5 w-full flex items-center justify-between">
            {room.users.map((user) => {
              if (user.id !== session.id!) {
                return (
                  <React.Fragment key={room.id}>
                    <div className="flex items-center gap-3 ">
                      <div className="size-10 rounded-full overflow-hidden">
                        {user.avatar !== null ? (
                          <Image
                            src={user.avatar}
                            width={40}
                            height={40}
                            alt={user.username}
                          />
                        ) : (
                          <UserIcon className="text-neutral-400" />
                        )}
                      </div>
                      <div className="flex flex-col text-neutral-600">
                        <h3 className="text-lg font-semibold">
                          {user.username}
                        </h3>
                        <p>{room.product.title}</p>
                      </div>
                    </div>
                    <div className="flex text-neutral-500">
                      {formatToTimeAgo(room.message[0].created_at.toString())}
                    </div>
                  </React.Fragment>
                );
              }
            })}
          </div>
        </Link>
      ))}
    </>
  );
}
