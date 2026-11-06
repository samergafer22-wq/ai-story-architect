import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Film, 
  Volume2, 
  Layers, 
  CheckCircle2, 
  ArrowLeft, 
  Play, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Eye,
  Camera,
  Music,
  Share2
} from 'lucide-react';

export interface AgentTeam {
  id: string;
  name: string;
  nameEn: string;
  toolsCount: number;
  icon: any;
  color: string;
  activeColor: string;
  borderColor: string;
  description: string;
  currentTask: string;
  tools: string[];
  outputArtifact: string;
}

export const AGENT_TEAMS: AgentTeam[] = [
  {
    id: 'script',
    name: 'فريق السيناريو والسرد الفيروسي',
    nameEn: 'Screenplay & Viral Hook Team',
    toolsCount: 15,
    icon: Sparkles,
    color: 'from-amber-500/20 to-amber-600/10',
    activeColor: 'bg-amber-400 text-slate-950',
    borderColor: 'border-amber-500/40',
    description: 'تفكيك الكلمات المفتاحية للموضوع وصياغة الخطاف الصادم وسيناريو 8 مشاهد بدون أي فراغ صوتي وسؤال التعليقات.',
    currentTask: 'صياغة 8 مشاهد سينمائية متصاعدة مع سؤال فيروسي للتعليقات...',
    tools: ['GPT-4o Script', 'Claude 3.5 Suspense', 'Gemini 1.5 Pro', 'TikTok Hook AI', 'Gapless Pacing v2', 'Viral CTA Engine'],
    outputArtifact: 'سيناريو فيلمي كامل (8 مشاهد · 28-35 كلمة/مشهد)'
  },
  {
    id: 'visuals',
    name: 'فريق الرؤية البصرية والتصوير 9:16',
    nameEn: 'Cinematography & 9:16 Visuals Team',
    toolsCount: 18,
    icon: Camera,
    color: 'from-rose-500/20 to-rose-600/10',
    activeColor: 'bg-rose-400 text-slate-950',
    borderColor: 'border-rose-500/40',
    description: 'مطابقة وتوليد لقطات فوتوغرافية سينمائية 8K بمقاسات 1080x1920 حصرية ومتطابقة مع أحداث كل مشهد بدقة.',
    currentTask: 'توليد ومطابقة المشاهد البصرية 9:16 بجودة سينمائية 8K...',
    tools: ['FLUX.1 Pro Cinema', 'Midjourney v6.1 Ultra', 'Runway Gen-3', 'Luma Dream Machine', 'Leonardo.ai 8K', 'Topaz Gigapixel'],
    outputArtifact: '8 لقطات بصرية أصلية 1080x1920 بدون صور خارجية'
  },
  {
    id: 'audio',
    name: 'فريق هندسة الصوت والأداء الإلقائي',
    nameEn: 'Audio Engineering & Voice Team',
    toolsCount: 14,
    icon: Volume2,
    color: 'from-cyan-500/20 to-cyan-600/10',
    activeColor: 'bg-cyan-400 text-slate-950',
    borderColor: 'border-cyan-500/40',
    description: 'توليد النبرة الإلقائية التفاعلية، ومزامنة إيقاع الموسيقى التصويرية، وإطلاق مؤثرات Sub-bass و Whoosh و Heartbeat.',
    currentTask: 'تركيب التعليق الصوتي الدرامي ودمج مؤثرات الصدمات والرياح...',
    tools: ['ElevenLabs Multilingual v2', 'Google Cloud Neural TTS', 'Adobe Podcast Enhance', 'Hans Zimmer Tension Drone', 'Sub-Bass Synthesizer'],
    outputArtifact: 'مقطع صوتي ملحمي متصل بدون فراغ مع مؤثرات سينمائية'
  },
  {
    id: 'vfx',
    name: 'فريق المونتاج والمؤثرات الحركية VFX',
    nameEn: 'VFX & Dynamic Motion Team',
    toolsCount: 15,
    icon: Film,
    color: 'from-purple-500/20 to-purple-600/10',
    activeColor: 'bg-purple-400 text-slate-950',
    borderColor: 'border-purple-500/40',
    description: 'برمجة حركات الكاميرا (Ken Burns, Pan, Zoom, Shake) ووهج Bloom وجزيئات الجمر وانتقالات المشاهد السلسة.',
    currentTask: 'تطبيق اهتزاز الكاميرا الواقعي ووهج الإضاءة وانتقالات المشاهد...',
    tools: ['Boris FX Sapphire', 'After Effects AI Motion', 'Camera Shake Matrix', 'Light Leaks Pro', '35mm Film Grain', 'Whip-Pan Engine'],
    outputArtifact: 'حركة كاميرا سينمائية وانتقالات بصرية 60 FPS'
  },
  {
    id: 'mastering',
    name: 'فريق الماسترينغ النهائي وتسليم تيك توك',
    nameEn: 'Mastering & TikTok Delivery Team',
    toolsCount: 10,
    icon: ShieldCheck,
    color: 'from-emerald-500/20 to-emerald-600/10',
    activeColor: 'bg-emerald-400 text-slate-950',
    borderColor: 'border-emerald-500/40',
    description: 'تدقيق منطقة الأمان 9:16، ومزامنة الصوت والصورة بنسبة 100%، وتسليم الفيديو جاهزاً للمعاينة والتنزيل MP4.',
    currentTask: 'الماسترينغ النهائي وتسليم الفيديو للمشغل العمودي...',
    tools: ['TikTok Safe Zone Audit', '1080x1920 Vertical Master', 'Auto Subtitles Engine', 'Retention Optimizer', 'MP4 Hardware Encoder'],
    outputArtifact: 'فيديو تيك توك نهائي 9:16 قابل للمشاهدة والتحميل'
  }
];

interface CollaborativeAgentMeshProps {
  isGenerating: boolean;
  progress: number;
  activeStage: string;
  topic: string;
}

export const CollaborativeAgentMesh: React.FC<CollaborativeAgentMeshProps> = ({
  isGenerating,
  progress,
  activeStage,
  topic
}) => {
  // Determine active team index based on progress (0 to 4)
  const activeTeamIndex = Math.min(
    4,
    Math.floor((progress / 100) * AGENT_TEAMS.length)
  );

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-md text-right font-sans mb-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>الشبكة العنكبوتية الذكية (تكامل 72 أداة في 5 فرق تخصصية)</span>
          </div>
          <h3 className="text-lg md:text-xl font-black text-white mt-1">
            منظومة العمل الجماعي الذكي وتسليم البيانات التراكمي
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            تعمل الأدوات كفريق أوركسترا سينمائي: كل فريق ينجز تفاصيله الدقيقة ويسلم المخرجات الكاملة للفريق الذي يليه مباشرة.
          </p>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shrink-0">
          <span className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="text-xs font-bold text-slate-200">
            {isGenerating ? `جاري الإنتاج المتكامل (${progress}%)` : 'الشبكة جاهزة ومتصلة'}
          </span>
        </div>
      </div>

      {/* Spiderweb Team Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 mt-5">
        {AGENT_TEAMS.map((team, idx) => {
          const Icon = team.icon;
          const isDone = progress >= ((idx + 1) * 20);
          const isCurrent = isGenerating && idx === activeTeamIndex;
          const isPending = !isDone && !isCurrent;

          return (
            <div
              key={team.id}
              className={`relative rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between ${
                isCurrent 
                  ? 'bg-slate-900/90 border-amber-400 shadow-xl shadow-amber-500/10 scale-102 ring-1 ring-amber-400'
                  : isDone
                  ? 'bg-slate-900/60 border-emerald-500/40 text-slate-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-75'
              }`}
            >
              {/* Node Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isCurrent 
                      ? 'bg-amber-400 text-slate-950 shadow-md animate-pulse'
                      : isDone 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    isCurrent
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                      : isDone
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    {team.toolsCount} أداة
                  </span>
                </div>

                <div className="text-xs font-black text-white leading-tight">
                  {team.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-sans">
                  {team.nameEn}
                </div>

                <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                  {team.description}
                </p>
              </div>

              {/* Status / Output Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                  {isDone ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>اكتمل وتم التسليم</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="text-amber-400 flex items-center gap-1 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                      <span>قيد المعالجة الآن...</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <span>بانتظار التسليم</span>
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 truncate mt-1" title={team.outputArtifact}>
                  {team.outputArtifact}
                </div>
              </div>

              {/* Spiderweb connection arrow indicator on desktop */}
              {idx < AGENT_TEAMS.length - 1 && (
                <div className="hidden md:flex absolute -left-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 items-center justify-center text-[10px] text-amber-400">
                  ◀
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Stage Bar & Data Handoff Details */}
      {isGenerating && (
        <div className="mt-5 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-inner flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>مرحلة التسليم اللحظي: {activeStage || 'معالجة البيانات في شبكة الـ 72 أداة...'}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              الموضوع قيد الصياغة والإنتاج: <span className="text-slate-200 font-bold">"{topic}"</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-64">
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
