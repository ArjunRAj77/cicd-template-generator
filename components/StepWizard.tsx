import React, { useState, useEffect } from 'react';
import { 
  Check, MoveUp, MoveDown, Trash2, Plus, 
  Settings, Layers, GitBranch, Cloud, Box, Globe, Shield, Zap, Server, Terminal, Info,
  FileCode, AlertTriangle
} from 'lucide-react';
import { 
  WizardState, CloudPlatform, AppType, DevOpsPlatform, Architecture, Environment, AdvancedOptions, TargetResource 
} from '../types';
import { CLOUD_OPTIONS, APP_OPTIONS, DEVOPS_OPTIONS, ARCH_OPTIONS, DEFAULT_ENVS, TARGET_RESOURCE_OPTIONS } from '../constants';

interface StepWizardProps {
  onComplete: (state: WizardState) => void;
  isGenerating: boolean;
}

const StepWizard: React.FC<StepWizardProps> = ({ onComplete, isGenerating }) => {
  const [state, setState] = useState<WizardState>({
    cloud: null,
    appType: null,
    targetResource: null,
    devOps: null,
    architecture: null,
    environments: [...DEFAULT_ENVS],
    advanced: {
      dockerSupport: false,
      generateDockerfile: false,
      iac: false,
      manualApproval: true,
      deploymentStrategy: 'Standard',
      artifactPromotion: false,
    },
  });

  // Reset target resource if cloud changes to one that doesn't support it
  useEffect(() => {
    if (state.cloud && state.targetResource) {
      const targetOption = TARGET_RESOURCE_OPTIONS.find(t => t.value === state.targetResource);
      if (targetOption && !targetOption.platforms.includes(state.cloud)) {
        updateState('targetResource', null);
      }
    }
  }, [state.cloud]);

  const updateState = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleEnvMove = (index: number, direction: -1 | 1) => {
    const newEnvs = [...state.environments];
    if (index + direction < 0 || index + direction >= newEnvs.length) return;
    const temp = newEnvs[index];
    newEnvs[index] = newEnvs[index + direction];
    newEnvs[index + direction] = temp;
    updateState('environments', newEnvs);
  };

  const removeEnv = (index: number) => {
    updateState('environments', state.environments.filter((_, i) => i !== index));
  };

  const addEnv = () => {
    const name = prompt("Enter environment name (e.g., UAT, Demo):");
    if (name) {
      updateState('environments', [...state.environments, { id: name.toLowerCase(), name }]);
    }
  };

  // Compatibility Validation
  const getCompatibilityError = (): string | null => {
    if (!state.appType || !state.targetResource) return null;
    
    const resourceOption = TARGET_RESOURCE_OPTIONS.find(t => t.value === state.targetResource);
    if (!resourceOption) return null;

    if (resourceOption.validAppTypes && !resourceOption.validAppTypes.includes(state.appType)) {
      return `Mismatch: '${state.targetResource}' is not a valid target for '${state.appType}'. Please select 'Data / ETL' or 'Infrastructure' for this resource.`;
    }
    
    return null;
  };

  const compatibilityError = getCompatibilityError();

  const isFormValid = 
    !!state.cloud && 
    !!state.appType && 
    !!state.devOps && 
    !!state.architecture && 
    !!state.targetResource && 
    state.environments.length > 0 &&
    !compatibilityError;

  // Filter resources based on selected cloud
  const filteredTargetResources = TARGET_RESOURCE_OPTIONS.filter(opt => 
    state.cloud ? opt.platforms.includes(state.cloud) : true
  );

  const renderCard = (
    label: string, 
    description: string, 
    icon: React.ElementType, 
    selected: boolean, 
    onClick: () => void,
    error?: boolean
  ) => (
    <div 
      onClick={onClick}
      className={`
        cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 hover:shadow-md h-full relative
        ${selected 
          ? error 
            ? 'border-btn-danger bg-btn-danger/10 ring-1 ring-btn-danger'
            : 'border-accent-blue bg-accent-blue/10 ring-1 ring-accent-blue' 
          : 'border-border-default bg-canvas-subtle hover:border-fg-muted'}
      `}
    >
      <div className={`p-2 rounded-lg shrink-0 ${selected ? (error ? 'bg-btn-danger/20 text-btn-danger' : 'bg-accent-blue/20 text-accent-blue') : 'bg-canvas-default text-fg-muted'}`}>
        {React.createElement(icon, { size: 24 })}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
            <h3 className={`font-semibold ${selected ? 'text-fg-default' : 'text-fg-default'}`}>{label}</h3>
            {selected && <Check className={`shrink-0 ml-2 ${error ? 'text-btn-danger' : 'text-accent-blue'}`} size={20} />}
        </div>
        <p className="text-sm text-fg-muted mt-1 leading-snug">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8 pb-32">
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-fg-default">Configure Pipeline 🛠️</h1>
            <p className="text-fg-muted mt-2">Select your stack preferences to generate a tailored CI/CD workflow.</p>
            
            <div className="mt-6 bg-canvas-subtle border border-border-default rounded-lg p-4 flex items-start gap-3">
              <Info className="text-accent-blue shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-sm font-bold text-fg-default">AI-Powered Starter Pack ✨</h4>
                <p className="text-sm text-fg-muted mt-1">
                  This tool uses Gemini to generate compliant CI/CD templates. While optimized for best practices, please review all generated code and security configurations before deploying to production.
                </p>
              </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Primary Stack */}
            <div className="lg:col-span-8 space-y-10">
                <section>
                    <h2 className="text-lg font-bold text-fg-default mb-4 flex items-center gap-2">
                        <span className="bg-canvas-subtle border border-border-default text-fg-default w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        ☁️ Cloud Provider
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {CLOUD_OPTIONS.map(opt => renderCard(
                            opt.label, opt.desc, opt.icon, state.cloud === opt.value, 
                            () => updateState('cloud', opt.value)
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-fg-default mb-4 flex items-center gap-2">
                        <span className="bg-canvas-subtle border border-border-default text-fg-default w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        📦 Application Type
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {APP_OPTIONS.map(opt => renderCard(
                            opt.label, opt.desc, opt.icon, state.appType === opt.value, 
                            () => updateState('appType', opt.value)
                        ))}
                    </div>
                </section>

                 <section>
                    <h2 className="text-lg font-bold text-fg-default mb-4 flex items-center gap-2">
                        <span className="bg-canvas-subtle border border-border-default text-fg-default w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                        🎯 Target Resource
                    </h2>
                    {!state.cloud && (
                        <p className="text-sm text-fg-muted mb-2 italic">👈 Select a Cloud Provider to see available resources.</p>
                    )}
                    
                    {compatibilityError && (
                      <div className="mb-4 bg-red-900/20 border border-btn-danger/50 text-btn-danger px-4 py-3 rounded-md flex items-start gap-3">
                        <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                        <div className="text-sm font-medium">{compatibilityError}</div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredTargetResources.map(opt => renderCard(
                            opt.label, opt.desc, opt.icon, state.targetResource === opt.value, 
                            () => updateState('targetResource', opt.value),
                            state.targetResource === opt.value && !!compatibilityError
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-fg-default mb-4 flex items-center gap-2">
                        <span className="bg-canvas-subtle border border-border-default text-fg-default w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                        🚀 DevOps Platform
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {DEVOPS_OPTIONS.map(opt => renderCard(
                            opt.label, opt.value, opt.icon, state.devOps === opt.value, 
                            () => updateState('devOps', opt.value)
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-fg-default mb-4 flex items-center gap-2">
                        <span className="bg-canvas-subtle border border-border-default text-fg-default w-6 h-6 rounded-full flex items-center justify-center text-xs">5</span>
                        📐 Pipeline Architecture
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ARCH_OPTIONS.map(opt => renderCard(
                            opt.label, opt.desc, opt.value === Architecture.Single ? Layers : GitBranch, 
                            state.architecture === opt.value, 
                            () => updateState('architecture', opt.value)
                        ))}
                    </div>
                </section>
            </div>

            {/* Right Col: Config */}
            <div className="lg:col-span-4 space-y-10">
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-fg-default flex items-center gap-2">
                            <span className="bg-canvas-subtle border border-border-default text-fg-default w-6 h-6 rounded-full flex items-center justify-center text-xs">6</span>
                            🌍 Environments
                        </h2>
                        <button onClick={addEnv} className="flex items-center gap-1 text-sm font-medium text-accent-blue hover:text-white px-2 py-1 rounded hover:bg-canvas-subtle transition-colors">
                            <Plus size={16} /> Add
                        </button>
                    </div>
                    
                    <div className="space-y-2 bg-canvas-subtle rounded-xl border border-border-default p-2">
                        {state.environments.map((env, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-canvas-default rounded-lg border border-border-default group hover:border-accent-blue/50 transition-colors">
                                <span className="font-mono text-xs font-bold text-fg-muted w-6">{idx + 1}</span>
                                <span className="flex-1 font-medium text-fg-default">{env.name}</span>
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => handleEnvMove(idx, -1)} 
                                        disabled={idx === 0}
                                        className="p-1.5 text-fg-muted hover:text-accent-blue hover:bg-canvas-overlay rounded disabled:opacity-30 transition-colors"
                                    >
                                        <MoveUp size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleEnvMove(idx, 1)} 
                                        disabled={idx === state.environments.length - 1}
                                        className="p-1.5 text-fg-muted hover:text-accent-blue hover:bg-canvas-overlay rounded disabled:opacity-30 transition-colors"
                                    >
                                        <MoveDown size={14} />
                                    </button>
                                    <button onClick={() => removeEnv(idx)} className="p-1.5 text-fg-muted hover:text-btn-danger hover:bg-canvas-overlay rounded ml-1 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {state.environments.length === 0 && (
                            <div className="text-center p-4 text-fg-muted text-sm italic">
                                🍃 No environments defined. Add one to continue.
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-fg-default mb-4 flex items-center gap-2">
                        <span className="bg-canvas-subtle border border-border-default text-fg-default w-6 h-6 rounded-full flex items-center justify-center text-xs">7</span>
                        🎛️ Advanced Options
                    </h2>
                    <div className="bg-canvas-subtle p-5 rounded-xl border border-border-default space-y-4">
                         {/* Docker Support */}
                         <div className="space-y-3">
                             <label className="flex items-start gap-3 cursor-pointer group">
                                 <div className="mt-1">
                                    <input 
                                      type="checkbox" 
                                      checked={state.advanced.dockerSupport}
                                      onChange={e => {
                                          const isChecked = e.target.checked;
                                          updateState('advanced', { 
                                              ...state.advanced, 
                                              dockerSupport: isChecked,
                                              generateDockerfile: isChecked ? state.advanced.generateDockerfile : false 
                                          });
                                      }}
                                      className="w-4 h-4 text-accent-blue bg-canvas-default border-border-default rounded focus:ring-offset-canvas-default"
                                    />
                                 </div>
                                 <div>
                                    <span className="font-medium text-fg-default group-hover:text-accent-blue transition-colors">Docker Support 🐳</span>
                                    <p className="text-xs text-fg-muted">Enable container build & push steps</p>
                                 </div>
                             </label>

                             {/* Conditional Sub-Option: Generate Dockerfile */}
                             {state.advanced.dockerSupport && (
                                <div className="ml-7 pl-4 border-l border-border-default">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="mt-1">
                                            <input 
                                                type="checkbox" 
                                                checked={state.advanced.generateDockerfile}
                                                onChange={e => updateState('advanced', { ...state.advanced, generateDockerfile: e.target.checked })}
                                                className="w-4 h-4 text-accent-blue bg-canvas-default border-border-default rounded focus:ring-offset-canvas-default"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <FileCode size={14} className="text-accent-blue" />
                                                <span className="font-medium text-fg-default text-sm group-hover:text-accent-blue transition-colors">Generate Dockerfile</span>
                                            </div>
                                            <p className="text-xs text-fg-muted mt-0.5">Create a starter Dockerfile in the output</p>
                                        </div>
                                    </label>
                                </div>
                             )}
                         </div>

                         <hr className="border-border-muted" />

                         <label className="flex items-start gap-3 cursor-pointer group">
                             <div className="mt-1">
                                <input 
                                  type="checkbox" 
                                  checked={state.advanced.iac}
                                  onChange={e => updateState('advanced', { ...state.advanced, iac: e.target.checked })}
                                  className="w-4 h-4 text-accent-blue bg-canvas-default border-border-default rounded focus:ring-offset-canvas-default"
                                />
                             </div>
                             <div>
                                <span className="font-medium text-fg-default group-hover:text-accent-blue transition-colors">Infrastructure as Code 🏗️</span>
                                <p className="text-xs text-fg-muted">Include Terraform/Bicep validation</p>
                             </div>
                         </label>

                         <hr className="border-border-muted" />

                         <label className="flex items-start gap-3 cursor-pointer group">
                             <div className="mt-1">
                                <input 
                                  type="checkbox" 
                                  checked={state.advanced.manualApproval}
                                  onChange={e => updateState('advanced', { ...state.advanced, manualApproval: e.target.checked })}
                                  className="w-4 h-4 text-accent-blue bg-canvas-default border-border-default rounded focus:ring-offset-canvas-default"
                                />
                             </div>
                             <div>
                                <span className="font-medium text-fg-default group-hover:text-accent-blue transition-colors">Manual Approval ✋</span>
                                <p className="text-xs text-fg-muted">Gate production deployments</p>
                             </div>
                         </label>

                         <hr className="border-border-muted" />

                         <div className="pt-2">
                            <label className="block text-sm font-medium text-fg-default mb-1.5">Deployment Strategy 📊</label>
                            <select 
                              value={state.advanced.deploymentStrategy}
                              onChange={e => updateState('advanced', { ...state.advanced, deploymentStrategy: e.target.value as any })}
                              className="w-full p-2.5 text-sm border border-border-default rounded-lg focus:ring-1 focus:ring-accent-blue outline-none bg-canvas-default text-fg-default hover:border-fg-muted transition-colors"
                            >
                              <option value="Standard">Standard (Recreate)</option>
                              <option value="Rolling">Rolling Update</option>
                              <option value="BlueGreen">Blue/Green</option>
                              <option value="Canary">Canary</option>
                            </select>
                         </div>
                    </div>
                </section>
            </div>
        </div>

        {/* Floating Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-canvas-subtle border-t border-border-default shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.5)] z-20">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="hidden sm:block">
                    <p className="text-sm text-fg-muted flex items-center gap-2">
                       {compatibilityError ? (
                           <span className="text-btn-danger font-medium flex items-center gap-1.5">
                               <AlertTriangle size={16} />
                               Configuration Invalid ⚠️
                           </span>
                       ) : (
                           isFormValid ? '✨ Ready to generate.' : 'Please complete all required selections.'
                       )}
                    </p>
                </div>
                <button 
                    onClick={() => onComplete(state)} 
                    disabled={isGenerating || !isFormValid}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-md font-bold text-base bg-btn-primary text-white hover:bg-btn-primaryHover disabled:opacity-50 disabled:cursor-not-allowed shadow transition-all active:scale-95 disabled:bg-btn-primary/50"
                >
                    {isGenerating ? (
                        <>
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           Generating... 🔮
                        </>
                    ) : (
                        <>
                           Generate CI/CD Pipeline
                           <Zap size={20} fill="currentColor" />
                        </>
                    )}
                </button>
            </div>
            <div className="text-center pb-3 text-xs text-fg-muted">
                Vibe coded by Arjun . Happy Coding.
            </div>
        </div>
    </div>
  );
};

export default StepWizard;