import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Copy, RefreshCw, ChevronLeft, 
  CheckCircle2, Sparkles, Folder
} from 'lucide-react';
import { GeneratedFile, WizardState } from '../types';
import { explainPipeline } from '../services/geminiService';
import JSZip from 'jszip';

interface ResultsViewProps {
  files: GeneratedFile[];
  onBack: () => void;
  state: WizardState;
}

const ResultsView: React.FC<ResultsViewProps> = ({ files, onBack, state }) => {
  const [selectedFile, setSelectedFile] = useState<GeneratedFile>(files[0]);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (files.length > 0) setSelectedFile(files[0]);
  }, [files]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("cicd-templates");
    if (folder) {
      files.forEach(file => {
        // Remove leading slash if present
        const cleanName = file.filename.startsWith('/') ? file.filename.slice(1) : file.filename;
        folder.file(cleanName, file.content);
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cicd-templates.zip";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const fetchExplanation = async () => {
    if (explanation) return;
    setLoadingExplanation(true);
    const text = await explainPipeline(files);
    setExplanation(text);
    setLoadingExplanation(false);
  };

  return (
    <div className="flex flex-col h-full bg-canvas-default rounded-xl shadow-xl overflow-hidden border border-border-default">
      {/* Header */}
      <div className="bg-canvas-subtle border-b border-border-default p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-canvas-overlay rounded-lg text-fg-muted hover:text-fg-default transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg text-fg-default">{state.devOps} Pipeline</h1>
            <p className="text-xs text-fg-muted">Generated for {state.cloud} • {state.appType}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDownloadZip}
            className="flex items-center gap-2 px-4 py-2 bg-btn-primary hover:bg-btn-primaryHover rounded-md text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Download size={16} /> Download ZIP
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-canvas-subtle border-r border-border-default flex flex-col shrink-0">
          <div className="p-4 border-b border-border-default">
            <h2 className="text-xs font-bold text-fg-muted uppercase tracking-wider">Project Files</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {files.map((file, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFile(file)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left
                  ${selectedFile.filename === file.filename 
                    ? 'bg-canvas-overlay text-fg-default border-l-2 border-accent-orange' 
                    : 'text-fg-muted hover:bg-canvas-overlay hover:text-fg-default'}
                `}
              >
                {file.filename.endsWith('.md') ? <FileText size={16} /> : <Folder size={16} />}
                <span className="truncate">{file.filename}</span>
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-border-default bg-canvas-subtle">
            <button 
              onClick={fetchExplanation}
              disabled={loadingExplanation}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-canvas-overlay border border-border-default text-fg-default hover:bg-border-muted rounded-md text-sm font-medium transition-colors"
            >
              {loadingExplanation ? <RefreshCw className="animate-spin text-accent-blue" size={16} /> : <Sparkles className="text-accent-blue" size={16} />}
              {explanation ? 'Regenerate Summary' : 'Explain Pipeline'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-canvas-default relative">
          {/* File Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border-default bg-canvas-default shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-fg-default">{selectedFile.filename}</span>
              <span className="px-2 py-0.5 rounded-full bg-canvas-subtle border border-border-default text-fg-muted text-[10px] font-bold uppercase">
                {selectedFile.description}
              </span>
            </div>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium text-fg-muted hover:text-fg-default transition-colors"
            >
              {copied ? <CheckCircle2 size={14} className="text-btn-primary"/> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Raw'}
            </button>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 overflow-auto p-0 bg-canvas-default relative">
            <pre className="font-mono text-sm leading-relaxed text-fg-default bg-canvas-default p-6 min-h-full whitespace-pre-wrap">
              <code>{selectedFile.content}</code>
            </pre>
          </div>

          {/* Explanation Panel (Overlay or Bottom) */}
          {explanation && (
            <div className="shrink-0 border-t border-border-default bg-canvas-subtle p-6 animate-in slide-in-from-bottom-5">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-start gap-3">
                  <Sparkles className="text-accent-blue mt-1 shrink-0" size={20} />
                  <div>
                    <h3 className="font-bold text-fg-default text-sm mb-1">AI Summary</h3>
                    <p className="text-fg-muted text-sm leading-relaxed whitespace-pre-line">
                      {explanation}
                    </p>
                  </div>
                  <button 
                    onClick={() => setExplanation(null)}
                    className="ml-auto text-fg-muted hover:text-fg-default"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsView;