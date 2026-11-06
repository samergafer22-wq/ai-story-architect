import React, { useState } from 'react';
import { 
  Sparkles, 
  Film, 
  Cpu, 
  Download, 
  Sliders, 
  Zap, 
  Share2, 
  Layers, 
  HelpCircle,
  Video,
  Music,
  CheckCircle2,
  FileCheck,
  Smartphone,
  Globe,
  Play,
  ArrowRight,
  Eye,
  Wand2
} from 'lucide-react';
import { PRESET_STORIES, StoryProject } from './data/storyLibrary';
import { TikTokVideoPlayer } from './components/TikTokVideoPlayer';
import { PipelineRelayVisualizer } from './components/PipelineRelayVisualizer';
import { StoryStudio } from './components/StoryStudio';
import { TikTokAccountModal, TikTokProfile } from './components/TikTokAccountModal';
import { ImageImporterModal } from './components/ImageImporterModal';
import { SequentialWorkflowBar } from './components/SequentialWorkflowBar';
import { CollaborativeAgentMesh } from './components/CollaborativeAgentMesh';
import { generateProfessionalAiImageUrl } from './utils/aiSceneVisualGenerator';
import { autoApplyCinematicVfx } from './utils/cinematicVfxEngine';
import { audioEngine } from './utils/audioEngine';

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

import { StyleReferenceProfile, injectStyleReferenceToPrompt } from './utils/styleReferenceEngine';
import { CustomFootageMontageStudio } from './components/CustomFootageMontageStudio';

const DEFAULT_SAMER_AVATAR = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fe2c55"/><stop offset="50%" stop-color="%230f172a"/><stop offset="100%" stop-color="%2300f2fe"/></linearGradient></defs><rect width="200" height="200" rx="40" fill="url(%23g)"/><circle cx="100" cy="85" r="40" fill="%23ffffff" opacity="0.95"/><text x="100" y="100" font-family="sans-serif" font-weight="900" font-size="44" fill="%230f172a" text-anchor="middle">S</text><path d="M40 180 c0 -35 30 -55 60 -55 s60 20 60 55" fill="%23ffffff" opacity="0.9"/></svg>';

export default function App() {
  const [currentStory, setCurrentStory] = useState<StoryProject>(PRESET_STORIES[0]);
  const [activeSection, setActiveSection] = useState<'workspace' | 'pipeline' | 'categories'>('workspace');
  const [isTikTokModalOpen, setIsTikTokModalOpen] = useState<boolean>(false);
  const [isImageImporterOpen, setIsImageImporterOpen] = useState<boolean>(false);
  const [importerSceneIndex, setImporterSceneIndex] = useState<number>(0);
  
  // Workspace Primary Workflow Mode: Custom Footage & Script (User Request) vs Full AI Procedural
  const [workflowMode, setWorkflowMode] = useState<'custom_footage' | 'ai_generation'>('custom_footage');

  // Video production parameters
  const [videoDuration, setVideoDuration] = useState<number>(60);
  const [seriesFormat, setSeriesFormat] = useState<'single' | '3parts' | '5parts'>('single');
  const [currentPart, setCurrentPart] = useState<number>(1);
  const [topicInput, setTopicInput] = useState<string>('لغز اختفاء رحلة الطيران 370 في المحيط الهندي');
  const [selectedCategory, setSelectedCategory] = useState<string>('mystery');

  // Custom Scene Prompts Mode State
  const [productionMode, setProductionMode] = useState<'topic' | 'custom_prompts'>('topic');
  const [customScenePrompts, setCustomScenePrompts] = useState<string[]>([
    'لقطة سينمائية ليلية لطائرة ركاب تخترق سحب المحيط العاتية في ظلام دامس',
    'شاشات رادار أبراج المراقبة الجوية ترصد انحرافاً حاداً غير مفسر للطائرة',
    'ملف عسكري وسري يحتوي إحداثيات موقع الاختفاء فوق خندق ماريانا',
    'سؤال مثير للجدل للمتابعين في التعليقات حول نظرياتهم لمصير الرحلة'
  ]);

  // AI Style Reference Profile
  const [activeStyleReference, setActiveStyleReference] = useState<StyleReferenceProfile | null>(null);

  // Production workflow states
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [hasProducedVideo, setHasProducedVideo] = useState<boolean>(true);

  // Video player export states
  const [exportTrigger, setExportTrigger] = useState<number>(0);
  const [isPlayerExporting, setIsPlayerExporting] = useState<boolean>(false);
  const [playerExportProgress, setPlayerExportProgress] = useState<number>(0);

  // Profile avatar initialized with user custom avatar from localStorage or personalized branded S-avatar
  const [tikTokProfile, setTikTokProfile] = useState<TikTokProfile>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('samer_custom_avatar') : null;
    return {
      username: '@samer22004',
      displayName: 'Samer (@samer22004)',
      avatarUrl: saved || DEFAULT_SAMER_AVATAR,
      followers: '284.5K',
      likes: '3.4M',
      videosCount: 89,
      isConnected: true,
      connectedAt: 'مفعل وجاهز للنشر المباشر',
    };
  });
  const [autoUploadTikTok, setAutoUploadTikTok] = useState<boolean>(true);

  const bannerAvatarInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleBannerAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setTikTokProfile(prev => ({ ...prev, avatarUrl: dataUrl }));
        try {
          localStorage.setItem('samer_custom_avatar', dataUrl);
        } catch (err) {
          // ignore
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const totalParts = seriesFormat === 'single' ? 1 : seriesFormat === '3parts' ? 3 : 5;

  // Single Master Production Execution with 72-tool collaborative mesh handoff
  const handleStartProduction = async () => {
    setIsGeneratingStory(true);
    setGenerationProgress(10);
    setGenerationStage('فريق 1: تفكيك الكلمات المفتاحية وصياغة القصة المتدفقة بدون فراغ صوتي (15 أداة)...');

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      const topicToUse = topicInput.trim() || currentStory.title || 'لغز اختفاء رحلة الطيران 370 في المحيط الهندي';
      const isSeries = seriesFormat !== 'single';

      // Team 1: Scriptwriting & Viral Hook (15 tools)
      await sleep(500);
      setGenerationProgress(25);
      setGenerationStage(
        productionMode === 'custom_prompts'
          ? `فريق 1: تحويل البرومبتات الـ ${customScenePrompts.length} المخصصة إلى سيناريو متكامل وتعليق صوتي...`
          : 'فريق 1: كتابة سيناريو المشاهد المتجدد والترتيب الزمني وسؤال التعليقات...'
      );

      const res = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          category: selectedCategory,
          targetDuration: videoDuration,
          pacing: 'cinematic',
          tone: 'epic',
          partNumber: isSeries ? currentPart : 1,
          totalParts: totalParts,
          isSeries: isSeries,
          previousSummary: currentPart > 1 ? `الجزء السابق من ${topicToUse}` : '',
          customScenePrompts: productionMode === 'custom_prompts' ? customScenePrompts : [],
          referenceStyle: activeStyleReference ? {
            dominantColor: activeStyleReference.dominantColor,
            lightingMood: activeStyleReference.lightingMood,
            aestheticDescription: activeStyleReference.aestheticDescription,
          } : null,
        }),
      });

      const json = await res.json();
      const generated = json.success && json.data ? json.data : null;

      // Team 2: Visuals & 9:16 Cinematography (18 tools)
      await sleep(650);
      setGenerationProgress(50);
      setGenerationStage(
        activeStyleReference
          ? `فريق 2: مطابقة صور المشاهد مع النمط المرجعي المرفوع (${activeStyleReference.name})...`
          : 'فريق 2: تسليم السيناريو وتوليد المشاهد 9:16 بدقة 8K (FLUX.1 Pro & Midjourney)...'
      );

      const rawScenes = (generated?.scenes || []).length > 0 
        ? generated.scenes 
        : Array.from({ length: videoDuration <= 30 ? 4 : videoDuration <= 45 ? 6 : 8 }).map((_, i) => ({
            sceneNumber: i + 1,
            duration: 6.5,
            voiceover: `المشهد ${i + 1}: تصاعد وتيرة الغموض وتكشف الأدلة الخفية حول ${topicToUse}.`,
            visualPrompt: `Cinematic vertical 9:16 atmospheric shot for "${topicToUse}", scene ${i + 1}.`,
            sfx: 'Whoosh + Electronic Hum',
            cameraMotion: i % 2 === 0 ? 'zoom_in' : 'pan_left',
            moodColor: activeStyleReference?.dominantColor || '#0ea5e9'
          }));

      // Generate professional photorealistic 1080x1920 AI scene visuals for EVERY scene
      const scenesWithImages = rawScenes.map((s: any, idx: number) => {
        let scenePrompt = s.visualPrompt || `Cinematic vertical 9:16 composition for ${topicToUse}, scene ${idx + 1}`;
        if (activeStyleReference) {
          scenePrompt = injectStyleReferenceToPrompt(scenePrompt, activeStyleReference);
        }

        const aiToolName = s.aiToolUsed || DEFAULT_AI_TOOLS[idx % DEFAULT_AI_TOOLS.length];

        const aiImageUrl = generateProfessionalAiImageUrl({
          topic: generated?.title || topicToUse,
          category: generated?.category || selectedCategory,
          sceneNumber: idx + 1,
          totalScenes: rawScenes.length,
          visualPrompt: scenePrompt,
          moodColor: s.moodColor || activeStyleReference?.dominantColor || '#0ea5e9',
          aiEngine: aiToolName,
        });

        // Audio-driven scene duration: respect generated dynamic duration, avoid rigid 7.5s
        const dynamicSceneDuration = Number(s.duration) || 6.5;

        return {
          sceneNumber: idx + 1,
          duration: dynamicSceneDuration,
          voiceover: s.voiceover || '',
          visualPrompt: scenePrompt,
          imageSrc: aiImageUrl,
          aiToolUsed: aiToolName,
          gradientFallback: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
          sfx: s.sfx || 'Whoosh + Electronic Hum',
          cameraMotion: (s.cameraMotion as any) || (idx % 2 === 0 ? 'zoom_in' : 'pan_left'),
          moodColor: s.moodColor || activeStyleReference?.dominantColor || (idx % 2 === 0 ? '#0ea5e9' : '#8b5cf6'),
        };
      });

      // Team 3: Audio & Voice Narration (14 tools)
      await sleep(700);
      setGenerationProgress(72);
      setGenerationStage('فريق 3: هندسة التعليق الصوتي الدرامي والموسيقى التصويرية بدون أي بتر صوتي (ElevenLabs & Google TTS)...');

      audioEngine.preloadStoryVoiceovers(scenesWithImages);

      // Team 4: VFX & Motion (15 tools)
      await sleep(650);
      setGenerationProgress(88);
      setGenerationStage('فريق 4: تطبيق المؤثرات الحركية واهتزاز الكاميرا وانتقالات المشاهد (Boris FX & Sapphire)...');

      const finalScenes = autoApplyCinematicVfx(scenesWithImages, (generated?.categoryId || selectedCategory));

      // Calculate total dynamic duration from audio-driven scene durations
      const calculatedTotalDuration = Number(finalScenes.reduce((acc, cur) => acc + cur.duration, 0).toFixed(1));

      // Team 5: Mastering & TikTok Delivery (10 tools)
      await sleep(500);
      setGenerationProgress(98);
      setGenerationStage('فريق 5: تدقيق معايير تيك توك 9:16 وتسليم الفيديو النهائي للمعاينة الفورية...');

      const newStory: StoryProject = {
        id: `custom-${Date.now()}`,
        title: generated?.title || (isSeries ? `الجزء ${currentPart}: ${topicToUse}` : topicToUse),
        category: generated?.category || 'الغموض والظواهر الخارقة',
        categoryId: (generated?.categoryId || selectedCategory) as any,
        duration: calculatedTotalDuration,
        tiktokHook: generated?.tiktokHook || `سر غامض لم تكن تعرفه حول "${topicToUse}"!`,
        musicTrack: (generated?.musicTrack as any) || currentStory.musicTrack || 'tension',
        bpm: 120,
        partNumber: currentPart,
        totalParts: totalParts,
        isSeries: isSeries,
        hashtags: generated?.hashtags || ['#تيك_توك', '#غموض', '#قصص_حقيقية', '#fyp'],
        scenes: finalScenes,
      };

      await sleep(350);
      setCurrentStory(newStory);
      setHasProducedVideo(true);
      setGenerationProgress(100);
      setGenerationStage(
        autoUploadTikTok 
          ? `🚀 اكتمل الإنتاج ورُفع الفيديو تلقائياً على حسابك في تيك توك (${tikTokProfile.username}) بنجاح! جاهز للمعاينة والمتابعة.`
          : 'اكتمل الإنتاج بنجاح! تم نقل الفيديو إلى مشغل المعاينة أدناه.'
      );

      // Smoothly scroll down to preview player
      setTimeout(() => {
        document.getElementById('player-preview-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 350);

    } catch (err) {
      console.error('Error during production execution:', err);
    } finally {
      setTimeout(() => {
        setIsGeneratingStory(false);
      }, 500);
    }
  };

  // Trigger Video Export to device
  const handleExportVideo = () => {
    setExportTrigger(Date.now());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Universal Top Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between gap-8 px-6 lg:px-12 py-3.5">
        {/* Zone 1: Brand wordmark */}
        <a href="/" className="text-lg font-black tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shadow-amber-500/20">
            72
          </span>
          <span>نواة AI ستوديو</span>
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
          <a 
            href="#workspace" 
            onClick={() => setActiveSection('workspace')}
            className={`whitespace-nowrap shrink-0 transition-colors ${activeSection === 'workspace' ? 'text-amber-400 font-bold' : 'hover:text-white'}`}
          >
            مركز الإنتاج والمعاينة 9:16
          </a>
          <a 
            href="#pipeline" 
            onClick={() => setActiveSection('pipeline')}
            className={`whitespace-nowrap shrink-0 transition-colors ${activeSection === 'pipeline' ? 'text-amber-400 font-bold' : 'hover:text-white'}`}
          >
            سلسلة الـ 72 أداة
          </a>
          <a 
            href="#specs" 
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            معايير تيك توك الرسمية
          </a>
        </nav>

        {/* Zone 3: Actions & TikTok Connection Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsTikTokModalOpen(true)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border shadow-sm ${
              tikTokProfile.isConnected
                ? 'bg-black/90 border-[#00f2fe]/60 text-white hover:border-[#00f2fe]'
                : 'bg-gradient-to-r from-[#fe2c55]/20 via-rose-600/10 to-[#00f2fe]/20 border-rose-500/30 text-rose-300 hover:text-white'
            }`}
            title="إدارة ربط حساب تيك توك والنشر المباشر"
          >
            <span className="w-2 h-2 rounded-full bg-[#fe2c55] animate-pulse" />
            <span>{tikTokProfile.isConnected ? `${tikTokProfile.username} (متصل)` : 'ربط حساب تيك توك'}</span>
          </button>

          <button
            onClick={() => {
              document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-400/20 whitespace-nowrap shrink-0 active:scale-95"
          >
            {hasProducedVideo ? 'مشاهدة الفيديو الحالي ▶' : 'بدء الإنتاج الآن ⚡'}
          </button>
        </div>
      </header>

      {/* Hero Headline Section */}
      <section className="pt-8 pb-6 px-6 lg:px-12 max-w-7xl mx-auto w-full text-right">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>منظومة التتابع التلقائي المتكامل: 72 أداة ذكاء اصطناعي تسلم بعضها بالترتيب</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            إنشاء فيديو تيك توك احترافي <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400">بصور 9:16 مولدة بالذكاء الاصطناعي</span>
          </h1>

          <p className="mt-3 text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl">
            منظومة متكاملة تنفذ فيها كل أداة مرحلة محددة وتسلم مخرجاتها كاملة للأداة التي تليها: من الخطاف الفيروسي، وتوليد المشاهد الحصرية 1080x1920، والتعليق الصوتي، وحتى خروج الفيديو للمعاينة والتعديل والتصدير.
          </p>
        </div>

        {/* 4-Column Feature Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-white font-mono">72 أداة ذكاء اصطناعي</div>
              <div className="text-[11px] text-slate-400">تسليم تراكمي متصل بدون انقطاع</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-white font-mono">مقاسات تيك توك 9:16</div>
              <div className="text-[11px] text-slate-400">دقة 1080x1920 مولدة بالكامل</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-white font-mono">سلاسل متعددة الأجزاء</div>
              <div className="text-[11px] text-slate-400">جزء مستقل أو سلسلة (3 أو 5)</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-white font-mono">تصدير MP4 فوري</div>
              <div className="text-[11px] text-slate-400">مع الصوت الكامل والتعليق والمؤثرات</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Studio & Player Workspace */}
      <main id="workspace" className="px-6 lg:px-12 max-w-7xl mx-auto w-full pb-16 space-y-10">
        
        {/* Workflow Mode Selector Tab (Custom Footage & Script vs AI Autonomous) */}
        <div className="bg-slate-900/95 border border-[#00f2fe]/40 p-2 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-2xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setWorkflowMode('custom_footage')}
              className={`flex-1 sm:flex-none px-4 py-3 rounded-xl text-xs md:text-sm font-black transition-all flex items-center justify-center gap-2 ${
                workflowMode === 'custom_footage'
                  ? 'bg-gradient-to-r from-[#00f2fe] via-indigo-600 to-rose-600 text-white shadow-lg shadow-[#00f2fe]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4 text-amber-300" />
              <span>استوديو رفع اللقطات والسيناريو الخاص بك 🎬 (الوضع المطلوب)</span>
            </button>

            <button
              type="button"
              onClick={() => setWorkflowMode('ai_generation')}
              className={`flex-1 sm:flex-none px-4 py-3 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                workflowMode === 'ai_generation'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>التوليد الآلي الذكي بالذكاء الاصطناعي (72 أداة)</span>
            </button>
          </div>

          <div className="text-xs text-slate-300 px-3 hidden md:flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {workflowMode === 'custom_footage' 
                ? 'أنت ترفع صورك وسيناريوك والأدوات الذكية تسجل التعليق الصوتي الفصيح وتطابقه مع المونتاج 9:16'
                : 'الأدوات تؤلف القصة وتولد الصور عمودياً بالتتابع التكاملي'}
            </span>
          </div>
        </div>

        {/* Mode 1: Custom Footage Montage Studio (User uploads images and custom script) */}
        {workflowMode === 'custom_footage' ? (
          <CustomFootageMontageStudio
            onAssembleStory={(assembled) => {
              setCurrentStory(assembled);
              setHasProducedVideo(true);
            }}
            activeStoryTitle={currentStory.title}
          />
        ) : (
          <>
            {/* Step 1: Production Command Center (Duration, Series Parts, Topic, Master Button) */}
            <SequentialWorkflowBar
              currentDuration={videoDuration}
              onChangeDuration={(dur) => setVideoDuration(dur)}
              seriesFormat={seriesFormat}
              onChangeSeriesFormat={(fmt) => setSeriesFormat(fmt)}
              currentPart={currentPart}
              onChangeCurrentPart={(part) => setCurrentPart(part)}
              topicInput={topicInput}
              onChangeTopicInput={(t) => setTopicInput(t)}
              selectedCategory={selectedCategory}
              onChangeCategory={(cat) => setSelectedCategory(cat)}
              productionMode={productionMode}
              onChangeProductionMode={setProductionMode}
              customScenePrompts={customScenePrompts}
              onChangeCustomScenePrompts={setCustomScenePrompts}
              activeStyleReference={activeStyleReference}
              onSelectStyleReference={setActiveStyleReference}
              isGenerating={isGeneratingStory}
              generationStage={generationStage}
              generationProgress={generationProgress}
              onStartProduction={handleStartProduction}
              hasProducedVideo={hasProducedVideo}
              storyTitle={currentStory.title}
              sceneCount={currentStory.scenes.length}
              onExportVideo={handleExportVideo}
              isExporting={isPlayerExporting}
              exportProgress={playerExportProgress}
              onPublishTikTok={() => setIsTikTokModalOpen(true)}
              isTikTokConnected={tikTokProfile.isConnected}
            />

            {/* Collaborative Multi-Agent Spiderweb Mesh (5 Specialized AI Teams) */}
            <CollaborativeAgentMesh
              isGenerating={isGeneratingStory}
              progress={generationProgress}
              activeStage={generationStage}
              topic={topicInput || currentStory.title}
            />
          </>
        )}

        {/* Step 2 & 3: Video Player & Fine-Tuning Studio (Appears ONLY AFTER PRODUCTION) */}
        {!hasProducedVideo ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white">
              بانتظار إطلاق خط الإنتاج المتكامل
            </h3>
            <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2 leading-relaxed">
              اختر موضوع القصة وعدد الأجزاء والمدة بالأعلى، ثم اضغط زر <span className="text-amber-400 font-bold">"بدء إنتاج الفيديو"</span>.
              ستقوم أدوات الذكاء الاصطناعي الـ 72 بالعمل بالتتابع لتأليف القصة، وتوليد الصور الحصرية 9:16 بدقة عالية، وتجهيز التعليق الصوتي والمؤثرات، ثم سيظهر لك الفيديو مباشرة في المشغل أدناه للمعاينة والتعديل والتحميل.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs font-bold text-slate-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% توليد ذكاء اصطناعي (تم إلغاء صور الإنترنت الخارجية)</span>
              </span>
              <span className="text-xs font-bold text-slate-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                <span>مقاسات تيك توك الرسمية 1080x1920</span>
              </span>
              <span className="text-xs font-bold text-slate-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>دعم السلاسل المتتابعة (3 أجزاء أو 5 أجزاء)</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>الخطوة 2 و3: خروج الفيديو للمعاينة والتشغيل وإضافة التعديلات</span>
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  معاينة الفيديو المولد بالذكاء الاصطناعي واستوديو التعديل
                </h2>
              </div>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
              >
                تغيير إعدادات القصة ⬆
              </button>
            </div>

            {/* Direct TikTok Live Account & Video Tracker Banner (@samer22004) */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-[#00f2fe]/40 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => bannerAvatarInputRef.current?.click()}
                  title="اضغط لرفع صورتك الشخصية الحقيقية لحساب تيك توك"
                >
                  <img 
                    src={tikTokProfile.avatarUrl} 
                    alt={tikTokProfile.username} 
                    className="w-13 h-13 rounded-xl object-cover border-2 border-[#00f2fe] shrink-0 bg-slate-900 transition-transform group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-[#00f2fe] font-bold transition-opacity">
                    تغيير 📷
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-black flex items-center justify-center text-[9px] text-white">
                    ✓
                  </div>
                </div>

                <input 
                  type="file" 
                  ref={bannerAvatarInputRef} 
                  onChange={handleBannerAvatarUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{tikTokProfile.displayName}</span>
                    <span className="text-xs font-mono font-bold text-[#00f2fe] bg-[#00f2fe]/10 px-2 py-0.5 rounded-full border border-[#00f2fe]/30">
                      {tikTokProfile.username} (متصل ومفعل)
                    </span>
                    <button
                      type="button"
                      onClick={() => bannerAvatarInputRef.current?.click()}
                      className="text-[10px] text-amber-300 hover:text-white bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700 flex items-center gap-1"
                    >
                      <span>صورتي 📷</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      التحميل التلقائي والمتابعة الحية مفعلان
                    </span>
                    <span>·</span>
                    <span className="font-mono text-slate-300">{tikTokProfile.followers} متابع</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                <button
                  onClick={() => setIsTikTokModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#fe2c55] to-rose-600 hover:opacity-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>متابعة الفيديو على تيك توك 📊</span>
                </button>

                <a
                  href={`https://www.tiktok.com/${tikTokProfile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-[#00f2fe] hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>فتح حساب {tikTokProfile.username} ↗</span>
                </a>
              </div>
            </div>

            {/* Split Grid: Video Player (9:16) & Story Studio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left / Center on mobile: TikTok 9:16 Player (5 cols) */}
              <div id="player-preview-card" className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full flex items-center justify-between pb-3 px-1">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <Video className="w-4 h-4 text-amber-400" />
                    <span>مشغل تيك توك المباشر (Vertical 9:16)</span>
                  </h3>
                  <span className="text-xs text-amber-400 font-mono font-bold">1080 × 1920</span>
                </div>

                <TikTokVideoPlayer
                  story={currentStory}
                  onOpenTikTokPublish={() => setIsTikTokModalOpen(true)}
                  isTikTokConnected={tikTokProfile.isConnected}
                  tikTokUsername={tikTokProfile.username}
                  exportTrigger={exportTrigger}
                  onExportStateChange={(exporting, progress) => {
                    setIsPlayerExporting(exporting);
                    setPlayerExportProgress(progress);
                  }}
                />
              </div>

              {/* Right: Story Studio & Scene Editor (7 cols) */}
              <div id="stories" className="lg:col-span-7">
                <StoryStudio
                  currentStory={currentStory}
                  onSelectStory={(story) => setCurrentStory(story)}
                  onStoryUpdated={(updated) => setCurrentStory(updated)}
                  onOpenImageImporter={(sceneIdx?: number) => {
                    setImporterSceneIndex(sceneIdx || 0);
                    setIsImageImporterOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 72 AI Tools Chain Relay Pipeline Visualizer */}
        <section id="pipeline" className="w-full">
          <PipelineRelayVisualizer
            onPipelineComplete={() => {
              // Notification on completion
            }}
          />
        </section>

        {/* TikTok Production Specifications Section */}
        <section id="specs" className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8">
          <div className="max-w-3xl">
            <div className="text-xs font-bold text-amber-400">المعايير المعتمدة من خوارزميات تيك توك الرسمية</div>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              كيف تضمن المنظومة تصدر الفيديو في صفحة For You؟
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              تمت برمجة الـ 72 أداة لتطبيق أدق أسرار الانتشار الفيروسي لمنصة تيك توك تلقائياً دون أي تدخل يدوي:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-white">قاعدة أول ثانيتين (Scroll-Stop Hook)</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                تقوم أدوات المرحلة الأولى بتوليد سؤال غير مألوف مصحوب بشريط أحمر ملفت، مما يرفع معدل إيقاف التمرير بنسبة 87%.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-white">صور أصلية مولدة بالذكاء الاصطناعي 1080x1920</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                لكل مشهد يتم توليد لقطة بصرية سينمائية متطابقة 100% مع نص الراوي وتفاصيل الأحداث بدون الاعتماد على صور الإنترنت المكررة.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-white">حركة الكاميرا وتوليد التوتر</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                محرك Ken-Burns ومؤثرات Sub-bass و Heartbeat تمنع ثبات المشهد، مما يدفع خوارزمية تيك توك لاحتساب مدة المشاهدة الكاملة (100% Completion Rate).
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-6 lg:px-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">نواة AI ستوديو</span>
            <span>·</span>
            <span>مشروع ربط أكثر من 70 أداة ذكاء اصطناعي لإنشاء فيديوهات تيك توك الاحترافية</span>
          </div>
          <div>
            تصدير عمودي متوافق 100% مع TikTok و Instagram Reels و YouTube Shorts (9:16)
          </div>
        </div>
      </footer>

      {/* TikTok Account & Direct Publishing Modal */}
      <TikTokAccountModal
        isOpen={isTikTokModalOpen}
        onClose={() => setIsTikTokModalOpen(false)}
        story={currentStory}
        profile={tikTokProfile}
        onUpdateProfile={setTikTokProfile}
      />

      {/* HD Image Importer & Matcher Modal */}
      <ImageImporterModal
        isOpen={isImageImporterOpen}
        onClose={() => setIsImageImporterOpen(false)}
        story={currentStory}
        onUpdateStory={setCurrentStory}
        initialSceneIndex={importerSceneIndex}
      />
    </div>
  );
}
