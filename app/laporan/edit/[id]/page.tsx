"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import { reportApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { getImageUrl } from "@/lib/utils";
import { Upload, X, FileText, Tag, AlignLeft, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditLaporanPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    header: "", body: "", category_id: "", address: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user) { router.push("/login"); return; }

    Promise.all([
      reportApi.getById(Number(id)),
      reportApi.getCategories(),
    ]).then(([rr, cr]) => {
      const r = rr.data.data;
      if (r.user_id !== user.id && user.role === "user") {
        toast.error("Anda tidak berhak mengedit laporan ini");
        router.push("/dashboard");
        return;
      }
      setForm({
        header: r.header,
        body: r.body,
        category_id: r.category_id.toString(),
        address: r.address || "",
      });
      const imgUrl = getImageUrl(r.image);
      if (imgUrl) setImagePreview(imgUrl);
      setCategories(cr.data.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Maksimal 5MB"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.header || !form.body || !form.category_id) {
      toast.error("Judul, deskripsi, dan kategori wajib diisi"); return;
    }
    const fd = new FormData();
    fd.append("header", form.header);
    fd.append("body", form.body);
    fd.append("category_id", form.category_id);
    if (form.address) fd.append("address", form.address);
    if (imageFile) fd.append("image", imageFile);
    setSaving(true);
    try {
      await reportApi.update(Number(id), fd);
      toast.success("Laporan berhasil diperbarui!");
      router.push(`/laporan/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal memperbarui laporan");
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-cream-light"><Navbar />
      <div className="flex items-center justify-center pt-40">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-12">
        <Link href={`/laporan/${id}`}
          className="inline-flex items-center gap-2 text-stone-500 hover:text-primary text-sm font-bold mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Detail
        </Link>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Edit Laporan</h1>
          <p className="text-stone-500">Perbarui informasi laporan Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6">
            <h2 className="font-display font-semibold text-stone-700 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Informasi Laporan
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Judul Laporan *</label>
                <input type="text" value={form.header}
                  onChange={(e) => setForm({ ...form, header: e.target.value })}
                  className="input" maxLength={200} />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">
                  <AlignLeft className="inline w-3.5 h-3.5 mr-1" /> Deskripsi *
                </label>
                <textarea value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="input resize-none" rows={5} />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">
                  <Tag className="inline w-3.5 h-3.5 mr-1" /> Kategori *
                </label>
                <select value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input">
                  <option value="">Pilih kategori</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.category_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Alamat</label>
                <input type="text" value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Alamat lengkap kejadian" className="input" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-display font-semibold text-stone-700 mb-4">Foto Bukti</h2>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-stone-200 hover:border-primary/40 rounded-xl p-8 text-center">
                <Upload className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-stone-500 text-sm font-bold">Klik untuk upload foto baru</p>
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()} className="btn-outline flex-1">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}