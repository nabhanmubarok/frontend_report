"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { reportApi, commentApi } from "@/lib/api";
import { getUser, isAdmin } from "@/lib/auth";
import { formatDate, getImageUrl } from "@/lib/utils";
import {
  MapPin, Calendar, User, Tag, MessageCircle, Send, Trash2, ArrowLeft,
  CheckCircle, XCircle, Clock, Pencil, X, Check,
} from "lucide-react";
import Link from "next/link";

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commLoading, setCommLoading] = useState(false);
  const imageUrl = getImageUrl(report.image);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const { getUser: _getUser } = require("@/lib/auth");
    setUser(_getUser());
  }, []);

  const loadReport = async () => {
    try {
      const [rr, cr] = await Promise.all([
        reportApi.getById(Number(id)),
        commentApi.getByReport(Number(id)),
      ]);
      setReport(rr.data.data);
      setComments(cr.data.data);
    } catch {
      toast.error("Laporan tidak ditemukan");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReport(); }, [id]);

  const submitComment = async () => {
    if (!user) { toast.error("Login untuk berkomentar"); return; }
    if (!commentText.trim()) return;
    setCommLoading(true);
    try {
      await commentApi.create({ body: commentText, public_report_id: Number(id) });
      setCommentText("");
      toast.success("Komentar ditambahkan");
      loadReport();
    } catch {
      toast.error("Gagal menambahkan komentar");
    } finally {
      setCommLoading(false);
    }
  };

  const startEdit = (c: any) => {
    setEditingId(c.id);
    setEditText(c.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (cid: number) => {
    if (!editText.trim()) return;
    setEditLoading(true);
    try {
      await commentApi.update(cid, editText);
      toast.success("Komentar diperbarui");
      setEditingId(null);
      loadReport();
    } catch {
      toast.error("Gagal memperbarui komentar");
    } finally {
      setEditLoading(false);
    }
  };

  const deleteComment = async (cid: number) => {
    if (!confirm("Hapus komentar ini?")) return;
    try {
      await commentApi.delete(cid);
      toast.success("Komentar dihapus");
      loadReport();
    } catch {
      toast.error("Gagal menghapus komentar");
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await reportApi.updateStatus(Number(id), status);
      toast.success(`Status diubah menjadi ${status}`);
      loadReport();
    } catch {
      toast.error("Gagal mengubah status");
    }
  };

  const deleteReport = async () => {
    if (!confirm("Hapus laporan ini? Tindakan tidak dapat dibatalkan.")) return;
    try {
      await reportApi.delete(Number(id));
      toast.success("Laporan dihapus");
      router.push("/dashboard");
    } catch {
      toast.error("Gagal menghapus laporan");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-cream-light">
      <Navbar /><div className="pt-24"><LoadingSpinner /></div>
    </div>
  );
  if (!report) return null;

  const isOwner = user?.id === report.user_id;

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-stone-500 hover:text-primary text-sm font-bold mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main */}
          <div className="md:col-span-2 space-y-5">
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="font-display text-2xl font-bold text-stone-800 leading-tight">
                  {report.header}
                </h1>
                <StatusBadge status={report.status} />
              </div>
              {imageUrl && (
                <img src={imageUrl} alt={report.header}
                  className="w-full rounded-xl mb-4 max-h-80 object-cover" />
              )}
              <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">{report.body}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-stone-500 pt-4 border-t border-stone-100">
                <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{report.author}</div>
                <div className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" />{report.category_name}</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDate(report.created_at)}</div>
              </div>
            </div>

            {/* Comments */}
            <div className="card p-6">
              <h2 className="font-display font-semibold text-stone-700 mb-5 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                Komentar ({comments.length})
              </h2>

              {user ? (
                <div className="flex gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Tulis komentar Anda..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="input resize-none mb-2" rows={2}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitComment(); }
                      }}
                    />
                    <button onClick={submitComment} disabled={commLoading || !commentText.trim()}
                      className="btn-primary text-sm py-1.5 px-4 flex items-center gap-2">
                      <Send className="w-3.5 h-3.5" />
                      {commLoading ? "Mengirim..." : "Kirim"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-50 rounded-xl p-4 mb-6 text-center">
                  <p className="text-stone-500 text-sm">
                    <Link href="/login" className="text-primary font-bold hover:underline">Login</Link> untuk menambahkan komentar
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-stone-400 text-sm text-center py-4">Belum ada komentar</p>
                ) : comments.map((c: any) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary text-stone-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {c.commenter.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-stone-700">{c.commenter}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-stone-400">{formatDate(c.created_at)}</span>
                          {/* Tombol edit – hanya pemilik komentar */}
                          {user?.id === c.user_id && editingId !== c.id && (
                            <button onClick={() => startEdit(c)}
                              className="text-stone-300 hover:text-primary transition-colors" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {/* Tombol hapus – pemilik atau admin */}
                          {(user?.id === c.user_id || isAdmin(user)) && editingId !== c.id && (
                            <button onClick={() => deleteComment(c.id)}
                              className="text-stone-300 hover:text-red-500 transition-colors" title="Hapus">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Mode edit */}
                      {editingId === c.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="input resize-none text-sm" rows={2}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(c.id)} disabled={editLoading || !editText.trim()}
                              className="flex items-center gap-1.5 text-xs font-bold bg-sage/10 text-sage-dark hover:bg-sage/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                              <Check className="w-3.5 h-3.5" />
                              {editLoading ? "Menyimpan..." : "Simpan"}
                            </button>
                            <button onClick={cancelEdit}
                              className="flex items-center gap-1.5 text-xs font-bold bg-stone-100 text-stone-500 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors">
                              <X className="w-3.5 h-3.5" />
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-stone-600 text-sm">{c.body}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {(report.address || report.latitude) && (
              <div className="card p-5">
                <h3 className="font-display font-semibold text-stone-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Lokasi
                </h3>
                {report.address && <p className="text-sm text-stone-600 mb-2">{report.address}</p>}
                {report.latitude && report.longitude && (
                  <a href={`https://maps.google.com/?q=${report.latitude},${report.longitude}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Buka di Google Maps
                  </a>
                )}
              </div>
            )}

            {isAdmin(user) && (
              <div className="card p-5">
                <h3 className="font-display font-semibold text-stone-700 mb-3">Tindakan Admin</h3>
                <div className="space-y-2">
                  <button onClick={() => updateStatus("approved")} disabled={report.status === "approved"}
                    className="w-full flex items-center gap-2 text-sm font-bold text-sage-dark bg-sage/10 hover:bg-sage/20 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-40">
                    <CheckCircle className="w-4 h-4" /> Setujui Laporan
                  </button>
                  <button onClick={() => updateStatus("rejected")} disabled={report.status === "rejected"}
                    className="w-full flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-40">
                    <XCircle className="w-4 h-4" /> Tolak Laporan
                  </button>
                  <button onClick={() => updateStatus("pending")} disabled={report.status === "pending"}
                    className="w-full flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-40">
                    <Clock className="w-4 h-4" /> Set Pending
                  </button>
                </div>
              </div>
            )}

            {(isOwner || isAdmin(user)) && (
              <div className="card p-5">
                <h3 className="font-display font-semibold text-stone-700 mb-3">Kelola Laporan</h3>
                <button onClick={deleteReport}
                  className="w-full btn-danger text-sm flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" /> Hapus Laporan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}