"use client";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

export default function CloseButton() {
  const router = useRouter();
  const onCloseClick = () => {
    router.back();
  };
  return (
    <button onClick={onCloseClick} className="absolute right-10 top-10">
      <XMarkIcon className="size-10 text-neutral-600 cursor-pointer" />
    </button>
  );
}
