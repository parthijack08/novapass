import React from 'react';
import { LayoutDashboard, Sliders, Printer, Settings, Info, CreditCard, Building } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  imageLoaded: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate, imageLoaded }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & uploads' },
    { id: 'editor', label: 'Photo Lab', icon: Sliders, desc: 'Crop, align & enhance', requiresImage: true },
    { id: 'print', label: 'Print Engine', icon: Printer, desc: 'Compile A4 sheet layout', requiresImage: true },
    { id: 'settings', label: 'Config & Settings', icon: Settings, desc: 'Defaults & paper size' },
    { id: 'legal', label: 'Sevenova Info Hub', icon: Building, desc: 'Legal and Corporate files' },
  ];

  return (
    <aside className="hidden h-[calc(100vh-4rem)] w-64 flex-col border-r border-gray-200 bg-white p-4 transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-900 md:flex">
      {/* Sidebar Navigation items */}
      <div className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isDisabled = item.requiresImage && !imageLoaded;

          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && onNavigate(item.id)}
              disabled={isDisabled}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all ${
                currentTab === item.id
                  ? 'bg-sub-active/40 text-secondary border border-sub-active/80 dark:bg-primary/20 dark:text-ui-element dark:border-primary/20 shadow-3xs'
                  : isDisabled
                  ? 'opacity-40 cursor-not-allowed text-gray-400'
                  : 'text-gray-600 hover:bg-black/5 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100'
              }`}
              id={`sidebar-item-${item.id}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  currentTab === item.id
                    ? 'bg-primary text-white dark:bg-primary'
                    : 'bg-gray-50 text-gray-500 group-hover:bg-gray-100 dark:bg-zinc-850 dark:text-zinc-400'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-tight">{item.label}</span>
                <span className="text-[10px] text-gray-400 dark:text-zinc-500">{item.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Helpful Studio Guide Status Card */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors duration-200 dark:border-zinc-800/40 dark:bg-zinc-850/40">
        <div className="flex gap-2.5">
          <Info className="h-4.5 w-4.5 shrink-0 text-primary" />
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-gray-900 dark:text-dark-100 uppercase tracking-wide">
              Print Specification Notice
            </span>
            <p className="text-[10px] leading-relaxed text-gray-500 dark:text-zinc-400">
              Set photo size limits in millimeters before exporting A4 compilations. Normal offset calibration is handled offline automatically.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
