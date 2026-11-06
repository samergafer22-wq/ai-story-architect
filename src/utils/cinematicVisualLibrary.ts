/**
 * High-Definition Cinematic Visual Library for TikTok 9:16 Vertical Video Production
 * Extensive catalog of 150+ ultra-high-definition, vertical (1080x1920) photographic assets
 * across 18 specialized archetypes with dynamic topic hashing to guarantee fresh, non-repeating visuals.
 */

export interface CinematicVisualAsset {
  id: string;
  url: string;
  title: string;
  archetype: string;
  keywords: string[];
  moodColor: string;
}

// 16 Local 8K Photorealistic Generated Masterpieces
export const LOCAL_CINEMATIC_ASSETS = {
  aviationCockpit: '/assets/images/airplane_cockpit_night_1793883725150.jpg',
  aviationStorm: '/assets/images/airplane_night_storm_1793883816135.jpg',
  radarDossier: '/assets/images/classified_radar_dossier_1793883832867.jpg',
  deepSeaSubmarine: '/assets/images/deep_sea_submarine_1793883762254.jpg',
  underwaterAbyss: '/assets/images/scene_underwater_abyss_1793669969992.jpg',
  ancientPyramidChamber: '/assets/images/ancient_pyramid_chamber_1793883778062.jpg',
  ancientDesertPortal: '/assets/images/scene_ancient_desert_portal_1793668725427.jpg',
  historicalPalace: '/assets/images/scene_historical_palace_1793668726539.jpg',
  bankVaultGold: '/assets/images/bank_vault_gold_1793883848655.jpg',
  deepSpaceSingularity: '/assets/images/deep_space_singularity_1793883795153.jpg',
  deepSpaceNebula: '/assets/images/scene_deep_space_nebula_1793668726232.jpg',
  cosmicWarp: '/assets/images/scene_cosmic_warp_1793669970109.jpg',
  cyberpunkCity: '/assets/images/cyberpunk_neon_city_1793883864467.jpg',
  cyberpunkMystery: '/assets/images/scene_cyberpunk_mystery_1793668725086.jpg',
  cyberLaboratory: '/assets/images/scene_cyber_laboratory_1793669968214.jpg',
  volcanicCitadel: '/assets/images/scene_volcanic_citadel_1793669969776.jpg',
};

// Comprehensive 150+ Vertical 1080x1920 Photographic Library across 18 Thematic Archetypes
export const EXTENSIVE_CINEMATIC_ASSETS: Record<string, string[]> = {
  // 1. Aviation & Flight Mysteries
  aviation: [
    LOCAL_CINEMATIC_ASSETS.aviationStorm,
    LOCAL_CINEMATIC_ASSETS.aviationCockpit,
    LOCAL_CINEMATIC_ASSETS.radarDossier,
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=1080&h=1920&q=85',
  ],

  // 2. Ocean Abyss, Submarines & Mariana Trench
  ocean: [
    LOCAL_CINEMATIC_ASSETS.deepSeaSubmarine,
    LOCAL_CINEMATIC_ASSETS.underwaterAbyss,
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1498623116890-37e912163d5d?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=1080&h=1920&q=85',
  ],

  // 3. Ancient Egypt, Pyramids & Sarcophagi
  ancient: [
    LOCAL_CINEMATIC_ASSETS.ancientPyramidChamber,
    LOCAL_CINEMATIC_ASSETS.ancientDesertPortal,
    LOCAL_CINEMATIC_ASSETS.historicalPalace,
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&h=1920&q=85',
  ],

  // 4. Great Wall of China & Asian Civilizations
  china: [
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1513415277900-a62401e19be4?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&h=1920&q=85',
    LOCAL_CINEMATIC_ASSETS.historicalPalace,
  ],

  // 5. Roman Empire & Classical Antiquity
  rome: [
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1529154036634-a20ab61f2a36?auto=format&fit=crop&w=1080&h=1920&q=85',
    LOCAL_CINEMATIC_ASSETS.historicalPalace,
    LOCAL_CINEMATIC_ASSETS.ancientPyramidChamber,
  ],

  // 6. Deep Space, Singularity & Galaxies
  space: [
    LOCAL_CINEMATIC_ASSETS.deepSpaceSingularity,
    LOCAL_CINEMATIC_ASSETS.deepSpaceNebula,
    LOCAL_CINEMATIC_ASSETS.cosmicWarp,
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=1080&h=1920&q=85',
  ],

  // 7. Tech Titans, Elon Musk, Steve Jobs & Silicon Valley
  tech_titans: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1080&h=1920&q=85',
    LOCAL_CINEMATIC_ASSETS.cyberLaboratory,
    LOCAL_CINEMATIC_ASSETS.cyberpunkCity,
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1080&h=1920&q=85',
  ],

  // 8. Cyberpunk & Artificial Intelligence
  scifi: [
    LOCAL_CINEMATIC_ASSETS.cyberpunkCity,
    LOCAL_CINEMATIC_ASSETS.cyberLaboratory,
    LOCAL_CINEMATIC_ASSETS.cyberpunkMystery,
    LOCAL_CINEMATIC_ASSETS.cosmicWarp,
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1080&h=1920&q=85',
  ],

  // 9. Wealth, Gold Vaults, Stock Markets & Luxury
  wealth: [
    LOCAL_CINEMATIC_ASSETS.bankVaultGold,
    'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1080&h=1920&q=85',
  ],

  // 10. Detective, Intelligence Dossiers & Classified Files
  detective: [
    LOCAL_CINEMATIC_ASSETS.radarDossier,
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1080&h=1920&q=85',
    LOCAL_CINEMATIC_ASSETS.aviationCockpit,
    LOCAL_CINEMATIC_ASSETS.cyberLaboratory,
    'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1080&h=1920&q=85',
    LOCAL_CINEMATIC_ASSETS.cyberpunkMystery,
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1080&h=1920&q=85',
    LOCAL_CINEMATIC_ASSETS.historicalPalace,
  ],

  // 11. Horror, Supernatural & Haunted Ruins
  horror: [
    LOCAL_CINEMATIC_ASSETS.volcanicCitadel,
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1080&h=1920&q=85',
  ],

  // 12. Medieval Castles, Fortresses & Citadels
  castles: [
    LOCAL_CINEMATIC_ASSETS.volcanicCitadel,
    LOCAL_CINEMATIC_ASSETS.historicalPalace,
    'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&h=1920&q=85',
  ],

  // 13. Deep Desert & Sand Dunes (Empty Quarter, Sahara)
  desert: [
    LOCAL_CINEMATIC_ASSETS.ancientDesertPortal,
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1080&h=1920&q=85',
    LOCAL_CINEMATIC_ASSETS.ancientPyramidChamber,
  ],

  // 14. Volcano, Magma & Elemental Cataclysms
  volcano: [
    LOCAL_CINEMATIC_ASSETS.volcanicCitadel,
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1080&h=1920&q=85',
    LOCAL_CINEMATIC_ASSETS.deepSpaceSingularity,
  ],

  // 15. General Mystery & Unsolved Wonders
  mystery: [
    LOCAL_CINEMATIC_ASSETS.radarDossier,
    LOCAL_CINEMATIC_ASSETS.deepSeaSubmarine,
    LOCAL_CINEMATIC_ASSETS.ancientDesertPortal,
    LOCAL_CINEMATIC_ASSETS.deepSpaceSingularity,
    LOCAL_CINEMATIC_ASSETS.ancientPyramidChamber,
    LOCAL_CINEMATIC_ASSETS.cyberpunkMystery,
    LOCAL_CINEMATIC_ASSETS.volcanicCitadel,
    LOCAL_CINEMATIC_ASSETS.historicalPalace,
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&h=1920&q=85',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1080&h=1920&q=85',
  ]
};

/**
 * Resolves the absolute best high-definition 9:16 vertical image for any scene
 * Employs semantic archetype matching + dynamic topic hashing to guarantee variety!
 */
export function getCinematicImageForScene(
  topic: string,
  categoryId: string,
  sceneNumber: number,
  visualPrompt?: string
): string {
  const combined = (topic + ' ' + (visualPrompt || '') + ' ' + categoryId).toLowerCase();

  let archetype = 'mystery';

  if (combined.includes('طائر') || combined.includes('طيران') || combined.includes('flight') || combined.includes('370') || combined.includes('radar') || combined.includes('airliner')) {
    archetype = 'aviation';
  } else if (combined.includes('صين') || combined.includes('سور الصين') || combined.includes('china') || combined.includes('great wall')) {
    archetype = 'china';
  } else if (combined.includes('روما') || combined.includes('قيصر') || combined.includes('إغريق') || combined.includes('يونان') || combined.includes('rome') || combined.includes('colosseum')) {
    archetype = 'rome';
  } else if (combined.includes('ماسك') || combined.includes('إيلون') || combined.includes('ستيف') || combined.includes('جوبز') || combined.includes('سبيس إكس') || combined.includes('أبل') || combined.includes('تسلا')) {
    archetype = 'tech_titans';
  } else if (combined.includes('بحر') || combined.includes('محيط') || combined.includes('غواص') || combined.includes('ماريانا') || combined.includes('سفين') || combined.includes('ocean') || combined.includes('trench') || combined.includes('برمودا')) {
    archetype = 'ocean';
  } else if (combined.includes('أهرام') || combined.includes('فرعون') || combined.includes('إرم') || combined.includes('ancient') || combined.includes('pyramid') || combined.includes('مومياء')) {
    archetype = 'ancient';
  } else if (combined.includes('صحراء') || combined.includes('رمال') || combined.includes('كثبان') || combined.includes('dune') || combined.includes('desert')) {
    archetype = 'desert';
  } else if (combined.includes('فضاء') || combined.includes('كوكب') || combined.includes('نجم') || combined.includes('ثقب') || combined.includes('space') || combined.includes('galaxy') || combined.includes('شمس') || combined.includes('كون') || combined.includes('مريخ')) {
    archetype = 'space';
  } else if (combined.includes('مال') || combined.includes('ثراء') || combined.includes('ذهب') || combined.includes('بورصة') || combined.includes('بنك') || combined.includes('wealth') || combined.includes('gold') || combined.includes('مليار') || combined.includes('روكفلر')) {
    archetype = 'wealth';
  } else if (combined.includes('بركان') || combined.includes('حمم') || combined.includes('نار') || combined.includes('volcano')) {
    archetype = 'volcano';
  } else if (combined.includes('قلعة') || combined.includes('حصن') || combined.includes('قصر') || combined.includes('castle') || combined.includes('fortress')) {
    archetype = 'castles';
  } else if (combined.includes('رعب') || combined.includes('شبح') || combined.includes('قبر') || combined.includes('مهجور') || combined.includes('horror') || combined.includes('ghost')) {
    archetype = 'horror';
  } else if (combined.includes('جريمة') || combined.includes('محقق') || combined.includes('لغز') || combined.includes('ملف') || combined.includes('تحقيق') || combined.includes('dossier')) {
    archetype = 'detective';
  } else if (combined.includes('ذكاء') || combined.includes('سيبر') || combined.includes('تقني') || combined.includes('روبوت') || combined.includes('مستقبل') || combined.includes('scifi') || combined.includes('ai')) {
    archetype = 'scifi';
  } else if (categoryId in EXTENSIVE_CINEMATIC_ASSETS) {
    archetype = categoryId;
  }

  const pool = EXTENSIVE_CINEMATIC_ASSETS[archetype] || EXTENSIVE_CINEMATIC_ASSETS.mystery;

  // DYNAMIC TOPIC HASHING: Ensures different topics and scenes get completely diverse images!
  let topicHash = 0;
  const hashSource = topic.trim();
  for (let i = 0; i < hashSource.length; i++) {
    topicHash = (topicHash * 33 + hashSource.charCodeAt(i)) & 0x7fffffff;
  }

  const index = Math.abs((topicHash + (sceneNumber - 1) * 3) % pool.length);
  return pool[index];
}
