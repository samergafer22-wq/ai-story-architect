import { getCinematicImageForScene } from '../utils/cinematicVisualLibrary';

export interface SceneItem {
  sceneNumber: number;
  duration: number; // in seconds (7.5s for 8 scenes = 60s)
  voiceover: string;
  visualPrompt: string;
  imageSrc?: string;
  gradientFallback: string;
  sfx: string;
  cameraMotion: 'zoom_in' | 'zoom_out' | 'pan_left' | 'pan_right' | 'shake';
  moodColor: string;
  aiToolUsed?: string;
  vfxEffect?: 'glow_bloom' | 'film_grain' | 'fire_embers' | 'light_leaks' | 'cyber_scanline' | 'cinematic_vignette' | 'none';
  shakeIntensity?: 'subtle' | 'impact_bass' | 'tremor' | 'none';
  transitionType?: 'zoom_warp' | 'whip_pan' | 'flash_white' | 'film_glitch' | 'fade_black' | 'cross_dissolve';
}

export interface StoryProject {
  id: string;
  title: string;
  category: string;
  categoryId: 'mystery' | 'scifi' | 'history' | 'horror' | 'wealth' | 'space' | 'fantasy' | 'drama';
  duration: number;
  tiktokHook: string;
  musicTrack: 'tension' | 'cyber' | 'epic' | 'ambient' | 'horror' | 'motivation';
  bpm: number;
  hashtags: string[];
  thumbnailSrc?: string;
  partNumber?: number;
  totalParts?: number;
  isSeries?: boolean;
  seriesTitle?: string;
  scenes: SceneItem[];
}

export interface StoryCategory {
  id: 'mystery' | 'scifi' | 'history' | 'horror' | 'wealth' | 'space' | 'fantasy' | 'drama';
  title: string;
  titleEn: string;
  icon: string;
  description: string;
  count: number;
}

export const STORY_CATEGORIES: StoryCategory[] = [
  {
    id: 'mystery',
    title: 'الغموض والظواهر الخارقة',
    titleEn: 'Mysteries & Deep Unsolved Files',
    icon: 'Search',
    description: 'ملفات استخباراتية سرية، حوادث اختفاء طائرات وسفن، وألغاز حيرت علماء الأرض.',
    count: 32,
  },
  {
    id: 'scifi',
    title: 'الخيال العلمي والذكاء الخارق',
    titleEn: 'Sci-Fi & Cyberpunk Multiverse',
    icon: 'Cpu',
    description: 'مدن السايبر المستقبلية، سيطرة الذكاء الاصطناعي، وبوابات الأكوان الموازية.',
    count: 28,
  },
  {
    id: 'history',
    title: 'التاريخ والأسرار القديمة',
    titleEn: 'Ancient History & Lost Empires',
    icon: 'Landmark',
    description: 'أسرار بناء الأهرامات، إرم ذات العماد المدفونة، وكنوز ملوك الشرق.',
    count: 26,
  },
  {
    id: 'space',
    title: 'غرائب الكون والفضاء السحيق',
    titleEn: 'Cosmic Oddities & Deep Space',
    icon: 'Orbit',
    description: 'الثقوب السوداء، انطفاء النجوم، والسفر عبر بوابات الالتواء الفضائي.',
    count: 24,
  },
  {
    id: 'wealth',
    title: 'سيكولوجيا الثراء والنجاح',
    titleEn: 'Wealth Wisdom & Mindset',
    icon: 'TrendingUp',
    description: 'خزائن الذهب الكبرى، أسرار كبار المستثمرين، واستراتيجيات السيطرة المالية.',
    count: 21,
  },
  {
    id: 'horror',
    title: 'الرعب والفولكلور الأسطوري',
    titleEn: 'Horror & Paranormal Folklore',
    icon: 'Ghost',
    description: 'قلاع مهجورة وشهادات موثقة لكيانات خارقة تتحدى قوانين الطبيعة.',
    count: 19,
  },
  {
    id: 'fantasy',
    title: 'الفانتازيا والملاحم الأسطورية',
    titleEn: 'Epic Fantasy & Legends',
    icon: 'Shield',
    description: 'بوابات الأبعاد، كائنات الأعماق، عوالم الجن، ومعارك القوى القديمة.',
    count: 18,
  },
  {
    id: 'drama',
    title: 'الدراما والمواقف الإنسانية',
    titleEn: 'Emotional Drama & Life Twists',
    icon: 'Heart',
    description: 'قصص حقيقية مؤثرة مليئة بالمفارقات، خيانات غير متوقعة، ولحظات صدمة كبرى.',
    count: 17,
  },
];

const RAW_PRESET_STORIES: StoryProject[] = [
  // 1. Aviation Mystery: MH370 (8 Scenes, 60s, Follower Opinion at Scene 8)
  {
    id: 'story-aviation-flight-370',
    title: 'لغز اختفاء رحلة الطيران 370 في المحيط الهندي (8 لقطات · 1 دقيقة)',
    category: 'الغموض والظواهر الخارقة',
    categoryId: 'mystery',
    duration: 60,
    tiktokHook: 'في منتصف الليل اختفت أضخم طائرة ركاب عن الرادارات دون نداء استغاثة واحد!',
    musicTrack: 'tension',
    bpm: 118,
    hashtags: ['#لغز_الطائرة', '#رحلة370', '#غموض', '#قصص_واقعية', '#fyp', '#viral'],
    scenes: [
      {
        sceneNumber: 1,
        duration: 7.5,
        voiceover: 'في تمام الساعة الواحدة فجراً أقلعت الطائرة الضخمة في رحلتها الروتينية المعتادة، وكانت كل المؤشرات الفنية وقراءات مقصورة القيادة تعمل بكفاءة تامة ودون أي إنذار مسبق.',
        visualPrompt: 'Cinematic wide aerial shot of a commercial airliner ascending into stormy dark clouds at night, runway beacons fading into mist.',
        gradientFallback: 'linear-gradient(135deg, #020617 0%, #1e293b 100%)',
        sfx: 'Whoosh + Jet Engine Roar',
        cameraMotion: 'zoom_in',
        moodColor: '#38bdf8',
        aiToolUsed: 'FLUX.1 Pro Cinema · تأسيس المشهد الجوي',
      },
      {
        sceneNumber: 2,
        duration: 7.5,
        voiceover: 'وفجأة وبمجرد عبور النقطة الفاصلة بين المجالين الجويين، انقطعت إشارة جهاز الإرسال والاستقبال الإلكتروني كلياً واختفت النقطة المضيئة من على شاشات المراقبة العسكرية.',
        visualPrompt: 'Military radar console with green circular grid, the blip suddenly blinking out, alarmed air traffic controller reflection in glass.',
        gradientFallback: 'linear-gradient(135deg, #090d16 0%, #0369a1 100%)',
        sfx: 'Radar Ping + Digital Static Glitch',
        cameraMotion: 'pan_left',
        moodColor: '#0ea5e9',
        aiToolUsed: 'Midjourney v6.1 Ultra · محاكاة شاشة الرادار العسكري',
      },
      {
        sceneNumber: 3,
        duration: 7.5,
        voiceover: 'أظهرت البيانات العسكرية اللاحقة أن الطائرة قامت بانعطاف حاد ومفاجئ إلى اليسار، متجهة مباشرة نحو أقصى جنوب المحيط الهندي المعزول عن أي حركة ملاحية بشرية.',
        visualPrompt: 'Navigational satellite map overlay showing sharp vector trajectory turn toward dark deep ocean abyss.',
        gradientFallback: 'linear-gradient(135deg, #042f2e 0%, #0f172a 100%)',
        sfx: 'Low Bass Drone + Wind Shear',
        cameraMotion: 'pan_right',
        moodColor: '#14b8a6',
        aiToolUsed: 'Runway Gen-3 Alpha · انتقال الملاحة الفضائية',
      },
      {
        sceneNumber: 4,
        duration: 7.5,
        voiceover: 'حلقت الطائرة في صمت مطبق لساعات طويلة في الظلام الدامس، دون أن تحاول التواصل مع أي برج مراقبة، وكأن شخصاً ما كان يقودها عمداً إلى المجهول.',
        visualPrompt: 'Silhouette of airliner gliding silently under moonlight over endless black ocean expanse, lone wing navigation lights.',
        gradientFallback: 'linear-gradient(135deg, #030712 0%, #1e1b4b 100%)',
        sfx: 'Deep Engine Hum + Wind Howl',
        cameraMotion: 'zoom_in',
        moodColor: '#6366f1',
        aiToolUsed: 'Luma Dream Machine · لقطة ليلية سينمائية فائقة الهدوء',
      },
      {
        sceneNumber: 5,
        duration: 7.5,
        voiceover: 'نفد الوقود في أعماق المحيط وانحدرت الطائرة بسرعة جنونية، لتلتهمها أمواج المحيط الهائج التي يصل عمقها إلى أكثر من ستة آلاف متر تحت سطح الماء.',
        visualPrompt: 'Colossal ocean waves in midnight storm, aircraft spiraling downward toward churning abyss with lightning flash.',
        gradientFallback: 'linear-gradient(135deg, #02182b 0%, #082f49 100%)',
        sfx: 'Thunder Crack + Sub Bass Impact',
        cameraMotion: 'shake',
        moodColor: '#0284c7',
        aiToolUsed: 'Kling AI v1.5 · محاكاة سقوط المحيط الهائج',
      },
      {
        sceneNumber: 6,
        duration: 7.5,
        voiceover: 'بدأت أضخم وأغلى عملية بحث في تاريخ البشرية باستخدام أحدث غواصات السونار الآلية، لكن المفاجأة كانت أن قاع المحيط لم يظهر أي أثر للهيكل الرئيسي.',
        visualPrompt: 'High-tech underwater submersible with twin halogen beams scanning abyssal ocean floor trenches and rocky peaks.',
        gradientFallback: 'linear-gradient(135deg, #010814 0%, #04364a 100%)',
        sfx: 'Sonar Ping + Deep Pressure Creak',
        cameraMotion: 'zoom_out',
        moodColor: '#0d9488',
        aiToolUsed: 'Stable Diffusion 3.5 Turbo · مسح الأعماق بسونار الغواصة',
      },
      {
        sceneNumber: 7,
        duration: 7.5,
        voiceover: 'وبعد سنوات عُثر على أجزاء متناثرة من الجناح على شواطئ إفريقية بعيدة، لتثبت الفحوصات الجنائية أن زاوية الارتطام تشير إلى هبوط محكم ومخطط له بدقة.',
        visualPrompt: 'Washed up aircraft flaperon wing fragment encrusted with marine barnacles resting on misty lonely beach at dawn.',
        gradientFallback: 'linear-gradient(135deg, #1c1917 0%, #78350f 100%)',
        sfx: 'Ocean Waves + Dramatic Chimes',
        cameraMotion: 'pan_left',
        moodColor: '#d97706',
        aiToolUsed: 'Leonardo.ai Alchemy · فحص الحطام الجنائي بدقة سينمائية',
      },
      {
        sceneNumber: 8,
        duration: 7.5,
        voiceover: 'حتى اليوم يظل لغز الطائرة أكبر سر طيران غير محلول في التاريخ المعاصر؛ فما هي نظريتكم الحقيقية؟ هل كان خطفاً أم عطلاً غامضاً؟ اكتبوا رأيكم بالتعليقات!',
        visualPrompt: 'Dramatic split view: unsolved case file stamped CLASSIFIED and interactive TikTok comment question marks floating over ocean.',
        gradientFallback: 'linear-gradient(135deg, #111827 0%, #b45309 100%)',
        sfx: 'Cinematic Grand Climax Hit + Outro Swell',
        cameraMotion: 'zoom_in',
        moodColor: '#f59e0b',
        aiToolUsed: 'DALL-E 3 HD · خاتمة التفاعل وسؤال المتابعين',
      },
    ],
  },

  // 2. Ancient Mystery: Lost City of Iram (8 Scenes, 60s)
  {
    id: 'story-ancient-iram-pillars',
    title: 'سر مدينة إرم ذات العماد المدفونة تحت رمال الأحقاف (1 دقيقة)',
    category: 'التاريخ والأسرار القديمة',
    categoryId: 'history',
    duration: 60,
    tiktokHook: 'مدينة بنتها حضارة جبارة من الذهب والياقوت ابتلعتها رمال الصحراء في ليلة واحدة!',
    musicTrack: 'epic',
    bpm: 122,
    hashtags: ['#إرم_ذات_العماد', '#أسرار_التاريخ', '#حضارات_قديمة', '#عجائب_العالم', '#fyp'],
    scenes: [
      {
        sceneNumber: 1,
        duration: 7.5,
        voiceover: 'في قلب صحراء الربع الخالي الشاسعة، تحدثت أقدم المخطوطات والكتب التاريخية عن أسطورة مدينة إرم ذات العماد، التي لم يُخلق مثلها في البلاد من حيث البناء والفخامة.',
        visualPrompt: 'Endless golden desert dunes under glowing starry night sky, ancient silk road caravan silhouette moving toward glowing horizon.',
        gradientFallback: 'linear-gradient(135deg, #0c0702 0%, #451a03 100%)',
        sfx: 'Desert Wind + Oud Drone',
        cameraMotion: 'zoom_in',
        moodColor: '#f59e0b',
        aiToolUsed: 'FLUX.1 Pro Cinema · تأسيس رمال الصحراء الذهبية',
      },
      {
        sceneNumber: 2,
        duration: 7.5,
        voiceover: 'تقول الروايات إن الملك شداد بن عاد أمر ببناء جنة أرضية بأعمدة شاهقة من الذهب الخالص وقصور مرصعة بالجواهر النادرة، لتتحدى عظمتها كل ما عرفته البشرية.',
        visualPrompt: 'Colossal ancient palace courtyard with monumental gold-plated pillars reflecting torches, ornate architectural arches.',
        gradientFallback: 'linear-gradient(135deg, #271206 0%, #78350f 100%)',
        sfx: 'Echoing Chimes + Grand Horn',
        cameraMotion: 'pan_left',
        moodColor: '#d97706',
        aiToolUsed: 'Midjourney v6.1 Ultra · محاكاة أعمدة الذهب الشاهقة',
      },
      {
        sceneNumber: 3,
        duration: 7.5,
        voiceover: 'وعندما بلغت المدينة أوج غرورها وقوتها، انطلقت عاصفة رملية كونية جبارة استمرت سبع ليال وثمانية أيام حسوماً، لتطمس كل معالم الحضارة في ساعات معدودة.',
        visualPrompt: 'Massive apocalyptic sandstorm vortex engulfing giant city walls, swirling red sand clouds tearing across sky.',
        gradientFallback: 'linear-gradient(135deg, #451a03 0%, #991b1b 100%)',
        sfx: 'Howling Windstorm + Heavy Bass Drop',
        cameraMotion: 'shake',
        moodColor: '#ef4444',
        aiToolUsed: 'Runway Gen-3 Alpha · عاصفة رملية ملحمية ثلاثية الأبعاد',
      },
      {
        sceneNumber: 4,
        duration: 7.5,
        voiceover: 'ابتلعت الرمال المتحركة القصور الشاهقة تحت طبقات يصل سمكها لمئات الأمتار، واختفت المدينة تماماً عن الخرائط والذاكرة كأنها لم تكن يوماً على قيد الوجود.',
        visualPrompt: 'Desert landscape settling into silence after storm, only the very tip of a monolithic golden spire protruding from dunes.',
        gradientFallback: 'linear-gradient(135deg, #1c1004 0%, #78350f 100%)',
        sfx: 'Fading Wind + Low Bell Toll',
        cameraMotion: 'zoom_out',
        moodColor: '#b45309',
        aiToolUsed: 'Luma Dream Machine · انطباق الرمال والهدوء الغامض',
      },
      {
        sceneNumber: 5,
        duration: 7.5,
        voiceover: 'وفي مطلع القرن الحالي استخدم علماء الجيولوجيا أقمار رادار ناسا المخترقة للأرض، لتكشف الصور عن شبكة طرق مائية ومبان ضخمة مدفونة في أعماق الرمال.',
        visualPrompt: 'Holographic satellite radar scan stripping away desert sand to reveal underground geometric city grid and aqueducts.',
        gradientFallback: 'linear-gradient(135deg, #090d16 0%, #0284c7 100%)',
        sfx: 'Digital Pulse + Satellite Beep',
        cameraMotion: 'zoom_in',
        moodColor: '#38bdf8',
        aiToolUsed: 'Stable Diffusion 3.5 Turbo · مسح رادار ناسا المخترق للرمال',
      },
      {
        sceneNumber: 6,
        duration: 7.5,
        voiceover: 'انطلقت بعثة استكشافية بالتعاون مع فرق دولية للوصول للموقع المحدد، ليعثروا على بوابات حجرية عملاقة عليها نقوش وكتابات بلغة لم يستطع أي عالم فك رموزها.',
        visualPrompt: 'Archaeologist explorers holding lanterns before a massive subterranean stone gate covered in glowing undeciphered cuneiform runes.',
        gradientFallback: 'linear-gradient(135deg, #18181b 0%, #d97706 100%)',
        sfx: 'Torch Crackle + Stone Scraping Sound',
        cameraMotion: 'pan_right',
        moodColor: '#eab308',
        aiToolUsed: 'Kling AI v1.5 · فتح البوابة الحجرية المجهولة',
      },
      {
        sceneNumber: 7,
        duration: 7.5,
        voiceover: 'توقفت عمليات الحفر فجأة وبسرية تامة لأسباب غامضة، وظلت أسرار ما عُثر عليه داخل القاعات السفلية محجوبة عن وسائل الإعلام حتى هذه اللحظة.',
        visualPrompt: 'Guarded military perimeter around desert dig site at night, sealed research crates with yellow warning seals.',
        gradientFallback: 'linear-gradient(135deg, #09090b 0%, #451a03 100%)',
        sfx: 'Tension Riser + Heartbeat',
        cameraMotion: 'zoom_in',
        moodColor: '#f97316',
        aiToolUsed: 'Leonardo.ai Alchemy · توثيق التكتم العسكري والسرية',
      },
      {
        sceneNumber: 8,
        duration: 7.5,
        voiceover: 'هل تعتقدون أن مدينة إرم حقيقة تاريخية تم طمسها أم مجرد أسطورة قديمة؟ وما الذي عثروا عليه هناك؟ شاركونا آراءكم ونظرياتكم بالتعليقات!',
        visualPrompt: 'Cinematic visual of golden dunes meeting starlit cosmos with TikTok comment icon prompting follower debate.',
        gradientFallback: 'linear-gradient(135deg, #0c0702 0%, #f59e0b 100%)',
        sfx: 'Grand Orchestral Finale Hit',
        cameraMotion: 'zoom_out',
        moodColor: '#facc15',
        aiToolUsed: 'DALL-E 3 HD · استطلاع رأي المتابعين ونهاية المشهد',
      },
    ],
  },

  // 3. Sci-Fi & AI Multiverse (8 Scenes, 60s)
  {
    id: 'story-cyber-singularity-60s',
    title: 'ملحمة الأبعاد الكونية: اختراق بوابات الزمن (8 مشاهد · 1 دقيقة)',
    category: 'الخيال العلمي والذكاء الخارق',
    categoryId: 'scifi',
    duration: 60,
    tiktokHook: 'عندما تم تشغيل هذه النواة الكمية لأول مرة، تم اختراق 8 أبعاد زمنية متوازية في دقيقة واحدة!',
    musicTrack: 'cyber',
    bpm: 124,
    hashtags: ['#خيال_علمي', '#أفلام_قصيرة', '#سينما_تيك_توك', '#ذكاء_اصطناعي', '#fyp'],
    scenes: [
      {
        sceneNumber: 1,
        duration: 7.5,
        voiceover: 'في أعمق نقطة من المختبر السري تحت الأرض، اجتمع كبار العلماء لمراقبة تشغيل أول نواة طاقة كمية في تاريخ البشرية، والتي بدأت بإصدار ترددات غير مسبوقة تهز المكان بالكامل.',
        visualPrompt: 'Cutting-edge futuristic cyberpunk laboratory, glowing spherical quantum hologram core pulsating with blue energy.',
        gradientFallback: 'linear-gradient(135deg, #090d16 0%, #0369a1 100%)',
        sfx: 'Whoosh + Electronic Hum',
        cameraMotion: 'zoom_in',
        moodColor: '#0ea5e9',
        aiToolUsed: 'FLUX.1 Pro Cinema · تشغيل النواة الكمية في المختبر',
      },
      {
        sceneNumber: 2,
        duration: 7.5,
        voiceover: 'وفجأة انقطعت الاتصالات المركزية عن المدينة، وانطلقت الإشارة المشفرة نحو الشوارع الغارقة في الأمطار وأضواء النيون الباردة، لتعلن بداية تحول تكنولوجي لا يمكن لأحد في هذا العالم إيقافه.',
        visualPrompt: 'Futuristic neon cityscape in heavy rain at night, lone hooded detective overlooking holographic billboards from rooftop.',
        gradientFallback: 'linear-gradient(135deg, #082f49 0%, #0284c7 100%)',
        sfx: 'Thunder + Rain Ambience',
        cameraMotion: 'pan_left',
        moodColor: '#38bdf8',
        aiToolUsed: 'Midjourney v6.1 Ultra · شوارع النيون والأمطار المستقبلية',
      },
      {
        sceneNumber: 3,
        duration: 7.5,
        voiceover: 'وفي قلب الصحراء المجهولة، استجابت بوابة حجرية أثرية قديمة استيقظت نقوشها السحرية بعد آلاف السنين، لتبتلع رمال الصحراء المحيطة في دوامة ضوئية ساحرة تفتح الطريق نحو المجهول.',
        visualPrompt: 'Majestic ancient monumental ruins under starry desert night sky, glowing celestial portal spinning with golden energy.',
        gradientFallback: 'linear-gradient(135deg, #1c1917 0%, #b45309 100%)',
        sfx: 'Desert Wind + Low Riser',
        cameraMotion: 'zoom_in',
        moodColor: '#f59e0b',
        aiToolUsed: 'Runway Gen-3 Alpha · استيقاظ البوابة الكونية القديمة',
      },
      {
        sceneNumber: 4,
        duration: 7.5,
        voiceover: 'ثم امتد الصدى إلى أعمق خندق مائي في قاع المحيط، حيث كشفت الأضواء عن معبد غارق لحضارة مفقودة بدأت أعمدته الرخامية في إرسال نبضات سونار متطابقة مع شفرة البوابة الصحراوية.',
        visualPrompt: 'Deep ocean trench abyss, ancient sunken monolithic civilization temple glowing with bioluminescent turquoise corals.',
        gradientFallback: 'linear-gradient(135deg, #042f2e 0%, #0d9488 100%)',
        sfx: 'Sonar Ping + Sub Bass Drop',
        cameraMotion: 'pan_right',
        moodColor: '#14b8a6',
        aiToolUsed: 'Luma Dream Machine · معبد الأعماق المائي المضيء',
      },
      {
        sceneNumber: 5,
        duration: 7.5,
        voiceover: 'وعلى الفور انطلقت سفينة الاستكشاف الفضائية بأقصى طاقة ممكنة، لتخترق نفق الالتواء الكوني الفائق محاطة بخطوط ضوئية متوهجة تمتد إلى ما لا نهاية بسرعة تفوق سرعة الضوء بمراحل.',
        visualPrompt: 'Hyperspace faster-than-light star travel, vibrant violet and gold light streaks stretching into infinity around starship.',
        gradientFallback: 'linear-gradient(135deg, #311042 0%, #9333ea 100%)',
        sfx: 'Hyperspace Woosh + Laser Drone',
        cameraMotion: 'zoom_in',
        moodColor: '#a855f7',
        aiToolUsed: 'Stable Diffusion 3.5 Turbo · اختراق نفق الالتواء الفضائي',
      },
      {
        sceneNumber: 6,
        duration: 7.5,
        voiceover: 'وفي مركز الفضاء السحيق، وقف رائد الفضاء المعزول مذهولاً أمام دوامة الجاذبية الكونية العملاقة، وهو يشاهد كيف تنصهر النجوم وتولد عوالم جديدة كلياً من الغبار النجمي الذهبي الخالص.',
        visualPrompt: 'Solitary astronaut floating in deep cosmos gazing at swirling purple and gold singularity event horizon.',
        gradientFallback: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
        sfx: 'Heartbeat + Deep Drone',
        cameraMotion: 'zoom_out',
        moodColor: '#8b5cf6',
        aiToolUsed: 'Kling AI v1.5 · دوامة الجاذبية والولادة النجمية',
      },
      {
        sceneNumber: 7,
        duration: 7.5,
        voiceover: 'وعبر تمزق أبعاد الزمان، أضاءت فوانيس قصر الظلال الأندلسي العريق لتكشف عن مخطوطة سرية كانت قد تنبأت بهذه اللحظة الكونية الفاصلة قبل أكثر من ألف عام بدقة متناهية لا تصدق.',
        visualPrompt: 'Grand historical Arabian palace courtyard at twilight, ornate arched colonnades illuminated by warm glowing lanterns.',
        gradientFallback: 'linear-gradient(135deg, #1c1917 0%, #78350f 100%)',
        sfx: 'Oud Chords + Candle Flick',
        cameraMotion: 'pan_left',
        moodColor: '#d97706',
        aiToolUsed: 'Leonardo.ai Alchemy · فك شيفرة المخطوطة الأندلسية',
      },
      {
        sceneNumber: 8,
        duration: 7.5,
        voiceover: 'وأخيراً فوق قمة القلعة البركانية الصامدة بين أنهار الحمم والبرق المشتعل، أدرك الجميع أن العالم قد دخل في عصر جديد لم يسبق له مثيل، فهل أنتم مستعدون لمواجهة القادم؟ شاركونا نظرياتكم!',
        visualPrompt: 'Colossal obsidian gothic fortress perched atop dramatic cliff above flowing rivers of glowing molten lava with follower callout.',
        gradientFallback: 'linear-gradient(135deg, #18181b 0%, #dc2626 100%)',
        sfx: 'Cinematic Grand Hit + Sub Bass Outro',
        cameraMotion: 'shake',
        moodColor: '#ef4444',
        aiToolUsed: 'DALL-E 3 HD · خاتمة الملحمة واستفتاء المتابعين',
      },
    ],
  },
];

export const PRESET_STORIES: StoryProject[] = RAW_PRESET_STORIES.map(story => ({
  ...story,
  thumbnailSrc: story.thumbnailSrc || getCinematicImageForScene(story.title, story.categoryId, 1),
  scenes: story.scenes.map((s, idx) => ({
    ...s,
    imageSrc: s.imageSrc || getCinematicImageForScene(story.title, story.categoryId, s.sceneNumber, s.visualPrompt),
    vfxEffect: s.vfxEffect || (idx === 0 ? 'light_leaks' : idx === 4 || idx === 7 ? 'fire_embers' : 'glow_bloom'),
    shakeIntensity: s.shakeIntensity || (idx === 0 || idx === 4 ? 'impact_bass' : 'subtle'),
    transitionType: s.transitionType || (idx === 0 ? 'flash_white' : idx % 2 === 0 ? 'zoom_warp' : 'whip_pan'),
  }))
}));

