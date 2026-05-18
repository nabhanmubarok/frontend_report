"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MessageSquare, Eye, EyeOff, Lock, User } from "lucide-react";
import { authApi } from "@/lib/api";
import { setAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error("Username dan password wajib diisi");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const { token, user } = res.data.data;
      setAuth(token, user);
      toast.success(`Selamat datang, ${user.username}!`);
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-light flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark to-primary opacity-90" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-sage/20 translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">LaporKita</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Suarakan Masalah,<br />Wujudkan Perubahan
          </h2>
          <p className="text-cream/70 text-lg">
            Platform pengaduan masyarakat terpercaya untuk Indonesia yang lebih baik.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          {["2.4K+ Laporan", "98% Puas", "15K+ Warga"].map((s) => (
            <div key={s} className="bg-white/10 rounded-xl px-4 py-2">
              <span className="text-white text-sm font-bold">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-stone-800">LaporKita</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Selamat Datang</h1>
          <p className="text-stone-500 mb-8">Masuk untuk melanjutkan ke akun Anda</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-stone-500 text-sm mt-6">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Daftar sekarang
            </Link>
          </p>

          <Link href="/" className="block text-center text-stone-400 text-sm mt-3 hover:text-stone-600">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
