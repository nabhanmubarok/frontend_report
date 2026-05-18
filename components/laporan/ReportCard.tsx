import Link from "next/link";
import { MapPin, MessageCircle, Calendar, Tag } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate, getImageUrl } from "@/lib/utils";
import Image from "next/image";

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

export default function ReportCard({ report }: { report: Report }) {
  const imageUrl = getImageUrl(report.image);

  return (
    <Link href={`/laporan/${report.id}`}>
      <div className="card hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer">
        {imageUrl && (
          <div className="relative w-full h-40 overflow-hidden">
            <img
              src={imageUrl}
              alt={report.header}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display font-semibold text-stone-800 line-clamp-1 group-hover:text-primary transition-colors">
              {report.header}
            </h3>
            <StatusBadge status={report.status} />
          </div>

          <p className="text-stone-500 text-sm line-clamp-2 mb-4">{report.body}</p>

          <div className="flex flex-wrap gap-3 text-xs text-stone-400">
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {report.category_name}
            </div>
            {report.address && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-32">{report.address}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {report.comment_count} komentar
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Calendar className="w-3 h-3" />
              {formatDate(report.created_at)}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
              {report.author.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-stone-400">{report.author}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
