import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { parseStudentCSV, REQUIRED_COLUMNS } from '../services/csvParser';
import {
  Upload,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
} from 'lucide-react';

export const CSVImportModal: React.FC = () => {
  const {
    isImportModalOpen,
    setIsImportModalOpen,
    importStudentsFromCSV,
    resetDemoData,
    students,
  } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isImportModalOpen) return null;

  const handleFileProcess = (file: File) => {
    setSelectedFileName(file.name);
    setImportStatus(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);

      const parsed = parseStudentCSV(content);
      setPreviewData(parsed.data.slice(0, 5));
      setValidationErrors(parsed.errors);
      setValidationWarnings(parsed.warnings);
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleImportConfirm = () => {
    if (fileContent) {
      const res = importStudentsFromCSV(fileContent);
      if (res.success) {
        setImportStatus(`Success! Imported ${res.count} students.`);
        setTimeout(() => {
          setIsImportModalOpen(false);
        }, 1200);
      } else {
        setValidationErrors([res.message]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-surface-1 border border-line rounded-3xl shadow-big max-w-2xl w-full p-6 space-y-5 text-ink">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-coral" />
            <h2 className="text-lg font-bold text-ink">
              Import Student Cohort CSV
            </h2>
          </div>
          <button
            onClick={() => setIsImportModalOpen(false)}
            className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Dataset Summary */}
        <div className="text-xs text-muted flex items-center justify-between p-3 bg-surface-2 rounded-xl border border-line">
          <span>Active Dataset in System: <b className="text-ink">{students.length} students</b> loaded</span>
          <button
            onClick={() => {
              if (window.confirm('Reset student data to default Foothill CSV?')) {
                resetDemoData();
                setIsImportModalOpen(false);
              }
            }}
            className="text-xs font-semibold text-coral hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default 50 Students</span>
          </button>
        </div>

        {/* Drag & Drop File Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-coral bg-coral-tint/30'
              : 'border-line-dark hover:border-coral bg-surface-2/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          <FileText className="w-10 h-10 text-muted mx-auto mb-2" />
          <div className="font-semibold text-sm text-ink">
            {selectedFileName ? selectedFileName : 'Drag and drop your student CSV file here'}
          </div>
          <p className="text-xs text-muted mt-1">
            Accepts Foothill Banner SIS cohort exports (.csv). Includes 26 required demographic and academic columns.
          </p>
        </div>

        {/* Validation Errors & Warnings */}
        {validationErrors.length > 0 && (
          <div className="p-3 bg-coral-tint border border-coral/30 rounded-xl text-xs text-coral-ink space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Validation Errors:</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {validationWarnings.length > 0 && (
          <div className="p-3 bg-warn-tint border border-warn/30 rounded-xl text-xs text-warn space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Import Warnings (Non-Blocking):</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5">
              {validationWarnings.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Preview of Parsed Rows */}
        {previewData.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted">
              Preview of Ingested Records (First {previewData.length} Students):
            </div>
            <div className="overflow-x-auto border border-line rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-2 text-muted text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Program</th>
                    <th className="py-2 px-3">Hold</th>
                    <th className="py-2 px-3">Spring Reg</th>
                    <th className="py-2 px-3">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {previewData.map((s) => (
                    <tr key={s.student_id}>
                      <td className="py-2 px-3 font-mono font-medium">{s.student_id}</td>
                      <td className="py-2 px-3">{s.first_name} {s.last_name}</td>
                      <td className="py-2 px-3 truncate max-w-[120px]">{s.program_of_study}</td>
                      <td className="py-2 px-3">{s.registration_hold}</td>
                      <td className="py-2 px-3">{s.registered_for_spring}</td>
                      <td className="py-2 px-3 font-bold text-coral-ink">{s.riskScore} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {importStatus && (
          <div className="p-3 bg-ok-tint text-ok rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-line text-xs">
          <span className="text-muted">
            All records persist locally via browser storage.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2 rounded-xl font-semibold border border-line hover:bg-surface-2 text-ink"
            >
              Cancel
            </button>

            <button
              onClick={handleImportConfirm}
              disabled={!fileContent || validationErrors.length > 0}
              className="px-4 py-2 rounded-xl font-semibold bg-coral text-white hover:bg-coral-ink disabled:opacity-40 shadow-xs"
            >
              Confirm & Ingest CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
