import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  Users,
  MailCheck,
  Smartphone,
  CalendarCheck,
  Sliders,
  Shield,
  Database,
  GraduationCap,
  GitBranch,
  BarChart3,
  FileText,
  Settings as SettingsIcon,
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeType?: 'hot' | 'ok' | 'neutral';
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, counts, currentVersion, walkthrough, stopWalkthrough } = useApp();

  const counselorNav: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'directory',
      label: 'Student Directory',
      icon: Users,
      badge: counts.total,
      badgeType: 'neutral',
    },
    {
      id: 'digest',
      label: 'Monday Digest',
      icon: MailCheck,
      badge: 15,
      badgeType: 'hot',
    },
    {
      id: 'outreach',
      label: 'Outreach & SMS Simulator',
      icon: Smartphone,
      badge: counts.awaitingApproval > 0 ? counts.awaitingApproval : undefined,
      badgeType: 'hot',
    },
    {
      id: 'weektwo',
      label: 'Week Two Follow-Up',
      icon: CalendarCheck,
      badge: counts.registeredWeekTwo > 0 ? `${counts.registeredWeekTwo} reg` : undefined,
      badgeType: 'ok',
    },
    {
      id: 'rules',
      label: 'Ranking Rules',
      icon: Sliders,
      badge: currentVersion.split(' ')[0],
      badgeType: 'neutral',
    },
  ];

  const systemsNav: NavItem[] = [
    {
      id: 'it',
      label: 'IT & Audit Center',
      icon: Shield,
    },
    {
      id: 'sis',
      label: 'Banner SIS Preview',
      icon: Database,
    },
    {
      id: 'canvas',
      label: 'Canvas LMS Preview',
      icon: GraduationCap,
    },
    {
      id: 'crm',
      label: 'CRM Timeline',
      icon: GitBranch,
    },
  ];

  const leadershipNav: NavItem[] = [
    {
      id: 'president',
      label: 'Executive / VP View',
      icon: BarChart3,
    },
    {
      id: 'pilot',
      label: 'Foothill Pilot Proposal',
      icon: FileText,
      badge: '$15k',
      badgeType: 'ok',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
    },
  ];

  const handleTabClick = (id: ActiveTab) => {
    if (walkthrough.active) {
      stopWalkthrough();
    }
    setActiveTab(id);
  };

  const renderNavButton = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => handleTabClick(item.id)}
        className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
          isActive
            ? 'bg-ink text-white shadow-xs'
            : 'text-muted hover:text-ink hover:bg-surface-2'
        }`}
      >
        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-coral' : 'text-muted group-hover:text-ink'}`} />
        <span>{item.label}</span>
        {item.badge !== undefined && (
          <span
            className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold leading-tight ${
              item.badgeType === 'hot'
                ? isActive
                  ? 'bg-coral text-white'
                  : 'bg-coral-tint text-coral-ink'
                : item.badgeType === 'ok'
                ? isActive
                  ? 'bg-ok text-white'
                  : 'bg-ok-tint text-ok'
                : isActive
                ? 'bg-white/20 text-white'
                : 'bg-surface-3 text-ink-light'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="bg-surface-1 border-b border-line shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Categories Container */}
        <div className="py-2.5 overflow-x-auto scrollbar-none flex flex-nowrap items-center gap-2 sm:gap-4">
          {/* Section: Counselor Workflow */}
          <div className="flex items-center gap-1">
            <span className="hidden xl:inline text-[11px] font-semibold uppercase tracking-wider text-faint mr-1">
              Counselor:
            </span>
            {counselorNav.map(renderNavButton)}
          </div>

          <div className="h-5 w-px bg-line flex-shrink-0" />

          {/* Section: Institutional Systems */}
          <div className="flex items-center gap-1">
            <span className="hidden xl:inline text-[11px] font-semibold uppercase tracking-wider text-faint mr-1">
              Systems:
            </span>
            {systemsNav.map(renderNavButton)}
          </div>

          <div className="h-5 w-px bg-line flex-shrink-0" />

          {/* Section: Leadership & Proposal */}
          <div className="flex items-center gap-1">
            <span className="hidden xl:inline text-[11px] font-semibold uppercase tracking-wider text-faint mr-1">
              Executive:
            </span>
            {leadershipNav.map(renderNavButton)}
          </div>
        </div>
      </div>
    </div>
  );
};
