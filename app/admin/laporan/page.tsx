"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { reportApi } from "@/lib/api";
import { getUser, isAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Clock, Trash2, Eye, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { exportToExcel } from "@/lib/excel";
import { Download } from "lucide-react";
import Link from "next/link";

export default function AdminLaporanPage() {
  const router = useRouter();
  const user = getUser();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [rejectModal, setRejectModal] = useState<{ id: number | null; note: string }>({ id: null, note: "" });

  useEffect(() => {
    if (!isAdmin(user)) {
      toast.error("Akses ditolak");
      router.push("/dashboard");
    }
  }, []);

  const loadReports = () => {
    setLoading(true);
    reportApi
      .getAll({ ...(statusFilter ? { status: statusFilter } : {}), page, limit: 15 })
      .then((r) => {
        setReports(r.data.data);
        setPagination(r.data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadReports(); }, [statusFilter, page]);

  const updateStatus = async (id: number, status: string, note?: string) => {
    try {
      await reportApi.updateStatus(id, status, note);
      toast.success("Status diperbarui");
      loadReports();
    } catch { toast.error("Gagal memperbarui status"); }
  };

  const deleteReport = async (id: number) => {
    if (!confirm("Hapus laporan ini?")) return;
    try {
      await reportApi.delete(id);
      toast.success("Laporan dihapus");
      loadReports();
    } catch {
      toast.error("Gagal menghapus laporan");
    }
  };

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Kelola Laporan</h1>
          <p className="text-stone-500">Tinjau dan perbarui status laporan pengaduan masyarakat</p>
        </div>

        {/* Filter */}
        <div className="card p-4 mb-6 flex items-center gap-3">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input py-2 w-44"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
          <button
    onClick={() => exportToExcel(reports, "laporan")}
    className="flex items-center gap-2 text-sm font-bold bg-sage/10 text-sage-dark hover:bg-sage/20 px-4 py-2 rounded-lg transition-colors"
  >
    <Download className="w-4 h-4" /> Export CSV
  </button>
          
          <span className="text-sm text-stone-400 ml-auto">
            Total: <strong className="text-stone-700">{pagination.total}</strong> laporan
          </span>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="text-left px-4 py-3 font-bold text-stone-600">ID</th>
                      <th className="text-left px-4 py-3 font-bold text-stone-600">Judul</th>
                      <th className="text-left px-4 py-3 font-bold text-stone-600">Pelapor</th>
                      <th className="text-left px-4 py-3 font-bold text-stone-600">Kategori</th>
                      <th className="text-left px-4 py-3 font-bold text-stone-600">Status</th>
                      <th className="text-left px-4 py-3 font-bold text-stone-600">Tanggal</th>
                      <th className="text-left px-4 py-3 font-bold text-stone-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-stone-400">
                          Tidak ada laporan
                        </td>
                      </tr>
                    ) : (
                      reports.map((r) => (
                        <tr key={r.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                          <td className="px-4 py-3 text-stone-400 font-mono">#{r.id}</td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-stone-700 line-clamp-1 max-w-48">{r.header}</p>
                          </td>
                          <td className="px-4 py-3 text-stone-600">{r.author}</td>
                          <td className="px-4 py-3 text-stone-500">{r.category_name}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={r.status} />
                          </td>
                          <td className="px-4 py-3 text-stone-400">{formatDate(r.created_at)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Link
                                href={`/laporan/${r.id}`}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                title="Lihat detail"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => updateStatus(r.id, "approved")}
                                disabled={r.status === "approved"}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-sage-dark hover:bg-sage/10 transition-colors disabled:opacity-30"
                                title="Setujui"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              {/* Tombol Tolak - membuka modal */}
                              <button
                                onClick={() => setRejectModal({ id: r.id, note: "" })}
                                disabled={r.status === "rejected"}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30"
                                title="Tolak"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updateStatus(r.id, "pending")}
                                disabled={r.status === "pending"}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-30"
                                title="Set Pending"
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteReport(r.id)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-stone-600 font-bold">{page} / {pagination.totalPages}</span>
                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages}
                  className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Tolak Laporan */}
      {rejectModal.id && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-up">
            <h2 className="font-display text-xl font-bold text-stone-800 mb-2">Tolak Laporan</h2>
            <p className="text-stone-500 text-sm mb-4">Tambahkan catatan alasan penolakan (opsional)</p>
            <textarea
              value={rejectModal.note}
              onChange={(e) => setRejectModal({ ...rejectModal, note: e.target.value })}
              placeholder="Contoh: Laporan duplikat, informasi tidak lengkap..."
              className="input resize-none mb-4"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRejectModal({ id: null, note: "" })}
                className="btn-outline flex-1"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  updateStatus(rejectModal.id!, "rejected", rejectModal.note);
                  setRejectModal({ id: null, note: "" });
                }}
                className="btn-danger flex-1"
              >
                Tolak Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}