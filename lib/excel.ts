export const exportToExcel = (reports: any[], filename = "laporan") => {
  const headers = ["ID", "Judul", "Deskripsi", "Status", "Kategori", "Pelapor", "Alamat", "Tanggal"];
  const rows = reports.map((r) => [
    r.id, r.header, r.body, r.status,
    r.category_name, r.author, r.address || "-",
    new Date(r.created_at).toLocaleDateString("id-ID"),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};