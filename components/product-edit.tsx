"use client";

import { useActionState, useState } from "react";
import Button from "./button";
import Input from "./input";
import { editProduct } from "@/app/products/[id]/edit/action";

interface ProductEditProps {
  product: {
    id: number;
    title: string;
    price: number;
    description: string;
    photo: string;
  };
}

export default function ProductEdit({ product }: ProductEditProps) {
  const [preview, setPreview] = useState(product.photo);
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    setPreview(URL.createObjectURL(file));
  };
  const [state, dispatch] = useActionState(editProduct, null);
  return (
    <div>
      <form action={dispatch} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square
                flex flex-col items-center justify-center text-neutral-400
                border-neutral-300 rounded-md border-dashed cursor-pointer
                bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        ></label>
        <input
          type="file"
          id="photo"
          name="photo"
          className="hidden"
          onChange={onImageChange}
        />
        <input
          type="text"
          name="id"
          defaultValue={product.id}
          className="hidden"
        />
        <input
          type="text"
          name="old_photo"
          defaultValue={product.photo}
          className="hidden"
        />
        <Input
          name="title"
          required
          defaultValue={product.title}
          type="text"
          placeholder="Title"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          required
          defaultValue={product.price}
          type="text"
          placeholder="Price"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          required
          defaultValue={product.description}
          type="text"
          placeholder="Description"
          errors={state?.fieldErrors.description}
        />
        <Button text="Edit" />
      </form>
    </div>
  );
}
