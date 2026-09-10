"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { MetaPixelEventData, MetaPixelEventName, trackMetaEvent } from "@/lib/meta-pixel";

export function MetaPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    trackMetaEvent("PageView");
  }, [pathname, query]);

  return null;
}

export function MetaPixelEvent({
  eventName,
  data
}: {
  eventName: MetaPixelEventName;
  data?: MetaPixelEventData;
}) {
  const dataKey = JSON.stringify(data ?? {});

  useEffect(() => {
    trackMetaEvent(eventName, data);
  }, [data, dataKey, eventName]);

  return null;
}
