/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Fragment, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle, 
  Circle, 
  ExternalLink, 
  Menu, 
  X, 
  Rocket, 
  Target, 
  Award, 
  ListChecks, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  Clock, 
  Key, 
  Code2, 
  Brain, 
  Calendar, 
  Star,
  Search,
  Filter,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen
} from "lucide-react";
import { MOCK_PROBLEMS, PHASES, type Problem, type PhaseInfo } from "./data";

export default function App() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("dsa_completed_problems");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [selectedPhase, setSelectedPhase] = useState<PhaseInfo>(PHASES[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Custom user study notes saved in localStorage
  const [customNotes, setCustomNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("dsa_custom_notes");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("dsa_completed_problems", JSON.stringify(Array.from(completedIds)));
  }, [completedIds]);

  const toggleCompletion = (id: string) => {
    const next = new Set(completedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCompletedIds(next);
  };

  const resetAllProgress = () => {
    if (window.confirm("Are you sure you want to reset all your learning progress? This will clear all completed tasks and cannot be undone.")) {
      setCompletedIds(new Set());
      localStorage.removeItem("dsa_completed_problems");
    }
  };

  const handleNoteChange = (problemId: string, value: string) => {
    const updated = { ...customNotes, [problemId]: value };
    setCustomNotes(updated);
    localStorage.setItem("dsa_custom_notes", JSON.stringify(updated));
  };

  const stats = useMemo(() => {
    const totalProblems = MOCK_PROBLEMS.length;
    const totalCompleted = Array.from(completedIds).filter(id => 
      MOCK_PROBLEMS.some(p => String(p.Problem_ID) === id)
    ).length;
    const overallProgress = totalProblems > 0 ? (totalCompleted / totalProblems) * 100 : 0;

    const phaseStats = PHASES.map(phase => {
      const phaseProblems = MOCK_PROBLEMS.filter(p => p.Phase === phase.name);
      const phaseCompleted = phaseProblems.filter(p => completedIds.has(String(p.Problem_ID))).length;
      const progress = phaseProblems.length > 0 ? (phaseCompleted / phaseProblems.length) * 100 : 0;
      return { ...phase, progress, total: phaseProblems.length, completed: phaseCompleted };
    });

    return { totalProblems, totalCompleted, overallProgress, phaseStats };
  }, [completedIds]);

  // Retrieve current phase problems
  const currentPhaseProblems = useMemo(() => {
    return MOCK_PROBLEMS.filter(p => p.Phase === selectedPhase.name);
  }, [selectedPhase.name]);

  // Apply search query and quick filters
  const filteredProblems = useMemo(() => {
    return currentPhaseProblems.filter(problem => {
      // 1. Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const nameMatch = problem.Problem_Name.toLowerCase().includes(q);
        const topicMatch = problem.Topic.toLowerCase().includes(q);
        const subtopicMatch = problem.Subtopic.toLowerCase().includes(q);
        const patternMatch = problem.Pattern?.toLowerCase().includes(q) || false;
        const companyMatch = problem.Company_Tags?.toLowerCase().includes(q) || false;
        const notesMatch = problem.Notes?.toLowerCase().includes(q) || false;
        
        if (!nameMatch && !topicMatch && !subtopicMatch && !patternMatch && !companyMatch && !notesMatch) {
          return false;
        }
      }

      // 2. Difficulty Filter
      if (difficultyFilter !== "All" && problem.Difficulty !== difficultyFilter) {
        return false;
      }

      // 3. Status Filter
      const isCompleted = completedIds.has(String(problem.Problem_ID));
      if (statusFilter === "Completed" && !isCompleted) return false;
      if (statusFilter === "Incomplete" && isCompleted) return false;

      return true;
    });
  }, [currentPhaseProblems, searchQuery, difficultyFilter, statusFilter, completedIds]);

  // Find active problem on desktop (defaults to first matching in current list)
  const activeProblem = useMemo(() => {
    if (filteredProblems.length === 0) return null;
    const found = filteredProblems.find(p => String(p.Problem_ID) === expandedProblemId);
    return found || filteredProblems[0];
  }, [filteredProblems, expandedProblemId]);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar Layout */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col h-full ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo & Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-slate-800 leading-none">DSA Mastery</h1>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 inline-block">Study Companion</span>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Overall Progress Gauge Card inside Sidebar */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Overall Mastery
              </span>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {stats.totalCompleted}/{stats.totalProblems} Done
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-200/80 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.overallProgress}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                />
              </div>
              <span className="text-sm font-black text-slate-800 w-10 text-right">
                {Math.round(stats.overallProgress)}%
              </span>
            </div>
          </div>

          {/* Phases Navigation Scroll Area */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 select-none scrollbar-thin">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Study Roadmap
            </div>
            {stats.phaseStats.map((phase) => (
              <button
                key={phase.id}
                onClick={() => {
                  setSelectedPhase(phase);
                  setIsSidebarOpen(false);
                  setExpandedProblemId(null);
                  setSearchQuery("");
                  setDifficultyFilter("All");
                  setStatusFilter("All");
                }}
                className={`w-full flex flex-col p-3.5 rounded-xl transition-all duration-200 group text-left border ${
                  selectedPhase.id === phase.id 
                    ? "bg-indigo-600 border-indigo-700 text-white shadow-sm shadow-indigo-100" 
                    : "bg-white hover:bg-slate-50/80 border-slate-100 text-slate-700 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    selectedPhase.id === phase.id ? "text-indigo-200" : "text-indigo-600"
                  }`}>
                    Phase {phase.id}
                  </span>
                  <span className={`text-[10px] font-bold ${
                    selectedPhase.id === phase.id ? "text-indigo-100" : "text-slate-400"
                  }`}>
                    {phase.completed}/{phase.total} Done
                  </span>
                </div>
                
                <span className={`text-xs font-bold leading-tight line-clamp-1 mb-2.5 ${
                  selectedPhase.id === phase.id ? "text-white" : "text-slate-800"
                }`}>
                  {phase.name.replace(/^Phase\s*\d+\s*-\s*/i, "")}
                </span>
                
                <div className="flex items-center gap-2.5 w-full">
                  <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${
                    selectedPhase.id === phase.id ? "bg-indigo-800/60" : "bg-slate-100"
                  }`}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${phase.progress}%` }}
                      className={`h-full rounded-full ${selectedPhase.id === phase.id ? "bg-white" : "bg-indigo-500"}`}
                    />
                  </div>
                  <span className={`text-[10px] font-bold flex-shrink-0 w-8 text-right ${
                    selectedPhase.id === phase.id ? "text-indigo-100" : "text-slate-500"
                  }`}>
                    {Math.round(phase.progress)}%
                  </span>
                </div>
              </button>
            ))}
          </nav>

          {/* Reset All Stats Footer button */}
          <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
            <button 
              onClick={resetAllProgress}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50/30 text-xs font-semibold rounded-lg transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Progress
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col lg:h-full lg:overflow-hidden min-w-0">
        
        {/* Workspace Top Bar Header */}
        <header className="h-16 px-4 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-40 flex-shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors flex-shrink-0"
              id="mobile-sidebar-toggle"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600 min-w-0">
              <span className="text-slate-400 flex-shrink-0">Phase {selectedPhase.id}</span>
              <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
              <span className="text-slate-800 truncate">{selectedPhase.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Phase stats summary pill */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full flex-shrink-0 shadow-xs">
              <Award className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-black text-emerald-700">
                {currentPhaseProblems.filter(p => completedIds.has(String(p.Problem_ID))).length}/{currentPhaseProblems.length} Phase Probs
              </span>
            </div>
          </div>
        </header>

        {/* Content Layout Body Pane */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 lg:overflow-hidden bg-[#F8FAFC]">
          
          {/* Left Column: Interactive Problems Registry */}
          <div className="w-full lg:w-[42%] xl:w-[38%] flex flex-col lg:h-full lg:overflow-hidden bg-white lg:border-r border-slate-200">
            
            {/* Search, Filter & Controls Panel */}
            <div className="flex-shrink-0 p-4 border-b border-slate-150 bg-white space-y-3.5 shadow-xs">
              {/* Search Bar Input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input 
                  type="text"
                  placeholder="Search problems, topics, patterns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl text-xs sm:text-sm font-medium transition-all outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Difficulty Quick Filters Row */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1 flex-shrink-0">Difficulty:</span>
                {["All", "Easy", "Medium", "Hard"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all flex-shrink-0 ${
                      difficultyFilter === diff 
                        ? diff === "Easy" ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : diff === "Medium" ? "bg-amber-50 border-amber-200 text-amber-700"
                          : diff === "Hard" ? "bg-rose-50 border-rose-200 text-rose-700"
                          : "bg-indigo-50 border-indigo-200 text-indigo-700"
                        : "bg-white border-slate-150 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              {/* Status Filters Row */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2.5 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1 flex-shrink-0">Status:</span>
                {[
                  { label: "All Problems", value: "All" },
                  { label: "Todo", value: "Incomplete" },
                  { label: "Completed", value: "Completed" }
                ].map((stat) => (
                  <button
                    key={stat.value}
                    onClick={() => setStatusFilter(stat.value)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all flex-shrink-0 ${
                      statusFilter === stat.value 
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs" 
                        : "bg-white border-slate-150 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    {stat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Container for Left Column list of Problems */}
            <div className="flex-1 lg:overflow-y-auto p-4 space-y-3 bg-slate-50/30 scrollbar-thin">
              
              {/* Phase Intro Description box */}
              {searchQuery === "" && difficultyFilter === "All" && statusFilter === "All" && (
                <div className="bg-gradient-to-br from-indigo-50/40 via-white to-slate-50/50 p-4 rounded-xl border border-indigo-100/50 shadow-2xs mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[9px] font-bold uppercase tracking-wider rounded-md">
                      Intro Blueprint
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {selectedPhase.description}
                  </p>
                </div>
              )}

              {/* Dynamic Empty State */}
              {filteredProblems.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400 min-h-[240px] bg-white rounded-xl border border-dashed border-slate-200">
                  <Search className="w-8 h-8 text-slate-300 mb-2 animate-pulse" />
                  <p className="text-sm font-semibold text-slate-700">No problems found</p>
                  <p className="text-xs text-slate-500 max-w-[200px] mt-1 leading-normal">
                    No tasks match your filter. Try clearing the search query or difficulty toggles.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery("");
                      setDifficultyFilter("All");
                      setStatusFilter("All");
                    }}
                    className="mt-4 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition-all"
                  >
                    Reset Active Filters
                  </button>
                </div>
              ) : (
                filteredProblems.map((problem, index) => {
                  const probIdStr = String(problem.Problem_ID);
                  const isCompleted = completedIds.has(probIdStr);
                  const isExpanded = expandedProblemId === probIdStr;
                  const isActive = activeProblem && String(activeProblem.Problem_ID) === probIdStr;
                  
                  return (
                    <motion.div
                      key={probIdStr}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: Math.min(index * 0.02, 0.2) }}
                      onClick={() => setExpandedProblemId(probIdStr)}
                      className={`relative flex flex-col p-4 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                        isActive 
                          ? "bg-indigo-50/50 border-indigo-200 shadow-xs ring-1 ring-indigo-50" 
                          : isCompleted 
                            ? "bg-white border-slate-150 hover:border-slate-250 hover:bg-slate-50/20" 
                            : "bg-white border-slate-150 hover:border-slate-250 hover:bg-slate-50/50"
                      }`}
                    >
                      {/* Active State Accent Indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-r-md" />
                      )}

                      {/* Completed State Accent Indicator */}
                      {!isActive && isCompleted && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-sm" />
                      )}

                      <div className="flex items-start gap-3">
                        {/* Status Checkbox */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompletion(probIdStr);
                          }}
                          className={`mt-0.5 transition-all transform hover:scale-115 active:scale-90 flex-shrink-0 ${
                            isCompleted ? "text-emerald-500" : "text-slate-300 hover:text-slate-400"
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="w-5 h-5 fill-current" /> : <Circle className="w-5 h-5" />}
                        </button>

                        {/* Content Detail */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-xs sm:text-sm font-bold truncate leading-snug ${
                              isCompleted ? "text-slate-400 line-through decoration-slate-300" : "text-slate-800"
                            }`}>
                              {problem.Problem_Name}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">
                              {problem.Source}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                              problem.Difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                              problem.Difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-rose-100 text-rose-700'
                            }`}>
                              {problem.Difficulty}
                            </span>
                            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded tracking-wide uppercase">
                              {problem.Topic}
                            </span>
                            {problem.Subtopic && (
                              <span className="text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {problem.Subtopic}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mobile inline details chevron */}
                        <div className="lg:hidden text-slate-400 group-hover:text-slate-600 flex-shrink-0 ml-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Mobile Inline Detail Drawer */}
                      {isExpanded && (
                        <div className="lg:hidden mt-4 pt-4 border-t border-slate-100 space-y-4">
                          
                          {/* Blueprint Details */}
                          <div className="grid grid-cols-1 gap-3 text-xs text-slate-600">
                            {problem.Pattern && (
                              <div className="flex items-start gap-2">
                                <Brain className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Core Pattern</p>
                                  <p className="font-semibold text-slate-800 leading-tight">{problem.Pattern}</p>
                                </div>
                              </div>
                            )}
                            
                            {problem.Techniques && (
                              <div className="flex items-start gap-2">
                                <Code2 className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Techniques</p>
                                  <p className="font-semibold text-slate-800 leading-tight">{problem.Techniques}</p>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-start gap-2">
                              <Key className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Prerequisites</p>
                                <p className="font-semibold text-slate-800 leading-tight">{problem.Prerequisites || "None"}</p>
                              </div>
                            </div>
                          </div>

                          {/* Study metrics */}
                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                            <div className="flex items-start gap-2">
                              <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Est. Time</p>
                                <p className="font-semibold text-slate-800 leading-none mt-1">{problem.Estimated_Time_Minutes ? `${problem.Estimated_Time_Minutes} mins` : "20 mins"}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Revision</p>
                                <p className="font-semibold text-slate-800 leading-none mt-1">{problem.Revision_Frequency || "Monthly"}</p>
                              </div>
                            </div>
                          </div>

                          {/* Preloaded Blueprint Notes */}
                          <div className="pt-3 border-t border-slate-100 space-y-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Blueprint Notes</p>
                            <p className="text-xs text-slate-500 italic bg-slate-50 border border-slate-100 p-2.5 rounded-lg leading-relaxed">
                              "{problem.Notes || "Analyze this problem to understand its core complexity bounds, primary conditions, data structure representation."}"
                            </p>
                          </div>

                          {/* Target Companies tags */}
                          {problem.Company_Tags && (
                            <div className="pt-3 border-t border-slate-100 space-y-1">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Interview Targets</p>
                              <div className="flex flex-wrap gap-1">
                                {problem.Company_Tags.split("|").map((tag, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[9px] font-semibold rounded-md">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Mobile Custom User Notes Editor */}
                          <div className="pt-3 border-t border-slate-100 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                                <BookOpen className="w-3 h-3 text-emerald-500" /> Personal Study Notes
                              </p>
                              <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full">Auto-saved</span>
                            </div>
                            <textarea
                              placeholder="Type dry run details, complexity ideas, or approaches you struggle with..."
                              value={customNotes[probIdStr] || ""}
                              onChange={(e) => handleNoteChange(probIdStr, e.target.value)}
                              className="w-full h-20 p-2.5 text-xs text-slate-700 placeholder-slate-400 bg-slate-50/50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-400 focus:outline-none transition-colors leading-relaxed"
                            />
                          </div>

                          {/* Solve CTA Button on mobile */}
                          <div className="pt-2">
                            <a 
                              href={problem.URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                            >
                              <span>Solve on {problem.Source}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: High Fidelity Solution Blueprint & Companion Workspace */}
          <div className="hidden lg:flex lg:w-[58%] xl:w-[62%] flex-col lg:h-full lg:overflow-y-auto bg-[#F8FAFC] p-6 sm:p-8 scrollbar-thin">
            <AnimatePresence mode="wait">
              {activeProblem ? (
                <motion.div 
                  key={activeProblem.Problem_ID}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
                >
                  {/* Breadcrumbs & Difficulty pill row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>{activeProblem.Topic}</span>
                      <ChevronRight className="w-3 h-3 text-slate-300" />
                      <span className="text-slate-600">{activeProblem.Subtopic}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider ${
                        activeProblem.Difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                        activeProblem.Difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {activeProblem.Difficulty}
                      </span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-md">
                        {activeProblem.Source}
                      </span>
                    </div>
                  </div>
                  
                  {/* Problem Name */}
                  <div className="space-y-1">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
                      {activeProblem.Problem_Name}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold">
                      Learning Order #{activeProblem.Learning_Order} • Part of {activeProblem.Phase}
                    </p>
                  </div>

                  {/* Primary Solve CTA Button */}
                  <div>
                    <a 
                      href={activeProblem.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span>Solve Problem on {activeProblem.Source}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Blueprint and Metrics Dashboards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-150">
                    
                    {/* Left Blueprint Details */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-indigo-500" /> Algorithmic Blueprint
                      </h4>
                      
                      <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                        {activeProblem.Pattern && (
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Core Pattern</p>
                            <p className="text-sm font-bold text-slate-800 leading-snug mt-1">{activeProblem.Pattern}</p>
                          </div>
                        )}
                        
                        {activeProblem.Techniques && (
                          <div className="pt-3 border-t border-slate-150">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Techniques</p>
                            <p className="text-sm font-bold text-slate-800 leading-snug mt-1">{activeProblem.Techniques}</p>
                          </div>
                        )}
                        
                        <div className="pt-3 border-t border-slate-150">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Prerequisites</p>
                          <p className="text-sm font-bold text-indigo-700 leading-snug mt-1 flex items-center gap-1">
                            <Key className="w-3.5 h-3.5 text-indigo-500" /> {activeProblem.Prerequisites || "None"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Study Metrics */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-amber-500" /> Study Metrics
                      </h4>
                      
                      <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Estimated Time</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">{activeProblem.Estimated_Time_Minutes ? `${activeProblem.Estimated_Time_Minutes} mins` : "20 mins"}</p>
                          </div>
                          <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100">
                            <Clock className="w-4 h-4 text-amber-500" />
                          </div>
                        </div>
                        
                        <div className="pt-2.5 border-t border-slate-150 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Revision Frequency</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">{activeProblem.Revision_Frequency || "Monthly"}</p>
                          </div>
                          <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100">
                            <Calendar className="w-4 h-4 text-amber-500" />
                          </div>
                        </div>
                        
                        <div className="pt-2.5 border-t border-slate-150">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Importance Score</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-sm font-bold text-slate-800 leading-none">{activeProblem.Importance_Score || 8}/10</span>
                            <div className="flex-1 bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-amber-500 h-full rounded-full" 
                                style={{ width: `${(activeProblem.Importance_Score || 8) * 10}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Frequently Asked At (Target Companies) */}
                  {activeProblem.Company_Tags && (
                    <div className="pt-6 border-t border-slate-150 space-y-3">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Frequently Asked At</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeProblem.Company_Tags.split("|").map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Platform Blueprint Notes */}
                  <div className="pt-6 border-t border-slate-150 space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Platform Blueprint Notes</h4>
                    <div className="relative overflow-hidden bg-indigo-50/20 border border-indigo-100/80 rounded-xl p-4">
                      <Sparkles className="absolute right-3 top-3 w-5 h-5 text-indigo-400/30" />
                      <p className="text-sm text-slate-600 italic leading-relaxed">
                        "{activeProblem.Notes || "No custom notes recorded for this pattern. Learn the primary constraints and trade-offs of the solution."}"
                      </p>
                    </div>
                  </div>

                  {/* Interactive Personal Study Workspace */}
                  <div className="pt-6 border-t border-slate-150 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-emerald-500" /> Personal Study Workspace
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Auto-saved
                      </div>
                    </div>
                    <div className="relative rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50/50 overflow-hidden transition-all">
                      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wide">
                        <span>Private companion notes</span>
                        <span className="text-slate-300">•</span>
                        <span>Jot down solutions, complexity bounds, or trade-offs</span>
                      </div>
                      <textarea
                        placeholder="Write your notes, sample dry runs, code outlines, and edge cases here..."
                        value={customNotes[String(activeProblem.Problem_ID)] || ""}
                        onChange={(e) => handleNoteChange(String(activeProblem.Problem_ID), e.target.value)}
                        className="w-full h-44 p-4 text-sm text-slate-700 placeholder-slate-400 bg-white outline-none resize-y leading-relaxed"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <Brain className="w-12 h-12 text-slate-300 mb-3 animate-pulse" />
                  <h4 className="text-sm font-bold text-slate-700">No problem selected</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">Select a DSA problem from the list to begin analyzing, tracking progress, and saving study notes.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
