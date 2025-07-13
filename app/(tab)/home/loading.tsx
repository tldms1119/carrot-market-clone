export default function loading() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="*:rounded-md flex gap-5">
          <div key={index} className="size-28 bg-neutral-200"></div>
          <div className="flex flex-col gap-2 *:rounded-md">
            <div className="bg-neutral-200 h-5 w-40"></div>
            <div className="bg-neutral-200 h-5 w-20"></div>
            <div className="bg-neutral-200 h-5 w-10"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
