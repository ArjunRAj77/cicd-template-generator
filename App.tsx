import React, { useState } from 'react';
import StepWizard from './components/StepWizard';
import ResultsView from './components/ResultsView';
import { WizardState, GeneratedFile } from './types';
import { generateTemplates } from './services/geminiService';
import { Rocket, Github, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[] | null>(null);
  const [wizardState, setWizardState] = useState<WizardState | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (state: WizardState) => {
    setIsGenerating(true);
    setError(null);
    setWizardState(state);
    
    try {
      const files = await generateTemplates(state);
      setGeneratedFiles(files);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGeneratedFiles(null);
    setWizardState(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-canvas-default flex flex-col font-sans text-fg-default">
      {/* Navbar */}
      <nav className="bg-canvas-subtle border-b border-border-default px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-canvas-default border border-border-default p-2 rounded-lg text-accent-blue">
            <Rocket size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-fg-default tracking-tight">CICD Template Generator</h1>
            <p className="text-xs text-fg-muted font-medium">AI-Powered DevOps Starter Pack</p>
          </div>
        </div>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-fg-muted hover:text-fg-default transition-colors"
        >
          <Github size={24} />
        </a>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative pb-8">
        {error && (
          <div className="max-w-4xl mx-auto w-full mt-6 px-4">
            <div className="bg-red-900/20 border border-btn-danger/50 text-btn-danger px-4 py-3 rounded-md flex items-center gap-3">
              <AlertCircle size={20} />
              <p>{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-sm font-semibold hover:underline">Dismiss</button>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col p-4 md:p-8">
          {!generatedFiles ? (
            <StepWizard onComplete={handleGenerate} isGenerating={isGenerating} />
          ) : (
            <div className="h-[calc(100vh-140px)] max-w-7xl mx-auto w-full">
              <ResultsView 
                files={generatedFiles} 
                onBack={handleReset} 
                state={wizardState!} 
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer - Only show on Results view, as StepWizard has its own fixed footer */}
      {generatedFiles && (
        <footer className="py-6 border-t border-border-default bg-canvas-subtle text-center text-xs text-fg-muted relative z-10">
           Vibe coded by Arjun . Happy Coding.
        </footer>
      )}

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-canvas-default/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-canvas-subtle border-t-accent-blue rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-fg-default">Crafting your pipeline...</h2>
            <p className="text-fg-muted mt-2">Analyzing best practices for {wizardState?.cloud} & {wizardState?.devOps}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;