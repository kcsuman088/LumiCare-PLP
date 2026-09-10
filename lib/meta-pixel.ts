export const META_PIXEL_ID = "1687403765652533";

export type MetaPixelEventName =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase";

export type MetaPixelEventData = Record<string, string | number | string[]>;

declare global {
  interface Window {
    fbq?: (eventType: "track", eventName: MetaPixelEventName, data?: MetaPixelEventData, options?: Record<string, string>) => void;
  }
}

export function trackMetaEvent(
  eventName: MetaPixelEventName,
  data?: MetaPixelEventData,
  options?: Record<string, string>
) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, data, options);
  }
}
