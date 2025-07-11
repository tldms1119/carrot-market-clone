import ProductList from "@/components/product-list";
import db from "@/lib/db";

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
    </div>
  );
}
