"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import { reportApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import {
  Upload, MapPin, X, Navigation, FileText, Tag, AlignLeft, Image as ImageIcon,
} from "lucide-react";


interface Category { id: number; category_name: string; }

export default function CreateReportPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    header: "", body: "", category_id: "", address: "", latitude: "", longitude: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user) { toast.error("Silakan login terlebih dahulu"); router.push("/login"); return; }
    reportApi.getCategories().then((r) => setCategories(r.data.data));
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Ukuran file maksimal 5MB"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setForm((prev) => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }));
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      setForm((prev) => ({ ...prev, latitude: lat.toString(), longitude: lng.toString(), address: data.display_name || `${lat}, ${lng}` }));
    } catch { /* user isi manual */ }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) { toast.error("Browser tidak mendukung GPS"); return; }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await handleMapClick(pos.coords.latitude, pos.coords.longitude);
        toast.success("Lokasi berhasil dideteksi!");
        setLocLoading(false);
      },
      () => { toast.error("Gagal mendapatkan lokasi. Izinkan akses GPS."); setLocLoading(false); }
    );
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
    if (form.latitude) fd.append("latitude", form.latitude);
    if (form.longitude) fd.append("longitude", form.longitude);
    if (imageFile) fd.append("image", imageFile);
    setLoading(true);
    try {
      await reportApi.create(fd);
      toast.success("Laporan berhasil dikirim!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengirim laporan");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Buat Laporan Baru</h1>
          <p className="text-stone-500">Isi formulir di bawah ini dengan detail yang jelas.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-stone-700 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Informasi Laporan
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">
                  Judul Laporan <span className="text-red-500">*</span>
                </label>
                <input type="text" placeholder="Contoh: Jalan Berlubang di Depan SDN 01"
                  value={form.header} onChange={(e) => setForm({ ...form, header: e.target.value })}
                  className="input" maxLength={200} />
                <p className="text-xs text-stone-400 mt-1">{form.header.length}/200 karakter</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">
                  <AlignLeft className="inline w-3.5 h-3.5 mr-1" />
                  Deskripsi Lengkap <span className="text-red-500">*</span>
                </label>
                <textarea placeholder="Jelaskan masalah secara detail: apa yang terjadi, kapan, dampaknya, dan tindakan yang diharapkan..."
                  value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="input resize-none" rows={5} />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">
                  <Tag className="inline w-3.5 h-3.5 mr-1" />
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input">
                  <option value="">Pilih kategori laporan</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.category_name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Lokasi */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-stone-700 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Lokasi Kejadian
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-stone-500">
                📍 Tulis alamat, atau gunakan tombol GPS di bawah.
              </p>

              

              <button type="button" onClick={detectLocation} disabled={locLoading}
                className="flex items-center gap-2 text-sm text-primary font-bold hover:underline disabled:opacity-50">
                <Navigation className="w-4 h-4" />
                {locLoading ? "Mendeteksi lokasi..." : "Deteksi Lokasi Otomatis (GPS)"}
              </button>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Alamat Lengkap</label>
                <input type="text"
                  placeholder="Terisi otomatis saat klik peta, atau isi manual"
                  value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="input" />
                <p className="text-xs text-stone-400 mt-1">
                  Sertakan nama jalan, nomor, RT/RW, kelurahan, dan kecamatan untuk memudahkan verifikasi.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Latitude</label>
                  <input type="text" placeholder="-6.9175" value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value })} className="input" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Longitude</label>
                  <input type="text" placeholder="107.6191" value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value })} className="input" />
                </div>
              </div>

              {form.latitude && form.longitude && (
                <div className="bg-sage/10 border border-sage/20 rounded-lg p-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sage-dark flex-shrink-0" />
                  <span className="text-sm text-sage-dark">
                    Koordinat: {parseFloat(form.latitude).toFixed(6)}, {parseFloat(form.longitude).toFixed(6)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Foto */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-stone-700 mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" /> Foto Bukti
            </h2>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-stone-200 hover:border-primary/40 rounded-xl p-8 text-center transition-colors group">
                <Upload className="w-10 h-10 text-stone-300 group-hover:text-primary/50 mx-auto mb-3 transition-colors" />
                <p className="text-stone-500 text-sm font-bold">Klik untuk upload foto</p>
                <p className="text-stone-400 text-xs mt-1">PNG, JPG, GIF – Maks 5MB</p>
              </button>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()} className="btn-outline flex-1">Batal</button>
            <button type="submit" disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Mengirim...</>
              ) : "Kirim Laporan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}