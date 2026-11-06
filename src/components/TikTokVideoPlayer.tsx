import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Shield, 
  Eye, 
  Type,
  Layers,
  Film,
  Cpu,
  Activity,
  Zap,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Globe
} from 'lucide-react';
import { SceneItem, StoryProject } from '../data/storyLibrary';
import { audioEngine } from '../utils/audioEngine';
import { synthesizeSceneVisual } from '../utils/neuralVisualSynthesizer';
import { drawProceduralCinematicScene } from '../utils/proceduralVisuals';
import { AI_TOOLS_DATA, PIPELINE_STAGES, AITool, PipelineStage } from '../data/aiToolsChain';
import { 
  calculateCameraShake, 
  renderCinematicVfxLayer, 
  renderTransitionEffect 
} from '../utils/cinematicVfxEngine';
import { getCinematicImageForScene } from '../utils/cinematicVisualLibrary';

interface TikTokVideoPlayerProps {
  story: StoryProject;
  onSceneChange?: (sceneIndex: number) => void;
  onOpenTikTokPublish?: () => void;
  isTikTokConnected?: boolean;
  tikTokUsername?: string;
  onOpenImageImporter?: (sceneIndex?: number) => void;
  exportTrigger?: number;
  onExportStateChange?: (isExporting: boolean, progress: number) => void;
}

export const TikTokVideoPlayer: React.FC<TikTokVideoPlayerProps> = ({ 
  story, 
  onSceneChange,
  onOpenTikTokPublish,
  isTikTokConnected = false,
  tikTokUsername = '@creator',
  onOpenImageImporter,
  exportTrigger,
  onExportStateChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showSafeZone, setShowSafeZone] = useState(false); // Clean cinematic by default
  const [showSubtitles, setShowSubtitles] = useState(false); // Clean visual by default (Text erased/hidden as requested)
  const [showVfx, setShowVfx] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [videoQuality, setVideoQuality] = useState<'1080p' | '720p'>('1080p');

  // Sync export state to parent workflow bar
  useEffect(() => {
    if (onExportStateChange) {
      onExportStateChange(isExporting, exportProgress);
    }
  }, [isExporting, exportProgress, onExportStateChange]);

  // Preloaded image cache
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const animationFrameRef = useRef<number | null>(null);
  const activeSceneRef = useRef<number>(0);
  const transitionProgressRef = useRef<number>(0);
  const transitionBridgeFiredRef = useRef<boolean>(false);

  // Playback & Gapless references to prevent stale closures
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const [gaplessAudioMode, setGaplessAudioMode] = useState<boolean>(true);
  const gaplessModeRef = useRef(gaplessAudioMode);
  useEffect(() => {
    gaplessModeRef.current = gaplessAudioMode;
  }, [gaplessAudioMode]);

  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const lastStateUpdateRef = useRef<number>(0);
  const renderFrameRef = useRef<((time: number) => void) | null>(null);

  // Calculate total duration (default 60s as requested)
  const totalDuration = story.scenes.reduce((acc, s) => acc + s.duration, 0) || story.duration || 60;

  // Preload all 8+ scene images immediately with automatic resilient fallback
  useEffect(() => {
    story.scenes.forEach(scene => {
      const src = scene.imageSrc || getCinematicImageForScene(story.title, story.categoryId || 'mystery', scene.sceneNumber, scene.visualPrompt);
      if (src && !imageCacheRef.current.has(src)) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => {
          imageCacheRef.current.set(src, img);
        };
        img.onerror = () => {
          const fallback = getCinematicImageForScene(story.title, story.categoryId || 'mystery', scene.sceneNumber, scene.visualPrompt);
          if (fallback && fallback !== src) {
            const fbImg = new Image();
            fbImg.crossOrigin = 'anonymous';
            fbImg.src = fallback;
            fbImg.onload = () => {
              imageCacheRef.current.set(src, fbImg);
            };
          }
        };
      }
    });
  }, [story]);

  // Handle Scene transition sound and speech with natural cinematic pacing
  const triggerSceneAudio = useCallback((scene: SceneItem, sceneIndex: number) => {
    if (isMuted) return;
    
    // Play SFX
    if (scene.sfx) {
      audioEngine.playSFX(scene.sfx);
    }
    
    // Play voiceover narration through Web Audio buffer streaming (captured in mediaStreamDestination)
    if (scene.voiceover) {
      audioEngine.playSceneVoiceover(
        scene.voiceover,
        () => {
          // Voiceover ended smoothly - audio engine un-ducks music naturally
          // The visual scene continues until its full scheduled duration finishes
        },
        scene.duration
      );
    }
  }, [isMuted]);

  const currentTimeRef = useRef<number>(0);

  // Determine current scene from time
  const getSceneForTime = useCallback((time: number): { scene: SceneItem; index: number; localTime: number } => {
    let accumulated = 0;
    for (let i = 0; i < story.scenes.length; i++) {
      const scene = story.scenes[i];
      if (time >= accumulated && time < accumulated + scene.duration) {
        return { scene, index: i, localTime: time - accumulated };
      }
      accumulated += scene.duration;
    }
    const lastIdx = story.scenes.length - 1;
    return {
      scene: story.scenes[lastIdx],
      index: lastIdx,
      localTime: story.scenes[lastIdx]?.duration || 7.5
    };
  }, [story]);

  // Play / Pause toggle with complete timeline preservation and instant responsiveness
  const togglePlay = () => {
    if (isPlayingRef.current) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      audioEngine.stopAll();
      lastStateUpdateRef.current = currentTimeRef.current;
      setCurrentTime(currentTimeRef.current);
    } else {
      // 1. Immediately activate playback state
      setIsPlaying(true);
      isPlayingRef.current = true;

      // 2. Safely resume audio context in background
      audioEngine.resumeContext().catch(() => {});

      // 3. Restart smoothly from 0 if reached end
      if (currentTimeRef.current >= totalDuration - 0.2) {
        currentTimeRef.current = 0;
        lastStateUpdateRef.current = 0;
        setCurrentTime(0);
        setCurrentSceneIndex(0);
        activeSceneRef.current = -1;
      }

      // 4. Trigger soundtrack and scene audio
      if (!isMutedRef.current) {
        try {
          audioEngine.startCinematicMusic(story.musicTrack);
          const { scene, index } = getSceneForTime(currentTimeRef.current);
          if (scene) {
            triggerSceneAudio(scene, index);
          }
        } catch (e) {
          console.warn('Audio start error:', e);
        }
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    audioEngine.stopAll();
    currentTimeRef.current = 0;
    setCurrentTime(0);
    setCurrentSceneIndex(0);
    activeSceneRef.current = -1;
    renderFrame(0);
  };

  // Rendering loop
  const renderFrame = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const { scene, index, localTime } = getSceneForTime(time);
    
    // Check if scene changed to trigger transition and audio
    if (activeSceneRef.current !== index) {
      activeSceneRef.current = index;
      setCurrentSceneIndex(index);
      transitionProgressRef.current = 1.0; // trigger transition flash
      transitionBridgeFiredRef.current = false;
      if (onSceneChange) onSceneChange(index);
      if (isPlayingRef.current && !isMutedRef.current) {
        triggerSceneAudio(scene, index);
      }
    }

    // Bridge transitional sound 0.7s before scene ends (eliminates silence completely)
    if (isPlayingRef.current && !isMutedRef.current && localTime > scene.duration - 0.7 && !transitionBridgeFiredRef.current) {
      transitionBridgeFiredRef.current = true;
      audioEngine.playSFX('Whoosh');
    }

    // Decay transition flash
    if (transitionProgressRef.current > 0) {
      transitionProgressRef.current = Math.max(0, transitionProgressRef.current - 0.08);
    }

    const sceneProgress = Math.min(1, Math.max(0, localTime / scene.duration));

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background Image or Dynamic Procedural Canvas
    ctx.save();
    
    // Dynamic Ken Burns camera motion calculation (optimized for 60s trailer pacing)
    let scale = 1.0;
    let offsetX = 0;
    let offsetY = 0;

    if (scene.cameraMotion === 'zoom_in') {
      scale = 1.02 + (sceneProgress * 0.16);
    } else if (scene.cameraMotion === 'zoom_out') {
      scale = 1.18 - (sceneProgress * 0.15);
    } else if (scene.cameraMotion === 'pan_left') {
      scale = 1.12;
      offsetX = (sceneProgress - 0.5) * (width * 0.08);
    } else if (scene.cameraMotion === 'pan_right') {
      scale = 1.12;
      offsetX = (0.5 - sceneProgress) * (width * 0.08);
    } else if (scene.cameraMotion === 'shake') {
      scale = 1.1;
      const shakeIntensity = Math.sin(localTime * 48) * 10 * (1 - sceneProgress * 0.4);
      offsetX = shakeIntensity;
      offsetY = Math.cos(localTime * 42) * 8;
    }

    // Dynamic Camera Shake Matrix (Impact bass punches, subtle float, or tremors)
    const isTransitionActive = transitionProgressRef.current > 0;
    const shakePreset = scene.shakeIntensity || (scene.cameraMotion === 'shake' ? 'tremor' : 'subtle');
    const cameraShake = calculateCameraShake(localTime, shakePreset, isTransitionActive);

    // Apply transformation centered with scale, shake offset, and micro-rotation
    ctx.translate(width / 2 + offsetX + cameraShake.offsetX, height / 2 + offsetY + cameraShake.offsetY);
    if (cameraShake.rotation !== 0) {
      ctx.rotate(cameraShake.rotation);
    }
    const finalScale = scale * cameraShake.scaleMod;
    ctx.scale(finalScale, finalScale);
    ctx.translate(-width / 2, -height / 2);

    const imgUrl = scene.imageSrc;
    const cachedImg = imgUrl ? imageCacheRef.current.get(imgUrl) : null;

    if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
      // Cover fit for high-definition 9:16 vertical cinematic visuals
      const imgRatio = cachedImg.width / cachedImg.height;
      const canvasRatio = width / height;
      let drawW = width;
      let drawH = height;
      let drawX = 0;
      let drawY = 0;

      if (imgRatio > canvasRatio) {
        drawW = height * imgRatio;
        drawX = (width - drawW) / 2;
      } else {
        drawH = width / imgRatio;
        drawY = (height - drawH) / 2;
      }
      ctx.drawImage(cachedImg, drawX, drawY, drawW, drawH);
    } else {
      // Dynamic Topic-Tailored Neural Visual Synthesizer
      synthesizeSceneVisual(ctx, width, height, {
        topic: story.title,
        category: story.category,
        sceneNumber: scene.sceneNumber,
        totalScenes: story.scenes.length,
        visualPrompt: scene.visualPrompt,
        moodColor: scene.moodColor || '#0ea5e9',
        time,
        cameraMotion: scene.cameraMotion,
        aiEngine: scene.aiToolUsed,
      });

      // Eagerly trigger prefetch if imageSrc is specified
      if (imgUrl && !imageCacheRef.current.has(imgUrl)) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imgUrl;
        img.onload = () => {
          imageCacheRef.current.set(imgUrl, img);
        };
        img.onerror = () => {
          const fallback = getCinematicImageForScene(story.title, story.categoryId || 'mystery', scene.sceneNumber, scene.visualPrompt);
          if (fallback && fallback !== imgUrl) {
            const fbImg = new Image();
            fbImg.crossOrigin = 'anonymous';
            fbImg.src = fallback;
            fbImg.onload = () => {
              imageCacheRef.current.set(imgUrl, fbImg);
            };
          }
        };
      }
    }
    ctx.restore();

    // 2. Cinematic Dynamic Transition between scenes (Zoom-Warp, Whip-Pan, Flash, Glitch, etc.)
    if (transitionProgressRef.current > 0) {
      const activeTransition = scene.transitionType || 'zoom_warp';
      renderTransitionEffect(ctx, width, height, activeTransition, transitionProgressRef.current);
    }

    // 3. Cinematic Film Vignette (Deepens atmosphere and highlights central focus)
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, width * 0.35,
      width / 2, height / 2, width * 0.88
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.4)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.88)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // 4. Atmospheric VFX Overlays (Bloom Glow, Light Leaks, Floating Embers, 35mm Grain, Scanlines)
    if (showVfx) {
      const activeVfx = scene.vfxEffect || 'glow_bloom';
      renderCinematicVfxLayer(ctx, width, height, time, activeVfx, scene.moodColor);
    }

    // 5. Arabic Multi-Line Subtitles (Word-wrapped, TikTok Viral Karaoke Style, Zero Cut-off)
    if (showSubtitles) {
      const subText = scene.voiceover || '';
      if (subText.trim()) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const fontSize = Math.round(width * 0.042);
        ctx.font = `900 ${fontSize}px 'Tajawal', 'Cairo', sans-serif`;

        const maxLineWidth = width * 0.82;
        const words = subText.trim().split(/\s+/);
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxLineWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);

        const lineHeight = fontSize * 1.45;
        const totalHeight = lines.length * lineHeight + 24;
        const baseCenterY = height * 0.72;
        const startY = baseCenterY - ((lines.length - 1) * lineHeight) / 2;

        let maxW = 0;
        lines.forEach(l => {
          const w = ctx.measureText(l).width;
          if (w > maxW) maxW = w;
        });

        const boxW = Math.min(width * 0.90, maxW + 48);
        const boxH = totalHeight;
        const boxX = (width - boxW) / 2;
        const boxY = baseCenterY - boxH / 2;

        // Sleek translucent rounded backdrop
        ctx.fillStyle = 'rgba(10, 15, 29, 0.88)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 20);
        ctx.fill();

        ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Render each line with heavy outline and bright gradient yellow fill
        lines.forEach((line, lineIdx) => {
          const lineY = startY + lineIdx * lineHeight;

          ctx.lineWidth = 6;
          ctx.strokeStyle = '#000000';
          ctx.lineJoin = 'round';
          ctx.strokeText(line, width / 2, lineY);

          ctx.fillStyle = lineIdx === lines.length - 1 ? '#FDE047' : '#FFFFFF';
          ctx.fillText(line, width / 2, lineY);
        });

        ctx.restore();
      }
    }

    // 6. Safe Zone Guide Overlay (when toggled for creators)
    if (showSafeZone) {
      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.setLineDash([8, 8]);
      ctx.lineWidth = 2;
      
      // Top unsafe zone (notch + search bar: top 12%)
      ctx.strokeRect(20, 20, width - 40, height * 0.12);
      // Bottom unsafe zone (caption + sound disc: bottom 22%)
      ctx.strokeRect(20, height * 0.78, width - 40, height * 0.20);
      // Right unsafe zone (like, comment, share icons: right 18%)
      ctx.strokeRect(width * 0.82, height * 0.4, width * 0.16, height * 0.36);

      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.font = `600 14px 'Tajawal', sans-serif`;
      ctx.fillText('منطقة أمان تيك توك (Safe Zone 9:16)', width / 2, 45);
      ctx.restore();
    }
  }, [story, getSceneForTime, showVfx, showSubtitles, showSafeZone, onSceneChange, triggerSceneAudio]);

  // Keep ref up to date on each render without triggering loop restart
  renderFrameRef.current = renderFrame;

  // Instant Reset & Repaint Frame 0 on story change (Fixes new video not appearing in preview)
  useEffect(() => {
    // 1. Terminate ongoing playback and reset timeline to 0
    audioEngine.stopAll();
    setIsPlaying(false);
    isPlayingRef.current = false;
    currentTimeRef.current = 0;
    setCurrentTime(0);
    setCurrentSceneIndex(0);
    activeSceneRef.current = -1;
    transitionProgressRef.current = 1.0;
    transitionBridgeFiredRef.current = false;

    // 2. Preload new story scene images immediately
    story.scenes.forEach((scene) => {
      if (scene.imageSrc) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = scene.imageSrc;
        img.onload = () => {
          imageCacheRef.current.set(scene.imageSrc!, img);
          if (renderFrameRef.current) renderFrameRef.current(0);
        };
      }
    });

    // 3. Force instant frame 0 canvas repaint for the newly loaded story
    const timer = setTimeout(() => {
      if (renderFrameRef.current) renderFrameRef.current(0);
    }, 20);

    return () => clearTimeout(timer);
  }, [story.id]);

  // Robust, continuous 60 FPS video render loop (Plays full 30s/45s/60s duration smoothly)
  useEffect(() => {
    let prev = performance.now();
    let animId: number;

    const loop = (timestamp: number) => {
      const delta = Math.min(0.08, (timestamp - prev) / 1000);
      prev = timestamp;

      if (isPlayingRef.current) {
        // Voiceover-driven dynamic time progression (ZERO audio cutoffs):
        // If the voiceover is actively narrating, NEVER skip or cut off to the next scene!
        const { scene, index, localTime } = getSceneForTime(currentTimeRef.current);
        const isNearSceneEnd = localTime >= (scene.duration - 0.25);
        const isVoiceSpeaking = audioEngine.isVoiceoverPlaying();

        if (isNearSceneEnd && isVoiceSpeaking) {
          // Calculate start timestamp of current scene
          let sceneStartTime = 0;
          for (let i = 0; i < index; i++) {
            sceneStartTime += story.scenes[i].duration;
          }
          // Hold time at the very end of the scene until the narration completes 100%
          currentTimeRef.current = sceneStartTime + scene.duration - 0.15;
        } else {
          currentTimeRef.current += delta;
        }

        if (currentTimeRef.current >= totalDuration) {
          // Complete video smoothly at 100% without abrupt cut-off
          currentTimeRef.current = totalDuration;
          isPlayingRef.current = false;
          setIsPlaying(false);
          lastStateUpdateRef.current = totalDuration;
          setCurrentTime(totalDuration);
          audioEngine.stopAll();
        } else if (Math.abs(currentTimeRef.current - lastStateUpdateRef.current) >= 0.25) {
          lastStateUpdateRef.current = currentTimeRef.current;
          setCurrentTime(currentTimeRef.current);
        }
      }

      if (renderFrameRef.current) {
        renderFrameRef.current(currentTimeRef.current);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [totalDuration, getSceneForTime]);

  // Export & Download TikTok Video Engine (Canvas + WebAudio to MP4/WebM with full Voiceover)
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);

  const handleExportTikTokVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    setExportProgress(3);
    setExportedVideoUrl(null);
    setExportedBlob(null);
    audioEngine.stopAll();

    try {
      // 1. Preload Arabic voiceover audio buffers for all scenes so recording is gapless and 100% captured
      setExportProgress(8);
      await audioEngine.preloadStoryVoiceovers(story.scenes);
      setExportProgress(15);

      const fps = 30;
      const canvasStream = canvas.captureStream(fps);

      const audioStream = audioEngine.getAudioStream();
      const combinedTracks = [...canvasStream.getVideoTracks()];
      if (audioStream && audioStream.getAudioTracks().length > 0) {
        combinedTracks.push(...audioStream.getAudioTracks());
      }
      const combinedStream = new MediaStream(combinedTracks);

      const preferredMimes = [
        'video/mp4;codecs=avc1,mp4a.40.2',
        'video/mp4',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm'
      ];
      let selectedMime = 'video/webm';
      for (const mime of preferredMimes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: videoQuality === '1080p' ? 12000000 : 6000000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const fileExt = selectedMime.includes('mp4') ? 'mp4' : 'webm';
      const sanitizedTitle = story.title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');
      const filename = `tiktok_9x16_${sanitizedTitle}.${fileExt}`;

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: selectedMime });
        const url = URL.createObjectURL(blob);
        setExportedBlob(blob);
        setExportedVideoUrl(url);

        // Direct Download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setIsExporting(false);
        setExportProgress(100);
      };

      recorder.start();
      audioEngine.startCinematicMusic(story.musicTrack);

      const startTime = performance.now();
      const renderDurationMs = totalDuration * 1000;
      let lastRecordedSceneIndex = -1;

      const recordStep = () => {
        const elapsed = performance.now() - startTime;
        const simTime = (elapsed / renderDurationMs) * totalDuration;
        const pct = Math.min(99, Math.round(15 + (elapsed / renderDurationMs) * 84));
        setExportProgress(pct);

        // Dynamically trigger scene voiceover & SFX into the WebAudio MediaStream recorder
        const { scene, index } = getSceneForTime(simTime);
        if (index !== lastRecordedSceneIndex) {
          lastRecordedSceneIndex = index;
          if (scene.voiceover) {
            audioEngine.playSceneVoiceover(scene.voiceover, undefined, scene.duration);
          }
          if (scene.sfx) {
            audioEngine.playSFX(scene.sfx);
          }
        }

        renderFrame(simTime);

        if (elapsed < renderDurationMs) {
          requestAnimationFrame(recordStep);
        } else {
          recorder.stop();
          audioEngine.stopAll();
        }
      };

      requestAnimationFrame(recordStep);
    } catch (err) {
      console.error('Failed to record video:', err);
      setIsExporting(false);
    }
  };

  // Web Share API to directly send video file into TikTok App on Mobile
  const handleShareToTikTokApp = async () => {
    if (!exportedBlob) {
      // Trigger export first
      handleExportTikTokVideo();
      return;
    }

    try {
      const fileExt = exportedBlob.type.includes('mp4') ? 'mp4' : 'webm';
      const file = new File([exportedBlob], `tiktok_${Date.now()}.${fileExt}`, { type: exportedBlob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: story.title,
          text: `${story.tiktokHook}\n\n#تيك_توك #fyp`,
        });
      } else {
        // Fallback: Open TikTok Upload Studio in browser
        window.open('https://www.tiktok.com/upload?lang=ar', '_blank');
      }
    } catch (e) {
      window.open('https://www.tiktok.com/upload?lang=ar', '_blank');
    }
  };

  // Listen to exportTrigger from parent sequential workflow bar
  useEffect(() => {
    if (exportTrigger && exportTrigger > 0 && !isExporting) {
      handleExportTikTokVideo();
    }
  }, [exportTrigger]);

  const currentScene = story.scenes[currentSceneIndex] || story.scenes[0];

  // 70+ AI Tools Pipeline Progress Tracking in Real-Time
  const progressRatio = totalDuration > 0 ? Math.min(1, Math.max(0, currentTime / totalDuration)) : 0;
  const progressPercentage = Math.round(progressRatio * 100);
  const activeToolIndex = Math.min(AI_TOOLS_DATA.length - 1, Math.max(0, Math.floor(progressRatio * AI_TOOLS_DATA.length)));
  const currentPipelineTool = AI_TOOLS_DATA[activeToolIndex] || AI_TOOLS_DATA[0];
  const currentPipelineStage = PIPELINE_STAGES.find(s => s.id === currentPipelineTool.stageId) || PIPELINE_STAGES[0];

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      {/* Active Video Confirmation Header Card */}
      <div className="w-full max-w-[390px] mb-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg backdrop-blur">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>فيديو تيك توك النشط ({totalDuration}s · {story.scenes.length} مشاهد)</span>
          </div>
          <h4 className="text-xs font-black text-white truncate mt-0.5" title={story.title}>
            {story.title}
          </h4>
        </div>
        <button
          onClick={togglePlay}
          className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow shrink-0 transition-transform active:scale-95"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
          <span>{isPlaying ? 'إيقاف' : 'تشغيل'}</span>
        </button>
      </div>

      {/* 9:16 Vertical Video Frame (Pure Cinematic Visual focus without text clutter) */}
      <div 
        ref={containerRef}
        onClick={togglePlay}
        role="button"
        tabIndex={0}
        aria-label="تشغيل / إيقاف الفيديو"
        className="relative w-full aspect-[9/16] max-w-[390px] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 cursor-pointer group select-none"
      >
        {/* Real 1080x1920 High-Res Canvas */}
        <canvas
          ref={canvasRef}
          width={videoQuality === '1080p' ? 1080 : 720}
          height={videoQuality === '1080p' ? 1920 : 1280}
          className="w-full h-full object-cover"
        />

        {/* Large Central Play Overlay Button when Paused */}
        {!isPlaying && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all hover:bg-black/30">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 transform transition-transform group-hover:scale-110 active:scale-95">
              <Play className="w-10 h-10 fill-slate-950 ml-1.5" />
            </div>
            <div className="mt-4 px-4 py-1.5 bg-black/85 border border-white/20 rounded-full text-white text-xs font-bold shadow-lg">
              اضغط لتشغيل الفيديو والمعاينة الحية ▶
            </div>
          </div>
        )}

        {/* Cinematic Scene Indicator Badge (Top Right) */}
        <div className="absolute top-4 right-4 z-20 pointer-events-none flex flex-col gap-1.5 items-end">
          <div className="bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>المشهد {currentSceneIndex + 1} من {story.scenes.length}</span>
          </div>

          {story.isSeries && (
            <div className="bg-rose-600/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
              الجزء {story.partNumber || 1} من {story.totalParts || 3}
            </div>
          )}
        </div>

        {/* Dynamic Duration Indicator Badge (Top Left) */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1.5 items-start">
          <div className="bg-amber-500/90 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
            {totalDuration}s · {totalDuration <= 30 ? '30 ثانية' : totalDuration <= 45 ? '45 ثانية' : '1 دقيقة'}
          </div>
          {currentSceneIndex === story.scenes.length - 1 && (
            <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
              💬 شارك برأيك في التعليقات!
            </div>
          )}
        </div>

        {/* Active AI Tool Relay Badge (Top Center) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-[58%]">
          <div className="bg-slate-950/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-mono px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xl truncate">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{currentScene.aiToolUsed || 'FLUX.1 Pro · توليد سينمائي متجدد'}</span>
          </div>
        </div>

        {/* Active Cinematic VFX & Transition Status Badge */}
        {showVfx && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="bg-purple-950/85 backdrop-blur-md border border-purple-500/40 text-purple-200 text-[9px] font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>مؤثر: {currentScene.vfxEffect || 'glow_bloom'} · انتقال: {currentScene.transitionType || 'zoom_warp'}</span>
            </div>
          </div>
        )}

        {/* Floating Complete Voiceover Caption Pill (Only shown if user explicitly enables subtitles) */}
        {showSubtitles && currentScene?.voiceover && (
          <div className="absolute bottom-6 left-3 right-3 z-20 pointer-events-none">
            <div className="bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2.5 text-center shadow-xl">
              <div className="text-[10px] text-amber-400 font-bold mb-0.5 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>نص الراوي (المشهد {currentSceneIndex + 1}):</span>
              </div>
              <p className="text-xs text-white font-medium leading-relaxed font-sans">
                {currentScene.voiceover}
              </p>
            </div>
          </div>
        )}

        {/* Scene Transition Visual Progress Strip (8 Scene Segment Blocks) */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-900/90 z-30 flex gap-1 p-0.5">
          {story.scenes.map((s, idx) => {
            const sceneStart = story.scenes.slice(0, idx).reduce((acc, cur) => acc + cur.duration, 0);
            const sceneEnd = sceneStart + s.duration;
            let fillPct = 0;
            if (currentTime >= sceneEnd) fillPct = 100;
            else if (currentTime > sceneStart) fillPct = ((currentTime - sceneStart) / s.duration) * 100;

            return (
              <div 
                key={idx} 
                className="flex-1 h-full bg-slate-800 rounded-full overflow-hidden cursor-pointer"
                onClick={() => {
                  currentTimeRef.current = sceneStart;
                  setCurrentTime(sceneStart);
                  setCurrentSceneIndex(idx);
                  activeSceneRef.current = idx;
                  renderFrame(sceneStart);
                  if (isPlayingRef.current && !isMuted) {
                    triggerSceneAudio(s, idx);
                  }
                }}
              >
                <div 
                  className={`h-full transition-all duration-75 ${
                    idx === currentSceneIndex ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Exporting Overlay Modal */}
        {isExporting && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-4">
              <Download className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">جاري معالجة وتصدير فيديو تيك توك 1 دقيقة (8 مشاهد)</h3>
            <p className="text-xs text-slate-400 mb-4">يتم دمج الكادرات السينمائية الثمانية والمؤثرات الصوتية بدقة 1080x1920...</p>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700 mb-2">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 transition-all duration-150"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">{exportProgress}% مكتمل</span>
          </div>
        )}
      </div>

      {/* Primary Video Controls Bar */}
      <div className="w-full max-w-[390px] bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mt-3 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center transition-transform active:scale-95 shadow-md shadow-amber-500/20"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الفيديو'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>
            <button
              onClick={handleReset}
              className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              title="إعادة التشغيل من البداية"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          <div className="text-right">
            <div className="text-xs font-mono text-slate-400">
              <span className="text-amber-400 font-bold text-sm">{currentTime.toFixed(1)}s</span>
              <span> / </span>
              <span className="font-bold text-white">{totalDuration}s (1 دقيقة)</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              8 كادرات سينمائية متتالية
            </div>
          </div>
        </div>

        {/* Gapless Audio Flow Status & Mode Switch */}
        <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${gaplessAudioMode ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-xs font-bold text-slate-200">التدفق الصوتي المتصل (بدون فجوات):</span>
          </div>
          <button
            onClick={() => setGaplessAudioMode(!gaplessAudioMode)}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
              gaplessAudioMode
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="الانتقال الفوري للمشهد التالي بمجرد انتهاء التعليق الصوتي لمنع أي صمت"
          >
            {gaplessAudioMode ? 'سرد مستمر متصل 🔥' : 'توقيت 7.5s كلاسيكي'}
          </button>
        </div>

        {/* View Options: Subtitles toggle + VFX Toggle */}
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setShowSubtitles(!showSubtitles)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-colors ${
              showSubtitles 
                ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:text-white'
            }`}
            title="مسح النصوص من الفيديو تماماً أو إظهارها"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{showSubtitles ? 'إخفاء النصوص' : 'النصوص ممسوحة (سينمائي نقي) 🧹'}</span>
          </button>

          <button
            onClick={() => setShowVfx(!showVfx)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
              showVfx 
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-300' 
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>مؤثرات VFX</span>
          </button>

          {onOpenImageImporter && (
            <button
              onClick={() => onOpenImageImporter(currentSceneIndex)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors"
              title="استيراد وتغيير صور المشاهد من مصادر الإنترنت ومطابقتها"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>صور الإنترنت</span>
            </button>
          )}

          <select
            value={videoQuality}
            onChange={(e) => setVideoQuality(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 font-mono"
          >
            <option value="1080p">1080p HD</option>
            <option value="720p">720p سريع</option>
          </select>
        </div>

        {/* Direct Download & TikTok Publish Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3.5">
          <button
            onClick={handleExportTikTokVideo}
            disabled={isExporting}
            className="py-3 px-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>{isExporting ? 'جاري تصدير الفيديو...' : 'تحميل الفيديو للجهاز 📥'}</span>
          </button>

          <button
            onClick={handleShareToTikTokApp}
            className="py-3 px-3 bg-gradient-to-r from-[#fe2c55] via-rose-600 to-[#00f2fe] hover:opacity-95 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/40 active:scale-98 transition-all"
            title="مشاركة الفيديو مباشرة وفتحه في تطبيق تيك توك على هاتفك"
          >
            <Share2 className="w-4 h-4 text-white" />
            <span>مشاركة مباشرة لتطبيق تيك توك 🚀</span>
          </button>
        </div>

        {/* Quick Action Links for TikTok Studio & Samer's account */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] gap-2">
          <a
            href="https://www.tiktok.com/upload?lang=ar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-[#00f2fe] transition-colors flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span>استوديو رفع تيك توك الرسمي ↗</span>
          </a>

          <a
            href="https://www.tiktok.com/@samer22004"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 font-mono font-bold flex items-center gap-1"
          >
            <span>@samer22004 (صفحة الحساب) ↗</span>
          </a>
        </div>
      </div>

      {/* Dynamic 70+ AI Tools Production Pipeline Progress Bar */}
      <div className="w-full max-w-[390px] bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mt-3 shadow-xl backdrop-blur">
        {/* Progress Bar Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>شريط تقدم الـ 70 أداة في خط الإنتاج</span>
                {isPlaying && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {isPlaying ? 'المعالجة جارية بالزمن الحقيقي' : 'جاهز للمزامنة مع التشغيل'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300">
              الأداة #{currentPipelineTool.id} / 72
            </span>
            <span className="text-xs font-mono font-black text-white">
              {progressPercentage}%
            </span>
          </div>
        </div>

        {/* Dynamic Multi-Segment Progress Bar Track (Clickable / Seekable) */}
        <div 
          className="relative w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            // RTL calculation: right to left
            const clickOffset = rect.right - e.clientX;
            const clickRatio = Math.max(0, Math.min(1, clickOffset / rect.width));
            setCurrentTime(clickRatio * totalDuration);
          }}
          title="انقر في أي مكان للتنقل المباشر عبر أدوات السلسلة الـ 72"
        >
          {/* Stage divider tick marks */}
          <div className="absolute inset-0 flex pointer-events-none z-10">
            {PIPELINE_STAGES.map((stg) => (
              <div 
                key={stg.id} 
                className="h-full border-r border-slate-900/60"
                style={{ width: `${(stg.toolsCount / 72) * 100}%` }}
              />
            ))}
          </div>

          {/* Glowing gradient fill */}
          <div 
            className="h-full bg-gradient-to-l from-amber-400 via-rose-500 to-indigo-500 transition-all duration-100 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Glowing active tool cursor */}
            <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-white shadow-[0_0_12px_#f59e0b] rounded-full animate-pulse" />
          </div>
        </div>

        {/* Real-Time Active Tool & Handoff Card */}
        <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800/90 text-right">
          <div className="flex items-center justify-between mb-1.5">
            <span 
              className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white font-mono"
              style={{ backgroundColor: `${currentPipelineStage.color}33`, borderColor: currentPipelineStage.color, borderWidth: 1 }}
            >
              المرحلة {currentPipelineStage.id}: {currentPipelineStage.title}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              فئة: {currentPipelineTool.category}
            </span>
          </div>

          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mt-1">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{currentPipelineTool.name}</span>
          </div>

          <p className="text-[11px] text-slate-300 mt-1 line-clamp-1 leading-snug">
            {currentPipelineTool.role}
          </p>

          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="text-slate-500">تسليم المخرجات للأداة التالية:</span>
            <span className="text-amber-400 font-medium font-mono flex items-center gap-1">
              <span>{currentPipelineTool.handsOffTo}</span>
              <ArrowLeft className="w-3 h-3 text-amber-400" />
            </span>
          </div>
        </div>

        {/* 10 Production Stages Quick Jump Matrix */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400 mb-1.5 flex items-center justify-between">
            <span>مراحل الإنتاج الـ 10:</span>
            <span className="text-[9px] text-slate-500 font-mono">انقر للقفز المباشر</span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {PIPELINE_STAGES.map((stage) => {
              const isCurrentStage = stage.id === currentPipelineStage.id;
              const isPassed = stage.id < currentPipelineStage.id;
              let precedingTools = 0;
              for (let i = 0; i < stage.id - 1; i++) {
                precedingTools += PIPELINE_STAGES[i]?.toolsCount || 7;
              }
              const stageStartTime = (precedingTools / 72) * totalDuration;

              return (
                <button
                  key={stage.id}
                  onClick={() => setCurrentTime(stageStartTime)}
                  className={`px-1.5 py-1 rounded-lg text-[9px] font-bold truncate transition-all text-center ${
                    isCurrentStage 
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm shadow-amber-400/40 ring-1 ring-amber-300' 
                      : isPassed
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-950 text-slate-500 hover:text-slate-400'
                  }`}
                  title={`${stage.title} (الأدوات ${precedingTools + 1}-${precedingTools + stage.toolsCount})`}
                >
                  {stage.id}. {stage.title.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
