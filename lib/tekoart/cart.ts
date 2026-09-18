import { TEKOART_CART_STORAGE } from "./shopify";
import type { TekoCartAction, TekoCartLine } from "./types";

export function reduceTekoCart(state: TekoCartLine[], action: TekoCartAction): TekoCartLine[] {
  switch (action.type) {
    case "hydrate":
      return clampLines(action.lines);
    case "add": {
      const existing = state.find((line) => line.variantId === action.line.variantId);
      if (!existing) return clampLines([...state, { ...action.line, quantity: Math.max(1, action.line.quantity) }]);
      return clampLines(
        state.map((line) =>
          line.variantId === action.line.variantId
            ? { ...line, quantity: line.quantity + Math.max(1, action.line.quantity) }
            : line,
        ),
      );
    }
    case "setQty":
      if (action.quantity <= 0) return state.filter((line) => line.variantId !== action.variantId);
      return clampLines(
        state.map((line) => (line.variantId === action.variantId ? { ...line, quantity: action.quantity } : line)),
      );
    case "remove":
      return state.filter((line) => line.variantId !== action.variantId);
    case "clear":
      return [];
    default: {
      const _never: never = action;
      throw new Error(`unexpected cart action ${( _never as { type: string }).type}`);
    }
  }
}

function clampLines(lines: TekoCartLine[]): TekoCartLine[] {
  return lines
    .filter((line) => line.quantity > 0 && Number.isFinite(line.variantId))
    .map((line) => ({ ...line, quantity: Math.min(99, Math.max(1, Math.floor(line.quantity))) }));
}

export function readStoredCart(): TekoCartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TEKOART_CART_STORAGE);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return clampLines(parsed.filter(isCartLine));
  } catch {
    return [];
  }
}

export function writeStoredCart(lines: TekoCartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEKOART_CART_STORAGE, JSON.stringify(lines));
}

function isCartLine(value: unknown): value is TekoCartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as TekoCartLine;
  return typeof line.variantId === "number" && typeof line.quantity === "number" && typeof line.handle === "string";
}

export function cartCount(lines: TekoCartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function cartSubtotal(lines: TekoCartLine[]): number {
  return lines.reduce((sum, line) => sum + Number.parseFloat(line.price) * line.quantity, 0);
}
