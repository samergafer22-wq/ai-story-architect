/**
 * Advanced Neural Visual Synthesizer
 * Generates custom, breathtaking, topic-tailored 9:16 vertical artwork for ANY story and scene.
 * Dynamically reacts to scene text, archetype, scene progression (1 to 8), and atmospheric lighting.
 */

export interface SceneVisualSpecs {
  topic: string;
  category: string;
  sceneNumber: number;
  totalScenes: number;
  visualPrompt: string;
  moodColor: string;
  time: number;
  cameraMotion: string;
  aiEngine?: string;
}

export function synthesizeSceneVisual(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  specs: SceneVisualSpecs
) {
  const { topic, category, sceneNumber, visualPrompt, moodColor, time, cameraMotion } = specs;
  const promptText = (topic + ' ' + visualPrompt + ' ' + category).toLowerCase();

  // 1. Detect Thematic Archetype from Prompt Text
  const isAviation = promptText.includes('طائر') || promptText.includes('طيران') || promptText.includes('flight') || promptText.includes('plane') || promptText.includes('radar') || promptText.includes('370') || promptText.includes('جو');
  const isOcean = promptText.includes('بحر') || promptText.includes('محيط') || promptText.includes('سفين') || promptText.includes('غواص') || promptText.includes('ocean') || promptText.includes('sea') || promptText.includes('ship') || promptText.includes('underwater') || promptText.includes('abyss') || promptText.includes('تيتان');
  const isAncient = promptText.includes('أهرام') || promptText.includes('فرعون') || promptText.includes('أثر') || promptText.includes('صحراء') || promptText.includes('قصر') || promptText.includes('ancient') || promptText.includes('pyramid') || promptText.includes('tomb') || promptText.includes('desert') || promptText.includes('monolith') || promptText.includes('إرم') || promptText.includes('حضار');
  const isSpace = promptText.includes('فضاء') || promptText.includes('كوكب') || promptText.includes('نجم') || promptText.includes('ثقب') || promptText.includes('space') || promptText.includes('galaxy') || promptText.includes('astronaut') || promptText.includes('cosmic') || promptText.includes('singularity') || promptText.includes('nebula') || promptText.includes('شمس');
  const isDetective = promptText.includes('جريمة') || promptText.includes('محقق') || promptText.includes('لغز') || promptText.includes('ملف') || promptText.includes('تحقيق') || promptText.includes('mystery') || promptText.includes('detective') || promptText.includes('crime') || promptText.includes('evidence');
  const isWealth = promptText.includes('مال') || promptText.includes('ثراء') || promptText.includes('ذهب') || promptText.includes('بنك') || promptText.includes('بورصة') || promptText.includes('wealth') || promptText.includes('gold') || promptText.includes('money') || promptText.includes('rich') || promptText.includes('millionaire');
  const isHorror = promptText.includes('رعب') || promptText.includes('شبح') || promptText.includes('قبر') || promptText.includes('مهجور') || promptText.includes('horror') || promptText.includes('ghost') || promptText.includes('creepy') || promptText.includes('shadow');
  const isVolcanic = promptText.includes('بركان') || promptText.includes('حمم') || promptText.includes('نار') || promptText.includes('volcano') || promptText.includes('lava') || promptText.includes('fire') || promptText.includes('inferno');
  const isCyber = promptText.includes('سايبر') || promptText.includes('ذكاء') || promptText.includes('مختبر') || promptText.includes('روبوت') || promptText.includes('شفر') || promptText.includes('cyber') || promptText.includes('robot') || promptText.includes('matrix') || promptText.includes('hologram') || promptText.includes('future') || promptText.includes('ai') || (!isAviation && !isOcean && !isAncient && !isSpace && !isDetective && !isWealth && !isHorror && !isVolcanic);

  // 2. Base Multi-Stop Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, width * 0.15, height);
  if (isAviation) {
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(0.35, '#0f172a');
    skyGrad.addColorStop(0.7, '#1e293b');
    skyGrad.addColorStop(1, '#020617');
  } else if (isOcean) {
    skyGrad.addColorStop(0, '#010814');
    skyGrad.addColorStop(0.35, '#03203c');
    skyGrad.addColorStop(0.7, '#04364a');
    skyGrad.addColorStop(1, '#010a12');
  } else if (isAncient) {
    skyGrad.addColorStop(0, '#0c0702');
    skyGrad.addColorStop(0.4, '#271206');
    skyGrad.addColorStop(0.75, '#451a03');
    skyGrad.addColorStop(1, '#0c0702');
  } else if (isSpace) {
    skyGrad.addColorStop(0, '#030108');
    skyGrad.addColorStop(0.35, '#19052b');
    skyGrad.addColorStop(0.7, '#380a45');
    skyGrad.addColorStop(1, '#04010a');
  } else if (isDetective) {
    skyGrad.addColorStop(0, '#09090b');
    skyGrad.addColorStop(0.4, '#18181b');
    skyGrad.addColorStop(0.75, '#27272a');
    skyGrad.addColorStop(1, '#09090b');
  } else if (isWealth) {
    skyGrad.addColorStop(0, '#05070a');
    skyGrad.addColorStop(0.4, '#171a0e');
    skyGrad.addColorStop(0.75, '#2b2c14');
    skyGrad.addColorStop(1, '#070a0d');
  } else if (isHorror) {
    skyGrad.addColorStop(0, '#050505');
    skyGrad.addColorStop(0.4, '#1c0c16');
    skyGrad.addColorStop(0.75, '#2e1022');
    skyGrad.addColorStop(1, '#050505');
  } else if (isVolcanic) {
    skyGrad.addColorStop(0, '#120202');
    skyGrad.addColorStop(0.4, '#380606');
    skyGrad.addColorStop(0.75, '#5c0b0b');
    skyGrad.addColorStop(1, '#0a0101');
  } else {
    // Cyberpunk
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(0.45, moodColor || '#0369a1');
    skyGrad.addColorStop(1, '#020617');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.save();

  // 3. Archetype-Specific Atmospheric Background Layers
  if (isSpace) {
    // Deep Space Singularity & Accretion Disk
    const cx = width * 0.5;
    const cy = height * 0.38;
    const coreR = width * 0.48;
    const coreGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, coreR);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.18, '#f59e0b');
    coreGrad.addColorStop(0.45, '#a855f7');
    coreGrad.addColorStop(0.8, '#3b82f6');
    coreGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fill();

    // Event Horizon Void
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(cx, cy, width * 0.13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Accretion Ring with perspective
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.35 + Math.sin(time * 0.4) * 0.04);
    ctx.scale(1, 0.32);
    const ringGrad = ctx.createRadialGradient(0, 0, width * 0.15, 0, 0, width * 0.6);
    ringGrad.addColorStop(0, 'rgba(250, 204, 21, 0.95)');
    ringGrad.addColorStop(0.4, 'rgba(236, 72, 153, 0.7)');
    ringGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.arc(0, 0, width * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

  } else if (isAviation) {
    // Volumetric Storm Cloud Bank & Radar Grid
    for (let c = 0; c < 6; c++) {
      const cx = width * (0.15 + c * 0.16);
      const cy = height * 0.28 + Math.sin(c + time) * 35;
      const cr = width * (0.3 + (c % 2) * 0.1);
      const cloudGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, cr);
      cloudGrad.addColorStop(0, 'rgba(30, 41, 59, 0.9)');
      cloudGrad.addColorStop(0.65, 'rgba(15, 23, 42, 0.75)');
      cloudGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = cloudGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dynamic lightning branch
    if (Math.sin(time * 9) > 0.88) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(width * 0.65, 40);
      ctx.lineTo(width * 0.55, height * 0.22);
      ctx.lineTo(width * 0.62, height * 0.26);
      ctx.lineTo(width * 0.48, height * 0.48);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Glowing Air Traffic Radar Rings
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let r = 60; r <= width * 0.48; r += 60) {
      ctx.arc(width * 0.5, height * 0.68, r, 0, Math.PI * 2);
    }
    ctx.stroke();

    // Radar Sweeper Beam
    const sweepAngle = time * 2.8;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.68);
    ctx.lineTo(
      width * 0.5 + Math.cos(sweepAngle) * width * 0.48,
      height * 0.68 + Math.sin(sweepAngle) * width * 0.48
    );
    ctx.stroke();

  } else if (isAncient) {
    // Starry Desert Night & Monolithic Pyramids
    // Crescent Gold Moon
    const mx = width * 0.75;
    const my = height * 0.18;
    const moonGrad = ctx.createRadialGradient(mx, my, 5, mx, my, 45);
    moonGrad.addColorStop(0, '#fef08a');
    moonGrad.addColorStop(0.35, '#fde047');
    moonGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(mx, my, 45, 0, Math.PI * 2);
    ctx.fill();

    // Distant Pyramid
    ctx.fillStyle = '#1c1004';
    ctx.beginPath();
    ctx.moveTo(width * 0.05, height * 0.76);
    ctx.lineTo(width * 0.35, height * 0.45);
    ctx.lineTo(width * 0.65, height * 0.76);
    ctx.closePath();
    ctx.fill();

    // Great Foreground Pyramid with glowing golden capstone
    const pyrGrad = ctx.createLinearGradient(width * 0.45, height * 0.32, width * 0.9, height * 0.85);
    pyrGrad.addColorStop(0, '#b45309');
    pyrGrad.addColorStop(0.5, '#78350f');
    pyrGrad.addColorStop(1, '#0c0702');
    ctx.fillStyle = pyrGrad;
    ctx.beginPath();
    ctx.moveTo(width * 0.22, height * 0.82);
    ctx.lineTo(width * 0.62, height * 0.32);
    ctx.lineTo(width * 0.98, height * 0.82);
    ctx.closePath();
    ctx.fill();

    // Glowing Capstone
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(width * 0.56, height * 0.39);
    ctx.lineTo(width * 0.62, height * 0.32);
    ctx.lineTo(width * 0.68, height * 0.39);
    ctx.closePath();
    ctx.fill();

    // Hieroglyphic light beam shooting into sky
    const beamGrad = ctx.createLinearGradient(width * 0.62, height * 0.32, width * 0.62, 0);
    beamGrad.addColorStop(0, 'rgba(250, 204, 21, 0.85)');
    beamGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(width * 0.6, height * 0.32);
    ctx.lineTo(width * 0.55, 0);
    ctx.lineTo(width * 0.69, 0);
    ctx.lineTo(width * 0.64, height * 0.32);
    ctx.closePath();
    ctx.fill();

  } else if (isOcean) {
    // Bioluminescent underwater rays & Submerged monolithic pillars
    const rayGrad = ctx.createLinearGradient(width * 0.3, 0, width * 0.7, height);
    rayGrad.addColorStop(0, 'rgba(20, 184, 166, 0.48)');
    rayGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.22)');
    rayGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(width * 0.15, 0);
    ctx.lineTo(width * 0.55, 0);
    ctx.lineTo(width * 0.88, height);
    ctx.lineTo(width * 0.32, height);
    ctx.closePath();
    ctx.fill();

    // Submerged Ancient City Columns
    ctx.fillStyle = '#02182b';
    for (let p = 0; p < 4; p++) {
      const colX = width * (0.12 + p * 0.24);
      const colW = width * 0.15;
      const colH = height * 0.48 + (p % 2) * 55;
      ctx.fillRect(colX, height - colH, colW, colH);

      // Bioluminescent turquoise veins
      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(colX + 8, height - colH + 20);
      ctx.lineTo(colX + colW - 12, height - colH + 90);
      ctx.lineTo(colX + 18, height - colH + 160);
      ctx.stroke();
    }

  } else if (isDetective) {
    // Noir Venetian Blinds Lighting & Murder Investigation Board
    ctx.save();
    // Ambient light strips through blinds
    for (let b = 0; b < 14; b++) {
      const by = b * (height / 14);
      ctx.fillStyle = b % 2 === 0 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, by, width, height / 14);
    }

    // Pinned Evidence Board in background
    ctx.fillStyle = '#27272a';
    ctx.fillRect(width * 0.1, height * 0.18, width * 0.8, height * 0.55);
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 4;
    ctx.strokeRect(width * 0.1, height * 0.18, width * 0.8, height * 0.55);

    // Photos pinned to board with red connecting thread
    const photos = [
      { x: width * 0.2, y: height * 0.25 },
      { x: width * 0.7, y: height * 0.28 },
      { x: width * 0.45, y: height * 0.42 },
      { x: width * 0.25, y: height * 0.58 },
      { x: width * 0.68, y: height * 0.6 }
    ];

    photos.forEach((p, idx) => {
      // Photo card
      ctx.fillStyle = '#e4e4e7';
      ctx.fillRect(p.x - 30, p.y - 35, 60, 70);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(p.x - 24, p.y - 28, 48, 42);

      // Red pin
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(p.x, p.y - 32, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Red strings connecting clues
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(photos[0].x, photos[0].y);
    ctx.lineTo(photos[2].x, photos[2].y);
    ctx.lineTo(photos[1].x, photos[1].y);
    ctx.lineTo(photos[4].x, photos[4].y);
    ctx.lineTo(photos[3].x, photos[3].y);
    ctx.lineTo(photos[2].x, photos[2].y);
    ctx.stroke();

    ctx.restore();

  } else if (isWealth) {
    // Vault Steel Walls & Bullion Glow
    const vaultDoorX = width * 0.5;
    const vaultDoorY = height * 0.42;
    // Circular heavy steel vault door
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(vaultDoorX, vaultDoorY, width * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Spoke handles
    for (let s = 0; s < 6; s++) {
      const ang = (s * Math.PI) / 3 + time * 0.2;
      ctx.strokeStyle = '#a1a1aa';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(vaultDoorX, vaultDoorY);
      ctx.lineTo(vaultDoorX + Math.cos(ang) * width * 0.38, vaultDoorY + Math.sin(ang) * width * 0.38);
      ctx.stroke();
    }

    // Gold bullion pile below
    ctx.fillStyle = '#eab308';
    for (let row = 0; row < 5; row++) {
      const barCount = 7 - row;
      const startX = (width - barCount * 55) / 2;
      const barY = height * 0.72 + row * 26;
      for (let b = 0; b < barCount; b++) {
        ctx.fillStyle = b % 2 === 0 ? '#facc15' : '#ca8a04';
        ctx.fillRect(startX + b * 55, barY, 50, 22);
      }
    }

  } else if (isVolcanic) {
    // Glowing lava river & jagged cliffs
    const lavaGrad = ctx.createLinearGradient(0, height * 0.72, 0, height);
    lavaGrad.addColorStop(0, '#f97316');
    lavaGrad.addColorStop(0.4, '#ea580c');
    lavaGrad.addColorStop(0.8, '#dc2626');
    lavaGrad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = lavaGrad;
    ctx.fillRect(0, height * 0.74, width, height * 0.26);

    // Jagged Cliff Silhouette
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.65);
    ctx.lineTo(width * 0.4, height * 0.52);
    ctx.lineTo(width * 0.6, height * 0.58);
    ctx.lineTo(width, height * 0.5);
    ctx.lineTo(width, height * 0.82);
    ctx.lineTo(0, height * 0.82);
    ctx.closePath();
    ctx.fill();

  } else {
    // Cyberpunk Neon City Skyline
    const buildingCount = 6;
    const bWidth = width / buildingCount;
    ctx.fillStyle = '#030712';
    for (let b = 0; b < buildingCount; b++) {
      const bx = b * bWidth;
      const bh = height * (0.35 + Math.sin(b * 1.5 + sceneNumber) * 0.16);
      const by = height - bh;
      ctx.fillRect(bx, by, bWidth * 0.9, bh);

      // Neon antenna & signs
      ctx.strokeStyle = b % 2 === 0 ? '#38bdf8' : '#ec4899';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bx + bWidth * 0.45, by);
      ctx.lineTo(bx + bWidth * 0.45, by - 45);
      ctx.stroke();

      // Neon window grid
      ctx.fillStyle = b % 2 === 0 ? 'rgba(56, 189, 248, 0.75)' : 'rgba(250, 204, 21, 0.75)';
      for (let wy = by + 20; wy < height - 60; wy += 38) {
        ctx.fillRect(bx + 10, wy, 7, 12);
        ctx.fillRect(bx + bWidth * 0.55, wy, 7, 12);
      }
    }
  }

  // 4. Hero Focal Subject Synthesis (Centered in 9:16 frame)
  const heroX = width * 0.5;
  const heroY = height * 0.48;

  if (isAviation) {
    // Aircraft Silhouette flying toward camera
    ctx.save();
    ctx.translate(heroX, heroY);
    const planeScale = 1.0 + Math.sin(time * 2.2) * 0.04;
    ctx.scale(planeScale, planeScale);

    // Fuselage
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 95, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(width * 0.4, 32);
    ctx.lineTo(width * 0.38, 48);
    ctx.lineTo(0, 28);
    ctx.lineTo(-width * 0.38, 48);
    ctx.lineTo(-width * 0.4, 32);
    ctx.closePath();
    ctx.fill();

    // Wingtips (Navigation beacons)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-width * 0.39, 40, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(width * 0.39, 40, 6, 0, Math.PI * 2);
    ctx.fill();

    // Jet Engine Afterburner Cones
    const jetGlow = ctx.createRadialGradient(0, 85, 5, 0, 85, 50);
    jetGlow.addColorStop(0, '#ffffff');
    jetGlow.addColorStop(0.35, '#38bdf8');
    jetGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = jetGlow;
    ctx.beginPath();
    ctx.arc(0, 85, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

  } else if (isSpace) {
    // Floating Astronaut in Spacewalk with gold visor reflecting nebula
    ctx.save();
    ctx.translate(heroX, heroY + Math.sin(time * 1.5) * 16);

    // Helmet
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(0, -55, 40, 0, Math.PI * 2);
    ctx.fill();

    // Visor
    const visorGrad = ctx.createLinearGradient(-26, -66, 26, -44);
    visorGrad.addColorStop(0, '#fef08a');
    visorGrad.addColorStop(0.5, '#f59e0b');
    visorGrad.addColorStop(1, '#9333ea');
    ctx.fillStyle = visorGrad;
    ctx.beginPath();
    ctx.ellipse(0, -55, 28, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spacesuit Torso
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.roundRect(-45, -16, 90, 100, 16);
    ctx.fill();

    // Suit lights
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-24, 0, 12, 9);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-6, 0, 12, 9);
    ctx.restore();

  } else if (isOcean) {
    // Submersible Explorer Pod with powerful dual searchlights
    ctx.save();
    ctx.translate(heroX, heroY);

    // Cone searchlights
    const lightGrad = ctx.createLinearGradient(0, 0, 0, height * 0.38);
    lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    lightGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.4)');
    lightGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-width * 0.38, height * 0.38);
    ctx.lineTo(width * 0.38, height * 0.38);
    ctx.lineTo(18, 0);
    ctx.closePath();
    ctx.fill();

    // Submersible spherical hull
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, -12, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Viewport window
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, -12, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

  } else if (isDetective) {
    // Giant Magnifying Glass focusing on a fingerprint / cipher
    ctx.save();
    ctx.translate(heroX, heroY);
    ctx.rotate(-0.25);

    // Magnifying lens glass
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.beginPath();
    ctx.arc(0, -20, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Handle
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(-8, 45, 16, 95, 6);
    ctx.fill();
    ctx.restore();

  } else if (isAncient) {
    // Golden Pharaoh Mask / Ancient Relic Silhouette
    ctx.save();
    ctx.translate(heroX, heroY);
    const goldGrad = ctx.createLinearGradient(-40, -60, 40, 60);
    goldGrad.addColorStop(0, '#fde047');
    goldGrad.addColorStop(0.5, '#eab308');
    goldGrad.addColorStop(1, '#854d0e');
    ctx.fillStyle = goldGrad;

    // Nemes Headdress
    ctx.beginPath();
    ctx.moveTo(0, -65);
    ctx.lineTo(55, -20);
    ctx.lineTo(40, 50);
    ctx.lineTo(-40, 50);
    ctx.lineTo(-55, -20);
    ctx.closePath();
    ctx.fill();

    // Face
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(0, -10, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

  } else {
    // Glowing Quantum Core / Portal
    ctx.save();
    ctx.translate(heroX, heroY);
    const corePulse = 1.0 + Math.sin(time * 3.2) * 0.08;
    ctx.scale(corePulse, corePulse);

    const qGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 100);
    qGrad.addColorStop(0, '#ffffff');
    qGrad.addColorStop(0.25, '#22d3ee');
    qGrad.addColorStop(0.65, '#0284c7');
    qGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = qGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 100, 0, Math.PI * 2);
    ctx.fill();

    // Rotating orbital data rings
    ctx.lineWidth = 3.5;
    for (let r = 0; r < 3; r++) {
      ctx.strokeStyle = r % 2 === 0 ? '#38bdf8' : '#facc15';
      ctx.save();
      ctx.rotate(time * (r % 2 === 0 ? 1 : -1) * (r + 1) * 0.8);
      ctx.beginPath();
      ctx.ellipse(0, 0, 65 + r * 28, 28 + r * 16, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  // 5. Special Callout Overlay for Scene 8 (Follower Opinion & Comment Boost)
  if (sceneNumber === 8) {
    ctx.save();
    const ctaY = height * 0.22;
    // Glowing Callout Banner in upper third
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    const bannerW = width * 0.88;
    const bannerH = 110;
    const bannerX = (width - bannerW) / 2;
    ctx.beginPath();
    ctx.roundRect(bannerX, ctaY, bannerW, bannerH, 20);
    ctx.fill();
    ctx.stroke();

    // Comment Bubble Icon
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💬 شاركنا رأيك ونظريتك في التعليقات!', width * 0.5, ctaY + 45);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 18px sans-serif';
    ctx.fillText('👇 ما هو تفسيرك الحقيقي لهذا اللغز؟ تابعنا للجزء القادم', width * 0.5, ctaY + 82);
    ctx.restore();
  }

  // 6. Dynamic Floating Atmospheric Particles (Rain / Embers / Bubbles / Stardust)
  const pCount = 42;
  for (let p = 0; p < pCount; p++) {
    let px = ((p * 137 + time * 70) % width);
    let py = ((p * 193 - time * 90 + height) % height);
    if (isAviation) {
      // Rain streaks
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - 15, py + 35);
      ctx.stroke();
    } else if (isOcean) {
      // Rising bubbles
      const bubbleY = height - ((p * 120 + time * 60) % height);
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, bubbleY, (p % 4) + 3, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Embers or stardust
      const pSize = (p % 4) + 1.5;
      const pAlpha = Math.abs(Math.sin(time + p * 0.8)) * 0.75 + 0.25;
      ctx.fillStyle = p % 2 === 0 ? `rgba(250, 204, 21, ${pAlpha})` : `rgba(56, 189, 248, ${pAlpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 7. Volumetric Vignette
  const vig = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.35, width * 0.5, height * 0.5, width * 0.88);
  vig.addColorStop(0, 'transparent');
  vig.addColorStop(0.7, 'rgba(0, 0, 0, 0.45)');
  vig.addColorStop(1, 'rgba(0, 0, 0, 0.88)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}
