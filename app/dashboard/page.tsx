"use client";
import { useEffect, useState } from "react";
import { reportApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import ReportCard from "@/components/laporan/ReportCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { FilePlus, Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Report {
  id: number;
  header: string;
  body: string;
  status: string;
  author: string;
  category_name: string;
  address: string | null;
  image: string | null;
  comment_count: number;
  created_at: string;
}

export default function DashboardPage() {
  const user = getUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", category_id: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
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

  const stats = {
    total: pagination.total,
    pending: reports.filter((r) => r.status === "pending").length,
    approved: reports.filter((r) => r.status === "approved").length,
  };

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-800">
              {user ? `Halo, ${user.username} 👋` : "Dashboard Laporan"}
            </h1>
            <p className="text-stone-500 mt-1">Pantau dan temukan laporan pengaduan masyarakat</p>
          </div>
          {user && (
            <Link href="/laporan/baru" className="btn-primary flex items-center gap-2 self-start">
              <FilePlus className="w-4 h-4" />
              Buat Laporan
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Laporan", value: pagination.total, color: "bg-primary/10 text-primary" },
            { label: "Menunggu", value: stats.pending, color: "bg-amber-100 text-amber-700" },
            { label: "Disetujui", value: stats.approved, color: "bg-sage/10 text-sage-dark" },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <div className={`text-3xl font-display font-bold mb-1 ${s.color.split(" ")[1]}`}>
                {s.value}
              </div>
              <div className="text-stone-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Cari laporan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={filters.status}
              onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
              className="input py-2 w-36"
            >
              <option value="">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
            <select
              value={filters.category_id}
              onChange={(e) => { setFilters({ ...filters, category_id: e.target.value }); setPage(1); }}
              className="input py-2 w-40"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.category_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reports grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-display text-lg">Tidak ada laporan ditemukan</p>
            {user && (
              <Link href="/laporan/baru" className="btn-primary mt-4 inline-flex items-center gap-2">
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-stone-600 font-bold">
                  {page} / {pagination.totalPages}
                </span>
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
    </div>
  );
}
