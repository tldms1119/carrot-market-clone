"use client";

import { useEffect, useRef, useState } from "react";
import ListProduct from "./list-product";
import { getMoreProducts } from "@/app/(tab)/home/action";

interface ProductListProps {
  initialProducts: {
    title: string;
    id: number;
    price: number;
    photo: string;
    created_at: Date;
  }[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  // Even though you mutate trigger value, react wouldn't rerender the page
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    // when the trigger(span) observe in view, we'll get new products
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        // 0. if trigger is observed
        if (element.isIntersecting && trigger.current) {
          // 1. stop observing
          observer.unobserve(trigger.current);
          // 2. get more products
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
      }
    );
    if (trigger.current) {
      // trigger 관찰할겠다고 명시적 지정
      observer.observe(trigger.current);
    }
    // clean up function (when user unmount this page)
    return () => {
      observer.disconnect();
    };
  }, [page]);
  return (
    <div className="p-5 flex flex-col gap-5 mb-15">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {isLastPage ? null : (
        <span
          //   like giving id to span tag
          ref={trigger}
          className="text-sm font-semibold bg-amber-500 w-fit mx-auto
    px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "Loading..." : "Load more"}
        </span>
      )}
    </div>
  );
}
