"use client";

// ============================================================
// CART DRAWER — Slide-in cart panel
// ============================================================

import { useCart } from "@/lib/cart";

interface Props {
  open: boolean;
  onClose: () => void;
  currency: string;
}

export default function CartDrawer({ open, onClose, currency }: Props) {
  const { items, totalPrice, removeItem, updateQty, clearCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-[var(--color-surface)] z-50 flex flex-col transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
          <h2 className="font-display text-xl text-[var(--color-text)]">
            سلة التسوق
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-16 text-[var(--color-text-muted)] font-arabic">
              <span className="text-5xl block mb-4 opacity-30">🛒</span>
              <p>سلتك فارغة</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.ml}`}
                className="flex gap-4 border-b border-[var(--color-border)] pb-6"
              >
                <div className="w-20 h-24 bg-[var(--color-surface-alt)] flex-shrink-0 overflow-hidden">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-arabic text-sm text-[var(--color-text)] mb-1 truncate">
                    {item.productName}
                  </p>
                  <p className="text-[var(--color-text-muted)] text-xs mb-3 font-arabic">
                    {item.ml}ml
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[var(--color-border)]">
                      <button
                        onClick={() =>
                          updateQty(item.productId, item.ml, item.quantity - 1)
                        }
                        className="px-3 py-1 hover:text-[var(--color-accent)] transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-sm font-arabic border-x border-[var(--color-border)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(item.productId, item.ml, item.quantity + 1)
                        }
                        className="px-3 py-1 hover:text-[var(--color-accent)] transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.ml)}
                      className="text-xs text-[var(--color-text-muted)] hover:text-red-400 transition-colors font-arabic"
                    >
                      حذف
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-[var(--color-accent)]">
                    {currency}{(item.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-[var(--color-border)] space-y-4">
            <div className="flex justify-between font-arabic">
              <span className="text-[var(--color-text-muted)]">الإجمالي</span>
              <span className="font-display text-2xl text-[var(--color-accent)]">
                {currency}{totalPrice.toFixed(0)}
              </span>
            </div>
            <button className="btn-luxury-fill w-full font-arabic">
              إتمام الطلب
            </button>
            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-[var(--color-text-muted)] hover:text-red-400 transition-colors font-arabic py-2"
            >
              إفراغ السلة
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
