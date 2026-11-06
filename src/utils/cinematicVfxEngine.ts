/**
 * Cinematic VFX & Transition Engine
 * Provides high-retention viral video effects: Glow/Bloom, Camera Shakes, Film Leaks,
 * Floating Embers, Chromatic Glitches, and Dynamic Canvas Transitions.
 * Designed to recreate Hollywood-grade Reels & TikTok visual engagement.
 */

import { SceneItem } from '../data/storyLibrary';

export type VfxEffectType = 
  | 'glow_bloom' 
  | 'film_grain' 
  | 'fire_embers' 
  | 'light_leaks' 
  | 'cyber_scanline' 
  | 'cinematic_vignette' 
  | 'none';

export type ShakeIntensityType = 
  | 'none' 
  | 'subtle' 
  | 'impact_bass' 
  | 'tremor';

export type TransitionStyleType = 
  | 'zoom_warp' 
  | 'whip_pan' 
  | 'flash_white' 
  | 'film_glitch' 
  | 'fade_black' 
  | 'cross_dissolve';

export interface VfxPresetInfo {
  id: VfxEffectType;
  titleAr: string;
  titleEn: string;
  icon: string;
  description: string;
  badge: string;
}

export interface ShakePresetInfo {
  id: ShakeIntensityType;
  titleAr: string;
  titleEn: string;
  icon: string;
  description: string;
}

export interface TransitionPresetInfo {
  id: TransitionStyleType;
  titleAr: string;
  titleEn: string;
  icon: string;
  description: string;
}

export const VFX_PRESETS: VfxPresetInfo[] = [
  {
    id: 'glow_bloom',
    titleAr: 'توهج سينمائي (Bloom & Glow)',
    titleEn: 'Cinematic Bloom Glow',
    icon: 'Sparkles',
    description: 'إشراقة ضوئية ناعمة وتوهج ألماسي يحاكي العدسات السينمائية باهظة الثمن.',
    badge: 'الأكثر طلباً',
  },
  {
    id: 'light_leaks',
    titleAr: 'تسريب أضواء سينمائية (Light Leaks)',
    titleEn: 'Anamorphic Light Leaks',
    icon: 'Sun',
    description: 'ومضات ضوء برتقالية وذهبية عابرة في زوايا الكاميرا تمنح إحساس 35mm الأصيل.',
    badge: 'فيروسي',
  },
  {
    id: 'fire_embers',
    titleAr: 'شرار وجزيئات ذهبية طافية (Floating Embers)',
    titleEn: 'Floating Golden Embers',
    icon: 'Flame',
    description: 'جزيئات وشهب ذهبية مضيئة تتحرك للأعلى مع تغير زوايا الضوء لتجربة خيالية عميقة.',
    badge: 'مبهر',
  },
  {
    id: 'film_grain',
    titleAr: 'حبيبات فيلم كلاسيكي 35mm (Vintage Grain)',
    titleEn: '35mm Film Grain',
    icon: 'Film',
    description: 'ملمس سينمائي احترافي يزيل الجمود الرقمي ويضفي دفء الأفلام الوثائقية العالمية.',
    badge: 'كلاسيكي',
  },
  {
    id: 'cyber_scanline',
    titleAr: 'خطوط سايبر وشذوذ لوني (Cyber CRT & Chromatic)',
    titleEn: 'Cyberpunk Scanlines',
    icon: 'Zap',
    description: 'تأثير شاشات المستقبل مع تقسيم طيفي (RGB Split) مناسب للخيال والغموض والذكاء الاصطناعي.',
    badge: 'سايبر',
  },
  {
    id: 'cinematic_vignette',
    titleAr: 'تأطير درامي داكن (Deep Vignette)',
    titleEn: 'Dramatic Vignette',
    icon: 'Eye',
    description: 'تعتيم درامي حاد للأطراف لجذب عين المشاهد لمركز الحدث ومضاعفة نسبة المشاهدة.',
    badge: 'تركيز حاد',
  },
  {
    id: 'none',
    titleAr: 'صورة نقية بدون فلاتر (Pure Minimal)',
    titleEn: 'Clean Original',
    icon: 'Sliders',
    description: 'عرض المشهد كما هو دون إضافات بصرية إضافية.',
    badge: 'نقي',
  },
];

export const SHAKE_PRESETS: ShakePresetInfo[] = [
  {
    id: 'impact_bass',
    titleAr: 'ارتطام الباس والضربات (Bass Beat Punch)',
    titleEn: 'Impact Bass Shake',
    icon: 'Activity',
    description: 'اهتزاز فوري متناسق مع الإيقاعات القوية وبدايات الجمل المشوقة.',
  },
  {
    id: 'subtle',
    titleAr: 'اهتزاز يدوي طبيعي (Handheld Float)',
    titleEn: 'Organic Handheld',
    icon: 'Move',
    description: 'حركة كاميرا بشرية هادئة تشعر المشاهد وكأن المشهد مصور بواسطة مخرج حي.',
  },
  {
    id: 'tremor',
    titleAr: 'ارتعاش تشويق درامي (Suspense Tremor)',
    titleEn: 'Suspense Tremor',
    icon: 'Vibrate',
    description: 'اهتزاز ذبذبي متسارع للمشاهد الصادمة ولحظات الذروة والمفاجآت.',
  },
  {
    id: 'none',
    titleAr: 'كاميرا ثابتة تماماً (Smooth Gimbal)',
    titleEn: 'Static Smooth',
    icon: 'Minimize2',
    description: 'حركة كين بيرنز انسيابية بدون ارتعاشات.',
  },
];

export const TRANSITION_PRESETS: TransitionPresetInfo[] = [
  {
    id: 'zoom_warp',
    titleAr: 'التفاف زووم فائق (Zoom-Warp Hyperspace)',
    titleEn: 'Hyper Zoom-Warp',
    icon: 'Maximize',
    description: 'اندفاع سينمائي سريع نحو عمق المشهد القادم يجبر المشاهد على مواصلة المتابعة.',
  },
  {
    id: 'whip_pan',
    titleAr: 'سوط الكاميرا السريع (Cinematic Whip-Pan)',
    titleEn: 'Directional Whip-Pan',
    icon: 'FastForward',
    description: 'التفاف أفقي ناعم وسريع مع تشويش الحركة (Motion Blur) الاحترافي.',
  },
  {
    id: 'flash_white',
    titleAr: 'وميض ضوئي فائق السطوع (Anamorphic White Flash)',
    titleEn: 'Anamorphic White Flash',
    icon: 'Sun',
    description: 'انفجار ضوء ساطع أبيض/ذهبي ينقل المشهد في كسر من الثانية بحماس عالٍ.',
  },
  {
    id: 'film_glitch',
    titleAr: 'تداخل رقمي وخلل طيفي (RGB Glitch Slice)',
    titleEn: 'RGB Film Glitch',
    icon: 'Radio',
    description: 'تقطيع لوني سريع ومؤثر طيفي للأفلام الحديثة والمحتوى التكنولوجي والغامض.',
  },
  {
    id: 'cross_dissolve',
    titleAr: 'انصهار حريري ناعم (Liquid Cross-Dissolve)',
    titleEn: 'Cross Dissolve',
    icon: 'Layers',
    description: 'تلاشي تدريجي فائق النعومة بين الصورتين دون انقطاع العين.',
  },
  {
    id: 'fade_black',
    titleAr: 'تلاشي سينمائي للسواد (Dramatic Black Dip)',
    titleEn: 'Cinematic Black Dip',
    icon: 'Moon',
    description: 'هبوط سريع للسواد لإبراز الفصول القصصية والمفارقات الصادمة.',
  },
];

/**
 * Calculates camera shake transformation matrix offsets
 */
export function calculateCameraShake(
  localTime: number,
  intensity: ShakeIntensityType,
  isTransitionActive: boolean
): { offsetX: number; offsetY: number; rotation: number; scaleMod: number } {
  if (intensity === 'none') {
    return { offsetX: 0, offsetY: 0, rotation: 0, scaleMod: 1.0 };
  }

  if (intensity === 'subtle') {
    const offsetX = Math.sin(localTime * 2.5) * 6 + Math.cos(localTime * 1.8) * 3;
    const offsetY = Math.cos(localTime * 2.1) * 5 + Math.sin(localTime * 1.3) * 3;
    const rotation = Math.sin(localTime * 1.5) * 0.006;
    return { offsetX, offsetY, rotation, scaleMod: 1.02 };
  }

  if (intensity === 'impact_bass') {
    // Sharp punch near scene beginning or recurring pulses
    const pulseFactor = Math.max(0, 1 - (localTime % 2.0) * 2.5);
    const transitionPunch = isTransitionActive ? 2.5 : 1.0;
    const totalPunch = (pulseFactor + (isTransitionActive ? 1.5 : 0)) * transitionPunch;
    
    const offsetX = (Math.sin(localTime * 55) * 14 + Math.sin(localTime * 110) * 6) * Math.min(2.0, totalPunch + 0.15);
    const offsetY = (Math.cos(localTime * 48) * 10) * Math.min(2.0, totalPunch + 0.15);
    const rotation = Math.sin(localTime * 35) * 0.012 * Math.min(1.5, totalPunch);
    const scaleMod = 1.0 + (totalPunch * 0.03);
    return { offsetX, offsetY, rotation, scaleMod };
  }

  if (intensity === 'tremor') {
    const freq = 45;
    const offsetX = (Math.sin(localTime * freq) * 12) + (Math.sin(localTime * 90) * 5);
    const offsetY = (Math.cos(localTime * (freq + 7)) * 10);
    const rotation = Math.sin(localTime * 25) * 0.015;
    return { offsetX, offsetY, rotation, scaleMod: 1.03 };
  }

  return { offsetX: 0, offsetY: 0, rotation: 0, scaleMod: 1.0 };
}

/**
 * Renders atmospheric VFX overlays directly onto the 2D canvas context
 */
export function renderCinematicVfxLayer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  vfx: VfxEffectType = 'glow_bloom',
  moodColor: string = '#0ea5e9'
) {
  if (vfx === 'none') return;

  ctx.save();

  switch (vfx) {
    case 'glow_bloom': {
      // Warm anamorphic golden & teal ambient bloom
      const bloomGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.35, width * 0.1,
        width * 0.5, height * 0.45, width * 0.95
      );
      const pulse = 0.18 + Math.sin(time * 2.0) * 0.06;
      bloomGrad.addColorStop(0, `rgba(255, 235, 180, ${pulse * 1.5})`);
      bloomGrad.addColorStop(0.4, `rgba(250, 204, 21, ${pulse * 0.6})`);
      bloomGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0)');
      
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = bloomGrad;
      ctx.fillRect(0, 0, width, height);

      // Top corner soft flare
      const flareGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, width * 0.7);
      flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      flareGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.15)');
      flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, 0, width * 0.7, height * 0.5);
      break;
    }

    case 'light_leaks': {
      // 35mm moving dynamic light leaks from edges
      ctx.globalCompositeOperation = 'screen';
      const leakPos = (Math.sin(time * 0.8) * 0.5 + 0.5);
      const leakX = width * (0.2 + leakPos * 0.6);
      const leakGrad = ctx.createRadialGradient(
        leakX, 0, 10,
        leakX, height * 0.35, width * 0.8
      );
      const leakAlpha = 0.28 + Math.cos(time * 1.5) * 0.12;
      leakGrad.addColorStop(0, `rgba(255, 170, 50, ${leakAlpha * 1.4})`);
      leakGrad.addColorStop(0.3, `rgba(239, 68, 68, ${leakAlpha * 0.8})`);
      leakGrad.addColorStop(0.7, `rgba(168, 85, 247, ${leakAlpha * 0.4})`);
      leakGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = leakGrad;
      ctx.fillRect(0, 0, width, height * 0.6);
      break;
    }

    case 'fire_embers': {
      // Rising radiant sparks and dust motes
      ctx.globalCompositeOperation = 'screen';
      const count = 42;
      for (let i = 0; i < count; i++) {
        const seed = i * 7919;
        const speed = 65 + (i % 7) * 20;
        const y = (height + 50 - ((time * speed + seed) % (height + 100)));
        const sway = Math.sin(time * 2.2 + i) * 22;
        const x = ((seed * 37) % width) + sway;
        const size = (i % 5 === 0) ? 3.5 : (i % 3 === 0) ? 2.5 : 1.5;
        const alpha = Math.abs(Math.sin(time * 3 + i * 0.7)) * 0.75 + 0.25;

        const emberGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        emberGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        emberGrad.addColorStop(0.3, `rgba(251, 191, 36, ${alpha * 0.9})`);
        emberGrad.addColorStop(0.7, `rgba(239, 68, 68, ${alpha * 0.5})`);
        emberGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = emberGrad;
        ctx.beginPath();
        ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'film_grain': {
      // 35mm documentary film grain simulation
      ctx.globalCompositeOperation = 'overlay';
      const grainStep = 4;
      const tSeed = Math.floor(time * 24); // 24 FPS jitter
      ctx.fillStyle = 'rgba(255, 255, 255, 0.055)';
      
      // Draw procedural sparse film specks
      for (let i = 0; i < 280; i++) {
        const gx = ((i * 1337 + tSeed * 997) % width);
        const gy = ((i * 3571 + tSeed * 643) % height);
        ctx.fillRect(gx, gy, grainStep, grainStep);
      }
      
      // Dark specks
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
      for (let i = 0; i < 280; i++) {
        const gx = ((i * 2467 + tSeed * 883) % width);
        const gy = ((i * 4861 + tSeed * 521) % height);
        ctx.fillRect(gx, gy, grainStep, grainStep);
      }
      break;
    }

    case 'cyber_scanline': {
      // CRT Scanlines & RGB split chromatic bars
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      for (let y = 0; y < height; y += 6) {
        ctx.fillRect(0, y, width, 2);
      }

      // Occasional glowing cyan / purple glitch line
      const glitchActive = (Math.sin(time * 12) > 0.85);
      if (glitchActive) {
        ctx.globalCompositeOperation = 'screen';
        const gy = ((time * 300) % height);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.fillRect(0, gy, width, 14);

        ctx.fillStyle = 'rgba(236, 72, 153, 0.3)';
        ctx.fillRect(0, (gy + 10) % height, width, 8);
      }
      break;
    }

    case 'cinematic_vignette': {
      // Super deep 2.39:1 / 9:16 vertical spotlight vignette
      const deepVignette = ctx.createRadialGradient(
        width / 2, height / 2, width * 0.28,
        width / 2, height / 2, width * 0.95
      );
      deepVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      deepVignette.addColorStop(0.65, 'rgba(0, 0, 0, 0.55)');
      deepVignette.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
      
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = deepVignette;
      ctx.fillRect(0, 0, width, height);
      break;
    }
  }

  ctx.restore();
}

/**
 * Renders transition overlay effects (Zoom Warp, Whip Pan, Flash, Glitch, Dissolve)
 */
export function renderTransitionEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  transition: TransitionStyleType,
  progress: number // from 1.0 (just transitioned) down to 0.0 (done)
) {
  if (progress <= 0) return;

  ctx.save();

  switch (transition) {
    case 'zoom_warp': {
      // Radial speed blur lines surging outward from center
      ctx.globalCompositeOperation = 'screen';
      const center = { x: width / 2, y: height / 2 };
      const rays = 24;
      for (let i = 0; i < rays; i++) {
        const angle = (i / rays) * Math.PI * 2;
        const len = width * 0.7 * progress;
        const x2 = center.x + Math.cos(angle) * len;
        const y2 = center.y + Math.sin(angle) * len;

        const rayGrad = ctx.createLinearGradient(center.x, center.y, x2, y2);
        rayGrad.addColorStop(0, `rgba(255, 255, 255, ${progress * 0.7})`);
        rayGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.strokeStyle = rayGrad;
        ctx.lineWidth = 14 * progress;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Center flash
      ctx.fillStyle = `rgba(255, 255, 255, ${progress * 0.45})`;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'whip_pan': {
      // Horizontal motion streak bars
      ctx.globalCompositeOperation = 'screen';
      const barCount = 12;
      for (let b = 0; b < barCount; b++) {
        const y = (b / barCount) * height;
        const h = height / barCount;
        const streakGrad = ctx.createLinearGradient(0, y, width, y);
        streakGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        streakGrad.addColorStop(0.5, `rgba(255, 255, 255, ${progress * 0.55})`);
        streakGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = streakGrad;
        ctx.fillRect(0, y, width, h);
      }
      break;
    }

    case 'flash_white': {
      // Blinding cinematic white & anamorphic amber flash
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, progress * 0.85)})`;
      ctx.fillRect(0, 0, width, height);

      // Horizontal lens flare streak across center
      const streakGrad = ctx.createLinearGradient(0, height * 0.5, width, height * 0.5);
      streakGrad.addColorStop(0, 'rgba(251, 191, 36, 0)');
      streakGrad.addColorStop(0.5, `rgba(255, 255, 255, ${progress * 0.9})`);
      streakGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');

      ctx.fillStyle = streakGrad;
      ctx.fillRect(0, height * 0.48, width, 18);
      break;
    }

    case 'film_glitch': {
      // Chromatic horizontal slice distortion
      const slices = 8;
      for (let s = 0; s < slices; s++) {
        const sliceY = (s / slices) * height + (Math.sin(s * 9) * 20);
        const sliceH = (height / slices) * 0.6;
        const shiftX = Math.sin(s * 15) * 45 * progress;

        ctx.fillStyle = s % 2 === 0 
          ? `rgba(6, 182, 212, ${progress * 0.45})` 
          : `rgba(244, 63, 94, ${progress * 0.45})`;
        ctx.fillRect(shiftX > 0 ? 0 : shiftX, sliceY, width + Math.abs(shiftX), sliceH);
      }
      break;
    }

    case 'fade_black': {
      // Dramatic Dip to Black
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.8})`;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'cross_dissolve': {
      // Soft ambient dissolve glow
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = `rgba(255, 240, 220, ${progress * 0.35})`;
      ctx.fillRect(0, 0, width, height);
      break;
    }
  }

  ctx.restore();
}

/**
 * 1-Click Auto-Applies viral cinematic VFX, shakes, and transitions
 * tailored to story category and scene pacing (Hook -> Build-up -> Climax -> Ending)
 */
export function autoApplyCinematicVfx(
  scenes: SceneItem[],
  categoryId: string = 'mystery'
): SceneItem[] {
  const total = scenes.length;

  return scenes.map((scene, idx) => {
    const isFirstHook = idx === 0;
    const isClimax = idx === Math.floor(total * 0.75);
    const isLast = idx === total - 1;

    let vfx: VfxEffectType = 'glow_bloom';
    let shake: ShakeIntensityType = 'subtle';
    let transition: TransitionStyleType = 'zoom_warp';

    // Hook Scene (0): Maximum viral retention impact
    if (isFirstHook) {
      shake = 'impact_bass';
      transition = 'flash_white';
      vfx = categoryId === 'scifi' ? 'cyber_scanline' : 'light_leaks';
    } 
    // Climax Scene: High tension and shock
    else if (isClimax) {
      shake = 'tremor';
      transition = 'zoom_warp';
      vfx = categoryId === 'horror' || categoryId === 'mystery' ? 'fire_embers' : 'glow_bloom';
    }
    // Ending Scene: Satisfying cinematic close
    else if (isLast) {
      shake = 'subtle';
      transition = 'fade_black';
      vfx = 'cinematic_vignette';
    }
    // Mid scenes: Category-tailored atmosphere
    else {
      switch (categoryId) {
        case 'scifi':
          vfx = idx % 2 === 0 ? 'cyber_scanline' : 'glow_bloom';
          shake = idx % 2 === 0 ? 'impact_bass' : 'subtle';
          transition = idx % 2 === 0 ? 'film_glitch' : 'zoom_warp';
          break;
        case 'history':
        case 'wealth':
          vfx = idx % 2 === 0 ? 'fire_embers' : 'light_leaks';
          shake = 'subtle';
          transition = idx % 2 === 0 ? 'whip_pan' : 'cross_dissolve';
          break;
        case 'horror':
        case 'mystery':
          vfx = idx % 2 === 0 ? 'cinematic_vignette' : 'film_grain';
          shake = idx % 3 === 0 ? 'tremor' : 'impact_bass';
          transition = idx % 2 === 0 ? 'zoom_warp' : 'whip_pan';
          break;
        case 'space':
        case 'fantasy':
        default:
          vfx = idx % 2 === 0 ? 'glow_bloom' : 'fire_embers';
          shake = 'impact_bass';
          transition = idx % 2 === 0 ? 'zoom_warp' : 'flash_white';
          break;
      }
    }

    return {
      ...scene,
      vfxEffect: vfx,
      shakeIntensity: shake,
      transitionType: transition,
    };
  });
}
