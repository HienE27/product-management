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
    <tr>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{formatCurrency(product.price)}</td>
      <td>
        <Image
          src={product.image}
          alt={product.name}
          width={80}
          height={80}
        />
      </td>
      <td>
        <button onClick={() => onEdit(product)}>Sửa</button>
        <button onClick={() => onDelete(product.id)}>Xóa</button>
      </td>
    </tr>
  );
}
