import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Clock, 
  Film, 
  Layers, 
  Play, 
  Download,
  RotateCcw,
  ArrowRight,
  MessageCircle,
  Hash,
  ChevronRight,
  PlusCircle,
  HelpCircle,
  Cpu,
  Camera,
  CheckCircle2,
  Globe,
  Image as ImageIcon,
  Sliders,
  Copy,
  ClipboardPaste
} from 'lucide-react';
import { StoryCategory, STORY_CATEGORIES, PRESET_STORIES, StoryProject, SceneItem } from '../data/storyLibrary';
import { getCinematicImageForScene } from '../utils/cinematicVisualLibrary';
import { parseScriptIntoScenes } from './CustomFootageMontageStudio';
import { 
  VFX_PRESETS, 
  SHAKE_PRESETS, 
  TRANSITION_PRESETS, 
  autoApplyCinematicVfx,
  VfxEffectType,
  ShakeIntensityType,
  TransitionStyleType 
} from '../utils/cinematicVfxEngine';

interface StoryStudioProps {
  currentStory: StoryProject;
  onSelectStory: (story: StoryProject) => void;
  onStoryUpdated: (updatedStory: StoryProject) => void;
  onOpenImageImporter?: (sceneIndex?: number) => void;
}

const DEFAULT_AI_TOOLS = [
  'FLUX.1 Pro Cinema · تأسيس المشهد البصري',
  'Midjourney v6.1 Ultra · تدقيق التفاصيل الميدانية',
  'Runway Gen-3 Alpha · انتقال مكاني ديناميكي',
  'Luma Dream Machine · كشف الألغاز المخفية',
  'Stable Diffusion 3.5 Turbo · تسارع الإثارة والحركة',
  'Kling AI v1.5 High-Motion · الذروة الدرامية الكبرى',
  'Leonardo.ai Alchemy · فحص الصدمة والأثر المتبقي',
  'DALL-E 3 HD · استطلاع رأي المتابعين ونهاية المشهد'
];

export const StoryStudio: React.FC<StoryStudioProps> = ({
  currentStory,
  onSelectStory,
  onStoryUpdated,
  onOpenImageImporter,
}) => {
  const [customTopic, setCustomTopic] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('mystery');
  const [selectedDuration, setSelectedDuration] = useState<number>(currentStory.duration || 60);
  const [isSeriesMode, setIsSeriesMode] = useState<boolean>(true);
  const [seriesPartsCount, setSeriesPartsCount] = useState<number>(3);
  const [currentPartNum, setCurrentPartNum] = useState<number>(1);
  const [musicTrack, setMusicTrack] = useState<'tension' | 'cyber' | 'epic' | 'ambient' | 'horror'>('tension');
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'scenes' | 'vfx' | 'presets'>('scenes');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger AI Generation (Always fresh, always new visuals & story, ends with follower opinion)
  const handleGenerateStory = async (nextPart: boolean = false) => {
    const topicToUse = customTopic.trim() || currentStory.title || 'لغز اختفاء رحلة الطيران 370';
    const targetPart = nextPart ? (currentStory.partNumber || 1) + 1 : 1;

    setIsGeneratingAI(true);
    setToastMessage(null);
    try {
      const res = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          category: selectedCategory,
          targetDuration: selectedDuration, // Selectable: 30s, 45s, 60s
          pacing: 'cinematic',
          tone: 'epic',
          partNumber: isSeriesMode ? targetPart : 1,
          totalParts: isSeriesMode ? seriesPartsCount : 1,
          isSeries: isSeriesMode,
          previousSummary: nextPart ? currentStory.scenes[currentStory.scenes.length - 1]?.voiceover : '',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const generated = json.data;

        const calculatedScenes = generated.scenes.map((s: any, idx: number) => ({
          sceneNumber: idx + 1,
          duration: Number(s.duration) || 6.5,
          voiceover: s.voiceover || '',
          visualPrompt: s.visualPrompt || `Cinematic vertical 9:16 portrait composition, topic "${topicToUse}", scene ${idx + 1}.`,
          aiToolUsed: s.aiToolUsed || DEFAULT_AI_TOOLS[idx % DEFAULT_AI_TOOLS.length],
          imageSrc: getCinematicImageForScene(topicToUse, selectedCategory, idx + 1, s.visualPrompt),
          gradientFallback: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
          sfx: s.sfx || 'Whoosh + Electronic Hum',
          cameraMotion: (s.cameraMotion as any) || (idx % 2 === 0 ? 'zoom_in' : 'pan_left'),
          moodColor: s.moodColor || (idx % 2 === 0 ? '#0ea5e9' : '#8b5cf6'),
          vfxEffect: s.vfxEffect || (idx === 0 ? 'light_leaks' : idx === 5 ? 'fire_embers' : 'glow_bloom'),
          shakeIntensity: s.shakeIntensity || (idx === 0 ? 'impact_bass' : 'subtle'),
          transitionType: s.transitionType || (idx === 0 ? 'flash_white' : 'zoom_warp'),
        }));

        const totalDynamicDur = Number(calculatedScenes.reduce((acc: number, cur: any) => acc + cur.duration, 0).toFixed(1));

        const newStory: StoryProject = {
          id: `custom-${Date.now()}`,
          title: generated.title || `${isSeriesMode ? `الجزء ${targetPart}: ` : ''}${topicToUse}`,
          category: generated.category || 'الغموض والظواهر الخارقة',
          categoryId: selectedCategory as any,
          duration: totalDynamicDur,
          tiktokHook: generated.tiktokHook || `سر غامض لن تصدقه حول "${topicToUse}"!`,
          musicTrack: (generated.musicTrack as any) || musicTrack,
          bpm: 120,
          partNumber: targetPart,
          totalParts: isSeriesMode ? seriesPartsCount : 1,
          isSeries: isSeriesMode,
          seriesTitle: topicToUse,
          hashtags: generated.hashtags || ['#تيك_توك_عرب', '#أفلام_قصيرة', '#ذكاء_اصطناعي', '#fyp'],
          scenes: calculatedScenes
        };

        setCurrentPartNum(targetPart);
        onSelectStory(newStory);
        setActiveTab('scenes');
        setToastMessage(`✨ تم إنتاج الفيديو الجديد بنجاح وتحميله فوراً في المشغل: "${newStory.title}"`);
        
        // Auto-scroll smoothly to preview player
        setTimeout(() => {
          document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } catch (err) {
      console.error('Error generating AI story:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleStartFreshStory = () => {
    setCustomTopic('');
    setCurrentPartNum(1);
    setActiveTab('scenes');
    setToastMessage(null);
  };

  // Full Script Paste from Clipboard & Auto-Distribution across scenes
  const handlePasteFullScript = async () => {
    try {
      let text = '';
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
        text = await navigator.clipboard.readText();
      }
      if (!text || !text.trim()) {
        const fallback = window.prompt('الصق السيناريو كاملاً هنا:');
        text = fallback || '';
      }
      if (text && text.trim()) {
        const parsed = parseScriptIntoScenes(text, currentStory.scenes.length || 8);
        if (parsed.length > 0) {
          const updatedScenes = currentStory.scenes.map((s, idx) => ({
            ...s,
            voiceover: parsed[idx] !== undefined ? parsed[idx] : s.voiceover
          }));
          onStoryUpdated({ ...currentStory, scenes: updatedScenes });
          setToastMessage(`✅ تم لصق وتوزيع السيناريو بنجاح على ${Math.min(parsed.length, updatedScenes.length)} مشاهد!`);
        }
      }
    } catch (err) {
      const fallback = window.prompt('الصق السيناريو كاملاً هنا:');
      if (fallback && fallback.trim()) {
        const parsed = parseScriptIntoScenes(fallback, currentStory.scenes.length || 8);
        if (parsed.length > 0) {
          const updatedScenes = currentStory.scenes.map((s, idx) => ({
            ...s,
            voiceover: parsed[idx] !== undefined ? parsed[idx] : s.voiceover
          }));
          onStoryUpdated({ ...currentStory, scenes: updatedScenes });
          setToastMessage(`✅ تم لصق وتوزيع السيناريو بنجاح على ${Math.min(parsed.length, updatedScenes.length)} مشاهد!`);
        }
      }
    }
  };

  // Copy Full Script to Clipboard
  const handleCopyFullScript = async () => {
    const fullText = currentStory.scenes.map((s, idx) => `المشهد ${idx + 1}:\n${s.voiceover}`).join('\n\n');
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullText);
        setToastMessage('📋 تم نسخ نصوص كافة المشاهد إلى الحافظة!');
      }
    } catch (e) {
      // ignore
    }
  };

  // Per-scene paste
  const handlePasteSceneVoiceover = async (idx: number) => {
    try {
      let text = '';
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
        text = await navigator.clipboard.readText();
      }
      if (!text || !text.trim()) {
        const fallback = window.prompt(`الصق نص المشهد ${idx + 1}:`, currentStory.scenes[idx]?.voiceover || '');
        text = fallback || '';
      }
      if (text && text.trim()) {
        const updatedScenes = [...currentStory.scenes];
        updatedScenes[idx] = { ...updatedScenes[idx], voiceover: text.trim() };
        onStoryUpdated({ ...currentStory, scenes: updatedScenes });
        setToastMessage(`✅ تم لصق النص في المشهد ${idx + 1}!`);
      }
    } catch (e) {
      const fallback = window.prompt(`الصق نص المشهد ${idx + 1}:`, currentStory.scenes[idx]?.voiceover || '');
      if (fallback && fallback.trim()) {
        const updatedScenes = [...currentStory.scenes];
        updatedScenes[idx] = { ...updatedScenes[idx], voiceover: fallback.trim() };
        onStoryUpdated({ ...currentStory, scenes: updatedScenes });
        setToastMessage(`✅ تم لصق النص في المشهد ${idx + 1}!`);
      }
    }
  };

  // Per-scene copy
  const handleCopySceneVoiceover = async (idx: number) => {
    const text = currentStory.scenes[idx]?.voiceover || '';
    if (!text) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setToastMessage(`📋 تم نسخ نص المشهد ${idx + 1}!`);
      }
    } catch (e) {
      // ignore
    }
  };

  // 1-Click Auto-Apply Cinematic VFX & Transitions across all scenes
  const handleAutoApplyVfx = () => {
    const updatedScenes = autoApplyCinematicVfx(currentStory.scenes, currentStory.categoryId);
    const updatedStory: StoryProject = {
      ...currentStory,
      scenes: updatedScenes,
    };
    onStoryUpdated(updatedStory);
    setToastMessage('✨ تم تطبيق النمط السينمائي الفيروسي (Auto-Cinema VFX) والتوهج وانتقالات الـ Zoom-Warp على جميع المشاهد!');
  };

  // Update specific scene VFX settings
  const handleUpdateSceneVfx = (
    sceneIndex: number,
    updates: Partial<SceneItem>
  ) => {
    const updatedScenes = currentStory.scenes.map((s, idx) => {
      if (idx === sceneIndex) {
        return { ...s, ...updates };
      }
      return s;
    });
    const updatedStory: StoryProject = {
      ...currentStory,
      scenes: updatedScenes,
    };
    onStoryUpdated(updatedStory);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl backdrop-blur-md">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>الخطوة 3: لوحة تعديل وتخصيص المشاهد والصور والمؤثرات (Customization Studio)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            تخصيص المشاهد والصور والانتقالات السينمائية
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            بعد معاينة الفيديو في المشغل، يمكنك تعديل نصوص المشاهد، تبديل أي صورة من صور الإنترنت HD 9:16، وتخصيص المؤثرات.
          </p>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-stretch md:self-auto shrink-0 flex-wrap">
          <button
            onClick={() => setActiveTab('scenes')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'scenes' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            المشاهد الـ {currentStory.scenes.length} الحالية 📝
          </button>

          <button
            onClick={() => setActiveTab('vfx')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'vfx' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>التأثيرات والانتقالات (VFX) 🎬</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'presets' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            القصص الجاهزة
          </button>

          {onOpenImageImporter && (
            <button
              onClick={() => onOpenImageImporter(0)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 hover:text-white hover:bg-indigo-500/25 transition-all shrink-0"
              title="فتح مستورد الصور عالي الجودة من الإنترنت ومطابقتها"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>صور الإنترنت (9:16)</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time Video Loaded Notification Toast */}
      {toastMessage && (
        <div className="mt-4 p-3.5 bg-gradient-to-r from-emerald-500/20 via-amber-500/15 to-transparent border border-emerald-500/40 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => {
              document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1.5 text-[11px] font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow shrink-0"
          >
            ▶ شاهد الآن في المشغل
          </button>
        </div>
      )}


      {/* Tab 2: Scene-by-Scene Timeline & Series Continuation */}
      {activeTab === 'scenes' && (
        <div className="mt-5 space-y-4">
          {/* Series Continuation Bar */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {currentStory.isSeries ? `الجزء ${currentStory.partNumber || 1} من ${currentStory.totalParts || 3}` : 'فيديو مستقل'}
                </span>
                <h3 className="text-sm font-bold text-white">{currentStory.title}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                8 لقطات بصرية مولدة بالذكاء الاصطناعي ومتوافقة مع النص · إلقاء صوتي متصل بدون فراغ · 60 ثانية
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {currentStory.isSeries && (
                <button
                  onClick={() => handleGenerateStory(true)}
                  disabled={isGeneratingAI}
                  className="flex-1 md:flex-none px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>توليد الجزء التالي (الجزء {(currentStory.partNumber || 1) + 1})</span>
                </button>
              )}

              {onOpenImageImporter && (
                <button
                  onClick={() => onOpenImageImporter(0)}
                  className="px-3 py-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:opacity-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/40 active:scale-95 transition-all shrink-0"
                  title="فتح مستورد الصور عالي الجودة من الإنترنت ومطابقة المشاهد"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-300" />
                  <span>مطابقة صور الإنترنت 🌐</span>
                </button>
              )}

              {/* 1-Click Direct Paste Full Script */}
              <button
                type="button"
                onClick={handlePasteFullScript}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-400/20 active:scale-95 transition-all shrink-0"
                title="لصق السيناريو كاملاً من الحافظة وتوزيعه تلقائياً على المشاهد"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-slate-950" />
                <span>لصق السيناريو 📋</span>
              </button>

              {/* Copy Full Script */}
              <button
                type="button"
                onClick={handleCopyFullScript}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors shrink-0"
                title="نسخ سيناريو كافة المشاهد الحالية"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ السيناريو 📄</span>
              </button>

              <button
                onClick={() => {
                  const updatedScenes = currentStory.scenes.map(s => ({ ...s, voiceover: '' }));
                  onStoryUpdated({ ...currentStory, scenes: updatedScenes });
                  setToastMessage('🧹 تم مسح كافة النصوص المكتوبة من جميع المشاهد!');
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold rounded-xl transition-colors shrink-0"
                title="مسح وتفريغ كافة النصوص المكتوبة لعرض لقطات سينمائية نقية"
              >
                مسح النصوص 🧹
              </button>

              <button
                onClick={handleStartFreshStory}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors shrink-0"
                title="البدء بقصة جديدة"
              >
                قصة جديدة
              </button>
            </div>
          </div>

          {/* 8 Scenes List with Visual Thumbnails & Internet Importer */}
          <div className="space-y-3">
            {currentStory.scenes.map((scene, idx) => (
              <div
                key={idx}
                className={`bg-slate-950 border rounded-2xl p-4 transition-all ${
                  idx === 7 
                    ? 'border-amber-500/50 bg-amber-500/5' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-3.5">
                  {/* Scene 9:16 Vertical Thumbnail Preview */}
                  <div className="relative w-20 sm:w-24 aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 group shadow-md">
                    {scene.imageSrc ? (
                      <img 
                        src={scene.imageSrc} 
                        alt={`مشهد ${scene.sceneNumber}`} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px]">
                        لا توجد صورة
                      </div>
                    )}
                    {onOpenImageImporter && (
                      <button
                        onClick={() => onOpenImageImporter(idx)}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 text-center text-amber-300 text-[10px] font-bold"
                        title="استبدال صورة هذا المشهد من الإنترنت"
                      >
                        <Globe className="w-4 h-4 mb-0.5 text-amber-400" />
                        <span>تغيير</span>
                      </button>
                    )}
                    <div className="absolute top-1 right-1 bg-black/80 text-white font-mono text-[9px] font-bold px-1.5 rounded">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Scene Content & Controls */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                          idx === 7 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-200'
                        }`}>
                          {scene.sceneNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-200">
                          المشهد {scene.sceneNumber} {idx === 7 && '🔥 (خاتمة وسؤال المتابعين)'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">({scene.duration}s)</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {onOpenImageImporter && (
                          <button
                            onClick={() => onOpenImageImporter(idx)}
                            className="text-[10px] font-bold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                            title="تغيير صورة هذا المشهد من الإنترنت"
                          >
                            <Globe className="w-3 h-3 text-indigo-400" />
                            <span>صورة الإنترنت</span>
                          </button>
                        )}

                        {scene.aiToolUsed && (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg font-mono flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-amber-400" />
                            <span className="truncate max-w-[150px]">{scene.aiToolUsed}</span>
                          </span>
                        )}

                        {/* Active VFX & Transition Badges */}
                        <button
                          onClick={() => setActiveTab('vfx')}
                          className="text-[10px] text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-2.5 py-1 rounded-lg font-mono flex items-center gap-1 transition-colors"
                          title="تعديل التأثيرات البصرية والانتقالات السينمائية"
                        >
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>{scene.vfxEffect || 'glow_bloom'} · {scene.transitionType || 'zoom_warp'}</span>
                        </button>

                        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                          SFX: {scene.sfx}
                        </span>
                      </div>
                    </div>

                    {/* Editable Voiceover text with Paste, Copy & Clear tools */}
                    <div className="relative mt-2">
                      <div className="flex items-center justify-between text-[11px] font-bold pb-1">
                        <span className="text-amber-400">نص المشهد {scene.sceneNumber}:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handlePasteSceneVoiceover(idx)}
                            className="text-[10px] text-[#00f2fe] hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                            title="لصق من الحافظة لهذا المشهد"
                          >
                            <ClipboardPaste className="w-3 h-3" />
                            <span>لصق</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopySceneVoiceover(idx)}
                            className="text-[10px] text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                            title="نسخ نص هذا المشهد"
                          >
                            <Copy className="w-3 h-3" />
                            <span>نسخ</span>
                          </button>
                          {scene.voiceover && (
                            <button
                              type="button"
                              onClick={() => {
                                const updatedScenes = [...currentStory.scenes];
                                updatedScenes[idx] = { ...updatedScenes[idx], voiceover: '' };
                                onStoryUpdated({ ...currentStory, scenes: updatedScenes });
                                setToastMessage(`🧹 تم مسح نص المشهد ${scene.sceneNumber}`);
                              }}
                              className="text-[10px] text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-1.5 py-0.5 rounded transition-colors"
                              title="مسح النص لهذا المشهد"
                            >
                              مسح 🧹
                            </button>
                          )}
                        </div>
                      </div>

                      <textarea
                        value={scene.voiceover}
                        onChange={(e) => {
                          const updatedScenes = [...currentStory.scenes];
                          updatedScenes[idx] = { ...updatedScenes[idx], voiceover: e.target.value };
                          onStoryUpdated({ ...currentStory, scenes: updatedScenes });
                        }}
                        rows={2}
                        className="w-full text-xs text-slate-200 leading-relaxed bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400 resize-none font-sans"
                        placeholder="اكتب أو الصق نص المشهد هنا..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Cinematic VFX & Transitions Studio */}
      {activeTab === 'vfx' && (
        <div className="mt-5 space-y-5">
          {/* VFX Studio Header & Auto-Apply Action */}
          <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-amber-950/40 border border-purple-500/40 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Sparkles className="w-4 h-4 fill-amber-400" />
                <span>مكتبة المؤثرات البصرية والانتقالات السينمائية (Cinematic VFX & Transitions)</span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-white mt-1">
                تأثيرات سينمائية عالية الإبهار تحاكي أشهر فيديوهات Reels الفيروسية
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                توهج ألماسي ناعم (Bloom Glow)، تسريب أضواء الكاميرا (Light Leaks)، ارتطام متزامن مع إيقاع الباس (Bass Punch Shake)، وانتقالات زووم والتفاف خاطفة (Zoom-Warp & Whip-Pan) لضمان أعلى مدة مشاهدة وتفاعل.
              </p>
            </div>

            <button
              onClick={handleAutoApplyVfx}
              className="px-5 py-3 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:opacity-95 text-slate-950 font-black text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 active:scale-95 transition-all shrink-0 w-full md:w-auto"
            >
              <Wand2 className="w-4 h-4 text-slate-950" />
              <span>تطبيق النمط السينمائي الفيروسي آلياً (Auto-Cinema) 🚀</span>
            </button>
          </div>

          {/* VFX Categories Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* 1. Atmospheric VFX Presets */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>1. أنماط الإضاءة والتوهج (VFX Atmosphere)</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                طبقات ضوئية حية تُرسم مباشرة على الفيديو لإعطاء عمق سينمائي 35mm:
              </p>
              <div className="space-y-1.5">
                {VFX_PRESETS.map((v) => (
                  <div key={v.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="font-bold text-slate-200">{v.titleAr.split('(')[0]}</span>
                    <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{v.badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Camera Shake Presets */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-2">
                <Camera className="w-4 h-4" />
                <span>2. اهتزاز وارتطام الكاميرا (Camera Shake)</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                حركات واهتزازات ذكية تعزز إحساس الواقعية والصدمات الصوتية:
              </p>
              <div className="space-y-1.5">
                {SHAKE_PRESETS.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="font-bold text-slate-200">{s.titleAr.split('(')[0]}</span>
                    <span className="text-[10px] font-mono text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">{s.id}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Transitions Presets */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-2">
                <Layers className="w-4 h-4" />
                <span>3. انتقالات المشاهد السينمائية (Transitions)</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                انتقالات ناعمة وخاطفة تمنع الملل وتزيد من معدل إكمال الفيديو:
              </p>
              <div className="space-y-1.5">
                {TRANSITION_PRESETS.map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="font-bold text-slate-200">{t.titleAr.split('(')[0]}</span>
                    <span className="text-[10px] font-mono text-indigo-400/90 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{t.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Per-Scene VFX Customizer Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>تخصيص التأثير والانتقال لكل مشهد من المشاهد الـ 8:</span>
                <span className="text-xs text-amber-400 font-mono">({currentStory.scenes.length} مشاهد)</span>
              </h4>
              <button
                onClick={() => {
                  document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>معاينة في المشغل</span>
                <span>↑</span>
              </button>
            </div>

            <div className="space-y-3">
              {currentStory.scenes.map((scene, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  {/* Left: Thumbnail & Scene Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-14 aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                      {scene.imageSrc ? (
                        <img src={scene.imageSrc} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-[9px]">#{idx + 1}</div>
                      )}
                      <div className="absolute top-1 right-1 bg-black/80 text-white font-mono text-[9px] font-bold px-1 rounded">
                        #{idx + 1}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">المشهد {idx + 1}</span>
                        {idx === 0 && <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">الهوك الأساسي</span>}
                        {idx === currentStory.scenes.length - 1 && <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded">الخاتمة</span>}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-sm mt-1 leading-snug">
                        {scene.voiceover}
                      </p>
                    </div>
                  </div>

                  {/* Right: VFX Controls Dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full md:w-auto shrink-0">
                    {/* 1. VFX Effect Selector */}
                    <div>
                      <label className="text-[10px] font-bold text-amber-300 block mb-1">المؤثر البصري (VFX):</label>
                      <select
                        value={scene.vfxEffect || 'glow_bloom'}
                        onChange={(e) => handleUpdateSceneVfx(idx, { vfxEffect: e.target.value as VfxEffectType })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        {VFX_PRESETS.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.titleAr.split('(')[0]}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Shake Selector */}
                    <div>
                      <label className="text-[10px] font-bold text-rose-300 block mb-1">اهتزاز الكاميرا:</label>
                      <select
                        value={scene.shakeIntensity || 'subtle'}
                        onChange={(e) => handleUpdateSceneVfx(idx, { shakeIntensity: e.target.value as ShakeIntensityType })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                      >
                        {SHAKE_PRESETS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.titleAr.split('(')[0]}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 3. Transition Selector */}
                    <div>
                      <label className="text-[10px] font-bold text-indigo-300 block mb-1">الانتقال لهذا المشهد:</label>
                      <select
                        value={scene.transitionType || 'zoom_warp'}
                        onChange={(e) => handleUpdateSceneVfx(idx, { transitionType: e.target.value as TransitionStyleType })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        {TRANSITION_PRESETS.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.titleAr.split('(')[0]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Preset Categories */}
      {activeTab === 'presets' && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {PRESET_STORIES.map((story) => (
              <div
                key={story.id}
                onClick={() => {
                  onSelectStory(story);
                  setActiveTab('scenes');
                  setToastMessage(`✨ تم تحميل قصة "${story.title}" في مشغل تيك توك بنجاح!`);
                  setTimeout(() => {
                    document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  currentStory.id === story.id
                    ? 'bg-slate-800 border-amber-500 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      {story.category}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">8 لقطات متجددة</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1 line-clamp-2 leading-snug">{story.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {story.scenes[0]?.voiceover}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>60 ثانية (1 دقيقة)</span>
                  <span className="text-amber-400 font-bold">تشغيل في المشغل ←</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
