/**
 * AI Style Reference & Aesthetic Matching Engine
 * Allows users to upload an AI-generated image as a visual reference/seed.
 * Analyzes palette, lighting, mood, and synthesizes matching vertical 9:16 scenes
 * that preserve visual coherence and high aesthetic fidelity across the entire video.
 */

export interface StyleReferenceProfile {
  id: string;
  name: string;
  imageUrl: string;
  dominantColor: string;
  palette: string[];
  lightingMood: 'cinematic_dark' | 'golden_warm' | 'neon_cyber' | 'deep_ocean_teal' | 'cosmic_ethereal' | 'hyper_vibrant';
  aestheticDescription: string;
  contrast: 'high' | 'medium' | 'soft';
}

// Built-in presets for instant inspiration
export const PRESET_STYLE_REFERENCES: StyleReferenceProfile[] = [
  {
    id: 'cinema_noir_dark',
    name: 'سينمائي غامض وظلال درامية (Cinematic Noir)',
    imageUrl: '/assets/images/classified_radar_dossier_1793883832867.jpg',
    dominantColor: '#0ea5e9',
    palette: ['#030712', '#0f172a', '#0284c7', '#38bdf8', '#f8fafc'],
    lightingMood: 'cinematic_dark',
    aestheticDescription: 'إضاءة جانبية حادة، ظلال عميقة، تباين لوني درامي وألوان كولد ستيل',
    contrast: 'high'
  },
  {
    id: 'cyber_neon_glow',
    name: 'سايبربانك ونيون مستقبلي (Cyber Neon)',
    imageUrl: '/assets/images/cyberpunk_neon_city_1793883864467.jpg',
    dominantColor: '#d946ef',
    palette: ['#0f051d', '#581c87', '#d946ef', '#06b6d4', '#f43f5e'],
    lightingMood: 'neon_cyber',
    aestheticDescription: 'أضواء نيون أرجوانية وزرقاء متوهجة، أسطح مبللة وانعكاسات ليلية',
    contrast: 'high'
  },
  {
    id: 'ancient_desert_gold',
    name: 'ذهب الصحراء والآثار القديمة (Desert Gold)',
    imageUrl: '/assets/images/scene_ancient_desert_portal_1793668725427.jpg',
    dominantColor: '#f59e0b',
    palette: ['#1c1917', '#451a03', '#b45309', '#f59e0b', '#fef3c7'],
    lightingMood: 'golden_warm',
    aestheticDescription: 'شمس الغروب الذهبية، رمال متوهجة، طراز أثري ونقوش حجرية ملحمية',
    contrast: 'medium'
  },
  {
    id: 'deep_abyss_teal',
    name: 'أعماق المحيط والفيروز المظلم (Deep Abyss)',
    imageUrl: '/assets/images/deep_sea_submarine_1793883762254.jpg',
    dominantColor: '#06b6d4',
    palette: ['#021b24', '#083344', '#0e7490', '#06b6d4', '#a5f3fc'],
    lightingMood: 'deep_ocean_teal',
    aestheticDescription: 'أعماق زرقاء وفيروزية، إضاءة كشافات موجهة وغموض مائي سحيق',
    contrast: 'high'
  },
  {
    id: 'cosmic_nebula_purple',
    name: 'سديم فضائي وأكوان موازية (Cosmic Ethereal)',
    imageUrl: '/assets/images/scene_deep_space_nebula_1793668726232.jpg',
    dominantColor: '#8b5cf6',
    palette: ['#09090b', '#2e1065', '#6b21a8', '#8b5cf6', '#c4b5fd'],
    lightingMood: 'cosmic_ethereal',
    aestheticDescription: 'توهج كوني أرجواني، ذرات نجوم متلألئة، شفق فضائي وتأثيرات أبعاد خارقة',
    contrast: 'high'
  }
];

/**
 * Extracts a representative color palette from an image URL or base64 data URL
 * using client-side canvas sampling
 */
export async function extractImageStyleProfile(imageUrl: string, customName?: string): Promise<StyleReferenceProfile> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(createFallbackProfile(imageUrl, customName));
          return;
        }

        canvas.width = 40;
        canvas.height = 40;
        ctx.drawImage(img, 0, 0, 40, 40);

        const imgData = ctx.getImageData(0, 0, 40, 40).data;
        let rSum = 0, gSum = 0, bSum = 0;
        const totalPixels = 40 * 40;

        for (let i = 0; i < imgData.length; i += 4) {
          rSum += imgData[i];
          gSum += imgData[i + 1];
          bSum += imgData[i + 2];
        }

        const avgR = Math.round(rSum / totalPixels);
        const avgG = Math.round(gSum / totalPixels);
        const avgB = Math.round(bSum / totalPixels);

        const hex = rgbToHex(avgR, avgG, avgB);

        // Determine mood based on color temperature and saturation
        let mood: StyleReferenceProfile['lightingMood'] = 'cinematic_dark';
        if (avgR > avgG && avgG > avgB && avgR > 130) {
          mood = 'golden_warm';
        } else if (avgB > avgR && avgG > avgR && avgB > 90) {
          mood = 'deep_ocean_teal';
        } else if (avgR > 120 && avgB > 120 && avgG < 110) {
          mood = 'neon_cyber';
        } else if (avgB > 110 && avgR > 80) {
          mood = 'cosmic_ethereal';
        }

        const profile: StyleReferenceProfile = {
          id: `custom-ref-${Date.now()}`,
          name: customName || 'صورة مرجعية خاصة مولدة بالذكاء الاصطناعي',
          imageUrl,
          dominantColor: hex,
          palette: [
            darkenHex(hex, 0.7),
            darkenHex(hex, 0.4),
            hex,
            lightenHex(hex, 0.3),
            lightenHex(hex, 0.6)
          ],
          lightingMood: mood,
          aestheticDescription: `نمط بصري متناسق مع النغمات اللونية (${hex}) وإضاءة سينمائية متدرجة`,
          contrast: 'high'
        };

        resolve(profile);
      } catch (e) {
        resolve(createFallbackProfile(imageUrl, customName));
      }
    };

    img.onerror = () => {
      resolve(createFallbackProfile(imageUrl, customName));
    };
  });
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function darkenHex(hex: string, factor: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.round(((num >> 16) & 255) * (1 - factor)));
  const g = Math.max(0, Math.round(((num >> 8) & 255) * (1 - factor)));
  const b = Math.max(0, Math.round((num & 255) * (1 - factor)));
  return rgbToHex(r, g, b);
}

function lightenHex(hex: string, factor: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.round(((num >> 16) & 255) + (255 - ((num >> 16) & 255)) * factor));
  const g = Math.min(255, Math.round(((num >> 8) & 255) + (255 - ((num >> 8) & 255)) * factor));
  const b = Math.min(255, Math.round((num & 255) + (255 - (num & 255)) * factor));
  return rgbToHex(r, g, b);
}

function createFallbackProfile(imageUrl: string, customName?: string): StyleReferenceProfile {
  return {
    id: `custom-ref-${Date.now()}`,
    name: customName || 'صورة مرجعية مخصصة',
    imageUrl,
    dominantColor: '#0ea5e9',
    palette: ['#030712', '#0f172a', '#0284c7', '#38bdf8', '#f8fafc'],
    lightingMood: 'cinematic_dark',
    aestheticDescription: 'نمط سينمائي احترافي عالي الدقة بمقاس تيك توك 9:16',
    contrast: 'high'
  };
}

/**
 * Augment a scene's visual prompt with the aesthetic traits of the uploaded reference image
 */
export function injectStyleReferenceToPrompt(basePrompt: string, styleProfile: StyleReferenceProfile): string {
  const moodTags: Record<StyleReferenceProfile['lightingMood'], string> = {
    cinematic_dark: 'cinematic deep shadows, dramatic rim lighting, film noir tones, 8k resolution, 9:16 portrait composition',
    golden_warm: 'warm golden hour sun, amber atmospheric volumetric dust, ancient epic textures, rich warm lighting, 8k vertical',
    neon_cyber: 'vibrant magenta and cyan neon rim lighting, wet reflective surfaces, cyberpunk aesthetic, high contrast 8k vertical',
    deep_ocean_teal: 'deep oceanic bioluminescent teal, volumetric underwater god rays, atmospheric haze, moody teal and blue 8k',
    cosmic_ethereal: 'cosmic ethereal nebula illumination, starlight reflections, deep violet and indigo palette, transcendental 8k',
    hyper_vibrant: 'vivid saturated color grade, dynamic cinematic lens flare, crisp micro-details, ultra-realistic vertical 9:16'
  };

  const styleTag = moodTags[styleProfile.lightingMood] || moodTags.cinematic_dark;
  return `${basePrompt}, matching aesthetic style with palette dominant ${styleProfile.dominantColor}, ${styleTag}, consistent filmic grading.`;
}
