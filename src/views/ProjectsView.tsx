import React, { useState } from 'react';
import {
  FolderGit2,
  CheckCircle2,
  Lock,
  ChevronRight,
  ExternalLink,
  Search,
  Plus
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { sound } from '../utils/audio';
import { ReturnButton } from '../components/common/ReturnButton';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    updateProjectPhase,
    openClientHQ,
    setActiveModal,
    formatCurrency
  } = useDashboard();

  const [filterType, setFilterType] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const filteredProjects = projects.filter(p => {
    const matchType = filterType === 'All' || p.websiteType.includes(filterType);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.clientName.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Return Button */}
      <div>
        <ReturnButton />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-100 font-heading flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-[#C9A038]" />
            Project Base & Progression Path
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            11-phase website development pipeline from requirement gathering to production deployment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-[#121826] border border-[#20293D] text-slate-300 font-semibold">
            {projects.length} Active Website Builds
          </span>
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('add-project');
            }}
            className="btn-gold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121826] border border-[#20293D] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-[#C9A038]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {['All', 'E-Commerce', 'Corporate', 'SaaS', 'Luxury'].map(type => (
            <button
              key={type}
              onClick={() => { sound.playClick(); setFilterType(type); }}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 border transition-all ${
                filterType === type
                  ? 'bg-[#182033] text-[#ECC968] border-[#C9A038]/50 font-semibold'
                  : 'bg-[#0A0D14] text-slate-400 hover:text-slate-200 border-[#1E2638]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#182033] border border-[#232D42] flex items-center justify-center text-[#C9A038]">
            <FolderGit2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">No Projects Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {projects.length === 0
                ? "Your project pipeline is clean and ready. Add your first website project to track the 11 development phases."
                : "No projects match your search or filter criteria."}
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('add-project');
            }}
            className="btn-gold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create First Project</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map(project => (
          <div
            key={project.id}
            className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] hover:border-[#C9A038]/40 transition-all space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span 
                    onClick={() => openClientHQ(project.clientId)}
                    className="text-xs font-bold text-[#ECC968] hover:underline cursor-pointer"
                  >
                    {project.clientName} →
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-[#151C2C] text-slate-300 border border-[#232D42]">
                    {project.websiteType}
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-[#151C2C] text-slate-400 border border-[#232D42]">
                    {project.approvalStatus}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 font-heading mt-1">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{project.notes}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-left lg:text-right">
                  <div className="text-[11px] text-slate-400">Contract Value</div>
                  <div className="text-base font-bold text-slate-100 font-heading">
                    {formatCurrency(project.projectValue)}
                  </div>
                </div>

                {project.currentPhaseIndex < 10 && (
                  <button
                    onClick={() => updateProjectPhase(project.id, project.currentPhaseIndex + 1)}
                    className="btn-gold px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <span>Upgrade Phase (+350 XP)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Stepper */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>
                  Stage {project.currentPhaseIndex + 1}/11: <strong className="text-slate-200">{project.phases[project.currentPhaseIndex]?.name}</strong>
                </span>
                <span className="font-semibold text-slate-300">{project.completionPercentage}% Progress</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-1.5">
                {project.phases.map((ph, idx) => {
                  const isCompleted = idx < project.currentPhaseIndex;
                  const isCurrent = idx === project.currentPhaseIndex;

                  return (
                    <div
                      key={ph.id}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        isCompleted
                          ? 'bg-[#151C2C] border-[#C9A038]/30 text-slate-300'
                          : isCurrent
                          ? 'bg-[#182033] border-[#C9A038] text-[#ECC968] font-semibold'
                          : 'bg-[#0E121C] border-[#1A2234] text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A038]" />
                        ) : isCurrent ? (
                          <div className="w-2 h-2 rounded-full bg-[#C9A038]" />
                        ) : (
                          <Lock className="w-3 h-3 text-slate-600" />
                        )}
                      </div>
                      <div className="text-[10px] font-medium line-clamp-1">{idx + 1}. {ph.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-[#1E2638] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span>Target Launch: <strong className="text-slate-200">{project.expectedLaunch}</strong></span>
                <span>Revisions: <strong className="text-slate-200">{project.revisionsCount} / {project.maxRevisions}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                {project.previewUrl && (
                  <a
                    href={project.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#ECC968] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Preview Staging</span>
                  </a>
                )}
                <button
                  onClick={() => openClientHQ(project.clientId)}
                  className="btn-dark px-2.5 py-1 rounded text-xs"
                >
                  Client HQ →
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

    </div>
  );
};
