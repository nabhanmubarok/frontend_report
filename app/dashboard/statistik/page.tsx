"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { reportApi } from "@/lib/api";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";
import { BarChart2, PieChart as PieIcon, TrendingUp, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import toast from "react-hot-toast";

const COLORS = ["#A98B76", "#8FA870", "#F59E0B", "#EF4444", "#6B8054", "#BFA98E"];

export default function StatistikPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
    const router = useRouter();

  useEffect(() => {
    const user = getUser();
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    toast.error("Akses ditolak");
    router.push("/dashboard");
    return;
  }
    reportApi.getAll({ limit: 500, page: 1 }).then((r) => {
      setReports(r.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-cream-light">
      <Navbar />
      <div className="flex items-center justify-center pt-40">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    </div>
  );

  // ── Data untuk Status Pie Chart ──
  const statusCount = reports.reduce((acc: any, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = [
    { name: "Menunggu", value: statusCount.pending || 0 },
    { name: "Disetujui", value: statusCount.approved || 0 },
    { name: "Ditolak", value: statusCount.rejected || 0 },
  ];

  // ── Data untuk Kategori Bar Chart ──
  const categoryCount = reports.reduce((acc: any, r) => {
    acc[r.category_name] = (acc[r.category_name] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value);

  // ── Data untuk Tren per Bulan (Line Chart) ──
  const monthCount = reports.reduce((acc: any, r) => {
    const date = new Date(r.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const trendData = Object.entries(monthCount)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, value]) => ({
      month: new Date(month + "-01").toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
      laporan: value,
    }));

  // ── Top Pelapor ──
  const authorCount = reports.reduce((acc: any, r) => {
    acc[r.author] = (acc[r.author] || 0) + 1;
    return acc;
  }, {});
  const topAuthors = Object.entries(authorCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5);

  const total = reports.length;
  const approved = statusCount.approved || 0;
  const resolveRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-stone-800 mb-1">Statistik Laporan</h1>
          <p className="text-stone-500">Ringkasan dan analisis data pengaduan masyarakat</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Laporan", value: total, color: "text-primary", bg: "bg-primary/10" },
            { label: "Disetujui", value: approved, color: "text-sage-dark", bg: "bg-sage/10" },
            { label: "Menunggu", value: statusCount.pending || 0, color: "text-amber-700", bg: "bg-amber-50" },
            { label: "Tingkat Selesai", value: `${resolveRate}%`, color: "text-stone-700", bg: "bg-stone-100" },
          ].map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <div className={`text-3xl font-display font-bold mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-stone-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart – Status */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-stone-700 mb-4 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-primary" />
              Distribusi Status
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={45}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} laporan`]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart – Tren */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-stone-700 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Tren Laporan (6 Bulan)
            </h2>
            {trendData.length < 2 ? (
              <div className="flex items-center justify-center h-[260px] text-stone-400 text-sm">
                Data belum cukup untuk menampilkan tren
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5DAC8" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8B6F5A" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#8B6F5A" }} />
                  <Tooltip formatter={(v) => [`${v} laporan`]} />
                  <Line
                    type="monotone"
                    dataKey="laporan"
                    stroke="#A98B76"
                    strokeWidth={2.5}
                    dot={{ fill: "#A98B76", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar Chart – Kategori */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-stone-700 mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              Laporan per Kategori
            </h2>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-[260px] text-stone-400 text-sm">Tidak ada data</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5DAC8" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#8B6F5A" }} />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fill: "#8B6F5A" }} />
                  <Tooltip formatter={(v) => [`${v} laporan`]} />
                  <Bar dataKey="value" fill="#A98B76" radius={[0, 6, 6, 0]}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top Pelapor */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-stone-700 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Top 5 Pelapor Aktif
            </h2>
            <div className="space-y-3">
              {topAuthors.length === 0 ? (
                <p className="text-stone-400 text-sm text-center py-8">Tidak ada data</p>
              ) : topAuthors.map((a: any, i) => (
                <div key={a.name} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-stone-700">{a.name}</span>
                      <span className="text-stone-400">{a.value} laporan</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${(a.value / (topAuthors[0]?.value || 1)) * 100}%`,
                          backgroundColor: COLORS[i % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}