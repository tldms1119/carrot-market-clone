"use server";

import db from "@/lib/db";
import { deleteImage, saveImage } from "@/lib/file-utils";
import { productSchema } from "../../product-schema";
import { redirect } from "next/navigation";

export async function getProduct(id: number) {
  const product = db.product.findUnique({
    where: {
      id,
    },
  });
  return product;
}

export async function editProduct(_: any, formData: FormData) {
  const data = {
    id: formData.get("id"),
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
  let isImageChanged = false;
  if (data.photo instanceof File) {
    data.photo = await saveImage(data.photo);
    isImageChanged = true;
  } else {
    data.photo = formData.get("old_photo");
  }
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const product = await db.product.update({
      where: {
        id: Number(data.id),
      },
      data: {
        title: result.data.title,
        price: result.data.price,
        description: result.data.description,
        photo: result.data.photo,
      },
      select: {
        id: true,
      },
    });
    if (product && isImageChanged) {
      deleteImage(formData.get("old_photo") as string);
    }
    redirect(`/products/${product.id}`);
  }
}
