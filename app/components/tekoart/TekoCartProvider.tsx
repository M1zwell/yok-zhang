"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { cartCount, cartSubtotal, readStoredCart, reduceTekoCart, writeStoredCart } from "@/lib/tekoart/cart";
import { createStorefrontCheckout, shopifyCartPermalink } from "@/lib/tekoart/shopify";
import type { TekoCartLine, TekoProduct, TekoVariant } from "@/lib/tekoart/types";
import { productImage } from "@/lib/tekoart/catalog";

type TekoCartApi = {
  lines: TekoCartLine[];
  count: number;
  subtotal: number;
  add: (product: TekoProduct, variant: TekoVariant, quantity?: number) => void;
  setQty: (variantId: number, quantity: number) => void;
  remove: (variantId: number) => void;
  clear: () => void;
  checkout: () => Promise<void>;
  checkingOut: boolean;
};

const TekoCartContext = createContext<TekoCartApi | null>(null);

export function TekoCartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reduceTekoCart, []);
  const [ready, setReady] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    dispatch({ type: "hydrate", lines: readStoredCart() });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeStoredCart(lines);
  }, [lines, ready]);

  const add = useCallback((product: TekoProduct, variant: TekoVariant, quantity = 1) => {
    dispatch({
      type: "add",
      line: {
        variantId: variant.id,
        productId: product.id,
        handle: product.handle,
        title: product.title,
        variantTitle: variant.title === "Default Title" ? "" : variant.title,
        sku: variant.sku,
        price: variant.price,
        image: productImage(product),
        quantity,
      },
    });
  }, []);

  const setQty = useCallback((variantId: number, quantity: number) => {
    dispatch({ type: "setQty", variantId, quantity });
  }, []);

  const remove = useCallback((variantId: number) => {
    dispatch({ type: "remove", variantId });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const checkout = useCallback(async () => {
    if (lines.length === 0) return;
    setCheckingOut(true);
    const payload = lines.map((line) => ({ variantId: line.variantId, quantity: line.quantity }));
    const created = await createStorefrontCheckout(payload);
    const url = created.ok ? created.checkoutUrl : shopifyCartPermalink(payload);
    window.location.href = url;
  }, [lines]);

  const value = useMemo<TekoCartApi>(
    () => ({
      lines,
      count: cartCount(lines),
      subtotal: cartSubtotal(lines),
      add,
      setQty,
      remove,
      clear,
      checkout,
      checkingOut,
    }),
    [add, checkingOut, checkout, clear, lines, remove, setQty],
  );

  return <TekoCartContext.Provider value={value}>{children}</TekoCartContext.Provider>;
}

export function useTekoCart(): TekoCartApi {
  const ctx = useContext(TekoCartContext);
  if (!ctx) throw new Error("useTekoCart must be used within TekoCartProvider");
  return ctx;
}
