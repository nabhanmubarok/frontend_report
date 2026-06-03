"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { reportApi } from "@/lib/api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, ReferenceLine,
  PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Users, FileCheck, Calendar, Target, PieChart as PieIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import toast from "react-hot-toast";

// ─── Palet warna dari referensi desain ───────────────────────────────────────
const PALETTE = {
  brown:     "#A98B76",
  brownMid:  "#BFA98E",
  brownLight:"#D4BC9C",
  cream:     "#EAD9CC",
  sage:      "#8FA870",
  sageDark:  "#6B8054",
  amber:     "#C4963E",
  red:       "#C07060",
};

const CATEGORY_COLORS = [
  PALETTE.brown,
  PALETTE.sage,
  PALETTE.amber,
  PALETTE.red,
  PALETTE.sageDark,
  PALETTE.brownMid,
  "#3B82F6",
  "#A855F7",
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#FFFDF9",
      border: "0.5px solid #E8DDD4",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 12,
      color: "#3B2A1A",
      boxShadow: "0 2px 12px rgba(169,139,118,0.12)",
    }}>
      <p style={{ fontWeight: 600, marginBottom: 6, color: "#3B2A1A" }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "#9C7E68" }}>{p.name}:</span>
          <span style={{ fontWeight: 500 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

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
    <div className="min-h-screen" style={{ background: "#FAF7F3" }}>
      <Navbar />
      <div className="flex items-center justify-center pt-40">
        <div
          className="w-10 h-10 rounded-full animate-spin"
          style={{ border: `3px solid ${PALETTE.cream}`, borderTopColor: PALETTE.brown }}
        />
      </div>
    </div>
  );

  // ─── Data processing ──────────────────────────────────────────────────────
  const total = reports.length;
  const approved = reports.filter(r => r.status === "approved").length;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const thisMonthCount = reports.filter(r => {
    const d = new Date(r.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const lastMonthCount = reports.filter(r => {
    const d = new Date(r.created_at);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  }).length;

  const growth = lastMonthCount === 0
    ? 100
    : ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;

  const monthSet = new Set<string>();
  reports.forEach(r => {
    const d = new Date(r.created_at);
    monthSet.add(`${d.getFullYear()}-${d.getMonth()}`);
  });
  const avgPerMonth = monthSet.size ? Math.round(total / monthSet.size) : 0;

  // Tren per status (line chart)
  const monthlyStatus: Record<string, { pending: number; approved: number; rejected: number }> = {};
  reports.forEach((r: any) => {
    const d = new Date(r.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyStatus[key]) monthlyStatus[key] = { pending: 0, approved: 0, rejected: 0 };
    if (r.status === "pending") monthlyStatus[key].pending++;
    else if (r.status === "approved") monthlyStatus[key].approved++;
    else if (r.status === "rejected") monthlyStatus[key].rejected++;
  });

  const trendStatusData = Object.entries(monthlyStatus)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, val]) => ({
      month: new Date(month + "-01").toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
      Disetujui: val.approved,
      Menunggu: val.pending,
      Ditolak: val.rejected,
    }));

  // Pie chart per kategori
  const categoryCount: Record<string, number> = {};
  reports.forEach(r => {
    const cat = r.category_name || "Tanpa Kategori";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const categoryPieData = Object.entries(categoryCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Top 5 pelapor
  const authorCount: Record<string, number> = {};
  reports.forEach(r => { authorCount[r.author] = (authorCount[r.author] || 0) + 1; });
  const topAuthors = Object.entries(authorCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const avgReportsPerAuthor = total / Object.keys(authorCount).length;
  const targetValue = Math.round(avgReportsPerAuthor * 1.2);

  // Warna bar berdasarkan urutan (gradasi coklat)
  const barColors = [PALETTE.brown, PALETTE.brownMid, PALETTE.brownLight, "#D9C9B8", "#E8DDD4"];

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F3" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">

        {/* Header */}
        <div className="mb-8">
          <h1 style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: 26,
            fontWeight: 600,
            color: "#3B2A1A",
            margin: "0 0 4px",
          }}>
            Statistik Laporan
          </h1>
          <p style={{ fontSize: 13, color: "#9C7E68", margin: 0 }}>
            Ringkasan dan analisis data laporan masuk
          </p>
          <div style={{
            width: 36,
            height: 3,
            borderRadius: 2,
            background: PALETTE.brown,
            marginTop: 12,
          }} />
        </div>

        {/* Kartu Metrik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Laporan"
            value={total.toLocaleString()}
            delta={`${growth >= 0 ? "+" : ""}${growth.toFixed(1)}% dari bulan lalu`}
            icon={<FileCheck size={16} />}
            variant="brown"
          />
          <MetricCard
            title="Laporan Disetujui"
            value={approved.toLocaleString()}
            delta={`${Math.round((approved / total) * 100)}% dari total laporan`}
            icon={<TrendingUp size={16} />}
            variant="sage"
          />
          <MetricCard
            title="Rata-rata / Bulan"
            value={avgPerMonth.toLocaleString()}
            delta={`${thisMonthCount} laporan bulan ini`}
            icon={<Calendar size={16} />}
            variant="amber"
          />
          <MetricCard
            title="Pelapor Aktif"
            value={Object.keys(authorCount).length.toLocaleString()}
            delta={`Top: ${topAuthors[0]?.name || "-"}`}
            icon={<Users size={16} />}
            variant="muted"
          />
        </div>

        {/* Line Chart – Tren per Status */}
        <div className="mb-6" style={{
          background: "#FFFDF9",
          border: "0.5px solid #E8DDD4",
          borderRadius: 14,
          padding: "1.25rem",
        }}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} color={PALETTE.brown} />
            <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, fontWeight: 600, color: "#3B2A1A", margin: 0 }}>
              Tren Laporan per Status
            </h2>
          </div>
          <p style={{ fontSize: 12, color: "#A99080", marginBottom: "1rem" }}>
            Perkembangan jumlah laporan berdasarkan status (6 bulan terakhir)
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4">
            {[
              { label: "Disetujui", color: PALETTE.sage },
              { label: "Menunggu", color: PALETTE.amber },
              { label: "Ditolak", color: PALETTE.red },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5" style={{ fontSize: 11, color: "#7A6050", fontWeight: 500 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendStatusData}>
              <CartesianGrid stroke="rgba(169,139,118,0.12)" strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9C7E68" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9C7E68" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Disetujui" stroke={PALETTE.sage} strokeWidth={2} dot={{ r: 3, fill: PALETTE.sage }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Menunggu" stroke={PALETTE.amber} strokeWidth={2} dot={{ r: 3, fill: PALETTE.amber }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Ditolak" stroke={PALETTE.red} strokeWidth={2} dot={{ r: 3, fill: PALETTE.red }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Baris kedua: Pie + Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart – Kategori */}
          <div style={{
            background: "#FFFDF9",
            border: "0.5px solid #E8DDD4",
            borderRadius: 14,
            padding: "1.25rem",
          }}>
            <div className="flex items-center gap-2 mb-1">
              <PieIcon size={16} color={PALETTE.brown} />
              <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, fontWeight: 600, color: "#3B2A1A", margin: 0 }}>
                Laporan per Kategori
              </h2>
            </div>
            <p style={{ fontSize: 12, color: "#A99080", marginBottom: "1rem" }}>
              Distribusi jumlah laporan berdasarkan kategori
            </p>
            {categoryPieData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#C4A882" }}>
                Tidak ada data kategori
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={44}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryPieData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`${v} laporan`, "Jumlah"]}
                    contentStyle={{
                      background: "#FFFDF9",
                      border: "0.5px solid #E8DDD4",
                      borderRadius: 10,
                      fontSize: 12,
                      color: "#3B2A1A",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, color: "#7A6050" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar Chart – Top Pelapor */}
          <div style={{
            background: "#FFFDF9",
            border: "0.5px solid #E8DDD4",
            borderRadius: 14,
            padding: "1.25rem",
          }}>
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} color={PALETTE.brown} />
              <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, fontWeight: 600, color: "#3B2A1A", margin: 0 }}>
                Laporan per Pelapor
              </h2>
            </div>
            <p style={{ fontSize: 12, color: "#A99080", marginBottom: "1rem" }}>
              5 pelapor teratas vs target (120% dari rata-rata)
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topAuthors} margin={{ top: 16, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="rgba(169,139,118,0.12)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9C7E68" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9C7E68" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [`${value} laporan`, "Jumlah"]}
                  contentStyle={{
                    background: "#FFFDF9",
                    border: "0.5px solid #E8DDD4",
                    borderRadius: 10,
                    fontSize: 12,
                    color: "#3B2A1A",
                  }}
                />
                <Bar dataKey="value" name="Jumlah Laporan" radius={[6, 6, 0, 0]}>
                  {topAuthors.map((_, idx) => (
                    <Cell key={`bar-${idx}`} fill={barColors[idx] || PALETTE.brownLight} />
                  ))}
                </Bar>
                <ReferenceLine
                  y={targetValue}
                  stroke={PALETTE.red}
                  strokeDasharray="5 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Target ${targetValue}`,
                    position: "insideTopRight",
                    fontSize: 11,
                    fill: PALETTE.red,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
            <p style={{ textAlign: "center", fontSize: 11, color: "#C4A882", marginTop: 8 }}>
              * Garis merah menunjukkan target (120% dari rata-rata pelapor)
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────
function MetricCard({ title, value, delta, icon, variant }: {
  title: string; value: string; delta: string; icon: React.ReactNode; variant: string;
}) {
  const styles: Record<string, { bg: string; iconBg: string; iconColor: string; titleColor: string; valueColor: string; deltaColor: string }> = {
    brown: {
      bg: "#F5EDE4", iconBg: "#EAD9CC", iconColor: "#A98B76",
      titleColor: "#9C7E68", valueColor: "#3B2A1A", deltaColor: "#A98B76",
    },
    sage: {
      bg: "#EBF0E4", iconBg: "#D6E4CB", iconColor: "#6B8054",
      titleColor: "#6B8054", valueColor: "#3A4D2A", deltaColor: "#8FA870",
    },
    amber: {
      bg: "#FAF3E7", iconBg: "#F0E0C0", iconColor: "#C4963E",
      titleColor: "#B08A4A", valueColor: "#3D2B0A", deltaColor: "#C4963E",
    },
    muted: {
      bg: "#EDE8E2", iconBg: "#DFD5CB", iconColor: "#9C7E68",
      titleColor: "#8B7668", valueColor: "#3B2A1A", deltaColor: "#A89080",
    },
  };
  const s = styles[variant] || styles.brown;

  return (
    <div style={{
      background: s.bg,
      borderRadius: 12,
      padding: "1rem 1.1rem",
      transition: "transform 0.15s ease",
    }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: s.iconBg, color: s.iconColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 12,
      }}>
        {icon}
      </div>
      <p style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500, color: s.titleColor, margin: "0 0 4px" }}>
        {title}
      </p>
      <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 26, fontWeight: 600, color: s.valueColor, margin: "0 0 6px", lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontSize: 12, fontWeight: 500, color: s.deltaColor, margin: 0 }}>
        {delta}
      </p>
    </div>
  );
}