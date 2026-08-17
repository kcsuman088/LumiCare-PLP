"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { product } from "@/lib/product";

export function ProductGallery() {
  const [active, setActive] = useState(0);
  const image = product.images[active];

  function move(direction: number) {
    setActive((current) => (current + direction + product.images.length) % product.images.length);
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-soft">
        <Image
          src={image.src}
          alt={image.alt}
          width={1100}
          height={900}
          priority={active === 0}
          className="aspect-[4/3] w-full object-cover"
        />
        <button
          type="button"
          aria-label="Previous product image"
          onClick={() => move(-1)}
          className="focus-ring absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-sm backdrop-blur transition hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next product image"
          onClick={() => move(1)}
          className="focus-ring absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-sm backdrop-blur transition hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {product.images.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setActive(index)}
            className={`focus-ring overflow-hidden rounded-2xl border bg-white transition ${
              active === index ? "border-orchid" : "border-white"
            }`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={220}
              height={170}
              className="aspect-[4/3] w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
