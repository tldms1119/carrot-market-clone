"use client";
import { saveMessage } from "@/app/chats/[id]/action";
import { InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ChatMessagesProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string;
}

export default function ChatMessagesList({
  chatRoomId,
  userId,
  username,
  avatar,
  initialMessages,
}: ChatMessagesProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SUPABASE_API_KEY = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!;
  const channel = useRef<RealtimeChannel>(null);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: "string",
          avatar: "",
        },
      },
    ]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username,
          avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
  };
  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_API_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="p-5 flex flex-col gap-3 h-screen">
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex flex-col gap-5 mt-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 items-start 
        ${message.userId === userId ? "justify-end" : ""}`}
            >
              {message.userId === userId ? null : !message.user.avatar ? (
                <UserIcon className="size-8" />
              ) : (
                <Image
                  width={40}
                  height={40}
                  className="size-8"
                  src={message.user.avatar!}
                  alt={message.user.username}
                />
              )}
              <div
                className={`flex flex-col gap-1
            ${message.userId === userId ? "items-end" : ""}`}
              >
                <span
                  className={`${
                    message.userId === userId ? "bg-green-500" : "bg-orange-500"
                  } px-2 py-1 rounded-md
             text-white`}
                >
                  {message.payload}
                </span>
                <span className="text-xs">
                  {formatToTimeAgo(message.created_at.toString())}
                </span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <form
        onSubmit={onSubmit}
        className="flex justify-between items-center gap-2 flex-shrink-0"
      >
        <input
          required
          onChange={onChange}
          value={message}
          type="text"
          name="message"
          placeholder="Write a message..."
          className="bg-transparent rounded-full w-full px-4 h-10
          focus:outline-none ring-1 focus:ring-2 transition ring-neutral-400
          focus:ring-neutral-500 border-none"
        />
        <button>
          <ArrowUpCircleIcon
            className="size-10 text-orange-500
          transition-colors hover:text-orange-300 cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
}
