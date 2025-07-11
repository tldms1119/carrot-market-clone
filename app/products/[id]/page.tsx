import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToDollar } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  } else {
    return false;
  }
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number((await params).id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);
  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={product.photo}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-300">
        <div className="size-10 rounded-full overflow-hidden">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon className="text-neutral-300" />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5 mb-25">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div
        className="fixed w-full max-w-screen-md h-25 bottom-0 p-5 pb-10 
        bg-neutral-300 flex justify-between items-center"
      >
        <span className="font-semibold text-xl">
          ${formatToDollar(product.price)}
        </span>
        {isOwner ? (
          <button
            className="bg-red-500 px-5 py-2.5 text-white
        rounded-md font-semibold"
          >
            Delete Product
          </button>
        ) : null}
        <Link
          className="bg-orange-500 px-5 py-2.5 text-white
        rounded-md font-semibold"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}
