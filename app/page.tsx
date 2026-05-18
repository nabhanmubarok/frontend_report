"use client";
import Link from "next/link";
import {
  MessageSquare,
  Shield,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Users,
  FileText,
  Star,
  ChevronDown,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-light font-body overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream-light/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-stone-800">
              LaporKita
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#fitur" className="text-stone-600 hover:text-primary transition-colors text-sm font-bold">
              Fitur
            </a>
            <a href="#cara-kerja" className="text-stone-600 hover:text-primary transition-colors text-sm font-bold">
              Cara Kerja
            </a>
            <a href="#statistik" className="text-stone-600 hover:text-primary transition-colors text-sm font-bold">
              Statistik
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-outline text-sm py-2 px-4">
              Masuk
            </Link>
            <Link href="/register" className="btn-primary text-sm py-2 px-4">
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-48 -left-24 w-80 h-80 rounded-full bg-sage/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-cream-dark/50 blur-2xl" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-bold mb-6">
                <Star className="w-3.5 h-3.5 fill-primary" />
                Platform Terpercaya #1
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-stone-800 leading-tight mb-6">
                Suara Anda,{" "}
                <span className="text-primary relative">
                  Perubahan Nyata
                  <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6">
                    <path d="M0 5 Q50 0 100 5 Q150 10 200 5" stroke="#A98B76" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                LaporKita adalah platform pengaduan masyarakat yang transparan.
                Laporkan masalah di lingkungan Anda, pantau prosesnya, dan
                lihat dampak nyata bersama komunitas.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="btn-primary flex items-center gap-2">
                  Buat Laporan Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/dashboard" className="btn-outline flex items-center gap-2">
                  Lihat Laporan
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-10">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-sage" />
                  <span className="text-sm text-stone-600 font-bold">Aman & Terpercaya</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm text-stone-600 font-bold">Terverifikasi</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-fade-in">
              <div className="relative z-10">
                {/* Mock report cards */}
                <div className="card p-5 mb-4 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-stone-800">Jalan Rusak di RT 03</h3>
                      <div className="flex items-center gap-1 text-stone-500 text-sm mt-1">
                        <MapPin className="w-3 h-3" />
                        Jl. Kebon Sirih No.12, Jakarta
                      </div>
                    </div>
                    <span className="badge bg-sage/20 text-sage-dark border-sage/30">Disetujui</span>
                  </div>
                  <p className="text-sm text-stone-600 line-clamp-2">
                    Jalan di depan gang RT 03 sudah berlubang cukup dalam dan membahayakan pengendara...
                  </p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-stone-100">
                    <span className="text-xs text-stone-400">oleh warga_jakarta</span>
                    <span className="text-xs text-stone-400 ml-auto">2 hari lalu</span>
                  </div>
                </div>

                <div className="card p-5 shadow-md ml-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-stone-800">Tumpukan Sampah TPS</h3>
                      <div className="flex items-center gap-1 text-stone-500 text-sm mt-1">
                        <MapPin className="w-3 h-3" />
                        Jl. Merdeka No.5, Bandung
                      </div>
                    </div>
                    <span className="badge bg-amber-100 text-amber-800 border-amber-200">Menunggu</span>
                  </div>
                  <p className="text-sm text-stone-600 line-clamp-2">
                    TPS di sudut jalan sudah penuh sejak 3 hari yang lalu belum diangkut...
                  </p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-stone-100">
                    <span className="text-xs text-stone-400">oleh penduduk_bdg</span>
                    <span className="text-xs text-stone-400 ml-auto">5 jam lalu</span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-cream-dark/50 -z-10 rotate-12" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-sage/20 -z-10" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-stone-400" />
        </div>
      </section>

      {/* STATS */}
      <section id="statistik" className="py-16 bg-primary">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "2,400+", label: "Laporan Masuk" },
              { num: "1,850+", label: "Laporan Selesai" },
              { num: "15,000+", label: "Pengguna Aktif" },
              { num: "98%", label: "Kepuasan Warga" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-4xl font-bold text-white mb-1">{s.num}</div>
                <div className="text-cream/80 text-sm font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-cream-dark px-4 py-1 rounded-full text-primary font-bold text-sm mb-4">
              Mengapa LaporKita?
            </div>
            <h2 className="font-display text-4xl font-bold text-stone-800 mb-4">
              Fitur Unggulan Platform
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto">
              Dirancang untuk memudahkan masyarakat menyampaikan aspirasi dan pengaduan secara efektif.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Pelaporan Mudah",
                desc: "Buat laporan lengkap dengan foto, lokasi peta, dan kategori dalam hitungan menit.",
                color: "bg-primary/10 text-primary",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Aman & Terverifikasi",
                desc: "Sistem autentikasi JWT memastikan setiap laporan berasal dari pengguna terverifikasi.",
                color: "bg-sage/10 text-sage-dark",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Pantau Status Real-time",
                desc: "Lacak perkembangan laporan Anda dari pending, disetujui, hingga diselesaikan.",
                color: "bg-amber-100 text-amber-700",
              },
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Diskusi Komunitas",
                desc: "Komentari laporan, berikan dukungan, dan diskusikan solusi bersama warga lain.",
                color: "bg-primary/10 text-primary",
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: "Lokasi Akurat",
                desc: "Sertakan koordinat GPS dan alamat lengkap untuk mempermudah verifikasi lapangan.",
                color: "bg-sage/10 text-sage-dark",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Manajemen Admin",
                desc: "Panel admin dan super admin untuk mengelola laporan, pengguna, dan kategori.",
                color: "bg-amber-100 text-amber-700",
              },
            ].map((f, i) => (
              <div key={i} className="card p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-stone-800 mb-2">{f.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="cara-kerja" className="py-24 px-6 bg-stone-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-stone-800 mb-4">
              Cara Kerja LaporKita
            </h2>
            <p className="text-stone-600">Empat langkah mudah untuk menyampaikan pengaduan Anda</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Daftar Akun", desc: "Buat akun gratis dengan username dan password." },
              { step: "02", title: "Buat Laporan", desc: "Isi formulir laporan dengan detail, foto, dan lokasi." },
              { step: "03", title: "Kirim & Pantau", desc: "Kirimkan laporan dan pantau statusnya secara berkala." },
              { step: "04", title: "Masalah Teratasi", desc: "Admin meninjau dan menindaklanjuti laporan Anda." },
            ].map((s, i) => (
              <div key={i} className="text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary/20" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary text-white font-display text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-md">
                  {s.step}
                </div>
                <h3 className="font-display font-semibold text-stone-800 mb-2">{s.title}</h3>
                <p className="text-stone-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-gradient-to-br from-primary to-primary-dark p-12 text-center text-white overflow-visible relative">
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-sage/20 blur-2xl" />
            <div className="relative z-10">
              <h2 className="font-display text-4xl font-bold mb-4">
                Siap Membuat Perubahan?
              </h2>
              <p className="text-cream/80 mb-8 text-lg max-w-xl mx-auto">
                Bergabunglah bersama ribuan warga yang telah mempercayakan aspirasi mereka kepada LaporKita.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link
                  href="/register"
                  className="bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-cream transition-colors shadow-md"
                >
                  Mulai Sekarang – Gratis
                </Link>
                <Link
                  href="/login"
                  className="border-2 border-white/50 text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Sudah Punya Akun?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-800 text-stone-300 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">LaporKita</span>
              </div>
              <p className="text-stone-400 text-sm max-w-xs">
                Platform pengaduan masyarakat yang transparan dan akuntabel.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-white mb-3">Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                  <li><Link href="/laporan/baru" className="hover:text-primary transition-colors">Buat Laporan</Link></li>
                  <li><Link href="/login" className="hover:text-primary transition-colors">Masuk</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-3">Dukungan</h4>
                <ul className="space-y-2 text-sm">
                  <li><span className="text-stone-400">Tentang Kami</span></li>
                  <li><span className="text-stone-400">Kebijakan Privasi</span></li>
                  <li><span className="text-stone-400">Hubungi Kami</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-stone-500 text-sm">© 2024 LaporKita. Semua hak dilindungi.</p>
            <p className="text-stone-500 text-sm">Dibuat dengan ❤️ untuk masyarakat Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
