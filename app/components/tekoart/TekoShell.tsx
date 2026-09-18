"use client";

import { useEffect, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import type { TekoShopKind } from "@/lib/tekoart/types";
import { TekoCartProvider } from "./TekoCartProvider";
import { TekoChrome } from "./TekoChrome";
import "./tekoart.css";

export function TekoShell({
  locale,
  kind,
  handle,
  children,
}: {
  locale: Locale;
  kind: TekoShopKind;
  handle?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("teko-shop");
    return () => root.classList.remove("teko-shop");
  }, []);

  return (
    <div className="teko-root" data-shop="tekoart" data-kind={kind}>
      <TekoCartProvider>
        <TekoChrome locale={locale} kind={kind} handle={handle}>
          {children}
        </TekoChrome>
      </TekoCartProvider>
    </div>
  );
}
