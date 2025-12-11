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
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Danh sách sản phẩm
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Quản lý sản phẩm của bạn một cách dễ dàng
          </p>
        </div>

        {/* Form Section */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-1 h-8 rounded-full ${editingId === null ? 'bg-blue-500' : 'bg-amber-500'}`} />
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {editingId === null ? 'Thêm sản phẩm mới' : `Chỉnh sửa sản phẩm #${editingId}`}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="id"
                  name="id"
                  placeholder="Nhập ID (số)"
                  value={form.id}
                  onChange={handleChange}
                  type="number"
                  min={1}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  placeholder="Nhập tên sản phẩm"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Giá <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  placeholder="Nhập giá (VND)"
                  value={form.price}
                  onChange={handleChange}
                  type="number"
                  min={0}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Hình ảnh sản phẩm <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!imagePreview}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {imagePreview && (
                    <div className="relative inline-block">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setForm((prev) => ({ ...prev, image: '' }));
                          // Reset file input
                          const fileInput = document.getElementById('image') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                        title="Xóa ảnh"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Chọn file ảnh (JPG, PNG, GIF) - Tối đa 5MB
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800"
              >
                {editingId === null ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm sản phẩm
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lưu thay đổi
                  </span>
                )}
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
