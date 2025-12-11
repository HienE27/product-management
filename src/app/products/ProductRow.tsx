'use client';

import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type ProductRowProps = {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: number) => void;
  formatCurrency: (value: number) => string;
};

export default function ProductRow({ product, onEdit, onDelete, formatCurrency }: ProductRowProps) {
  return (
    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold text-sm">
          {product.id}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {product.name}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
          {formatCurrency(product.price)}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={product.image}
              alt={product.name}
              width={64}
              height={64}
              className="object-cover w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23e4e4e7" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 dark:focus:ring-offset-zinc-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Sửa
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:focus:ring-offset-zinc-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Xóa
          </button>
        </div>
      </td>
    </tr>
  );
}
