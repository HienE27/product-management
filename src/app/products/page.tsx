'use client';

import { useState } from 'react';
import Image from 'next/image';

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

  function resetForm() {
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

    if (!parsedId || !form.name || !parsedPrice || !form.image) {
      alert('Nhập đầy đủ Id, Name, Price, Image');
      return;
    }

    if (editingId === null) {
      if (products.some((p) => p.id === parsedId)) {
        alert('Id đã tồn tại');
        return;
      }
      const newProduct: Product = {
        id: parsedId,
        name: form.name,
        price: parsedPrice,
        image: form.image,
      };
      setProducts((prev) => [...prev, newProduct]);
    } else {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                id: parsedId,
                name: form.name,
                price: parsedPrice,
                image: form.image,
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
    if (!confirm(`Xóa sản phẩm Id = ${id}?`)) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
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
          />
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="price"
            placeholder="Price (số)"
            value={form.price}
            onChange={handleChange}
          />
          <input
            name="image"
            placeholder="Image path (ví dụ: /images/p1.jpg)"
            value={form.image}
            onChange={handleChange}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            {/* Dòng này sẽ dùng tạo CONFLICT 2 */}
            <button type="submit">
              {editingId === null ? 'Thêm sản phẩm' : 'Lưu thay đổi'}
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
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.price.toLocaleString()}</td>
                <td>
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={80}
                    height={80}
                  />
                </td>
                <td>
                  <button onClick={() => handleEdit(p)}>Sửa</button>
                  <button onClick={() => handleDelete(p.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
