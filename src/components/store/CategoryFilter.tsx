"use client";

import { Category } from "@/types";

interface Props {
  categories: Category[];
}

export default function CategoryFilter({ categories }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {categories.map((cat, i) => (
        <a
          key={cat.id}
          href={`/?category=${cat.id}`}
          className={`card-luxury p-6 text-center hover:bg-[var(--color-accent)] group transition-all duration-300 opacity-0 animate-fadeUp`}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <span className="text-3xl block mb-3">{cat.icon}</span>
          <p className="text-[var(--color-text-muted)] group-hover:text-[var(--color-bg)] text-sm font-arabic transition-colors">
            {cat.nameAr}
          </p>
          <p className="text-[var(--color-text-muted)] group-hover:text-[var(--color-bg)] text-[10px] tracking-widest uppercase mt-1 transition-colors">
            {cat.name}
          </p>
        </a>
      ))}
    </div>
  );
}
