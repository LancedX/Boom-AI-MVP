import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Student,
  RiskRule,
  RiskConfig,
  AuditLogEntry,
  Counselor,
  ActiveTab,
  WalkthroughStep,
} from '../types';
import {
  DEFAULT_COUNSELORS,
  getInitialStudents,
  INITIAL_AUDIT_LOG,
  INITIAL_RULE_CONFIG,
  RULE_HISTORY,
  WALKTHROUGH_STEPS,
} from '../services/defaultData';
import { calculateStudentRisk, DEFAULT_RULES, DEFAULT_THRESHOLDS } from '../services/riskEngine';
import { parseStudentCSV, exportReconciliationCSV as exportCSVService } from '../services/csvParser';

interface CollegeSettings {
  collegeName: string;
  term: string;
  sendDay: string;
  sendTime: string;
  topN: number;
  sendOption: 'A' | 'B' | 'C';
  holidayReschedule: boolean;
  readingLevelTarget: string;
}

const DEFAULT_SETTINGS: CollegeSettings = {
  collegeName: 'Foothill College',
  term: 'Fall 2026 / Spring 2027',
  sendDay: 'Monday',
  sendTime: '07:00 AM',
  topN: 15,
  sendOption: 'A',
  holidayReschedule: true,
  readingLevelTarget: '8th Grade',
};

const STORAGE_KEY = 'boom_ai_foothill_state_v2';

interface AppContextType {
  students: Student[];
  rules: RiskRule[];
  thresholds: { high: number; medium: number };
  ruleHistory: RiskConfig[];
  currentVersion: string;
  currentCounselor: Counselor;
  allCounselors: Counselor[];
  selectedCounselorId: string;
  auditLog: AuditLogEntry[];
  activeTab: ActiveTab;
  selectedStudent: Student | null;
  isProfileOpen: boolean;
  isImportModalOpen: boolean;
  settings: CollegeSettings;
  walkthrough: {
    active: boolean;
    currentStep: number;
    isAutoPlaying: boolean;
  };
  walkthroughSteps: WalkthroughStep[];
  filteredStudents: Student[];
  counts: {
    total: number;
    high: number;
    medium: number;
    watch: number;
    holds: number;
    notRegistered: number;
    awaitingApproval: number;
    sent: number;
    replied: number;
    registeredWeekTwo: number;
  };
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedStudent: (student: Student | null) => void;
  openStudentProfile: (student: Student) => void;
  closeStudentProfile: () => void;
  setIsImportModalOpen: (open: boolean) => void;
  setSelectedCounselorId: (id: string) => void;
  approveOutreach: (studentId: string, channel: 'SMS' | 'Email' | 'Canvas', text?: string) => void;
  skipOutreach: (studentId: string, reason: string) => void;
  simulateStudentReply: (studentId: string, replyText: string, markRegistered?: boolean) => void;
  markStudentRegistered: (studentId: string) => void;
  updateRule: (ruleId: string, points: number, enabled: boolean) => void;
  updateThresholds: (high: number, medium: number) => void;
  saveRuleVersion: (versionName: string) => void;
  restoreRuleVersion: (version: RiskConfig) => void;
  importStudentsFromCSV: (csvContent: string) => { success: boolean; message: string; count: number };
  resetDemoData: () => void;
  updateSettings: (newSettings: Partial<CollegeSettings>) => void;
  exportReconciliationCSV: () => void;
  startWalkthrough: () => void;
  stopWalkthrough: () => void;
  nextWalkthroughStep: () => void;
  prevWalkthroughStep: () => void;
  toggleAutoPlayWalkthrough: () => void;
  logAudit: (action: string, actor: string, details: string, studentId?: string, studentName?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_students');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved students:', e);
    }
    return getInitialStudents();
  });

  const [rules, setRules] = useState<RiskRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_rules');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_RULES;
  });

  const [thresholds, setThresholds] = useState<{ high: number; medium: number }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_thresholds');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_THRESHOLDS;
  });

  const [ruleHistory, setRuleHistory] = useState<RiskConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_rule_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return RULE_HISTORY;
  });

  const [currentVersion, setCurrentVersion] = useState<string>('v1.2');

  const [selectedCounselorId, setSelectedCounselorId] = useState<string>('M. Okoro');
  const [allCounselors] = useState<Counselor[]>(DEFAULT_COUNSELORS);

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_audit');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_AUDIT_LOG;
  });

  const [activeTab, setActiveTabState] = useState<ActiveTab>(() => {
    try {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'approve') return 'outreach';
      if (hash === 'week-two' || hash === 'weektwo') return 'weektwo';
      const validTabs: ActiveTab[] = [
        'dashboard',
        'directory',
        'digest',
        'outreach',
        'weektwo',
        'rules',
        'settings',
        'it',
        'sis',
        'canvas',
        'crm',
        'president',
        'pilot',
      ];
      if (validTabs.includes(hash as ActiveTab)) {
        return hash as ActiveTab;
      }
    } catch (e) {}
    return 'dashboard';
  });

  const setActiveTab = useCallback((tab: ActiveTab) => {
    setActiveTabState(tab);
    try {
      window.location.hash = tab;
    } catch (e) {}
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (hash === 'approve') {
          setActiveTabState('outreach');
        } else if (hash === 'week-two') {
          setActiveTabState('weektwo');
        } else if (hash) {
          const validTabs: ActiveTab[] = [
            'dashboard',
            'directory',
            'digest',
            'outreach',
            'weektwo',
            'rules',
            'settings',
            'it',
            'sis',
            'canvas',
            'crm',
            'president',
            'pilot',
          ];
          if (validTabs.includes(hash as ActiveTab)) {
            setActiveTabState(hash as ActiveTab);
          }
        }
      } catch (e) {}
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  const [settings, setSettings] = useState<CollegeSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SETTINGS;
  });

  const [walkthrough, setWalkthrough] = useState<{
    active: boolean;
    currentStep: number;
    isAutoPlaying: boolean;
  }>({
    active: false,
    currentStep: 0,
    isAutoPlaying: false,
  });

  // Current counselor object
  const currentCounselor =
    allCounselors.find((c) => c.id === selectedCounselorId) || allCounselors[0];

  // Helper to log audit actions
  const logAudit = useCallback(
    (action: string, actor: string, details: string, studentId?: string, studentName?: string) => {
      const newEntry: AuditLogEntry = {
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        action,
        actor,
        details,
        studentId,
        studentName,
        simulated: false,
      };
      setAuditLog((prev) => [newEntry, ...prev]);
    },
    []
  );

  // Recalculate student risk whenever rules or thresholds change
  const recalculateAllStudents = useCallback(
    (activeRules: RiskRule[], activeThresholds: { high: number; medium: number }) => {
      setStudents((prev) =>
        prev.map((student) => {
          const risk = calculateStudentRisk(student, activeRules, activeThresholds);
          return {
            ...student,
            ...risk,
          };
        })
      );
    },
    []
  );

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_students', JSON.stringify(students));
    } catch (e) {}
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_rules', JSON.stringify(rules));
      localStorage.setItem(STORAGE_KEY + '_thresholds', JSON.stringify(thresholds));
      localStorage.setItem(STORAGE_KEY + '_rule_history', JSON.stringify(ruleHistory));
      localStorage.setItem(STORAGE_KEY + '_audit', JSON.stringify(auditLog));
      localStorage.setItem(STORAGE_KEY + '_settings', JSON.stringify(settings));
    } catch (e) {}
  }, [rules, thresholds, ruleHistory, auditLog, settings]);

  // Keep selected student synced
  useEffect(() => {
    if (selectedStudent) {
      const updated = students.find((s) => s.student_id === selectedStudent.student_id);
      if (updated) setSelectedStudent(updated);
    }
  }, [students]);

  // Auto-play walkthrough effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (walkthrough.active && walkthrough.isAutoPlaying) {
      timer = setTimeout(() => {
        if (walkthrough.currentStep < WALKTHROUGH_STEPS.length - 1) {
          const nextStep = walkthrough.currentStep + 1;
          setWalkthrough((prev) => ({ ...prev, currentStep: nextStep }));
          setActiveTab(WALKTHROUGH_STEPS[nextStep].tab);
        } else {
          setWalkthrough((prev) => ({ ...prev, isAutoPlaying: false }));
        }
      }, 5500);
    }
    return () => clearTimeout(timer);
  }, [walkthrough.active, walkthrough.isAutoPlaying, walkthrough.currentStep]);

  // Actions
  const openStudentProfile = useCallback((student: Student) => {
    setSelectedStudent(student);
    setIsProfileOpen(true);
  }, []);

  const closeStudentProfile = useCallback(() => {
    setIsProfileOpen(false);
  }, []);

  const approveOutreach = useCallback(
    (studentId: string, channel: 'SMS' | 'Email' | 'Canvas', text?: string) => {
      const now = new Date().toISOString();
      let studentName = '';

      setStudents((prev) =>
        prev.map((s) => {
          if (s.student_id === studentId) {
            studentName = `${s.first_name} ${s.last_name}`;
            const updated: Student = {
              ...s,
              outreachState: 'sent',
              outreachChannel: channel,
              approvedAt: now,
              customDraft: text || s.suggestedDraft,
              timeline: [
                {
                  id: `t-${Date.now()}`,
                  timestamp: now,
                  title: `Outreach Approved & Dispatched via ${channel}`,
                  type: 'counselor',
                  description: `Approved by ${currentCounselor.name}. Sent via Foothill verified channel.`,
                },
                ...s.timeline,
              ],
            };
            return updated;
          }
          return s;
        })
      );

      logAudit(
        'Outreach Approved & Sent',
        currentCounselor.name,
        `Approved ${channel} outreach message for ${studentName} (${studentId})`,
        studentId,
        studentName
      );
    },
    [currentCounselor, logAudit]
  );

  const skipOutreach = useCallback(
    (studentId: string, reason: string) => {
      const now = new Date().toISOString();
      let studentName = '';

      setStudents((prev) =>
        prev.map((s) => {
          if (s.student_id === studentId) {
            studentName = `${s.first_name} ${s.last_name}`;
            return {
              ...s,
              outreachState: 'skipped',
              skipReason: reason,
              timeline: [
                {
                  id: `t-${Date.now()}`,
                  timestamp: now,
                  title: 'Outreach Skipped / Deferred',
                  type: 'counselor',
                  description: `Deferred by ${currentCounselor.name}. Reason: ${reason}. Carries forward to next week.`,
                },
                ...s.timeline,
              ],
            };
          }
          return s;
        })
      );

      logAudit(
        'Outreach Deferred',
        currentCounselor.name,
        `Deferred outreach for ${studentName} (${studentId}): ${reason}`,
        studentId,
        studentName
      );
    },
    [currentCounselor, logAudit]
  );

  const simulateStudentReply = useCallback(
    (studentId: string, replyText: string, markRegistered: boolean = false) => {
      const now = new Date().toISOString();
      let studentName = '';

      setStudents((prev) =>
        prev.map((s) => {
          if (s.student_id === studentId) {
            studentName = `${s.first_name} ${s.last_name}`;
            const isResolution =
              markRegistered ||
              replyText.toLowerCase().includes('form') ||
              replyText.toLowerCase().includes('sent') ||
              replyText.toLowerCase().includes('cleared') ||
              replyText.toLowerCase().includes('registered');

            const updated: Student = {
              ...s,
              studentReply: replyText,
              replyTimestamp: now,
              weekTwoStatus: isResolution ? 'hold_cleared' : 'needs_counselor',
              timeline: [
                {
                  id: `t-${Date.now()}`,
                  timestamp: now,
                  title: 'Student Reply Received',
                  type: 'student',
                  description: `Inbound reply: "${replyText}"`,
                },
                ...s.timeline,
              ],
            };

            if (markRegistered) {
              updated.registered_for_spring = 'Y';
              updated.weekTwoStatus = 'registered';
              updated.timeline.unshift({
                id: `t-${Date.now() + 1}`,
                timestamp: now,
                title: 'Spring 2027 Registration Confirmed',
                type: 'sync',
                description: 'Banner SIS feed confirmed enrollment in Spring 2027 coursework.',
              });
            }

            const recalculated = calculateStudentRisk(updated, rules, thresholds);
            return {
              ...updated,
              ...recalculated,
            };
          }
          return s;
        })
      );

      logAudit(
        'Student Response Received',
        'Student Inbound Webhook',
        `Student ${studentName} (${studentId}) replied: "${replyText}"`,
        studentId,
        studentName
      );
    },
    [rules, thresholds, logAudit]
  );

  const markStudentRegistered = useCallback(
    (studentId: string) => {
      const now = new Date().toISOString();
      let studentName = '';

      setStudents((prev) =>
        prev.map((s) => {
          if (s.student_id === studentId) {
            studentName = `${s.first_name} ${s.last_name}`;
            const updated: Student = {
              ...s,
              registered_for_spring: 'Y',
              weekTwoStatus: 'registered',
              registration_hold: 'N',
              timeline: [
                {
                  id: `t-${Date.now()}`,
                  timestamp: now,
                  title: 'Spring 2027 Registration Confirmed in Banner',
                  type: 'sync',
                  description: 'Hold removed and 12+ spring units registered in Banner SIS.',
                },
                ...s.timeline,
              ],
            };
            const recalculated = calculateStudentRisk(updated, rules, thresholds);
            return {
              ...updated,
              ...recalculated,
            };
          }
          return s;
        })
      );

      logAudit(
        'Spring Registration Confirmed',
        'Banner Read-Only Connector',
        `Confirmed Spring 2027 registration for ${studentName} (${studentId})`,
        studentId,
        studentName
      );
    },
    [rules, thresholds, logAudit]
  );

  const updateRule = useCallback(
    (ruleId: string, points: number, enabled: boolean) => {
      const updatedRules = rules.map((r) => (r.id === ruleId ? { ...r, points, enabled } : r));
      setRules(updatedRules);
      setCurrentVersion('v1.2 (modified)');
      recalculateAllStudents(updatedRules, thresholds);
      logAudit(
        'Rule Configuration Changed',
        currentCounselor.name,
        `Updated rule ${ruleId} to ${points} pts (enabled: ${enabled})`
      );
    },
    [rules, thresholds, currentCounselor, recalculateAllStudents, logAudit]
  );

  const updateThresholds = useCallback(
    (high: number, medium: number) => {
      const updated = { high, medium };
      setThresholds(updated);
      recalculateAllStudents(rules, updated);
      logAudit(
        'Risk Thresholds Adjusted',
        currentCounselor.name,
        `High priority set to >= ${high}, Medium set to >= ${medium}`
      );
    },
    [rules, currentCounselor, recalculateAllStudents, logAudit]
  );

  const saveRuleVersion = useCallback(
    (versionName: string) => {
      const newVersion: RiskConfig = {
        version: versionName,
        updatedAt: new Date().toISOString(),
        rules,
        thresholds,
      };
      setRuleHistory((prev) => [newVersion, ...prev]);
      setCurrentVersion(versionName);
      logAudit('Rule Snapshot Saved', currentCounselor.name, `Saved rule configuration version ${versionName}`);
    },
    [rules, thresholds, currentCounselor, logAudit]
  );

  const restoreRuleVersion = useCallback(
    (config: RiskConfig) => {
      setRules(config.rules);
      setThresholds(config.thresholds);
      setCurrentVersion(config.version);
      recalculateAllStudents(config.rules, config.thresholds);
      logAudit(
        'Rule Version Restored',
        currentCounselor.name,
        `Restored rules and thresholds to configuration ${config.version}`
      );
    },
    [currentCounselor, recalculateAllStudents, logAudit]
  );

  const importStudentsFromCSV = useCallback(
    (csvContent: string) => {
      const res = parseStudentCSV(csvContent, rules, thresholds);
      if (res.rowCount > 0) {
        setStudents(res.data);
        logAudit(
          'CSV Dataset Imported',
          currentCounselor.name,
          `Imported ${res.rowCount} student records from CSV. Errors: ${res.errors.length}, Warnings: ${res.warnings.length}`
        );
        return { success: true, message: `Successfully loaded ${res.rowCount} students.`, count: res.rowCount };
      }
      return {
        success: false,
        message: res.errors[0] || 'Failed to parse CSV records.',
        count: 0,
      };
    },
    [rules, thresholds, currentCounselor, logAudit]
  );

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY + '_students');
    localStorage.removeItem(STORAGE_KEY + '_rules');
    localStorage.removeItem(STORAGE_KEY + '_thresholds');
    localStorage.removeItem(STORAGE_KEY + '_rule_history');
    localStorage.removeItem(STORAGE_KEY + '_audit');
    localStorage.removeItem(STORAGE_KEY + '_settings');

    const freshStudents = getInitialStudents();
    setStudents(freshStudents);
    setRules(DEFAULT_RULES);
    setThresholds(DEFAULT_THRESHOLDS);
    setRuleHistory(RULE_HISTORY);
    setCurrentVersion('v1.2');
    setAuditLog(INITIAL_AUDIT_LOG);
    setSettings(DEFAULT_SETTINGS);
    setSelectedCounselorId('M. Okoro');
    setWalkthrough({ active: false, currentStep: 0, isAutoPlaying: false });

    logAudit('Demo Reset to Baseline', 'System', 'Reset student cohort, rules, and simulated interactions to baseline Foothill dataset.');
  }, [logAudit]);

  const updateSettings = useCallback(
    (newSettings: Partial<CollegeSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
      logAudit('College Settings Updated', currentCounselor.name, 'Updated notification and schedule preferences.');
    },
    [currentCounselor, logAudit]
  );

  const exportReconciliationCSVHandler = useCallback(() => {
    exportCSVService(students);
    logAudit('Reconciliation CSV Exported', currentCounselor.name, `Exported ${students.length} student records to CSV.`);
  }, [students, currentCounselor, logAudit]);

  // Walkthrough controls
  const startWalkthrough = useCallback(() => {
    setWalkthrough({ active: true, currentStep: 0, isAutoPlaying: false });
    setActiveTab(WALKTHROUGH_STEPS[0].tab);
  }, []);

  const stopWalkthrough = useCallback(() => {
    setWalkthrough((prev) => ({ ...prev, active: false, isAutoPlaying: false }));
  }, []);

  const nextWalkthroughStep = useCallback(() => {
    setWalkthrough((prev) => {
      const next = Math.min(WALKTHROUGH_STEPS.length - 1, prev.currentStep + 1);
      setActiveTab(WALKTHROUGH_STEPS[next].tab);
      return { ...prev, currentStep: next, isAutoPlaying: false };
    });
  }, []);

  const prevWalkthroughStep = useCallback(() => {
    setWalkthrough((prev) => {
      const prevStep = Math.max(0, prev.currentStep - 1);
      setActiveTab(WALKTHROUGH_STEPS[prevStep].tab);
      return { ...prev, currentStep: prevStep, isAutoPlaying: false };
    });
  }, []);

  const toggleAutoPlayWalkthrough = useCallback(() => {
    setWalkthrough((prev) => ({ ...prev, isAutoPlaying: !prev.isAutoPlaying }));
  }, []);

  // Filtered students by advisor
  const filteredStudents =
    selectedCounselorId === 'all'
      ? students
      : students.filter((s) => s.assigned_advisor === selectedCounselorId);

  // Derived counts from current student dataset
  const counts = {
    total: students.length,
    high: students.filter((s) => s.riskTier === 'High').length,
    medium: students.filter((s) => s.riskTier === 'Medium').length,
    watch: students.filter((s) => s.riskTier === 'Watch').length,
    holds: students.filter((s) => s.registration_hold === 'Y' || (s.aid_hold_type && s.aid_hold_type !== 'None')).length,
    notRegistered: students.filter((s) => s.registered_for_spring === 'N').length,
    awaitingApproval: students.filter((s) => s.outreachState === 'awaiting_approval').length,
    sent: students.filter((s) => s.outreachState === 'sent').length,
    replied: students.filter((s) => !!s.studentReply).length,
    registeredWeekTwo: students.filter((s) => s.weekTwoStatus === 'registered' || (s.registered_for_spring === 'Y' && !!s.studentReply)).length,
  };

  return (
    <AppContext.Provider
      value={{
        students,
        rules,
        thresholds,
        ruleHistory,
        currentVersion,
        currentCounselor,
        allCounselors,
        selectedCounselorId,
        auditLog,
        activeTab,
        selectedStudent,
        isProfileOpen,
        isImportModalOpen,
        settings,
        walkthrough,
        walkthroughSteps: WALKTHROUGH_STEPS,
        filteredStudents,
        counts,
        setActiveTab,
        setSelectedStudent,
        openStudentProfile,
        closeStudentProfile,
        setIsImportModalOpen,
        setSelectedCounselorId,
        approveOutreach,
        skipOutreach,
        simulateStudentReply,
        markStudentRegistered,
        updateRule,
        updateThresholds,
        saveRuleVersion,
        restoreRuleVersion,
        importStudentsFromCSV,
        resetDemoData,
        updateSettings,
        exportReconciliationCSV: exportReconciliationCSVHandler,
        startWalkthrough,
        stopWalkthrough,
        nextWalkthroughStep,
        prevWalkthroughStep,
        toggleAutoPlayWalkthrough,
        logAudit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
