import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { WalkthroughBanner } from './components/WalkthroughBanner';
import { CounselorDashboard } from './components/CounselorDashboard';
import { StudentDirectory } from './components/StudentDirectory';
import { WeeklyDigest } from './components/WeeklyDigest';
import { OutreachCenter } from './components/OutreachCenter';
import { WeekTwoWorkflow } from './components/WeekTwoWorkflow';
import { RulesManager } from './components/RulesManager';
import { SettingsView } from './components/SettingsView';
import { ITAuditCenter } from './components/ITAuditCenter';
import { SISBannerPreview } from './components/SISBannerPreview';
import { CanvasLMSPreview } from './components/CanvasLMSPreview';
import { CRMPreview } from './components/CRMPreview';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { PilotProposal } from './components/PilotProposal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { CSVImportModal } from './components/CSVImportModal';
import { ShieldCheck, Database, Calendar } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { activeTab, currentCounselor, settings } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-surface-2 text-ink">
      {/* Top Global Header */}
      <Header />

      {/* Guided Walkthrough Banner (visible when tour is active) */}
      <WalkthroughBanner />

      {/* Global Tabs Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <CounselorDashboard />}
        {activeTab === 'directory' && <StudentDirectory />}
        {activeTab === 'digest' && <WeeklyDigest />}
        {activeTab === 'outreach' && <OutreachCenter />}
        {activeTab === 'weektwo' && <WeekTwoWorkflow />}
        {activeTab === 'rules' && <RulesManager />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'it' && <ITAuditCenter />}
        {activeTab === 'sis' && <SISBannerPreview />}
        {activeTab === 'canvas' && <CanvasLMSPreview />}
        {activeTab === 'crm' && <CRMPreview />}
        {activeTab === 'president' && <ExecutiveDashboard />}
        {activeTab === 'pilot' && <PilotProposal />}
      </main>

      {/* Footer */}
      <footer className="bg-surface-1 border-t border-line py-6 text-xs text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-ink">Boom AI</span>
            <span>·</span>
            <span>Foothill Community College</span>
            <span>·</span>
            <span>Spring 2027 Enrollment Recovery MVP</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-faint">
            <span className="flex items-center gap-1 text-ok">
              <span className="w-2 h-2 rounded-full bg-ok" />
              Banner Read-Only: 02:00 AM Sync
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-muted" />
              FERPA Compliant In-Memory Ledger
            </span>
            <span>·</span>
            <span>Version 1.2</span>
          </div>
        </div>
      </footer>

      {/* Persistent Modals */}
      <StudentProfileModal />
      <CSVImportModal />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
