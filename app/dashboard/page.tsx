"use client";
import { useEffect, useState } from "react";
import { reportApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import ReportCard from "@/components/laporan/ReportCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import {
  FilePlus, Filter, Search, ChevronLeft, ChevronRight,
  FileText, Clock, CheckCircle, TrendingUp,
} from "lucide-react";

interface Report {
  id: number;
  header: string;
  body: string;
  status: string;
  author: string;
  author_avatar: string | null;
  category_name: string;
  address: string | null;
  image: string | null;
  comment_count: number;
  like_count: number; 
  created_at: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", category_id: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
    setUser(getUser());
    reportApi.getCategories().then((r) => setCategories(r.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    reportApi
      .getAll({
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.category_id ? { category_id: parseInt(filters.category_id) } : {}),
        page,
        limit: 9,
      })
      .then((r) => {
        setReports(r.data.data);
        setPagination(r.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [filters, page]);

  const filtered = search
    ? reports.filter(
        (r) =>
          r.header.toLowerCase().includes(search.toLowerCase()) ||
          r.body.toLowerCase().includes(search.toLowerCase())
      )
    : reports;

  const pending = reports.filter((r) => r.status === "pending").length;
  const approved = reports.filter((r) => r.status === "approved").length;
  const rejected = reports.filter((r) => r.status === "rejected").length;

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute top-8 left-8 w-32 h-32 rounded-full bg-white/5" />
        </div>
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-cream/70 text-sm font-bold uppercase tracking-widest mb-2">
                Selamat Datang
              </p>
              <h1 className="font-display text-4xl font-bold text-white mb-2">
                {user ? `Halo, ${user.username} 👋` : "Dashboard Laporan"}
              </h1>
              <p className="text-cream/70 text-base">
                Pantau dan kelola laporan pengaduan masyarakat
              </p>
            </div>
            {user && (
              <Link
                href="/laporan/baru"
                className="bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-cream transition-colors shadow-lg flex items-center gap-2 self-start"
              >
                <FilePlus className="w-4 h-4" />
                Buat Laporan
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { icon: FileText, label: "Total Laporan", value: pagination.total, color: "bg-white/10", textColor: "text-white" },
              { icon: Clock, label: "Menunggu", value: pending, color: "bg-amber-500/20", textColor: "text-amber-200" },
              { icon: CheckCircle, label: "Disetujui", value: approved, color: "bg-sage/20", textColor: "text-green-200" },
              { icon: TrendingUp, label: "Ditolak", value: rejected, color: "bg-red-500/20", textColor: "text-red-200" },
            ].map((s) => (
              <div key={s.label} className={`${s.color} rounded-2xl p-4 backdrop-blur-sm border border-white/10`}>
                <div className="flex items-center gap-3 mb-2">
                  <s.icon className={`w-4 h-4 ${s.textColor}`} />
                  <span className="text-cream/70 text-xs font-bold uppercase tracking-wide">{s.label}</span>
                </div>
                <div className={`font-display text-3xl font-bold ${s.textColor}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 mb-8 -mt-6 relative z-10 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Cari judul atau deskripsi laporan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 py-2.5"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-stone-50 rounded-lg px-3 py-1.5 border border-stone-200">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-xs text-stone-400 font-bold">Filter:</span>
            </div>
            <select
              value={filters.status}
              onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
              className="input py-2 w-36 text-sm"
            >
              <option value="">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
            <select
              value={filters.category_id}
              onChange={(e) => { setFilters({ ...filters, category_id: e.target.value }); setPage(1); }}
              className="input py-2 w-44 text-sm"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.category_name}</option>
              ))}
            </select>
            {(filters.status || filters.category_id || search) && (
              <button
                onClick={() => { setFilters({ status: "", category_id: "" }); setSearch(""); setPage(1); }}
                className="text-xs text-red-500 font-bold hover:underline px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Result info */}
        {!loading && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-stone-500">
              Menampilkan <span className="font-bold text-stone-700">{filtered.length}</span> laporan
              {search && <span> untuk "<span className="text-primary font-bold">{search}</span>"</span>}
            </p>
            {pagination.totalPages > 1 && (
              <span className="text-sm text-stone-400">Halaman {page} dari {pagination.totalPages}</span>
            )}
          </div>
        )}

        {/* Reports grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-stone-300" />
            </div>
            <h3 className="font-display text-xl text-stone-600 mb-2">Tidak ada laporan ditemukan</h3>
            <p className="text-stone-400 text-sm mb-6">
              {search || filters.status || filters.category_id
                ? "Coba ubah filter atau kata kunci pencarian"
                : "Belum ada laporan yang masuk"}
            </p>
            {user && (
              <Link href="/laporan/baru" className="btn-primary inline-flex items-center gap-2">
                <FilePlus className="w-4 h-4" />
                Buat Laporan Pertama
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {filtered.map((r) => <ReportCard key={r.id} report={r} />)}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="text-stone-400 px-1">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${
                          p === page
                            ? "bg-primary text-white shadow-sm"
                            : "border border-stone-200 hover:bg-stone-100 text-stone-600"
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages}
                  className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}