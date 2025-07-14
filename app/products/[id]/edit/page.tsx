import { notFound } from "next/navigation";
import { getProduct } from "./action";
import ProductEdit from "@/components/product-edit";

export default async function EditProduct({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const id = Number((await params).id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  return <ProductEdit product={product} />;
}
