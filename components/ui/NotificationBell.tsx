"use client";
import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { notificationApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function NotificationBell() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const res = await notificationApi.getAll();
      setNotifs(res.data.data);
      setUnread(res.data.unread_count);
    } catch {}
  };

  useEffect(() => {
    const user = getUser();
    if (!user) return;
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = async () => {
    setOpen(!open);
    if (!open && unread > 0) {
      await notificationApi.markAllAsRead();
      setUnread(0);
      setNotifs((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    }
  };

  const user = getUser();
  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleOpen}
        className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors">
        <Bell className="w-5 h-5 text-stone-600" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 card shadow-xl z-50 animate-slide-up max-h-96 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-display font-semibold text-stone-700">Notifikasi</h3>
            <span className="text-xs text-stone-400">{notifs.length} notif</span>
          </div>

          <div className="overflow-y-auto flex-1">
            {notifs.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-sm">
                Tidak ada notifikasi
              </div>
            ) : notifs.map((n) => (
              <div key={n.id}
                className={cn(
                  "px-4 py-3 border-b border-stone-50 hover:bg-stone-50 transition-colors",
                  !n.is_read && "bg-primary/5 border-l-2 border-l-primary"
                )}>
                <p className="text-sm text-stone-700 leading-relaxed">{n.message}</p>
                <p className="text-xs text-stone-400 mt-1">{formatDate(n.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}