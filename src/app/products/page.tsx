'use client';

import { useState } from 'react';
import Image from 'next/image';
import ProductRow from './ProductRow';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string; // ví dụ "/images/p1.jpg"
};

const initialProducts: Product[] = [
  { id: 1, name: 'Sản phẩm 1', price: 100000, image: '/images/p1.jpg' },
  { id: 2, name: 'Sản phẩm 2', price: 150000, image: '/images/p2.jpg' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    id: '',
    name: '',
    price: '',
    image: '',
  });

  function formatCurrency(value: number): string {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}


  function resetForm() {
    if (editingId !== null) {
      const ok = confirm('Bạn có chắc muốn hủy chỉnh sửa hiện tại không?');
      if (!ok) return;
    }
    setForm({ id: '', name: '', price: '', image: '' });
    setEditingId(null);
  }


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsedId = Number(form.id);
    const parsedPrice = Number(form.price);
    const trimmedName = form.name.trim();
    const trimmedImage = form.image.trim();

    if (!form.id || isNaN(parsedId)) {
      alert('Id phải là số hợp lệ');
      return;
    }

    if (parsedId <= 0) {
      alert('Id phải lớn hơn 0');
      return;
    }

    if (!trimmedName) {
      alert('Name không được để trống');
      return;
    }

    if (!form.price || isNaN(parsedPrice)) {
      alert('Price phải là số hợp lệ');
      return;
    }

    if (parsedPrice <= 0) {
      alert('Price phải lớn hơn 0');
      return;
    }

    if (!trimmedImage) {
      alert('Image không được để trống');
      return;
    }

    if (!trimmedImage.startsWith('/')) {
      alert('Image path nên bắt đầu bằng "/" (ví dụ: /images/p1.jpg)');
      return;
    }

    if (editingId === null) {
      // THÊM MỚI
      if (products.some((p) => p.id === parsedId)) {
        alert('Id đã tồn tại');
        return;
      }
      const newProduct: Product = {
        id: parsedId,
        name: trimmedName,
        price: parsedPrice,
        image: trimmedImage,
      };
      setProducts((prev) => [...prev, newProduct]);
    } else {
      // SỬA
      // Nếu đổi Id sang Id đã tồn tại (khác chính nó) thì báo lỗi
      if (products.some((p) => p.id === parsedId && p.id !== editingId)) {
        alert('Id mới bị trùng với sản phẩm khác');
        return;
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
              ...p,
              id: parsedId,
              name: trimmedName,
              price: parsedPrice,
              image: trimmedImage,
            }
            : p,
        ),
      );
    }

    resetForm();
  }


  function handleEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      id: String(product.id),
      name: product.name,
      price: String(product.price),
      image: product.image,
    });
  }

  function handleDelete(id: number) {
    const product = products.find((p) => p.id === id);
    const label = product ? `${product.name} (Id = ${product.id})` : `Id = ${id}`;

    if (!confirm(`Bạn có chắc muốn xóa sản phẩm ${label}?`)) return;

    setProducts((prev) => prev.filter((p) => p.id !== id));

    if (editingId === id) {
      resetForm();
    }
  }


  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      {/* Dòng này sẽ dùng tạo CONFLICT 1 */}
      <h1>Danh sách sản phẩm</h1>

      <section style={{ marginTop: 16, marginBottom: 24 }}>
        <h2>{editingId === null ? 'Thêm sản phẩm' : `Sửa sản phẩm #${editingId}`}</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'grid', gap: 8, maxWidth: 400 }}
        >
          <input
            name="id"
            placeholder="Id (số)"
            value={form.id}
            onChange={handleChange}
            type="number"
            min={1}
            required
          />
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            placeholder="Price (số)"
            value={form.price}
            onChange={handleChange}
            type="number"
            min={0}
            required
          />
          <input
            name="image"
            placeholder="Image path (ví dụ: /images/p1.jpg)"
            value={form.image}
            onChange={handleChange}
            required
          />


          <div style={{ display: 'flex', gap: 8 }}>
            {/* Dòng này sẽ dùng tạo CONFLICT 2 */}
            <button type="submit">
                {editingId === null ? 'Thêm sản phẩm mới (Add product)' : 'Cập nhật sản phẩm(Save changes)'}
            </button>
            {editingId !== null && (
              <button type="button" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2>Danh sách</h2>
        <table
          border={1}
          cellPadding={8}
          style={{ borderCollapse: 'collapse', width: '100%' }}
        >
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
  <ProductRow
    key={p.id}
    product={p}
    onEdit={handleEdit}
    onDelete={handleDelete}
    formatCurrency={formatCurrency}
  />
))}

          </tbody>
        </table>
      </section>
    </main>
  );
}
