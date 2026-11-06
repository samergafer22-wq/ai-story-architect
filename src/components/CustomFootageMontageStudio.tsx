import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Film, 
  Volume2, 
  Sparkles, 
  Play, 
  Trash2, 
  Plus, 
  FileText, 
  Sliders, 
  CheckCircle2, 
  Wand2, 
  Music, 
  ArrowRight,
  Split,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  Copy,
  ClipboardPaste,
  Clipboard,
  Check,
  Eraser
} from 'lucide-react';
import { SceneItem, StoryProject } from '../data/storyLibrary';
import { autoApplyCinematicVfx } from '../utils/cinematicVfxEngine';
import { audioEngine } from '../utils/audioEngine';

// Robust Arabic & Multi-lingual Script Splitter into Scene Segments
export function parseScriptIntoScenes(rawText: string, maxScenes: number = 8): string[] {
  if (!rawText || !rawText.trim()) return [];
  const text = rawText.trim();

  // 1. Check for lines or numbered segments like (1., المشهد الأول, [المشهد 1], etc.)
  let lines = text
    .split(/\r?\n+/)
    .map(l => l.replace(/^(\d+[\.\-\)]|\u0627\u0644\u0645\u0634\u0647\u062f\s*\d*[:\-]?|مشهد\s*\d*[:\-]?|Scene\s*\d*[:\-]?|\[.*?\])\s*/i, '').trim())
    .filter(l => l.length > 0);

  if (lines.length >= 2) {
    return lines.slice(0, maxScenes);
  }

  // 2. Try punctuation split (Periods, exclamation marks, question marks, Arabic comma, English comma)
  let sentences = text
    .split(/(?:[\.\!\u06D4\u061F\?]+|[\u060C\,]\s+)/)
    .map(s => s.trim())
    .filter(s => s.length > 4);

  if (sentences.length >= 2) {
    return sentences.slice(0, maxScenes);
  }

  // 3. Fallback: Split by word chunks (e.g. 10-18 words per scene)
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length > 8) {
    const targetCount = Math.min(maxScenes, Math.max(3, Math.ceil(words.length / 14)));
    const wordsPerScene = Math.ceil(words.length / targetCount);
    const result: string[] = [];
    for (let i = 0; i < words.length; i += wordsPerScene) {
      result.push(words.slice(i, i + wordsPerScene).join(' '));
    }
    return result.slice(0, maxScenes);
  }

  return [text];
}

export interface CustomSceneAsset {
  id: string;
  imageSrc: string;
  imageName: string;
  scriptText: string;
  duration?: number;
  cameraMotion?: 'zoom_in' | 'zoom_out' | 'pan_left' | 'pan_right' | 'shake';
  vfxEffect?: 'glow_bloom' | 'light_leaks' | 'fire_embers' | 'film_grain' | 'cyber_scanline';
  sfx?: string;
}

interface CustomFootageMontageStudioProps {
  onAssembleStory: (assembledStory: StoryProject) => void;
  activeStoryTitle?: string;
}

export const CustomFootageMontageStudio: React.FC<CustomFootageMontageStudioProps> = ({
  onAssembleStory,
  activeStoryTitle = 'مشروعي المخصص',
}) => {
  const [projectTitle, setProjectTitle] = useState<string>(activeStoryTitle || 'مشروع الفيديو والسيناريو الخاص بي');
  const [scenes, setScenes] = useState<CustomSceneAsset[]>([
    {
      id: 'sc-1',
      imageSrc: '/assets/images/airplane_night_storm_1793883816135.jpg',
      imageName: 'المشهد الأول (البداية)',
      scriptText: 'في ليلة عاصفة ومظلمة، بدأت الأحداث تتسارع بشكل غير مسبوق في قلب المحيط.',
      cameraMotion: 'zoom_in',
      vfxEffect: 'light_leaks',
      sfx: 'Whoosh + Cinematic Impact'
    },
    {
      id: 'sc-2',
      imageSrc: '/assets/images/airplane_cockpit_night_1793883725150.jpg',
      imageName: 'المشهد الثاني (التصاعد)',
      scriptText: 'سجلت أجهزة الرادار إشارات مريبة ومجهولة المصدر أثارت حيرة جميع المتابعين على الفور.',
      cameraMotion: 'pan_left',
      vfxEffect: 'glow_bloom',
      sfx: 'Radar Ping + Digital Static'
    },
    {
      id: 'sc-3',
      imageSrc: '/assets/images/classified_radar_dossier_1793883832867.jpg',
      imageName: 'المشهد الثالث (السر المخفي)',
      scriptText: 'كشفت الوثائق السرية لاحقاً عن حقائق مذهلة جرى التكتم عليها لتفادي إثارة الرأي العام.',
      cameraMotion: 'zoom_in',
      vfxEffect: 'fire_embers',
      sfx: 'Sub Bass Drop + Sonar'
    },
    {
      id: 'sc-4',
      imageSrc: '/assets/images/deep_sea_submarine_1793883762254.jpg',
      imageName: 'المشهد الرابع (الخاتمة)',
      scriptText: 'برأيك الخاص، ما هو السر الحقيقي وراء هذه القصة؟ اكتب رأيك بالتعليقات وتابعنا للمزيد!',
      cameraMotion: 'shake',
      vfxEffect: 'film_grain',
      sfx: 'Grand Orchestral Finale Hit'
    }
  ]);

  const [musicTrack, setMusicTrack] = useState<'tension' | 'epic' | 'cyber' | 'ambient' | 'horror'>('tension');
  const [isAssembling, setIsAssembling] = useState<boolean>(false);
  const [assemblyStage, setAssemblyStage] = useState<string>('');
  const [fullScriptInput, setFullScriptInput] = useState<string>('');
  const [showScriptSplitter, setShowScriptSplitter] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const batchFileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Single Scene Image Upload
  const handleSingleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setScenes(prev => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            imageSrc: dataUrl,
            imageName: file.name
          };
          return updated;
        });
        showToast(`📷 تم رفع صورة المشهد ${index + 1} بنجاح!`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Batch Multi-Image Upload (Drop or select 2 to 8 images at once)
  const handleBatchImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).slice(0, 8);
    const loadedImages: { url: string; name: string }[] = [];

    let processedCount = 0;
    fileList.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          loadedImages[idx] = { url: dataUrl, name: file.name };
        }
        processedCount++;

        if (processedCount === fileList.length) {
          setScenes(prev => {
            return loadedImages.map((img, i) => {
              const existing = prev[i];
              return {
                id: `custom-sc-${i + 1}-${Date.now()}`,
                imageSrc: img.url,
                imageName: img.name,
                scriptText: existing?.scriptText || (i === loadedImages.length - 1 ? 'ما رأيك في هذه القصة؟ شاركنا نظريتك بالتعليقات!' : `نص المشهد رقم ${i + 1} هنا...`),
                cameraMotion: i % 2 === 0 ? 'zoom_in' : 'pan_left',
                vfxEffect: i === 0 ? 'light_leaks' : i === loadedImages.length - 1 ? 'fire_embers' : 'glow_bloom',
                sfx: i === 0 ? 'Whoosh + Cinematic Impact' : 'Sub Bass Drop + Sonar'
              };
            });
          });
          showToast(`📁 تم رفع وتحديث صور ${fileList.length} مشاهد بنجاح!`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Helper to apply parsed strings to scenes
  const applyParsedScenes = (parsedParts: string[]) => {
    if (!parsedParts || parsedParts.length === 0) return;

    setScenes(prev => {
      const count = Math.min(8, Math.max(prev.length, parsedParts.length));
      const defaultImages = [
        '/assets/images/airplane_night_storm_1793883816135.jpg',
        '/assets/images/airplane_cockpit_night_1793883725150.jpg',
        '/assets/images/classified_radar_dossier_1793883832867.jpg',
        '/assets/images/deep_sea_submarine_1793883762254.jpg',
        '/assets/images/scene_ancient_desert_portal_1793668725427.jpg',
        '/assets/images/airplane_night_storm_1793883816135.jpg',
        '/assets/images/airplane_cockpit_night_1793883725150.jpg',
        '/assets/images/deep_sea_submarine_1793883762254.jpg',
      ];

      const newScenes: CustomSceneAsset[] = [];
      for (let i = 0; i < count; i++) {
        const existing = prev[i];
        newScenes.push({
          id: existing?.id || `custom-sc-${i + 1}-${Date.now()}`,
          imageSrc: existing?.imageSrc || defaultImages[i % defaultImages.length],
          imageName: existing?.imageName || `لقطة المشهد ${i + 1}`,
          scriptText: parsedParts[i] || existing?.scriptText || `نص المشهد ${i + 1}`,
          cameraMotion: existing?.cameraMotion || (i % 2 === 0 ? 'zoom_in' : 'pan_left'),
          vfxEffect: existing?.vfxEffect || (i === 0 ? 'light_leaks' : 'glow_bloom'),
          sfx: existing?.sfx || (i === 0 ? 'Whoosh + Cinematic Impact' : 'Sub Bass Drop + Sonar')
        });
      }
      return newScenes;
    });
  };

  // 1-Click Paste from Clipboard (reads clipboard and distributes immediately)
  const handlePasteFullScriptFromClipboard = async () => {
    try {
      let text = '';
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
        text = await navigator.clipboard.readText();
      }
      
      if (!text || !text.trim()) {
        const fallback = window.prompt('الصق السيناريو كاملاً هنا:', fullScriptInput);
        text = fallback || '';
      }

      if (text && text.trim()) {
        setFullScriptInput(text);
        const parsed = parseScriptIntoScenes(text, 8);
        if (parsed.length > 0) {
          applyParsedScenes(parsed);
          showToast(`✅ تم نسخ ولصق السيناريو من الحافظة وتوزيعه بنجاح على ${parsed.length} مشاهد!`);
          setShowScriptSplitter(false);
        } else {
          showToast('✅ تم لصق النص في محرر السيناريو.');
          setShowScriptSplitter(true);
        }
      } else {
        showToast('⚠️ الحافظة فارغة! يرجى نسخ النص أولاً ثم الضغط على زر اللصق.');
      }
    } catch (err) {
      console.warn('Clipboard read permission denied or unavailable:', err);
      const fallback = window.prompt('يرجى لصق السيناريو هنا:', fullScriptInput);
      if (fallback && fallback.trim()) {
        setFullScriptInput(fallback);
        const parsed = parseScriptIntoScenes(fallback, 8);
        applyParsedScenes(parsed);
        showToast(`✅ تم لصق السيناريو وتوزيعه بنجاح على ${parsed.length} مشاهد!`);
        setShowScriptSplitter(false);
      }
    }
  };

  // Copy Full Script to Clipboard
  const handleCopyFullScript = async () => {
    const fullText = scenes.map((s, idx) => `المشهد ${idx + 1}:\n${s.scriptText}`).join('\n\n');
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullText);
        showToast('📋 تم نسخ نصوص جميع المشاهد إلى الحافظة بنجاح!');
      } else {
        showToast('تم نسخ السيناريو!');
      }
    } catch (e) {
      showToast('تعذر النسخ التلقائي');
    }
  };

  // Per-scene paste
  const handlePasteSceneText = async (idx: number) => {
    try {
      let text = '';
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
        text = await navigator.clipboard.readText();
      }
      if (!text || !text.trim()) {
        const fallback = window.prompt(`الصق نص المشهد ${idx + 1}:`, scenes[idx]?.scriptText || '');
        text = fallback || '';
      }
      if (text && text.trim()) {
        setScenes(prev => {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], scriptText: text.trim() };
          return updated;
        });
        showToast(`✅ تم لصق النص في المشهد ${idx + 1}!`);
      }
    } catch (e) {
      const fallback = window.prompt(`الصق نص المشهد ${idx + 1}:`, scenes[idx]?.scriptText || '');
      if (fallback && fallback.trim()) {
        setScenes(prev => {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], scriptText: fallback.trim() };
          return updated;
        });
        showToast(`✅ تم لصق النص في المشهد ${idx + 1}!`);
      }
    }
  };

  // Per-scene copy
  const handleCopySceneText = async (idx: number) => {
    const text = scenes[idx]?.scriptText || '';
    if (!text) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showToast(`📋 تم نسخ نص المشهد ${idx + 1} إلى الحافظة!`);
      }
    } catch (e) {
      // ignore
    }
  };

  // Per-scene clear
  const handleClearSceneText = (idx: number) => {
    setScenes(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], scriptText: '' };
      return updated;
    });
    showToast(`🧹 تم تفريغ نص المشهد ${idx + 1}`);
  };

  // Split pasted full script manually
  const handleSplitScript = () => {
    if (!fullScriptInput.trim()) {
      showToast('⚠️ يرجى كتابة أو لصق نص أولاً في المربع أدناه.');
      return;
    }

    const parsed = parseScriptIntoScenes(fullScriptInput, 8);
    if (parsed.length === 0) {
      showToast('⚠️ لم يتم العثور على جمل صالحة للتقسيم.');
      return;
    }

    applyParsedScenes(parsed);
    showToast(`✅ تم تقسيم السيناريو وتوزيعه بنجاح على ${parsed.length} مشاهد!`);
    setShowScriptSplitter(false);
  };

  // Ready-to-use sample script templates
  const handleLoadSampleScript = (topicKey: 'mystery' | 'history') => {
    const samples = {
      mystery: [
        'في سكون الليل المظلم، انطلقت رحلة الطيران المجهولة فوق مياه المحيط العميقة.',
        'فجأة وبدون سابق إنذار، انقطعت إشارات الرادار واختفى أثر الطائرة تماماً عن شاشات المراقبة.',
        'كشفت الوثائق السرية لاحقاً عن إشارات استغاثة مشفرة وصلت من قاع خندق ماريانا الغامض.',
        'ما هو التفسير الحقيقي برأيك لما حدث للطاقم؟ اكتب تحليلك بالتعليقات وشاركنا رأيك!'
      ],
      history: [
        'قبل آلاف السنين، شُيدت مدينة إرم ذات العماد في قلب صحراء الربع الخالي الشاسعة.',
        'تميزت المدينة بقصور ذهبية وأعمدة ضخمة لم يُخلق مثلها في البلاد القديمة.',
        'ثم في ليلة واحدة عصفت ريح صرصر عاتية طمرت الحضارة بأكملها تحت رمال الزمن.',
        'هل تعتقد أن البعثات الاستكشافية ستعثر يوماً على بقايا هذه المدينة المفقودة؟ شاركنا رأيك!'
      ]
    };

    const parts = samples[topicKey];
    applyParsedScenes(parts);
    showToast(`✨ تم تحميل سيناريو "${topicKey === 'mystery' ? 'لغز الطيران الغامض' : 'مدينة إرم المفقودة'}" وتوزيعه على 4 مشاهد!`);
    setShowScriptSplitter(false);
  };

  const handleAddScene = () => {
    if (scenes.length < 8) {
      setScenes(prev => [
        ...prev,
        {
          id: `sc-${prev.length + 1}-${Date.now()}`,
          imageSrc: '/assets/images/scene_ancient_desert_portal_1793668725427.jpg',
          imageName: `المشهد الجديد (${prev.length + 1})`,
          scriptText: 'اكتب نص التعليق الصوتي لهذا المشهد هنا...',
          cameraMotion: 'zoom_in',
          vfxEffect: 'glow_bloom',
          sfx: 'Whoosh + Cinematic Impact'
        }
      ]);
    }
  };

  const handleRemoveScene = (index: number) => {
    if (scenes.length > 2) {
      setScenes(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Master Assemble & Montage Execution
  const handleAssembleAndMontage = async () => {
    setIsAssembling(true);
    setAssemblyStage('فحص اللقطات والسيناريو المرفوع...');

    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

    try {
      await sleep(400);
      setAssemblyStage('هندسة التعليق الصوتي وتوليد النطق العربي الصافي لكل مشهد...');

      // Calculate audio-driven durations for each scene
      const preparedScenes: SceneItem[] = scenes.map((s, idx) => {
        const text = s.scriptText.trim();
        const wordCount = text.split(/\s+/).length;
        // Dynamic duration based on speech words + breathing room
        const duration = Math.max(4.5, Math.min(9.5, Number((wordCount * 0.28 + 0.8).toFixed(1))));

        return {
          sceneNumber: idx + 1,
          duration,
          voiceover: text,
          visualPrompt: `User custom shot: ${s.imageName}`,
          imageSrc: s.imageSrc,
          aiToolUsed: 'محرك المونتاج الآلي وتوليد التعليق الصوتي',
          sfx: s.sfx || (idx === 0 ? 'Whoosh + Cinematic Impact' : 'Sub Bass Drop + Sonar'),
          cameraMotion: s.cameraMotion || (idx % 2 === 0 ? 'zoom_in' : 'pan_left'),
          moodColor: idx % 2 === 0 ? '#0ea5e9' : '#8b5cf6',
          vfxEffect: s.vfxEffect || (idx === 0 ? 'light_leaks' : 'glow_bloom'),
          transitionType: idx === 0 ? 'flash_white' : 'zoom_warp',
          shakeIntensity: s.cameraMotion === 'shake' ? 'tremor' : 'subtle',
          gradientFallback: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)'
        };
      });

      await sleep(500);
      setAssemblyStage('تطبيق مؤثرات الحركة والكاميرا Ken-Burns وانتقالات Zoom-Warp...');

      // Preload voiceovers into audio engine
      audioEngine.preloadStoryVoiceovers(preparedScenes);

      await sleep(400);
      setAssemblyStage('مزامنة الموسيقى التصويرية ومطابقة توقيت المشاهد 9:16 بدقة...');

      const totalVideoDur = Number(preparedScenes.reduce((acc, cur) => acc + cur.duration, 0).toFixed(1));

      const newStory: StoryProject = {
        id: `custom-user-project-${Date.now()}`,
        title: projectTitle.trim() || 'فيديو مخصص من صانع المحتوى',
        category: 'الغموض والظواهر الخارقة',
        categoryId: 'mystery',
        duration: totalVideoDur,
        tiktokHook: scenes[0]?.scriptText?.slice(0, 70) || 'شاهد ما حدث حتى اللحظة الأخيرة!',
        musicTrack,
        bpm: 120,
        partNumber: 1,
        totalParts: 1,
        isSeries: false,
        hashtags: ['#تيك_توك', '#مونتاج_خاص', '#قصص', '#fyp'],
        scenes: preparedScenes
      };

      await sleep(350);
      onAssembleStory(newStory);

      // Smooth scroll to preview player
      setTimeout(() => {
        document.getElementById('player-preview-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 250);

    } catch (err) {
      console.error('Error during custom montage assembly:', err);
    } finally {
      setIsAssembling(false);
    }
  };

  return (
    <div className="bg-slate-900/95 border border-[#00f2fe]/40 rounded-3xl p-5 md:p-7 shadow-2xl backdrop-blur-md text-right font-sans space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#00f2fe]">
            <Film className="w-4 h-4 text-[#00f2fe]" />
            <span>استوديو المونتاج المخصص: أنت تحمّل اللقطات والسيناريو · والأدوات تعمل التعليق الصوتي والمونتاج</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            رفع لقطاتك وسيناريوك الخاص والمونتاج الآلي
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            حمّل صورك أو فيديوهاتك الخاصة من جهازك لكل مشهد، واكتب السيناريو الذي تريده. ستقوم الأدوات الذكية بتسجيل التعليق الصوتي العربي ومطابقته بدقة ومونتاج اللقطات بمؤثرات سينمائية 9:16.
          </p>
        </div>

        {/* Global Batch Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <input 
            type="file" 
            ref={batchFileInputRef} 
            onChange={handleBatchImageUpload} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />

          <button
            type="button"
            onClick={() => batchFileInputRef.current?.click()}
            className="px-3.5 py-2 bg-gradient-to-r from-[#00f2fe] to-indigo-600 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-[#00f2fe]/20 active:scale-95 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>رفع دفعة صور لجميع المشاهد 📁</span>
          </button>

          {/* 1-Click Direct Paste from Clipboard Button */}
          <button
            type="button"
            onClick={handlePasteFullScriptFromClipboard}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-400/20 active:scale-95 transition-all"
            title="لصق النص المنسوخ من الحافظة وتوزيعه تلقائياً على المشاهد"
          >
            <ClipboardPaste className="w-4 h-4 text-slate-950" />
            <span>لصق السيناريو من الحافظة 📋</span>
          </button>

          {/* Copy Full Script Button */}
          <button
            type="button"
            onClick={handleCopyFullScript}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors active:scale-95"
            title="نسخ سيناريو كافة المشاهد الحالية"
          >
            <Copy className="w-3.5 h-3.5 text-slate-300" />
            <span>نسخ السيناريو 📄</span>
          </button>

          {/* Manual Editor Toggle */}
          <button
            type="button"
            onClick={() => setShowScriptSplitter(!showScriptSplitter)}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-[#00f2fe] text-xs font-bold rounded-xl border border-[#00f2fe]/30 flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>محرر السيناريو 📝</span>
          </button>
        </div>
      </div>

      {/* Floating Status Notification Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-xs font-bold text-emerald-300 flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            type="button"
            onClick={() => setToastMessage(null)} 
            className="text-emerald-400 hover:text-white text-xs px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Project Title & Music Soundtrack Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-3.5">
          <label className="text-xs font-bold text-slate-300 block mb-1.5">
            عنوان الفيديو أو القصة:
          </label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="اكتب عنواناً جذاباً للفيديو..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f2fe]"
          />
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5">
          <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
            <span>الموسيقى التصويرية:</span>
            <Music className="w-3.5 h-3.5 text-amber-400" />
          </label>
          <select
            value={musicTrack}
            onChange={(e) => setMusicTrack(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
          >
            <option value="tension">تشويق وغموض وضربات قلب (Tension Heartbeat)</option>
            <option value="epic">ملحمية وأوركسترا كبرى (Grand Epic)</option>
            <option value="cyber">سايبربانك ونبضات إلكترونية (Cyber Rhythmic)</option>
            <option value="horror">رعب وأوتار غامضة (Dark Atmosphere)</option>
            <option value="ambient">هادئة وثائقية (Documentary Ambient)</option>
          </select>
        </div>
      </div>

      {/* Full Script Splitter Dropdown Modal / Drawer */}
      {showScriptSplitter && (
        <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-4 space-y-3.5 animate-in fade-in duration-200 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Split className="w-4 h-4 text-amber-400" />
              <span>الصق السيناريو الكامل هنا ليقوم المحرك بتوزيعه وتقسيمه على المشاهد تلقائياً:</span>
            </span>
            <button
              onClick={() => setShowScriptSplitter(false)}
              className="text-xs text-slate-400 hover:text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
            >
              إغلاق ✕
            </button>
          </div>

          <textarea
            value={fullScriptInput}
            onChange={(e) => setFullScriptInput(e.target.value)}
            rows={4}
            placeholder="الصق نص السيناريو كاملاً هنا. افصل بين كل مشهد بسطر جديد أو نقطة أو فاصلة..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
            {/* Quick Demo Templates */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-bold">نماذج سريعة:</span>
              <button
                type="button"
                onClick={() => handleLoadSampleScript('mystery')}
                className="text-[10px] text-amber-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-1 rounded-lg transition-colors"
              >
                ✈️ قصة رحلة الطيران
              </button>
              <button
                type="button"
                onClick={() => handleLoadSampleScript('history')}
                className="text-[10px] text-indigo-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-1 rounded-lg transition-colors"
              >
                🏛️ قصة مدينة إرم المفقودة
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteFullScriptFromClipboard}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>لصق من الحافظة</span>
              </button>

              <button
                type="button"
                onClick={handleSplitScript}
                disabled={!fullScriptInput.trim()}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow disabled:opacity-50 active:scale-95 transition-all"
              >
                <Split className="w-3.5 h-3.5" />
                <span>تقسيم النص على المشاهد فوراً ⚡</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scene Asset Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Film className="w-4 h-4 text-amber-400" />
            <span>مشاهد الفيديو ({scenes.length} مشاهد) — اضغط على أي صورة لتغييرها من جهازك:</span>
          </span>
          <button
            type="button"
            onClick={handleAddScene}
            disabled={scenes.length >= 8}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-[#00f2fe] text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1 disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة مشهد جديد ({scenes.length}/8)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {scenes.map((scene, idx) => (
            <div 
              key={scene.id} 
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-lg relative group"
            >
              {/* Scene Top Details */}
              <div className="flex items-start gap-3">
                {/* 9:16 Vertical Thumbnail with Single Upload Trigger */}
                <label className="relative w-20 aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 cursor-pointer shrink-0 shadow-md group/img">
                  <img 
                    src={scene.imageSrc} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform group-hover/img:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 text-center text-[#00f2fe] text-[9px] font-bold">
                    <Upload className="w-4 h-4 mb-0.5" />
                    <span>تغيير الصورة</span>
                  </div>
                  <div className="absolute top-1 right-1 bg-black/80 text-white font-mono text-[9px] font-bold px-1.5 rounded">
                    #{idx + 1}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleSingleImageUpload(idx, e)} 
                    className="hidden" 
                  />
                </label>

                {/* Script Voiceover Text Box */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-amber-400">نص المشهد {idx + 1}:</span>
                    
                    {/* Scene Script Quick Tools: Paste, Copy, Clear, Remove */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePasteSceneText(idx)}
                        className="text-[10px] text-[#00f2fe] hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors"
                        title="لصق النص من الحافظة في هذا المشهد"
                      >
                        <ClipboardPaste className="w-3 h-3" />
                        <span>لصق</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopySceneText(idx)}
                        className="text-[10px] text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors"
                        title="نسخ نص هذا المشهد"
                      >
                        <Copy className="w-3 h-3" />
                        <span>نسخ</span>
                      </button>

                      {scene.scriptText && (
                        <button
                          type="button"
                          onClick={() => handleClearSceneText(idx)}
                          className="text-[10px] text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-colors"
                          title="مسح نص المشهد"
                        >
                          <Eraser className="w-3 h-3" />
                          <span>مسح</span>
                        </button>
                      )}

                      {scenes.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveScene(idx)}
                          className="text-slate-500 hover:text-rose-400 mr-1"
                          title="حذف هذا المشهد"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    value={scene.scriptText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setScenes(prev => {
                        const updated = [...prev];
                        updated[idx] = { ...updated[idx], scriptText: val };
                        return updated;
                      });
                    }}
                    rows={3}
                    placeholder="اكتب أو الصق التعليق الصوتي للمشهد هنا..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-[#00f2fe] leading-relaxed resize-none"
                  />
                </div>
              </div>

              {/* Montage Parameters per Scene (Camera Motion + VFX) */}
              <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold">حركة الكاميرا:</span>
                  <select
                    value={scene.cameraMotion || 'zoom_in'}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setScenes(prev => {
                        const updated = [...prev];
                        updated[idx] = { ...updated[idx], cameraMotion: val };
                        return updated;
                      });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 font-mono"
                  >
                    <option value="zoom_in">تكبير سينمائي (Zoom In)</option>
                    <option value="zoom_out">ابتعاد واسع (Zoom Out)</option>
                    <option value="pan_left">تحريك يسار (Pan Left)</option>
                    <option value="pan_right">تحريك يمين (Pan Right)</option>
                    <option value="shake">اهتزاز درامي (Camera Shake)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold">المؤثر:</span>
                  <select
                    value={scene.vfxEffect || 'glow_bloom'}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setScenes(prev => {
                        const updated = [...prev];
                        updated[idx] = { ...updated[idx], vfxEffect: val };
                        return updated;
                      });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 font-mono"
                  >
                    <option value="glow_bloom">توهج (Glow)</option>
                    <option value="light_leaks">تسرب ضوء (Light Leak)</option>
                    <option value="fire_embers">جمر وشرار (Embers)</option>
                    <option value="film_grain">حبيبات 35mm (Film Grain)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Assembly Progress Box */}
      {isAssembling && (
        <div className="p-4 bg-slate-950 border border-amber-500/50 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-300">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>جاري المونتاج الآلي: {assemblyStage}</span>
            </span>
            <span className="text-emerald-400 font-mono">جاري المعالجة...</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00f2fe] via-amber-400 to-rose-500 animate-pulse w-full" />
          </div>
        </div>
      )}

      {/* MASTER ASSEMBLE ACTION BUTTON */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleAssembleAndMontage}
          disabled={isAssembling}
          className="w-full py-4 bg-gradient-to-r from-[#00f2fe] via-indigo-600 to-rose-600 hover:opacity-95 text-white font-black text-sm md:text-base rounded-2xl flex items-center justify-center gap-2.5 shadow-2xl shadow-[#00f2fe]/20 active:scale-98 transition-all disabled:opacity-50"
        >
          {isAssembling ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>جاري تسجيل التعليق الصوتي الصافي ومونتاج اللقطات...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>
                🎬 تشغيل المونتاج الآلي وتسجيل التعليق الصوتي ومطابقة المشاهد ({scenes.length} مشاهد)
              </span>
            </>
          )}
        </button>
        <div className="mt-2 text-center text-[11px] text-slate-400">
          توليد تعليق صوتي فصيح بدون أي بتر + مونتاج سينمائي + مطابقة التوقيت + تصدير فوري لمشغل المعاينة 9:16
        </div>
      </div>
    </div>
  );
};
