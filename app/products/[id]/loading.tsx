import { PhotoIcon } from "@heroicons/react/24/solid";

export default function Loading() {
  return (
    <div className="animate-pulse p-5 flex flex-col gap-5">
      <div
        className="aspect-square border-neutral-400 border-4 
      border-dashed rounded-md flex justify-center items-center
      text-neutral-400"
      >
        <PhotoIcon className="h-28" />
      </div>
      <div className="flex gap-2 items-center">
        <div className="size-14 rounded-full bg-neutral-400"></div>
        <div className="flex flex-col gap-1">
          <div className="h-5 w-40 bg-neutral-400 rounded-md"></div>
          <div className="h-5 w-20 bg-neutral-400 rounded-md"></div>
        </div>
      </div>
      <div className="h-7 w-80 bg-neutral-400 rounded-md"></div>
    </div>
  );
}
