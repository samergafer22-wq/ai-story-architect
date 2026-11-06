/**
 * Dynamic Procedural Cinematic Art Generator
 * Synthesizes unique, high-resolution vertical 9:16 visuals for any custom topic,
 * ensuring every newly generated story has brand new, visually captivating artwork.
 */

export interface VisualDirectives {
  topic: string;
  sceneNumber: number;
  moodColor: string;
  visualPrompt: string;
  time: number;
  width: number;
  height: number;
}

export function drawProceduralCinematicScene(ctx: CanvasRenderingContext2D, directives: VisualDirectives) {
  const { topic, sceneNumber, moodColor, visualPrompt, time, width, height } = directives;
  const promptLower = (visualPrompt + ' ' + topic).toLowerCase();

  // 1. Deep Atmospheric Gradient Base
  const baseGrad = ctx.createLinearGradient(0, 0, width * 0.3, height);
  if (promptLower.includes('ocean') || promptLower.includes('water') || promptLower.includes('sunken') || promptLower.includes('بحر') || promptLower.includes('محيط')) {
    baseGrad.addColorStop(0, '#021024');
    baseGrad.addColorStop(0.5, '#052659');
    baseGrad.addColorStop(1, '#010814');
  } else if (promptLower.includes('space') || promptLower.includes('galaxy') || promptLower.includes('star') || promptLower.includes('فضاء') || promptLower.includes('كون') || promptLower.includes('كوكب')) {
    baseGrad.addColorStop(0, '#090514');
    baseGrad.addColorStop(0.4, '#1b0933');
    baseGrad.addColorStop(0.8, '#2d0a4e');
    baseGrad.addColorStop(1, '#05020a');
  } else if (promptLower.includes('lava') || promptLower.includes('fire') || promptLower.includes('volcano') || promptLower.includes('بركان') || promptLower.includes('نار')) {
    baseGrad.addColorStop(0, '#1c0502');
    baseGrad.addColorStop(0.5, '#450a0a');
    baseGrad.addColorStop(1, '#0a0100');
  } else if (promptLower.includes('desert') || promptLower.includes('ancient') || promptLower.includes('tomb') || promptLower.includes('صحراء') || promptLower.includes('أهرام') || promptLower.includes('أثر')) {
    baseGrad.addColorStop(0, '#1c1206');
    baseGrad.addColorStop(0.5, '#451a03');
    baseGrad.addColorStop(1, '#0c0701');
  } else {
    // Cyberpunk / Mystery / Default deep cinematic
    baseGrad.addColorStop(0, '#030712');
    baseGrad.addColorStop(0.5, moodColor || '#0f172a');
    baseGrad.addColorStop(1, '#020617');
  }

  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Dynamic Thematic Elements depending on Scene Number & Prompt
  ctx.save();

  // Cosmic Singularity / Light Vortex (For Space / Sci-Fi / Portals)
  if (promptLower.includes('portal') || promptLower.includes('warp') || promptLower.includes('core') || promptLower.includes('singularity') || promptLower.includes('بوابة') || promptLower.includes('ثقب')) {
    const vortexCenterX = width / 2;
    const vortexCenterY = height * 0.42;
    const vortexRadius = width * 0.45;

    // Glowing cosmic halo
    const glow = ctx.createRadialGradient(vortexCenterX, vortexCenterY, 10, vortexCenterX, vortexCenterY, vortexRadius);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.2, '#38bdf8');
    glow.addColorStop(0.6, moodColor);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(vortexCenterX, vortexCenterY, vortexRadius, 0, Math.PI * 2);
    ctx.fill();

    // Swirling spiral arms
    ctx.lineWidth = 3;
    for (let arm = 0; arm < 4; arm++) {
      ctx.strokeStyle = arm % 2 === 0 ? 'rgba(250, 204, 21, 0.4)' : 'rgba(168, 85, 247, 0.4)';
      ctx.beginPath();
      const armOffset = (arm * Math.PI) / 2;
      for (let r = 20; r < vortexRadius * 0.9; r += 6) {
        const theta = armOffset + (r * 0.05) - (time * 1.2);
        const sx = vortexCenterX + Math.cos(theta) * r;
        const sy = vortexCenterY + Math.sin(theta) * r;
        if (r === 20) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }
  }

  // Futuristic Skyscrapers / Ancient Monoliths Silhouette at the base
  ctx.fillStyle = '#030712';
  ctx.beginPath();
  ctx.moveTo(0, height);

  const pillarsCount = 7;
  const pillarWidth = width / pillarsCount;
  for (let i = 0; i <= pillarsCount; i++) {
    const px = i * pillarWidth;
    // Varying height silhouettes
    const ph = height * (0.32 + Math.sin(i * 1.7 + sceneNumber) * 0.12);
    const topY = height - ph;
    ctx.lineTo(px, topY);
    ctx.lineTo(px + pillarWidth * 0.85, topY);
    ctx.lineTo(px + pillarWidth * 0.85, height);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Architectural / Holographic Neon Accents on Silhouettes
  ctx.strokeStyle = moodColor || '#0ea5e9';
  ctx.lineWidth = 2;
  for (let i = 0; i < pillarsCount; i++) {
    const px = i * pillarWidth + pillarWidth * 0.1;
    const ph = height * (0.32 + Math.sin(i * 1.7 + sceneNumber) * 0.12);
    const topY = height - ph;

    // Glowing edge
    ctx.beginPath();
    ctx.moveTo(px, topY);
    ctx.lineTo(px + pillarWidth * 0.75, topY);
    ctx.stroke();

    // Holographic window dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let wy = topY + 40; wy < height - 60; wy += 45) {
      if ((i + Math.floor(wy / 40)) % 2 === 0) {
        ctx.fillRect(px + pillarWidth * 0.25, wy, 4, 8);
        ctx.fillRect(px + pillarWidth * 0.55, wy, 4, 8);
      }
    }
  }

  // Glowing Horizon Line / Celestial Aura
  const horizonGrad = ctx.createLinearGradient(0, height * 0.62, 0, height * 0.75);
  horizonGrad.addColorStop(0, 'rgba(250, 204, 21, 0.35)');
  horizonGrad.addColorStop(0.5, `${moodColor}66`);
  horizonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = horizonGrad;
  ctx.fillRect(0, height * 0.6, width, height * 0.18);

  ctx.restore();
}
