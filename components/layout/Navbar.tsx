"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  MessageSquare,
  LayoutDashboard,
  FilePlus,
  Users,
  LogOut,
  ChevronDown,
  User,
  ShieldCheck,
  BarChart2,
} from "lucide-react";
import { getUser, clearAuth, isAdmin, isSuperAdmin } from "@/lib/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import NotificationBell from "@/components/ui/NotificationBell";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    clearAuth();
    toast.success("Berhasil keluar");
    router.push("/");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/laporan/baru", label: "Buat Laporan", icon: FilePlus },
    ...(isAdmin(user)
      ? [{ href: "/dashboard/statistik", label: "Statistik", icon: BarChart2 }]
      : []),
    ...(isAdmin(user)
      ? [{ href: "/admin/laporan", label: "Kelola Laporan", icon: ShieldCheck }]
      : []),
    ...(isSuperAdmin(user)
      ? [{ href: "/admin/users", label: "Kelola User", icon: Users }]
      : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-stone-800">LaporKita</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors",
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-800"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 rounded-xl px-3 py-2 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-stone-700 max-w-24 truncate">
                  {user.username}
                </span>
                <ChevronDown className={cn("w-3 h-3 text-stone-400 transition-transform", dropOpen && "rotate-180")} />
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 card shadow-lg py-1 z-50 animate-slide-up">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs text-stone-400">Masuk sebagai</p>
                    <p className="text-sm font-bold text-stone-700">{user.username}</p>
                    <span className="badge bg-primary/10 text-primary border-primary/20 text-xs mt-1">
                      {user.role}
                    </span>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-800"
                  >
                    <User className="w-4 h-4" />
                    Profil Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login" className="btn-outline text-sm py-1.5 px-4">Masuk</Link>
            <Link href="/register" className="btn-primary text-sm py-1.5 px-4">Daftar</Link>
          </div>
        )}
      </div>
    </header>
  );
}