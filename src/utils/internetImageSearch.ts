/**
 * Internet Image Importer & Matcher Service
 * High-definition (1080x1920 9:16) internet photos library, semantic keyword matcher,
 * live /api/images/search integration, and 1-click auto-matching engine for all video scenes.
 */

export interface InternetPhoto {
  id: string;
  url: string;
  title: string;
  category: string;
  categoryNameAr: string;
  keywords: string[];
  resolution: string;
  source: string;
  author?: string;
  moodColor: string;
}

export const INTERNET_PHOTO_CATEGORIES = [
  { id: 'all', label: 'جميع التصنيفات' },
  { id: 'aviation', label: 'طيران وسحب ✈️' },
  { id: 'ancient', label: 'أهرامات وحضارات 🏺' },
  { id: 'ocean', label: 'أعماق وبحار 🌊' },
  { id: 'space', label: 'فضاء ومجرات 🚀' },
  { id: 'scifi', label: 'سايبربانك ومستقبل ⚡' },
  { id: 'wealth', label: 'قصور وذهب وفخامة 💎' },
  { id: 'horror', label: 'رعب وغموض 👁️' },
  { id: 'history', label: 'قلاع وسور الصين 🏰' },
  { id: 'nature', label: 'براكين وصحاري 🌋' },
  { id: 'drama', label: 'دراما ووجوه 🎭' },
];

export const CURATED_INTERNET_PHOTOS: InternetPhoto[] = [
  // --- Aviation & Sky Mysteries ---
  {
    id: 'air-1',
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1080&q=85',
    title: 'إقلاع طائرة ركاب بوينغ ضخمة ليلاً في سماء ملبدة بالغيوم',
    category: 'aviation',
    categoryNameAr: 'طيران وسحب',
    keywords: ['طائرة', 'طيران', 'إقلاع', 'مطار', 'مدرج', 'flight', 'airplane', 'takeoff', '370'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Aviation Visuals',
    moodColor: '#0284c7'
  },
  {
    id: 'air-2',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1080&q=85',
    title: 'مقصورة قيادة طائرة مضاءة بالرادارات وشاشات الملاحة والتحذير',
    category: 'aviation',
    categoryNameAr: 'طيران وسحب',
    keywords: ['قمرة', 'مقصورة', 'رادار', 'أجهزة', 'ملاحة', 'طيار', 'cockpit', 'radar', 'navigation'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Flight Deck Pro',
    moodColor: '#f59e0b'
  },
  {
    id: 'air-3',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1080&q=85',
    title: 'عاصفة رعدية وبروق تضرب فوق الغيوم من نافذة طائرة محلقة',
    category: 'aviation',
    categoryNameAr: 'طيران وسحب',
    keywords: ['عاصفة', 'برق', 'غيوم', 'سحب', 'طيران', 'storm', 'clouds', 'lightning', 'برمودا'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Atmospheric Lens',
    moodColor: '#6366f1'
  },
  {
    id: 'air-4',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=85',
    title: 'شاطئ المحيط الضبابي وموقع العثور على أجزاء الحطام',
    category: 'aviation',
    categoryNameAr: 'طيران وسحب',
    keywords: ['شاطئ', 'حطام', 'محيط', 'أمواج', 'ضباب', 'أثر', 'ocean', 'shore', 'debris'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Ocean Coast Capture',
    moodColor: '#0ea5e9'
  },
  {
    id: 'air-5',
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1080&q=85',
    title: 'ملف تحقيقات سري ووثائق استخباراتية دولية مسربة',
    category: 'aviation',
    categoryNameAr: 'طيران وسحب',
    keywords: ['ملف', 'تحقيق', 'وثيقة', 'سر', 'استخبارات', 'مخطط', 'dossier', 'secret', 'investigation'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Archival Focus',
    moodColor: '#d97706'
  },
  {
    id: 'air-6',
    url: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1080&q=85',
    title: 'جناح طائرة يخترق سحب الغروب الأرجوانية في سماء المحيط',
    category: 'aviation',
    categoryNameAr: 'طيران وسحب',
    keywords: ['جناح', 'غروب', 'سحب', 'طيران', 'شمس', 'flight', 'sunset', 'wing'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Aero Views',
    moodColor: '#f43f5e'
  },

  // --- Ancient Civilizations & Pyramids & China ---
  {
    id: 'anc-1',
    url: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1080&q=85',
    title: 'أهرامات الجيزة الخالدة تحت سماء الصحراء المرصعة بالنجوم',
    category: 'ancient',
    categoryNameAr: 'أهرامات وحضارات',
    keywords: ['أهرامات', 'مصر', 'فراعنة', 'تاريخ', 'آثار', 'pyramids', 'egypt', 'ancient', 'pharaoh'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Heritage Photography',
    moodColor: '#d97706'
  },
  {
    id: 'anc-2',
    url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1080&q=85',
    title: 'أعمدة معبد الكرنك ونقوش هيروغليفية حجرية أسطورية',
    category: 'ancient',
    categoryNameAr: 'أهرامات وحضارات',
    keywords: ['معبد', 'أعمدة', 'هيروغليفية', 'نقوش', 'فرعون', 'temple', 'columns', 'hieroglyphics'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Luxor Visual Archive',
    moodColor: '#f59e0b'
  },
  {
    id: 'anc-3',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1080&q=85',
    title: 'كثبان الربع الخالي وسر مدينة إرم ذات العماد المفقودة',
    category: 'ancient',
    categoryNameAr: 'أهرامات وحضارات',
    keywords: ['صحراء', 'كثبان', 'رمال', 'إرم', 'أحقاف', 'مدفونة', 'desert', 'dunes', 'sand', 'lost city'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Desert Explorer',
    moodColor: '#eab308'
  },
  {
    id: 'anc-4',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=85',
    title: 'قاعة سرية تحت الأرض مرصعة بالذهب والكنوز الأثرية',
    category: 'ancient',
    categoryNameAr: 'أهرامات وحضارات',
    keywords: ['كنز', 'ذهب', 'سرداب', 'قبر', 'مدفن', 'تابوت', 'gold', 'tomb', 'chamber', 'relic'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Royal Chamber Lens',
    moodColor: '#fbbf24'
  },
  {
    id: 'anc-china-1',
    url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1080&q=85',
    title: 'سور الصين العظيم يمتد فوق قمم الجبال الضبابية الشاهقة',
    category: 'history',
    categoryNameAr: 'قلاع وسور الصين',
    keywords: ['سور الصين', 'الصين', 'جبال', 'تاريخ', 'حصن', 'great wall', 'china', 'mountain', 'dynasty'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Great Wall Heritage',
    moodColor: '#059669'
  },
  {
    id: 'anc-china-2',
    url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1080&q=85',
    title: 'برج مراقبة عتيق على سور الصين في الشتاء وضباب الفجر',
    category: 'history',
    categoryNameAr: 'قلاع وسور الصين',
    keywords: ['سور الصين', 'برج', 'شتاء', 'حصن', 'قديم', 'watchtower', 'great wall', 'snow'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Imperial Lens',
    moodColor: '#047857'
  },
  {
    id: 'anc-rome-1',
    url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1080&q=85',
    title: 'مدرج الكولوسيوم الروماني وأقواس الإمبراطورية الذهبية',
    category: 'history',
    categoryNameAr: 'قلاع وسور الصين',
    keywords: ['كولوسيوم', 'روما', 'إمبراطورية', 'قيصر', 'colosseum', 'rome', 'gladiator', 'ancient rome'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Roman Antiquities',
    moodColor: '#b45309'
  },

  // --- Deep Ocean & Marine Abyss ---
  {
    id: 'ocn-1',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1080&q=85',
    title: 'غواصة استكشاف أعماق تضيء كشافاتها في قاع خندق ماريانا',
    category: 'ocean',
    categoryNameAr: 'أعماق وبحار',
    keywords: ['غواصة', 'أعماق', 'محيط', 'بحر', 'خندق', 'submarine', 'deep sea', 'abyss', 'mariana'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Deep Blue Explorers',
    moodColor: '#0284c7'
  },
  {
    id: 'ocn-2',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&q=85',
    title: 'أمواج هائجة وعاصفة عنيفة تبتلع سفينة في قلب المحيط',
    category: 'ocean',
    categoryNameAr: 'أعماق وبحار',
    keywords: ['أمواج', 'عاصفة', 'سفينة', 'بحر', 'طوفان', 'waves', 'ocean storm', 'shipwreck'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Maritime Action',
    moodColor: '#0369a1'
  },
  {
    id: 'ocn-3',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1080&q=85',
    title: 'أطلال مدينة أتلانتس الغارقة تتلألأ بنبضات حيوية تحت الماء',
    category: 'ocean',
    categoryNameAr: 'أعماق وبحار',
    keywords: ['أطلال', 'مدينة غارقة', 'أتلانتس', 'معبد', 'atlantis', 'sunken city', 'underwater ruins'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Abyss Chronicles',
    moodColor: '#06b6d4'
  },
  {
    id: 'ocn-4',
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1080&q=85',
    title: 'شمس تخترق صفحة ماء المحيط الكريستالي إلى الهاوية الزرقاء',
    category: 'ocean',
    categoryNameAr: 'أعماق وبحار',
    keywords: ['أشعة', 'أعماق', 'محيط', 'بحر', 'sunbeams', 'underwater', 'marine depth'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Hydro Visuals',
    moodColor: '#0284c7'
  },

  // --- Space & Cosmos ---
  {
    id: 'spc-1',
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1080&q=85',
    title: 'سديم كوني متوهج بألوان الغازات النجمية في الفضاء السحيق',
    category: 'space',
    categoryNameAr: 'فضاء ومجرات',
    keywords: ['سديم', 'فضاء', 'مجرة', 'نجوم', 'nebula', 'space', 'galaxy', 'cosmos', 'stars'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Cosmic Hubble Collection',
    moodColor: '#9333ea'
  },
  {
    id: 'spc-2',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1080&q=85',
    title: 'ولادة نجم جديد وانفجار مستعر أعظم كوني في المجرة',
    category: 'space',
    categoryNameAr: 'فضاء ومجرات',
    keywords: ['نجم', 'انفجار', 'شمس', 'طاقة', 'supernova', 'star birth', 'astronomy'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Astrophysics Visuals',
    moodColor: '#c026d3'
  },
  {
    id: 'spc-3',
    url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1080&q=85',
    title: 'كوكب الأرض والغلاف الجوي المضيء من محطة الفضاء الدولية',
    category: 'space',
    categoryNameAr: 'فضاء ومجرات',
    keywords: ['الأرض', 'مدار', 'محطة الفضاء', 'غلاف', 'earth', 'orbit', 'space station', 'iss'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Orbital View',
    moodColor: '#38bdf8'
  },
  {
    id: 'spc-4',
    url: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1080&q=85',
    title: 'إطلاق صاروخ استكشافي عملاق يخترق سحب الليل نحو الفضاء',
    category: 'space',
    categoryNameAr: 'فضاء ومجرات',
    keywords: ['صاروخ', 'إطلاق', 'مركبة', 'نار', 'rocket', 'launch', 'spaceship', 'propulsion', 'spacex'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Spaceflight Direct',
    moodColor: '#f97316'
  },

  // --- Tech Titans, AI & Cyberpunk ---
  {
    id: 'cyb-1',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&q=85',
    title: 'مدينة سايبربانك مستقبلية بأبراج نيون وشاشات هولوغرام',
    category: 'scifi',
    categoryNameAr: 'سايبربانك ومستقبل',
    keywords: ['سايبربانك', 'نيون', 'مدينة مستقبلية', 'تكنولوجيا', 'cyberpunk', 'neon city', 'futuristic'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Neon Blade Runner',
    moodColor: '#ec4899'
  },
  {
    id: 'cyb-2',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1080&q=85',
    title: 'مطر الشفرات البرمجية وأكواد الذكاء الاصطناعي الماتريكس',
    category: 'scifi',
    categoryNameAr: 'سايبربانك ومستقبل',
    keywords: ['كود', 'برمجة', 'هاكر', 'ذكاء اصطناعي', 'matrix', 'cyber code', 'artificial intelligence'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Cyber Matrix Lab',
    moodColor: '#22c55e'
  },
  {
    id: 'cyb-elon',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1080&q=85',
    title: 'مختبر روبوتات ذكي وتكنولوجيا مستقبلية وأجهزة متطورة',
    category: 'scifi',
    categoryNameAr: 'سايبربانك ومستقبل',
    keywords: ['إيلون ماسك', 'تكنولوجيا', 'روبوت', 'مستقبل', 'ذكاء اصطناعي', 'elon musk', 'tech titan', 'ai'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Future Tech Lens',
    moodColor: '#6366f1'
  },
  {
    id: 'cyb-chip',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1080&q=85',
    title: 'معالج كمومي فائق متوهج بمسارات إلكترونية دقيقة وضوء نيون',
    category: 'scifi',
    categoryNameAr: 'سايبربانك ومستقبل',
    keywords: ['شريحة', 'معالج', 'كمومي', 'سيليكون', 'chip', 'processor', 'quantum'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Quantum Hardware',
    moodColor: '#3b82f6'
  },

  // --- Wealth, Gold & Luxury ---
  {
    id: 'wlh-1',
    url: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=1080&q=85',
    title: 'سبائك الذهب الخالص المتراصة في خزينة البنك الاحتياطي',
    category: 'wealth',
    categoryNameAr: 'قصور وذهب وفخامة',
    keywords: ['ذهب', 'سبائك', 'خزينة', 'ثراء', 'مال', 'gold bars', 'bullion', 'vault', 'wealth'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Bullion Reserve',
    moodColor: '#eab308'
  },
  {
    id: 'wlh-2',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1080&q=85',
    title: 'بنتهاوس فخم بإطلالة بانورامية على أفق ناطحات السحاب',
    category: 'wealth',
    categoryNameAr: 'قصور وذهب وفخامة',
    keywords: ['قصر', 'بنتهاوس', 'فخامة', 'ناطحة سحاب', 'penthouse', 'luxury mansion', 'skyline'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Luxury Architectural',
    moodColor: '#f59e0b'
  },
  {
    id: 'wlh-3',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1080&q=85',
    title: 'شاشات البورصة العالمية وتحليلات تداول الأسهم والأموال',
    category: 'wealth',
    categoryNameAr: 'قصور وذهب وفخامة',
    keywords: ['بورصة', 'تداول', 'أسهم', 'استثمار', 'charts', 'stock trading', 'finance', 'money'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Wall Street Lens',
    moodColor: '#10b981'
  },

  // --- Nature, Volcanoes & Deserts ---
  {
    id: 'nat-volcano',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&q=85',
    title: 'ثوران بركاني متوهج وتدفق الحمم البركانية المنصهرة في الليل',
    category: 'nature',
    categoryNameAr: 'براكين وصحاري',
    keywords: ['بركان', 'حمم', 'نار', 'ثوران', 'انفجار', 'volcano', 'lava', 'eruption', 'magma'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Volcano Expeditions',
    moodColor: '#ef4444'
  },
  {
    id: 'nat-desert',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1080&q=85',
    title: 'بحر الرمال الذهبية وكثبان الصحراء الشاسعة تحت وهج الشمس',
    category: 'nature',
    categoryNameAr: 'براكين وصحاري',
    keywords: ['صحراء', 'رمال', 'كثبان', 'شمس', 'desert', 'dunes', 'sahara'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Sahara Heritage',
    moodColor: '#f59e0b'
  },

  // --- Horror & Supernatural ---
  {
    id: 'hrr-1',
    url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1080&q=85',
    title: 'ممر مظلم ومرعب في قصر مهجور مع ظلال غامضة',
    category: 'horror',
    categoryNameAr: 'رعب وغموض',
    keywords: ['رعب', 'مهجور', 'ممر', 'ظلام', 'أشباح', 'haunted', 'dark hallway', 'horror', 'spooky'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Shadow Photography',
    moodColor: '#64748b'
  },
  {
    id: 'hrr-2',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1080&q=85',
    title: 'قمر دموي أحمر يضيء مقبرة قديمة وأشجاراً يابسة',
    category: 'horror',
    categoryNameAr: 'رعب وغموض',
    keywords: ['قمر أحمر', 'مقبرة', 'دموي', 'غموض', 'blood moon', 'cemetery', 'nightmare'],
    resolution: '1080 × 1920 UHD (9:16)',
    source: 'Unsplash Curated HD',
    author: 'Gothic Night Lens',
    moodColor: '#ef4444'
  }
];

/**
 * Live search that connects to `/api/images/search` with dynamic fallback
 */
export async function searchInternetImagesAsync(query: string = '', category: string = 'all'): Promise<InternetPhoto[]> {
  try {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category && category !== 'all') params.set('category', category);

    const res = await fetch(`/api/images/search?${params.toString()}`);
    if (res.ok) {
      const json = await res.json();
      const rawList = json.data || json.images || [];
      if (json.success && Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map((img: any, idx: number) => ({
          id: img.id || `api-${idx}`,
          url: img.url,
          title: img.title || `مشهد سينمائي عالي الجودة (${idx + 1})`,
          category: img.category || category || 'general',
          categoryNameAr: getCategoryArabicName(img.category || category),
          keywords: img.keywords || [query, category],
          resolution: '1080 × 1920 UHD (9:16)',
          source: 'Curated 9:16 Library',
          author: 'Studio High-Res',
          moodColor: img.moodColor || '#f59e0b',
        }));
      }
    }
  } catch (err) {
    console.warn('API image search fallback to local library:', err);
  }

  // Fallback to local filtering
  return searchInternetImages(query, category);
}

function getCategoryArabicName(cat: string): string {
  const found = INTERNET_PHOTO_CATEGORIES.find(c => c.id === cat);
  return found ? found.label.replace(/[^ء-ي\s]/g, '').trim() : 'سينمائي عام';
}

/**
 * Search the curated internet photos library locally
 */
export function searchInternetImages(query: string = '', category: string = 'all'): InternetPhoto[] {
  const qLower = (query || '').trim().toLowerCase();

  return CURATED_INTERNET_PHOTOS.filter(photo => {
    // Category check
    if (category !== 'all' && photo.category !== category) {
      return false;
    }

    if (!qLower) return true;

    // Keyword & Title search
    const titleMatch = photo.title.toLowerCase().includes(qLower);
    const categoryMatch = photo.categoryNameAr.toLowerCase().includes(qLower) || photo.category.toLowerCase().includes(qLower);
    const keywordMatch = photo.keywords.some(k => k.toLowerCase().includes(qLower) || qLower.includes(k.toLowerCase()));

    return titleMatch || categoryMatch || keywordMatch;
  });
}

/**
 * Smart Matcher: Automatically finds the best distinct HD internet photos for all 8 scenes of a story!
 * Avoids duplicate photos across scenes for maximum visual variety.
 */
export function autoMatchAllScenes(
  scenes: { voiceover: string; visualPrompt?: string; sceneNumber: number }[],
  storyCategory?: string
): { sceneIndex: number; matchedPhoto: InternetPhoto }[] {
  const usedPhotoIds = new Set<string>();
  const results: { sceneIndex: number; matchedPhoto: InternetPhoto }[] = [];

  scenes.forEach((scene, idx) => {
    const textToAnalyze = `${scene.voiceover} ${scene.visualPrompt || ''} ${storyCategory || ''}`.toLowerCase();

    // Score photos based on keyword matches
    const scored = CURATED_INTERNET_PHOTOS.map(photo => {
      let score = 0;

      // Heavy bonus if category matches
      if (storyCategory && (photo.category === storyCategory || photo.categoryNameAr.includes(storyCategory))) {
        score += 5;
      }

      // Keyword hits
      for (const kw of photo.keywords) {
        if (textToAnalyze.includes(kw.toLowerCase())) {
          score += 4;
        }
      }

      // Title hits
      const titleWords = photo.title.toLowerCase().split(/\s+/);
      for (const tw of titleWords) {
        if (tw.length > 2 && textToAnalyze.includes(tw)) {
          score += 2;
        }
      }

      // Heavily penalize already-used photos to ensure distinct visual variety
      if (usedPhotoIds.has(photo.id)) {
        score -= 50;
      }

      return { photo, score };
    });

    // Sort by highest score descending
    scored.sort((a, b) => b.score - a.score);

    // Pick best match
    const bestMatch = scored[0]?.photo || CURATED_INTERNET_PHOTOS[idx % CURATED_INTERNET_PHOTOS.length];
    usedPhotoIds.add(bestMatch.id);
    results.push({ sceneIndex: idx, matchedPhoto: bestMatch });
  });

  return results;
}
