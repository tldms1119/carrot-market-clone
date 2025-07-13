"use server";

import CloseButton from "@/components/close-button";
import db from "@/lib/db";
import { formatToDollar } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

export default async function Modal({ params }: { params: { id: string } }) {
  const id = Number((await params).id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  return (
    <div
      className="absolute w-full h-full z-50
    flex justify-center items-center left-0 top-0 bg-white/60"
    >
      <CloseButton />
      <div className="max-w-screen-sm w-full h-1/2 flex justify-center">
        <div
          className="w-full bg-neutral-400 
          rounded-md flex justify-between items-center shadow-xl"
        >
          <div className="w-full h-full bg-white relative">
            <Image
              fill
              src={product.photo}
              alt={product.title}
              className="object-contain"
            />
          </div>
          <div className="w-full h-full flex flex-col justify-between bg-red-50">
            <div className="p-3 flex items-center gap-5 border-b border-neutral-300 flex-shrink-0">
              <div className="size-10 rounded-full overflow-hidden relative">
                {product.user.avatar !== null ? (
                  <Image
                    fill
                    src={product.user.avatar}
                    alt={product.user.username}
                  />
                ) : (
                  <UserIcon className="text-neutral-300" />
                )}
              </div>
              <div className="text-neutral-600 font-semibold">
                {product.user.username}
              </div>
            </div>
            <div className="p-3 flex-1 overflow-auto">
              <h1 className="text-xl font-semibold">{product.title}</h1>
              <p className="pt-3 elli">{product.description}</p>
            </div>
            <div className="h-20 flex justify-between items-center flex-shrink-0">
              <span className="font-semibold text-xl p-4">
                ${formatToDollar(product.price)}
              </span>
              <Link
                className="bg-orange-500 px-5 py-2.5 mr-3 text-white
        rounded-md font-semibold"
                href={``}
              >
                채팅하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
