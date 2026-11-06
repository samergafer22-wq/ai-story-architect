import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Globe, 
  Link as LinkIcon, 
  Check, 
  CheckCircle2, 
  Layers, 
  Film, 
  ExternalLink,
  Zap,
  ArrowRight,
  Filter,
  Image as ImageIcon
} from 'lucide-react';
import { 
  InternetPhoto, 
  INTERNET_PHOTO_CATEGORIES, 
  searchInternetImages, 
  searchInternetImagesAsync,
  autoMatchAllScenes 
} from '../utils/internetImageSearch';
import { StoryProject } from '../data/storyLibrary';

interface ImageImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryProject;
  onUpdateStory: (updatedStory: StoryProject) => void;
  initialSceneIndex?: number;
}

const QUICK_TOPIC_SUGGESTIONS = [
  { label: 'أهرامات الفراعنة 🏺', q: 'أهرامات' },
  { label: 'سور الصين العظيم 🏯', q: 'سور الصين' },
  { label: 'خندق ماريانا والأعماق 🌊', q: 'خندق ماريانا' },
  { label: 'طائرة ورحلة 370 ✈️', q: 'طائرة' },
  { label: 'إيلون ماسك وتكنولوجيا ⚡', q: 'إيلون ماسك' },
  { label: 'سبائك الذهب والخزائن 💰', q: 'ذهب' },
  { label: 'الفضاء والمجرات 🚀', q: 'فضاء' },
  { label: 'براكين وثورات 🌋', q: 'بركان' },
  { label: 'روما والكولوسيوم 🏛️', q: 'كولوسيوم' },
];

export const ImageImporterModal: React.FC<ImageImporterModalProps> = ({
  isOpen,
  onClose,
  story,
  onUpdateStory,
  initialSceneIndex = 0,
}) => {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(initialSceneIndex);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [customUrlPreviewError, setCustomUrlPreviewError] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAutoMatching, setIsAutoMatching] = useState<boolean>(false);
  const [photosList, setPhotosList] = useState<InternetPhoto[]>(() => searchInternetImages('', 'all'));
  const [isLoadingPhotos, setIsLoadingPhotos] = useState<boolean>(false);

  // Trigger live search whenever query or category changes
  React.useEffect(() => {
    let isCancelled = false;
    setIsLoadingPhotos(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchInternetImagesAsync(searchQuery, activeCategory);
        if (!isCancelled) {
          setPhotosList(results);
        }
      } catch (err) {
        if (!isCancelled) {
          setPhotosList(searchInternetImages(searchQuery, activeCategory));
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingPhotos(false);
        }
      }
    }, 180);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, activeCategory]);

  if (!isOpen) return null;

  const activeScene = story.scenes[selectedSceneIndex] || story.scenes[0];
  const photos = photosList;

  // Apply a specific internet photo to the currently selected scene
  const handleApplyPhotoToScene = (photo: InternetPhoto, targetIndex: number) => {
    const updatedScenes = [...story.scenes];
    if (updatedScenes[targetIndex]) {
      updatedScenes[targetIndex] = {
        ...updatedScenes[targetIndex],
        imageSrc: photo.url,
        aiToolUsed: `Internet HD Match · ${photo.title}`,
      };

      const updatedStory: StoryProject = {
        ...story,
        scenes: updatedScenes,
      };

      onUpdateStory(updatedStory);
      setToastMessage(`✓ تم تعيين صورة "${photo.title}" للمشهد رقم ${targetIndex + 1} بنجاح!`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // 1-Click Auto-Match All 8 Scenes from internet photos
  const handleAutoMatchAll = () => {
    setIsAutoMatching(true);
    setToastMessage(null);

    setTimeout(() => {
      const matches = autoMatchAllScenes(story.scenes, story.category);
      const updatedScenes = [...story.scenes];

      matches.forEach(m => {
        if (updatedScenes[m.sceneIndex]) {
          updatedScenes[m.sceneIndex] = {
            ...updatedScenes[m.sceneIndex],
            imageSrc: m.matchedPhoto.url,
            aiToolUsed: `Internet HD Match · ${m.matchedPhoto.title}`,
          };
        }
      });

      const updatedStory: StoryProject = {
        ...story,
        scenes: updatedScenes,
      };

      onUpdateStory(updatedStory);
      setIsAutoMatching(false);
      setToastMessage('✨ تمت مطابقة جميع المشاهد الـ 8 بصور سينمائية فائقة الجودة من الإنترنت بنجاح!');
      setTimeout(() => setToastMessage(null), 4000);
    }, 450);
  };

  // Apply custom URL
  const handleApplyCustomUrl = (targetIndex: number) => {
    if (!customImageUrl.trim()) return;

    const updatedScenes = [...story.scenes];
    if (updatedScenes[targetIndex]) {
      updatedScenes[targetIndex] = {
        ...updatedScenes[targetIndex],
        imageSrc: customImageUrl.trim(),
        aiToolUsed: 'Custom URL Import · رابط خارجي عالي الدقة',
      };

      const updatedStory: StoryProject = {
        ...story,
        scenes: updatedScenes,
      };

      onUpdateStory(updatedStory);
      setToastMessage(`✓ تم تعيين الرابط المخصص للمشهد رقم ${targetIndex + 1}!`);
      setCustomImageUrl('');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right font-sans">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  مستورد الصور عالي الجودة من الإنترنت ومطابقتها للمشاهد
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
                  1080×1920 9:16 HD
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                استورد صوراً جاهزة فائقة الدقة من مصادر الإنترنت، أو نفّذ مطابقة ذكية فورية لكافة المشاهد الثمانية بضغطة واحدة.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-Time Action Notification Banner */}
        {toastMessage && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-2.5 flex items-center justify-between text-xs font-bold text-emerald-300 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-400 hover:text-white text-xs underline"
            >
              إخفاء
            </button>
          </div>
        )}

        {/* 1-Click Auto-Match Banner */}
        <div className="p-4 sm:px-6 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-indigo-500/15 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-right w-full sm:w-auto">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">
                مطابقة ذكية فورية لجميع المشاهد الـ 8 بضغطة زر واحدة:
              </div>
              <div className="text-[11px] text-slate-400">
                يقوم النظام بتحليل نصوص كل مشهد والكلمات المفتاحية ومطابقتها مع أفضل الصور العالمية بدقة 9:16 دون أي تكرار.
              </div>
            </div>
          </div>

          <button
            onClick={handleAutoMatchAll}
            disabled={isAutoMatching}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 shrink-0 active:scale-95 transition-all disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 text-slate-950 ${isAutoMatching ? 'animate-spin' : ''}`} />
            <span>{isAutoMatching ? 'جاري التحليل والمطابقة...' : '⚡ تشغيل المطابقة الذكية للـ 8 مشاهد معاً'}</span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">

          {/* Scene Selector Strip (1 to 8) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>اختر المشهد المستهدف للاستبدال (1 - 8):</span>
              </span>
              <span className="text-[11px] text-amber-400 font-mono font-bold">
                المشهد الحالي: #{selectedSceneIndex + 1}
              </span>
            </div>

            {/* 8 Scene Thumbnails Strip */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {story.scenes.map((scene, idx) => {
                const isSelected = idx === selectedSceneIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedSceneIndex(idx)}
                    className={`relative rounded-xl overflow-hidden border p-1 text-center transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 shadow-md ring-2 ring-amber-400/30'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                    }`}
                  >
                    <div className="w-full aspect-[9/16] rounded-lg overflow-hidden bg-slate-800 relative mb-1">
                      {scene.imageSrc ? (
                        <img 
                          src={scene.imageSrc} 
                          alt={`مشهد ${idx + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px]">
                          لا توجد صورة
                        </div>
                      )}
                      <div className="absolute top-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-bold text-white font-mono">
                        #{idx + 1}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 block truncate">
                      مشهد {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Scene Context Box */}
            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="min-w-0 flex-1">
                <span className="text-slate-400 font-bold block mb-0.5">
                  نص التعليق الصوتي للمشهد #{selectedSceneIndex + 1}:
                </span>
                <p className="text-slate-200 line-clamp-1 italic text-[11px]">
                  "{activeScene.voiceover}"
                </p>
              </div>
              <div className="text-[10px] text-amber-400/90 font-mono bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 shrink-0">
                {activeScene.aiToolUsed || 'FLUX.1 Pro Cinema'}
              </div>
            </div>
          </div>

          {/* Direct URL Importer Bar */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <label className="text-xs font-bold text-slate-200 block mb-2 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>استيراد صورة مخصصة مباشرة عبر رابط URL من الإنترنت:</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => {
                  setCustomImageUrl(e.target.value);
                  setCustomUrlPreviewError(false);
                }}
                placeholder="ألصق رابط الصورة هنا (مثال: https://images.unsplash.com/... أو أي رابط صورة عمودية)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
              />
              <button
                onClick={() => handleApplyCustomUrl(selectedSceneIndex)}
                disabled={!customImageUrl.trim()}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 shrink-0"
              >
                <Check className="w-4 h-4" />
                <span>تعيين للمشهد #{selectedSceneIndex + 1}</span>
              </button>
            </div>
          </div>

          {/* Internet Photo Search & Category Pills */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالكلمات المفتاحية (مثال: أهرامات، طائرة، فضاء، محيط، كود، ذهب، قصر، سحاب)..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="text-xs text-slate-400 font-mono shrink-0 flex items-center gap-1 self-end sm:self-center">
                <span>النتائج المتاحة:</span>
                <span className="font-bold text-amber-400">
                  {isLoadingPhotos ? 'جاري التحميل...' : `${photos.length} صورة عمودية 9:16`}
                </span>
              </div>
            </div>

            {/* Quick Topic Suggestion Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs custom-scrollbar">
              <span className="text-[11px] text-slate-400 shrink-0 font-bold">موضوعات مميزة:</span>
              {QUICK_TOPIC_SUGGESTIONS.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSearchQuery(topic.q);
                    setActiveCategory('all');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
                    searchQuery === topic.q
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs custom-scrollbar">
              {INTERNET_PHOTO_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    activeCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Curated HD Internet Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {photos.map((photo) => {
              const isCurrentlyApplied = activeScene.imageSrc === photo.url;
              return (
                <div
                  key={photo.id}
                  className={`group relative bg-slate-900 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all ${
                    isCurrentlyApplied
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'border-slate-800 hover:border-slate-700 hover:shadow-xl'
                  }`}
                >
                  {/* Vertical 9:16 Frame Preview */}
                  <div className="relative aspect-[9/16] w-full overflow-hidden bg-slate-950">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end pointer-events-none">
                      <span className="bg-black/75 backdrop-blur-md text-amber-400 border border-amber-400/30 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow">
                        9:16 UHD
                      </span>
                      <span className="bg-black/75 backdrop-blur-md text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                        {photo.categoryNameAr}
                      </span>
                    </div>

                    {isCurrentlyApplied && (
                      <div className="absolute top-2 left-2 bg-emerald-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>نشط حالياً</span>
                      </div>
                    )}

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-2 right-2 left-2 pointer-events-none">
                      <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-tight drop-shadow-md">
                        {photo.title}
                      </h4>
                      <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">
                        {photo.source}
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <div className="p-2 bg-slate-950 border-t border-slate-800/80">
                    <button
                      onClick={() => handleApplyPhotoToScene(photo, selectedSceneIndex)}
                      className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isCurrentlyApplied
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow active:scale-95'
                      }`}
                    >
                      {isCurrentlyApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>معيّنة للمشهد #{selectedSceneIndex + 1}</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>تعيين للمشهد #{selectedSceneIndex + 1}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {photos.length === 0 && (
            <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 p-6">
              <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-300">لم يتم العثور على صور مطابقة لكلمة البحث</h4>
              <p className="text-xs text-slate-500 mt-1">جرب كلمات أخرى مثل: طائرة، فضاء، أهرامات، ذهب، محيط، قصر، نيون...</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-3 px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-amber-400 hover:bg-slate-700"
              >
                عرض كافة الصور
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>جميع الصور بمقاس 9:16 عمودي متوافقة 100% مع شاشات تيك توك وبدقة 1080×1920</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
            >
              تم وإغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
