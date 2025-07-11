import { formatToDollar, formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  id: number;
  title: string;
  price: number;
  photo: string;
  created_at: Date;
}

export default function ListProduct({
  id,
  title,
  price,
  photo,
  created_at,
}: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image src={photo} alt={title} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-1 *:text-neutral-700">
        <span className="text-xl">{title}</span>
        <span className="text-sm text-neutral-300">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">${formatToDollar(price)}</span>
      </div>
    </Link>
  );
}
