export const product = {
  name: "Vitamin C Glow Serum",
  brandName: "LumiCare Vitamin C Serum",
  phone: "9744254833",
  regularPrice: 5000,
  offerPrice: 3999,
  deliveryFee: 150,
  freeDeliveryThreshold: 8000,
  currency: "Rs",
  description:
    "A lightweight, refreshing serum made for everyday skincare. It helps give the skin a brighter, healthier-looking glow while keeping skin feeling fresh and hydrated.",
  benefits: [
    "Helps brighten the appearance of dull skin",
    "Supports a healthy-looking glow",
    "Lightweight and easy to apply",
    "Helps keep skin hydrated",
    "Suitable for everyday skincare routines"
  ],
  images: [
    {
      src: "/products/vitamin-c-serum-hero.png",
      alt: "Woman applying Vitamin C Glow Serum"
    },
    {
      src: "/products/vitamin-c-serum-bottle.png",
      alt: "Vitamin C serum bottle"
    },
    {
      src: "/products/vitamin-c-serum-texture.png",
      alt: "Smooth skincare texture in a glass jar"
    },
    {
      src: "/products/vitamin-c-serum-packaging.png",
      alt: "Premium skincare product packaging"
    }
  ],
  testimonials: [
    {
      quote:
        "The serum feels so lightweight and leaves my skin looking fresh and glowing.",
      name: "Arvi KC",
      location: "Ghorahi Dang",
      demo: true
    },
    {
      quote: "I really like how simple it is to add this to my morning routine.",
      name: "Nivi Thapa",
      location: "Kathmandu",
      demo: true
    },
    {
      quote: "The texture is amazing and it doesn't feel heavy on my skin.",
      name: "Anjana Shrestha",
      location: "Nawalparasi",
      demo: true
    },
    {
      quote: "The packaging and overall experience feel really premium.",
      name: "Asmita KC",
      location: "Ghorahi",
      demo: true
    }
  ],
  faqs: [
    {
      question: "How do I use the serum?",
      answer:
        "Apply 2-3 drops to clean, dry skin and gently massage it into your face. Follow with moisturizer and sunscreen during the day."
    },
    {
      question: "Can I use it every day?",
      answer:
        "Yes, it is designed for everyday use. Start with once a day and adjust based on how your skin responds."
    },
    {
      question: "When should I use it?",
      answer:
        "It can be used in your morning or evening skincare routine. If used during the day, finish with sunscreen."
    },
    {
      question: "Is it suitable for all skin types?",
      answer:
        "It is designed as an everyday serum, but everyone's skin is different. Patch testing is recommended before regular use."
    },
    {
      question: "How much serum should I use?",
      answer: "2-3 drops are generally enough for the face."
    },
    {
      question: "How should I store it?",
      answer:
        "Keep it in a cool, dry place away from direct sunlight and close the bottle after use."
    },
    {
      question: "Can I use it with other skincare products?",
      answer:
        "Yes, it can be incorporated into a simple skincare routine. If you're using multiple active ingredients, introduce products gradually."
    }
  ]
};

export function formatMoney(amount: number) {
  return `${product.currency} ${amount.toLocaleString("en-NP")}`;
}

export function getDeliveryFee(subtotal: number) {
  return subtotal >= product.freeDeliveryThreshold ? 0 : product.deliveryFee;
}

export function getOrderTotals(quantity: number) {
  const safeQuantity = Math.max(1, Number.isFinite(quantity) ? Math.floor(quantity) : 1);
  const subtotal = product.offerPrice * safeQuantity;
  const deliveryFee = getDeliveryFee(subtotal);
  return {
    quantity: safeQuantity,
    pricePerPiece: product.offerPrice,
    subtotal,
    deliveryFee,
    totalPrice: subtotal + deliveryFee
  };
}
