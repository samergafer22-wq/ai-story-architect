import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Clock, 
  Layers, 
  Play, 
  Zap, 
  Download, 
  Share2, 
  Wand2, 
  CheckCircle2, 
  Film,
  Cpu,
  Upload,
  Image as ImageIcon,
  Palette,
  Edit3,
  X,
  Plus,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { 
  StyleReferenceProfile, 
  PRESET_STYLE_REFERENCES, 
  extractImageStyleProfile 
} from '../utils/styleReferenceEngine';

export interface SequentialWorkflowBarProps {
  currentDuration: number;
  onChangeDuration: (duration: number) => void;
  seriesFormat: 'single' | '3parts' | '5parts';
  onChangeSeriesFormat: (format: 'single' | '3parts' | '5parts') => void;
  currentPart: number;
  onChangeCurrentPart: (part: number) => void;
  topicInput: string;
  onChangeTopicInput: (topic: string) => void;
  selectedCategory: string;
  onChangeCategory: (category: string) => void;
  
  // Custom Scene Prompts Mode
  productionMode: 'topic' | 'custom_prompts';
  onChangeProductionMode: (mode: 'topic' | 'custom_prompts') => void;
  customScenePrompts: string[];
  onChangeCustomScenePrompts: (prompts: string[]) => void;

  // Style Reference Profile
  activeStyleReference: StyleReferenceProfile | null;
  onSelectStyleReference: (style: StyleReferenceProfile | null) => void;

  isGenerating: boolean;
  generationStage: string;
  generationProgress: number;
  onStartProduction: () => void;
  hasProducedVideo: boolean;
  storyTitle: string;
  sceneCount: number;
  onExportVideo: () => void;
  isExporting: boolean;
  exportProgress: number;
  onPublishTikTok: () => void;
  isTikTokConnected?: boolean;
}

export const CATEGORIES_LIST = [
  { id: 'mystery', label: 'الغموض والظواهر الخارقة' },
  { id: 'scifi', label: 'الخيال العلمي والأكوان الموازية' },
  { id: 'history', label: 'أحداث تاريخية وحضارات مفقودة' },
  { id: 'horror', label: 'رعب وأسرار مظلمة' },
  { id: 'detective', label: 'جرائم وألغاز بوليسية' },
  { id: 'wealth', label: 'ثراء وريادة أعمال' },
];

export const SequentialWorkflowBar: React.FC<SequentialWorkflowBarProps> = ({
  currentDuration,
  onChangeDuration,
  seriesFormat,
  onChangeSeriesFormat,
  currentPart,
  onChangeCurrentPart,
  topicInput,
  onChangeTopicInput,
  selectedCategory,
  onChangeCategory,
  productionMode,
  onChangeProductionMode,
  customScenePrompts,
  onChangeCustomScenePrompts,
  activeStyleReference,
  onSelectStyleReference,
  isGenerating,
  generationStage,
  generationProgress,
  onStartProduction,
  hasProducedVideo,
  storyTitle,
  sceneCount,
  onExportVideo,
  isExporting,
  exportProgress,
  onPublishTikTok,
  isTikTokConnected = false,
}) => {
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const quickTopics = [
    'لغز اختفاء رحلة الطيران 370 في المحيط الهندي',
    'سر مدينة إرم ذات العماد المدفونة في الربع الخالي',
    'ماذا وجد الغواصون في خندق ماريانا في أعمق نقطة بالأرض',
    'أسرار بناء الأهرامات وغرف الفراعنة السرية',
    'بوابات الأكوان الموازية والذكاء الاصطناعي الخارق',
    'لغز اختفاء طاقم سفينة ماري سيلست بكامل أمتعتهم',
  ];

  const totalParts = seriesFormat === 'single' ? 1 : seriesFormat === '3parts' ? 3 : 5;

  // Handle local image file upload as style reference
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const profile = await extractImageStyleProfile(dataUrl, file.name);
        onSelectStyleReference(profile);
        setIsUploadingImage(false);
        setShowStyleModal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add scene prompt helper
  const handleUpdatePrompt = (index: number, text: string) => {
    const updated = [...customScenePrompts];
    updated[index] = text;
    onChangeCustomScenePrompts(updated);
  };

  const handleAddScenePrompt = () => {
    if (customScenePrompts.length < 8) {
      onChangeCustomScenePrompts([
        ...customScenePrompts,
        `لقطة سينمائية درامية عمودية 9:16 للمشهد ${customScenePrompts.length + 1}`
      ]);
    }
  };

  const handleRemoveScenePrompt = (index: number) => {
    if (customScenePrompts.length > 2) {
      const updated = customScenePrompts.filter((_, i) => i !== index);
      onChangeCustomScenePrompts(updated);
    }
  };

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl backdrop-blur-md mb-8 text-right font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>الخطوة 1: مركز إعداد الإنتاج التكاملي (سلسلة الـ 72 أداة ذكاء اصطناعي)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            صناعة فيديو تيك توك احترافي متكامل (Vertical 9:16)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            حدد مدة الفيديو، ارفع صورتك المرجعية لتوحيد النمط الفني، أو اكتب برومبت لكل مشهد بنفسك. عند الضغط على زر الإنتاج أدناه ستعمل الأدواة بشكل تكاملي وتسلم بعضها ليخرج الفيديو جاهزاً للمعاينة والتعديل.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-800 shrink-0">
          <span className={`w-2.5 h-2.5 rounded-full ${hasProducedVideo ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
          <span className="text-xs font-bold text-slate-200">
            {hasProducedVideo ? 'فيديو جاهز في المعاينة' : 'بانتظار إطلاق الإنتاج'}
          </span>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="mt-6 space-y-5">
        
        {/* Row 1: Duration, Series Parts & Style Reference Seeder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. Duration Selection */}
          <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>1. مدة الفيديو:</span>
              </span>
              <span className="text-[11px] text-amber-400 font-mono font-bold">
                {currentDuration <= 30 ? '30s (4 مشاهد)' : currentDuration <= 45 ? '45s (6 مشاهد)' : '60s (8 مشاهد)'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { sec: 30, label: '30 ثانية', scenes: '4 مشاهد' },
                { sec: 45, label: '45 ثانية', scenes: '6 مشاهد' },
                { sec: 60, label: '1 دقيقة', scenes: '8 مشاهد' },
              ].map((d) => (
                <button
                  key={d.sec}
                  type="button"
                  onClick={() => onChangeDuration(d.sec)}
                  className={`py-2 px-1.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-0.5 transition-all ${
                    currentDuration === d.sec
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md shadow-amber-400/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{d.label}</span>
                  <span className={`text-[10px] font-mono ${currentDuration === d.sec ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                    {d.scenes}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Series Parts Selection */}
          <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-rose-400" />
                <span>2. الأجزاء والسلسلة:</span>
              </span>
              <span className="text-[11px] text-rose-400 font-mono font-bold">
                {seriesFormat === 'single' ? 'مستقل' : `${totalParts} أجزاء`}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'single' as const, label: 'مستقل', desc: 'فيديو واحد' },
                { id: '3parts' as const, label: '3 أجزاء', desc: 'سلسلة 3x' },
                { id: '5parts' as const, label: '5 أجزاء', desc: 'ملحمة 5x' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => {
                    onChangeSeriesFormat(fmt.id);
                    onChangeCurrentPart(1);
                  }}
                  className={`py-2 px-1.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-0.5 transition-all ${
                    seriesFormat === fmt.id
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-rose-400 font-black shadow-md shadow-rose-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{fmt.label}</span>
                  <span className={`text-[10px] ${seriesFormat === fmt.id ? 'text-white/90' : 'text-slate-500'}`}>
                    {fmt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. AI Style Reference Image (Requested by user: Upload AI image -> match all scenes) */}
          <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#00f2fe]" />
                <span>3. صورة النمط الفني المرجعي:</span>
              </span>
              {activeStyleReference && (
                <button
                  type="button"
                  onClick={() => onSelectStyleReference(null)}
                  className="text-[10px] text-rose-400 hover:text-rose-300"
                >
                  إلغاء المرجع
                </button>
              )}
            </div>

            {activeStyleReference ? (
              <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-xl border border-[#00f2fe]/40">
                <img 
                  src={activeStyleReference.imageUrl} 
                  alt="Reference Style" 
                  className="w-10 h-10 rounded-lg object-cover border border-[#00f2fe] shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-white truncate">{activeStyleReference.name}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full inline-block border border-white/40"
                      style={{ backgroundColor: activeStyleReference.dominantColor }}
                    />
                    <span className="text-[10px] text-[#00f2fe] font-mono truncate">
                      مطابقة ألوان وإضاءة المشاهد
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStyleModal(true)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] rounded-lg shrink-0"
                >
                  تغيير
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowStyleModal(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-700 hover:border-[#00f2fe] bg-slate-900/60 hover:bg-slate-900 text-xs font-bold text-slate-300 flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4 text-[#00f2fe]" />
                <span>رفع صورة مرجعية للنمط (AI Reference) 🖼️</span>
              </button>
            )}
            
            <div className="text-[10px] text-slate-500 mt-2 truncate">
              توليد صور متطابقة في الروح والألوان مستوحاة من صورتك
            </div>
          </div>
        </div>

        {/* Row 2: Production Mode Switch (Auto Topic vs Custom Scene Prompts) */}
        <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 md:p-5 shadow-inner">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300">4. آلية صناعة المشاهد:</span>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => onChangeProductionMode('topic')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    productionMode === 'topic'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>توليد تلقائي ذكي من الموضوع</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeProductionMode('custom_prompts')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    productionMode === 'custom_prompts'
                      ? 'bg-gradient-to-r from-[#00f2fe] to-indigo-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>إدخال برومبت لكل مشهد بنفسك (Custom Prompts) 🔥</span>
                </button>
              </div>
            </div>

            {/* Category selection */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[11px] text-slate-400 shrink-0">التصنيف:</span>
              <select
                value={selectedCategory}
                onChange={(e) => onChangeCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 font-bold"
              >
                {CATEGORIES_LIST.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mode A: Automatic Topic Generation */}
          {productionMode === 'topic' ? (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => onChangeTopicInput(e.target.value)}
                  placeholder="اكتب فكرة القصة هنا (مثال: لغز اختفاء رحلة الطيران 370، أسرار خندق ماريانا، ثورة الذكاء الاصطناعي...)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                {topicInput && (
                  <button
                    type="button"
                    onClick={() => onChangeTopicInput('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded"
                  >
                    مسح
                  </button>
                )}
              </div>

              {/* Inspiration Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 shrink-0">اقتراحات سريعة:</span>
                {quickTopics.slice(0, 4).map((topic, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onChangeTopicInput(topic)}
                    className="text-[10px] text-slate-300 hover:text-amber-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1 rounded-lg transition-colors truncate max-w-[260px]"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Mode B: Custom Scene Prompts Builder */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-300 font-bold">
                  اكتب برومبت اللقطة البصرية لكل مشهد (سيقوم الذكاء الاصطناعي بتوليد المشاهد والصوت متطابقاً معها):
                </div>
                <button
                  type="button"
                  onClick={handleAddScenePrompt}
                  disabled={customScenePrompts.length >= 8}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-[#00f2fe] text-xs font-bold rounded-lg border border-slate-800 flex items-center gap-1 disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة مشهد ({customScenePrompts.length}/8)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto p-1">
                {customScenePrompts.map((promptText, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-amber-400 flex items-center gap-1">
                        <Film className="w-3 h-3" />
                        <span>برومبت المشهد {idx + 1} {idx === customScenePrompts.length - 1 ? '(خاتمة وسؤال التعليقات)' : ''}:</span>
                      </span>
                      {customScenePrompts.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveScenePrompt(idx)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <textarea
                      value={promptText}
                      onChange={(e) => handleUpdatePrompt(idx, e.target.value)}
                      rows={2}
                      placeholder={`صف ما يحدث في المشهد ${idx + 1} بصرياً...`}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00f2fe] resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-time 72-Tool Sequential Relay Progress Indicator */}
          {isGenerating && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/50 shadow-lg space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                  <span>سلسلة الـ 72 أداة تعمل بالتتابع التراكمي: {generationStage || 'توليد القصة والمشاهد...'}</span>
                </span>
                <span className="text-emerald-400 font-mono font-bold">{generationProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>توليد صور 9:16 حصرية بمطابقة النمط المطلوب ودقة 8K</span>
                <span>تجهيز التعليق الصوتي الصافي والمؤثرات وخروج الفيديو للمعاينة</span>
              </div>
            </div>
          )}

          {/* THE MASTER PRODUCTION ACTION BUTTON */}
          <div className="mt-5">
            <button
              type="button"
              onClick={onStartProduction}
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 hover:opacity-95 text-slate-950 font-black text-sm md:text-base rounded-2xl flex items-center justify-center gap-2.5 shadow-2xl shadow-amber-500/25 active:scale-98 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin text-slate-950" />
                  <span>جاري ترحيل المهام بين الأدوات وتوليد الفيديو الحصري...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 text-slate-950" />
                  <span>
                    {hasProducedVideo 
                      ? '🚀 إعادة إنتاج وتوليد فيديو جديد بالكامل عبر الـ 72 أداة'
                      : `🚀 بدء إنتاج الفيديو وتشغيل خط الـ 72 أداة بالتتابع (${productionMode === 'custom_prompts' ? `${customScenePrompts.length} مشاهد مخصصة` : (seriesFormat !== 'single' ? `الجزء ${currentPart} من ${totalParts}` : 'فيديو مستقل')})`}
                  </span>
                </>
              )}
            </button>

            {/* Direct Auto-Upload status pill */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>حساب تيك توك النشط: <span className="font-mono text-[#00f2fe]">@samer22004</span></span>
              </span>
              <span className="text-slate-500">خروج الفيديو تلقائياً للمعاينة في المشغل أدناه بعد الإنتاج</span>
            </div>
          </div>
        </div>

        {/* Post-Production Action Bar (Visible only when video has been produced) */}
        {hasProducedVideo && (
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-white">الفيديو المولد الحالي:</span>
                <span className="text-xs text-amber-400 font-bold truncate max-w-xs">{storyTitle}</span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {sceneCount} مشاهد AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                اكتمل الإنتاج بنجاح! يمكنك الآن مشاهدة الفيديو بالمشغل، ضبط المؤثرات، أو تنزيله ونشره على تيك توك.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <button
                type="button"
                onClick={() => {
                  document.getElementById('player-preview-card')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 md:flex-none px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>انتقل لمشاهدة الفيديو ▶</span>
              </button>

              <button
                type="button"
                onClick={onExportVideo}
                disabled={isExporting}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? `${exportProgress}% جاري التنزيل...` : 'تحميل MP4 بجودة HD 📥'}</span>
              </button>

              <button
                type="button"
                onClick={onPublishTikTok}
                className="px-3.5 py-2.5 bg-gradient-to-r from-[#fe2c55] to-rose-600 hover:opacity-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>نشر تيك توك (@samer22004)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Style Reference Selector Modal */}
      {showStyleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#00f2fe]" />
                <h3 className="text-base font-black text-white">
                  تحديد صورة النمط الفني المرجعي (Style Reference Seeder)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowStyleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ارفع صورة مولدة بالذكاء الاصطناعي من جهازك، وستقوم منظومة الإنتاج تلقائياً باستخراج نمط الألوان والإضاءة والمزاج السينمائي لتوليد جميع مشاهد الفيديو مستوحاة من نفس الصورة وبنفس الجودة!
            </p>

            {/* Upload from device box */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="w-full py-5 border-2 border-dashed border-[#00f2fe]/60 hover:border-[#00f2fe] bg-slate-950/80 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group"
            >
              <Upload className="w-7 h-7 text-[#00f2fe] group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">
                {isUploadingImage ? 'جاري قراءة واستخراج ألوان الصورة...' : 'اضغط لاختيار صورة من جهازك (JPG / PNG)'}
              </div>
              <div className="text-[10px] text-slate-400">
                يمكنك رفع أي صورة مولدة بـ Midjourney أو FLUX أو DALL-E
              </div>
            </button>

            {/* Built-in Presets */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-400">أو اختر من الأنماط السينمائية الجاهزة:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_STYLE_REFERENCES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onSelectStyleReference(preset);
                      setShowStyleModal(false);
                    }}
                    className="flex items-center gap-2.5 p-2 bg-slate-950 border border-slate-800 hover:border-[#00f2fe] rounded-xl text-right transition-colors"
                  >
                    <img 
                      src={preset.imageUrl} 
                      alt="" 
                      className="w-11 h-11 rounded-lg object-cover border border-slate-700 shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-white truncate">{preset.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{preset.aestheticDescription}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
