"use client";

import { HandThumbUpIcon as SolidThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/action";

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}) {
  // UseOptimistic allows user to show update page without any delay
  // during server mutate specific states
  const [state, reducer] = useOptimistic(
    { isLiked, likeCount },
    (prevState, payload) => ({
      isLiked: !prevState.isLiked,
      likeCount: prevState.isLiked
        ? prevState.likeCount - 1
        : prevState.likeCount + 1,
    })
  );

  const onClick = async () => {
    reducer(undefined);
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-neutral-500 text-sm border
                 border-neutral-500 rounded-full p-2 transition-colors cursor-pointer
                ${
                  state.isLiked
                    ? "bg-orange-500 text-white border-orange-500"
                    : "hover:bg-neutral-800"
                }`}
    >
      {state.isLiked ? (
        <SolidThumbUpIcon className="size-5" />
      ) : (
        <OutlineThumbUpIcon className="size-5" />
      )}

      {state.isLiked ? (
        <span>{state.likeCount}</span>
      ) : (
        <span>Likes ({state.likeCount})</span>
      )}
    </button>
  );
}
