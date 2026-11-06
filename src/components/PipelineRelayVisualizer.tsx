import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  ArrowLeft, 
  Cpu, 
  Sliders, 
  Clock, 
  Search, 
  Zap, 
  Sparkles, 
  ChevronRight,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { AITool, PIPELINE_STAGES, AI_TOOLS_DATA } from '../data/aiToolsChain';

interface PipelineRelayVisualizerProps {
  onToolSelect?: (tool: AITool) => void;
  onPipelineComplete?: () => void;
}

export const PipelineRelayVisualizer: React.FC<PipelineRelayVisualizerProps> = ({
  onToolSelect,
  onPipelineComplete,
}) => {
  const [tools, setTools] = useState<AITool[]>(AI_TOOLS_DATA);
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);
  const [currentRunningIndex, setCurrentRunningIndex] = useState<number>(-1);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(tools[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Automated Sequential Relay Execution across all 72 tools
  useEffect(() => {
    let timeout: any = null;

    if (isRunningPipeline && currentRunningIndex >= 0 && currentRunningIndex < tools.length) {
      const currentTool = tools[currentRunningIndex];
      setActiveStageId(currentTool.stageId);
      setSelectedTool(currentTool);

      // Mark current as processing
      setTools(prev => prev.map((t, idx) => {
        if (idx < currentRunningIndex) return { ...t, status: 'completed' };
        if (idx === currentRunningIndex) return { ...t, status: 'processing' };
        return { ...t, status: 'idle' };
      }));

      // Simulate step duration proportional to tool's processing time (accelerated for preview)
      const stepDuration = Math.max(120, Math.round(currentTool.processingTimeMs / 3));

      timeout = setTimeout(() => {
        setTools(prev => prev.map((t, idx) => {
          if (idx === currentRunningIndex) return { ...t, status: 'handed_off' };
          return t;
        }));

        if (currentRunningIndex + 1 < tools.length) {
          setCurrentRunningIndex(currentRunningIndex + 1);
        } else {
          // Completed all 72 tools!
          setIsRunningPipeline(false);
          setCurrentRunningIndex(-1);
          setTools(prev => prev.map(t => ({ ...t, status: 'completed' })));
          if (onPipelineComplete) onPipelineComplete();
        }
      }, stepDuration);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isRunningPipeline, currentRunningIndex, tools.length, onPipelineComplete]);

  const handleStartPipeline = () => {
    setIsRunningPipeline(true);
    setCurrentRunningIndex(0);
  };

  const handleResetPipeline = () => {
    setIsRunningPipeline(false);
    setCurrentRunningIndex(-1);
    setTools(prev => prev.map(t => ({ ...t, status: 'idle' })));
  };

  const filteredTools = tools.filter(t => {
    const matchesStage = activeStageId === 0 || t.stageId === activeStageId;
    const matchesSearch = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.includes(searchQuery) ||
      t.category.includes(searchQuery);
    return matchesStage && matchesSearch;
  });

  const completedCount = tools.filter(t => t.status === 'completed' || t.status === 'handed_off').length;
  const progressPct = Math.round((completedCount / tools.length) * 100);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl backdrop-blur-md">
      {/* Header section with Stats & Pipeline Runner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold tracking-wide">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>نظام التتابع التلقائي المتكامل (72 أداة ذكاء اصطناعي)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            سلسلة الترحيل والإنتاج التراكمي (Relay Pipeline)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            كل أداة تنفذ مهمتها الدقيقة وتسلم مخرجاتها كاملة للأداة التي تليها، من صياغة أول ثانيتين وحتى الفيديو النهائي القابل للتحميل.
          </p>
        </div>

        {/* Pipeline Status Indicator */}
        <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
          <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>شبكة الـ 72 أداة متصلة وتعمل بالتتابع التراكمي</span>
          </div>
        </div>
      </div>

      {/* Real-time Progress Bar */}
      <div className="mt-4 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
            {completedCount}/{tools.length}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">
              {isRunningPipeline ? `جاري معالجة الأداة ${currentRunningIndex + 1}: ${tools[currentRunningIndex]?.name}` : 'جاهز للتشغيل والترحيل'}
            </div>
            <div className="text-[11px] text-slate-400">
              {completedCount === tools.length ? 'تم اكتمال وتسليم جميع الأدوات الـ 72 بنجاح!' : 'تتابع تسليم البيانات لحظياً من أداة لأخرى'}
            </div>
          </div>
        </div>

        <div className="w-full md:w-64 flex items-center gap-2">
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 transition-all duration-200"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-amber-400">{progressPct}%</span>
        </div>
      </div>

      {/* 10 Stages Selector Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveStageId(0)}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeStageId === 0
              ? 'bg-white text-slate-950 shadow-md'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          كافة المراحل (72 أداة)
        </button>

        {PIPELINE_STAGES.map((stage) => {
          const isCurrentActive = activeStageId === stage.id;
          const stageTools = tools.filter(t => t.stageId === stage.id);
          const stageDone = stageTools.every(t => t.status === 'completed' || t.status === 'handed_off');

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all border ${
                isCurrentActive
                  ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: stage.color }} 
              />
              <span>{stage.id}. {stage.title}</span>
              {stageDone && <Check className="w-3 h-3 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن أداة (Midjourney, ElevenLabs, Runway, Sora...)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          عرض {filteredTools.length} أداة
        </div>
      </div>

      {/* 2-Column Grid: Tools List + Tool Data Relay Inspector */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Tools List (7 Cols) */}
        <div className="lg:col-span-7 space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
          {filteredTools.map((tool) => {
            const isSelected = selectedTool?.id === tool.id;
            const isCurrentProcessing = tool.status === 'processing';
            const isHandedOff = tool.status === 'handed_off';
            const isDone = tool.status === 'completed';

            return (
              <div
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool);
                  if (onToolSelect) onToolSelect(tool);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-800 border-amber-500/60 shadow-lg shadow-amber-500/5'
                    : isCurrentProcessing
                    ? 'bg-amber-500/10 border-amber-500/80'
                    : isDone
                    ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-800/50 hover:border-slate-700'
                }`}
              >
                {/* Active Tool Running Bar */}
                {isCurrentProcessing && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400 animate-pulse" />
                )}

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isCurrentProcessing
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tool.id}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{tool.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{tool.role}</p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                        <Check className="w-3 h-3" />
                        <span>تم التسليم</span>
                      </span>
                    ) : isCurrentProcessing ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">
                        <Zap className="w-3 h-3 animate-spin" />
                        <span>معالجة</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">
                        {tool.processingTimeMs}ms
                      </span>
                    )}
                  </div>
                </div>

                {/* Relay flow summary line */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-[48%]">
                    <span className="text-slate-500 font-medium">تستلم:</span>
                    <span className="truncate text-slate-300">{tool.receivedFrom}</span>
                  </div>
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mx-1" />
                  <div className="flex items-center gap-1.5 truncate max-w-[48%]">
                    <span className="text-slate-500 font-medium">تسلم إلى:</span>
                    <span className="truncate text-slate-300">{tool.handsOffTo}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tool Relay Inspector (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          {selectedTool ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-400">الأداة رقم #{selectedTool.id} في خط الإنتاج</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedTool.name}</h3>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium">
                    المرحلة {selectedTool.stageId}: {selectedTool.stageName}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 leading-relaxed">
                {selectedTool.description}
              </div>

              {/* Data Hand-Off Cards */}
              <div className="space-y-3">
                {/* Received Input */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3">
                  <div className="text-[11px] font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                    <span>1. المدخلات المستلمة من ({selectedTool.receivedFrom})</span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono bg-black/40 p-2 rounded-lg border border-slate-800/60 leading-relaxed">
                    {selectedTool.sampleInput}
                  </div>
                </div>

                {/* Hand-off Output Payload */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3">
                  <div className="text-[11px] font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <span>2. المخرجات المسلّمة إلى ({selectedTool.handsOffTo})</span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono bg-black/40 p-2 rounded-lg border border-slate-800/60 leading-relaxed">
                    {selectedTool.sampleOutput}
                  </div>
                  <div className="mt-1.5 text-[10px] text-slate-400">
                    نوع الحمولة: <span className="font-mono text-amber-300">{selectedTool.payloadType}</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-2 text-center pt-2">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-400">زمن المعالجة المتوقع</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">{selectedTool.processingTimeMs} ms</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-400">حالة الربط الشبكي</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">متصل ومفعل 100%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-12">
              <Cpu className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-xs">اختر أداة من القائمة لعرض مسار تسليم البيانات</p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 text-center">
            تكامل ديناميكي يضمن عدم انقطاع البيانات حتى تصدير الفيديو النهائي
          </div>
        </div>
      </div>
    </div>
  );
};
