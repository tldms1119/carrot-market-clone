import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      created_at: true,
    },
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export default async function Product() {
  const initialProducts = await getInitialProducts();
  return (
    <div className="p-5 flex flex-col gap-5">
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="bg-orange-500 flex
      items-center justify-center size-16 rounded-full 
      fixed bottom-24 right-8 text-white
      transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
