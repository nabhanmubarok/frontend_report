"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { userApi } from "@/lib/api";
import { getUser, isSuperAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit, X, Save, ShieldCheck, User, Users } from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  const user = getUser();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [form, setForm] = useState({ username: "", password: "", role: "user" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin(user)) {
      toast.error("Akses ditolak – Super Admin only");
      router.push("/dashboard");
    }
  }, []);

  const loadUsers = () => {
    setLoading(true);
    userApi.getAll().then((r) => setUsers(r.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm({ username: "", password: "", role: "user" });
    setShowModal(true);
  };

  const openEdit = (u: any) => {
    setEditUser(u);
    setForm({ username: u.username, password: "", role: u.role });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.username) { toast.error("Username wajib diisi"); return; }
    if (!editUser && !form.password) { toast.error("Password wajib diisi"); return; }
    setSaving(true);
    try {
      if (editUser) {
        await userApi.update(editUser.id, { username: form.username, role: form.role });
        toast.success("User diperbarui");
      } else {
        await userApi.create(form);
        toast.success("User dibuat");
      }
      setShowModal(false);
      loadUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (id === user?.id) { toast.error("Tidak bisa menghapus akun sendiri"); return; }
    if (!confirm("Hapus user ini?")) return;
    try {
      await userApi.delete(id);
      toast.success("User dihapus");
      loadUsers();
    } catch {
      toast.error("Gagal menghapus user");
    }
  };

  const roleColor: Record<string, string> = {
    user: "bg-stone-100 text-stone-600",
    admin: "bg-primary/10 text-primary",
    super_admin: "bg-sage/10 text-sage-dark",
  };

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Kelola Pengguna</h1>
            <p className="text-stone-500">Manajemen akun pengguna sistem</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total User", value: users.length, icon: Users, color: "text-primary" },
            { label: "Admin", value: users.filter(u => u.role === "admin").length, icon: ShieldCheck, color: "text-sage-dark" },
            { label: "Super Admin", value: users.filter(u => u.role === "super_admin").length, icon: User, color: "text-amber-700" },
          ].map((s) => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-stone-800">{s.value}</div>
                <div className="text-stone-400 text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left px-4 py-3 font-bold text-stone-600">ID</th>
                  <th className="text-left px-4 py-3 font-bold text-stone-600">Username</th>
                  <th className="text-left px-4 py-3 font-bold text-stone-600">Role</th>
                  <th className="text-left px-4 py-3 font-bold text-stone-600">Bergabung</th>
                  <th className="text-left px-4 py-3 font-bold text-stone-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 text-stone-400 font-mono">#{u.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-stone-700">{u.username}</span>
                        {u.id === user?.id && (
                          <span className="badge bg-amber-100 text-amber-700 border-amber-200 text-xs">Anda</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge border-transparent ${roleColor[u.role] || ""}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-400">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={u.id === user?.id}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-stone-800">
                {editUser ? "Edit User" : "Tambah User Baru"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="input"
                  placeholder="username"
                />
              </div>
              {!editUser && (
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input"
                    placeholder="minimal 6 karakter"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="input"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1">Batal</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
