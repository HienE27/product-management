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

  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    setImagePreview(null);
    setEditingId(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh hợp lệ');
        return;
      }

      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }

      // Tạo preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setForm((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
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
      alert('Vui lòng chọn hình ảnh');
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
    setImagePreview(product.image);
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
      <h1>Product List (version 2B)</h1>

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
              {editingId === null ? 'Add product' : 'Save changes'}
            </button>
            {editingId !== null && (
              <button type="button" onClick={resetForm}>
                Hủy
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Products List Section */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="px-6 sm:px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Danh sách sản phẩm
              </h2>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {products.length} sản phẩm
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Tên sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="w-12 h-12 text-zinc-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Chưa có sản phẩm nào</p>
                        <p className="text-sm text-zinc-400 dark:text-zinc-500">Thêm sản phẩm đầu tiên của bạn ở trên</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <ProductRow
                      key={p.id}
                      product={p}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      formatCurrency={formatCurrency}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
