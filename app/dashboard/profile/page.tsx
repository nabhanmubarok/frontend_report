"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { authApi } from "@/lib/api";
import { getUser, clearAuth } from "@/lib/auth";
import toast from "react-hot-toast";
import { User, Lock, LogOut, Save } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const user = getUser();
  const [usernameForm, setUsernameForm] = useState({ username: user?.username || "" });
  const [passForm, setPassForm] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameForm.username) { toast.error("Username wajib diisi"); return; }
    setSavingProfile(true);
    try {
      await authApi.updateProfile(usernameForm);
      toast.success("Profil diperbarui. Silakan login ulang.");
      clearAuth();
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passForm.oldPassword || !passForm.newPassword) { toast.error("Semua field wajib diisi"); return; }
    if (passForm.newPassword !== passForm.confirm) { toast.error("Password baru tidak cocok"); return; }
    if (passForm.newPassword.length < 6) { toast.error("Password baru minimal 6 karakter"); return; }
    setSavingPass(true);
    try {
      await authApi.changePassword({ oldPassword: passForm.oldPassword, newPassword: passForm.newPassword });
      toast.success("Password berhasil diubah. Silakan login ulang.");
      clearAuth();
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengubah password");
    } finally {
      setSavingPass(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    toast.success("Berhasil keluar");
    router.push("/");
  };

  if (!user) { router.push("/login"); return null; }

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Profil Saya</h1>
          <p className="text-stone-500">Kelola informasi akun Anda</p>
        </div>

        {/* Profile info card */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-display font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-stone-800">{user.username}</h2>
              <span className="badge bg-primary/10 text-primary border-primary/20">{user.role}</span>
            </div>
          </div>

          <form onSubmit={updateProfile}>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">
              <User className="inline w-3.5 h-3.5 mr-1" />
              Username
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={usernameForm.username}
                onChange={(e) => setUsernameForm({ username: e.target.value })}
                className="input flex-1"
              />
              <button type="submit" disabled={savingProfile} className="btn-primary flex items-center gap-2 px-4">
                <Save className="w-4 h-4" />
                {savingProfile ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>

        {/* Change password */}
        <div className="card p-6 mb-6">
          <h2 className="font-display font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Ubah Password
          </h2>
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">Password Lama</label>
              <input
                type="password"
                value={passForm.oldPassword}
                onChange={(e) => setPassForm({ ...passForm, oldPassword: e.target.value })}
                className="input"
                placeholder="Masukkan password lama"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">Password Baru</label>
              <input
                type="password"
                value={passForm.newPassword}
                onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                className="input"
                placeholder="Minimal 6 karakter"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">Konfirmasi Password Baru</label>
              <input
                type="password"
                value={passForm.confirm}
                onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
                className="input"
                placeholder="Ulangi password baru"
              />
            </div>
            <button type="submit" disabled={savingPass} className="btn-primary flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {savingPass ? "Mengubah..." : "Ubah Password"}
            </button>
          </form>
        </div>

        {/* Logout */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-stone-700 mb-3">Sesi</h2>
          <button onClick={handleLogout} className="btn-danger flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Keluar dari Akun
          </button>
        </div>
      </div>
    </div>
  );
}
