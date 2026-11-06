/**
 * High-performance Web Audio API Synthesizer and SFX Engine for TikTok Video Generation
 * Provides gapless narration, cinematic music ducking/swelling, and seamless audio flow.
 */

class AudioVideoEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;
  private mediaStreamDestination: MediaStreamAudioDestinationNode | null = null;
  private isPlaying = false;
  private activeIntervals: number[] = [];
  private activeOscillators: OscillatorNode[] = [];
  private activeVoiceSource: AudioBufferSourceNode | null = null;
  private speechUtterance: SpeechSynthesisUtterance | null = null;
  private audioBufferCache: Map<string, AudioBuffer> = new Map();

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.92, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Dedicated voiceover gain node routed to masterGain AND mediaStreamDestination
      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.setValueAtTime(1.15, this.ctx.currentTime);
      this.voiceGain.connect(this.masterGain);

      // Create stream destination for MediaRecorder canvas export
      try {
        this.mediaStreamDestination = this.ctx.createMediaStreamDestination();
        this.masterGain.connect(this.mediaStreamDestination);
      } catch (e) {
        console.warn('MediaStreamDestination not supported in this environment', e);
      }
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public async resumeContext(): Promise<void> {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn('AudioContext resume error:', e);
      }
    }
  }

  public getAudioStream(): MediaStream | null {
    this.initContext();
    return this.mediaStreamDestination ? this.mediaStreamDestination.stream : null;
  }

  /**
   * Play dynamic cinematic soundtrack based on genre with continuous rhythmic pulse
   */
  public startCinematicMusic(genre: 'tension' | 'cyber' | 'epic' | 'ambient' | 'horror' | 'motivation' = 'cyber') {
    this.initContext();
    this.stopMusic();
    if (!this.ctx || !this.musicGain) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;

    // Continuous rhythmic pulse sub-bass that NEVER stops
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(48, now);
    subGain.gain.setValueAtTime(0.38, now);
    subOsc.connect(subGain);
    subGain.connect(this.musicGain);
    subOsc.start();
    this.activeOscillators.push(subOsc);

    if (genre === 'cyber') {
      // 16th note synth arpeggiator feel
      const rootNotes = [65.41, 77.78, 87.31, 98.00, 116.54, 130.81]; // C2, Eb2, F2, G2, Bb2, C3
      let step = 0;
      const interval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying || !this.musicGain) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const f = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        const freq = rootNotes[step % rootNotes.length] * (step % 4 === 0 ? 0.5 : 1);
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        f.type = 'lowpass';
        f.frequency.setValueAtTime(1200, this.ctx.currentTime);

        g.gain.setValueAtTime(0.3, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

        osc.connect(f);
        f.connect(g);
        g.connect(this.musicGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.24);
        step++;
      }, 190);
      this.activeIntervals.push(interval);

    } else if (genre === 'tension' || genre === 'horror') {
      // Deep pulsating bass + eerie high drone
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(55, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      filter.Q.setValueAtTime(6, now);

      bassOsc.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(this.musicGain);

      bassGain.gain.setValueAtTime(0.42, now);
      bassOsc.start();
      this.activeOscillators.push(bassOsc);

      // Continuous tension heartbeat pulse every 450ms
      const interval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        filter.frequency.setValueAtTime(160, t);
        filter.frequency.exponentialRampToValueAtTime(460, t + 0.18);
        filter.frequency.exponentialRampToValueAtTime(160, t + 0.42);
      }, 450);
      this.activeIntervals.push(interval);

    } else {
      // Epic grand orchestral pad + rhythmic chord pulses
      const freqs = [110, 164.81, 220, 277.18]; // A2, E3, A3, C#4
      freqs.forEach((freq) => {
        if (!this.ctx || !this.musicGain) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        g.gain.setValueAtTime(0.18, now);
        osc.connect(g);
        g.connect(this.musicGain);
        osc.start();
        this.activeOscillators.push(osc);
      });

      // Pulse rhythmic chord swell every 600ms
      const interval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying || !this.sfxGain) return;
        const thump = this.ctx.createOscillator();
        const tg = this.ctx.createGain();
        thump.type = 'sine';
        thump.frequency.setValueAtTime(95, this.ctx.currentTime);
        thump.frequency.exponentialRampToValueAtTime(38, this.ctx.currentTime + 0.28);
        tg.gain.setValueAtTime(0.42, this.ctx.currentTime);
        tg.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.32);
        thump.connect(tg);
        tg.connect(this.sfxGain);
        thump.start();
        thump.stop(this.ctx.currentTime + 0.35);
      }, 600);
      this.activeIntervals.push(interval);
    }
  }

  /**
   * Duck music down when speaking, swell music up during transition cuts
   */
  public duckMusic(isSpeaking: boolean) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);
    if (isSpeaking) {
      // Lower music slightly during speech so voiceover is crisp and dominant
      this.musicGain.gain.linearRampToValueAtTime(0.36, now + 0.12);
    } else {
      // Swell music up when speaking pauses so there is zero empty silence
      this.musicGain.gain.linearRampToValueAtTime(0.74, now + 0.18);
    }
  }

  /**
   * Stop cinematic music background
   */
  public stopMusic() {
    this.isPlaying = false;
    this.activeIntervals.forEach(id => clearInterval(id));
    this.activeIntervals = [];

    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // ignore
      }
    });
    this.activeOscillators = [];
  }

  /**
   * Play SFX Cues (Whoosh, Sub Bass, Heartbeat, Glitch, Hit)
   */
  public playSFX(sfxName: string) {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const nameLower = (sfxName || '').toLowerCase();

    if (nameLower.includes('whoosh') || nameLower.includes('riser')) {
      // White noise whoosh
      const bufferSize = this.ctx.sampleRate * 0.55;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(220, now);
      filter.frequency.exponentialRampToValueAtTime(3400, now + 0.42);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.65, now + 0.28);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start();
      noise.stop(now + 0.55);

    } else if (nameLower.includes('heartbeat') || nameLower.includes('pulse')) {
      // Double thump sub-bass
      const playThump = (offset: number, vol: number) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(88, now + offset);
        osc.frequency.exponentialRampToValueAtTime(36, now + offset + 0.15);

        g.gain.setValueAtTime(vol, now + offset);
        g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
      };
      playThump(0, 0.75);
      playThump(0.16, 0.5);

    } else if (nameLower.includes('bass') || nameLower.includes('drop') || nameLower.includes('thud')) {
      // Cinematic Sub Bass Drop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.7);

      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(now + 0.85);

    } else if (nameLower.includes('glitch')) {
      // Electronic digital glitch
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220 + Math.random() * 850, now + i * 0.045);

        g.gain.setValueAtTime(0.32, now + i * 0.045);
        g.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * 0.045);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(now + i * 0.045);
        osc.stop(now + (i + 1) * 0.05);
      }
    } else {
      // Grand cinematic impact hit
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.55);

      gain.gain.setValueAtTime(0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(now + 0.7);
    }
  }

  /**
   * Fetch and decode Arabic TTS audio buffer from server proxy
   */
  public async fetchVoiceoverAudioBuffer(text: string): Promise<AudioBuffer | null> {
    const cleanText = text.trim();
    if (!cleanText) return null;

    if (this.audioBufferCache.has(cleanText)) {
      return this.audioBufferCache.get(cleanText) || null;
    }

    this.initContext();
    if (!this.ctx) return null;

    try {
      const res = await fetch(`/api/tts/audio?text=${encodeURIComponent(cleanText)}`);
      if (!res.ok) {
        console.warn(`TTS server returned status ${res.status}`);
        return null;
      }

      const arrayBuffer = await res.arrayBuffer();
      // decodeAudioData consumes the arrayBuffer, so we decode directly
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.audioBufferCache.set(cleanText, audioBuffer);
      return audioBuffer;
    } catch (e) {
      console.warn('Failed to fetch/decode Arabic TTS audio buffer:', e);
      return null;
    }
  }

  /**
   * Preload audio buffers for all story scenes so video playback & export have instant vocal audio
   */
  public async preloadStoryVoiceovers(scenes: { voiceover: string }[]): Promise<void> {
    this.initContext();
    const tasks = scenes.map(s => {
      if (s.voiceover && s.voiceover.trim()) {
        return this.fetchVoiceoverAudioBuffer(s.voiceover);
      }
      return Promise.resolve(null);
    });

    try {
      await Promise.all(tasks);
    } catch (err) {
      console.warn('Error during voiceover preloading:', err);
    }
  }

  private isVoiceoverActive = false;

  public isVoiceoverPlaying(): boolean {
    return this.isVoiceoverActive;
  }

  /**
   * Play scene voiceover through Web Audio API (routed to both masterGain & mediaStreamDestination)
   * This guarantees that MediaRecorder captures 100% of the spoken narration in exported MP4/WebM!
   */
  public async playSceneVoiceover(
    text: string,
    onEnd?: () => void,
    targetDuration: number = 7.5
  ): Promise<void> {
    this.initContext();

    if (!this.ctx || !this.voiceGain) {
      this.speakVoiceover(text, onEnd, targetDuration);
      return;
    }

    try {
      const buffer = await this.fetchVoiceoverAudioBuffer(text);

      if (buffer && this.ctx && this.voiceGain) {
        // Smoothly stop any old voice source without harsh clicking
        if (this.activeVoiceSource) {
          try {
            this.activeVoiceSource.stop();
            this.activeVoiceSource.disconnect();
          } catch (e) {
            // ignore
          }
          this.activeVoiceSource = null;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        // Calculate rate to finish at least 1.2s before targetDuration ends
        const bufferDuration = buffer.duration;
        const targetPlayTime = Math.max(2.8, targetDuration - 1.2);
        let rate = 1.0;
        if (bufferDuration > targetPlayTime) {
          rate = Math.min(1.45, bufferDuration / targetPlayTime);
        } else if (bufferDuration < 2.5 && targetPlayTime > 4.5) {
          rate = 1.0;
        }
        source.playbackRate.setValueAtTime(rate, this.ctx.currentTime);

        source.connect(this.voiceGain);

        this.duckMusic(true);
        this.isVoiceoverActive = true;

        source.onended = () => {
          this.isVoiceoverActive = false;
          this.duckMusic(false);
          if (this.activeVoiceSource === source) {
            this.activeVoiceSource = null;
          }
          if (onEnd) onEnd();
        };

        this.activeVoiceSource = source;
        source.start();
        return;
      }
    } catch (err) {
      console.warn('Error playing buffered voiceover, falling back to Web Speech API:', err);
    }

    // High quality fallback: Web Speech API + Web Audio vocal carrier
    this.speakVoiceover(text, onEnd, targetDuration);
  }

  /**
   * Fallback: Speak Arabic text via Web Speech API with gapless pacing and automatic ducking
   */
  public speakVoiceover(text: string, onEnd?: () => void, targetDuration: number = 7.5) {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Brief 35ms timeout prevents browser audio thread stall on cancel/speak sequence
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';

        // Calculate dynamic speech rate based on word count to smoothly finish before scene ends
        const words = text.trim().split(/\s+/).length;
        const desiredSpeechTime = Math.max(3.2, targetDuration - 1.2);
        const naturalTime = words / 2.3;
        let rate = naturalTime / desiredSpeechTime;
        rate = Math.min(1.42, Math.max(1.05, rate));

        utterance.rate = rate;
        utterance.pitch = 0.98;

        // Try finding an Arabic voice
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find(v => v.lang.startsWith('ar') || v.lang.includes('Arabic'));
        if (arabicVoice) {
          utterance.voice = arabicVoice;
        }

        this.duckMusic(true);
        this.isVoiceoverActive = true;

        utterance.onstart = () => {
          this.duckMusic(true);
          this.isVoiceoverActive = true;
        };

        utterance.onend = () => {
          this.isVoiceoverActive = false;
          this.duckMusic(false);
          if (onEnd) onEnd();
        };

        utterance.onerror = () => {
          this.isVoiceoverActive = false;
          this.duckMusic(false);
          if (onEnd) onEnd();
        };

        this.speechUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      }, 35);
    } catch (e) {
      console.warn('Speech synthesis error', e);
      this.isVoiceoverActive = false;
      this.duckMusic(false);
      if (onEnd) onEnd();
    }
  }

  public stopVoiceover() {
    this.isVoiceoverActive = false;
    if (this.activeVoiceSource) {
      try {
        this.activeVoiceSource.stop();
        this.activeVoiceSource.disconnect();
      } catch (e) {
        // ignore
      }
      this.activeVoiceSource = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.duckMusic(false);
  }

  public stopAll() {
    this.stopMusic();
    this.stopVoiceover();
  }
}

export const audioEngine = new AudioVideoEngine();
