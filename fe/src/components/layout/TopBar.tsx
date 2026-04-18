import { useAppStore } from "@/stores/useAppStore";
import { Menu } from "lucide-react";

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pageInfo = useAppStore((s) => s.pageInfo);

  return (
    <header
      className="flex h-[58px] flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white/80 px-4 md:px-6 backdrop-blur-sm"
      style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-3">
        {/* Hamburger — only on mobile */}
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors md:hidden"
          aria-label="Mở menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-[15px] font-extrabold text-gray-800 leading-tight">
            {pageInfo.title}
          </h1>
          {pageInfo.subtitle && (
            <p className="text-[11.5px] text-gray-400 leading-none mt-0.5">
              {pageInfo.subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
