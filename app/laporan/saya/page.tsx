"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ReportCard from "@/components/laporan/ReportCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { reportApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import Link from "next/link";
import { FilePlus, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

export default function MyReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
    const user = getUser();
    if (!user) { router.push("/login"); return; }
    loadReports();
  }, [page]);

  const loadReports = () => {
    setLoading(true);
    reportApi.getMyReports({ page, limit: 9 }).then((r) => {
      setReports(r.data.data);
      setPagination(r.data.pagination);
    }).catch(() => toast.error("Gagal memuat laporan"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Laporan Saya</h1>
            <p className="text-stone-500">Semua laporan yang telah kamu buat ({pagination.total} laporan)</p>
          </div>
          <Link href="/laporan/baru" className="btn-primary flex items-center gap-2">
            <FilePlus className="w-4 h-4" /> Buat Laporan
          </Link>
        </div>

        {loading ? <LoadingSpinner /> : reports.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-display text-xl text-stone-600 mb-2">Belum ada laporan</h3>
            <p className="text-stone-400 text-sm mb-6">Mulai buat laporan pertama kamu</p>
            <Link href="/laporan/baru" className="btn-primary inline-flex items-center gap-2">
              <FilePlus className="w-4 h-4" /> Buat Laporan
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {reports.map((r) => <ReportCard key={r.id} report={r} />)}
            </div>
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                  className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-stone-600 font-bold">{page} / {pagination.totalPages}</span>
                <button onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages}
                  className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40">
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