import { useState, useRef, useCallback } from "react";
import { Play, Pause, Volume2, CloudRain, Trees, Coffee, Waves } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type NoiseType = "rain" | "forest" | "ocean" | "cafe";

interface AudioPlayerProps {
  id: string;
  title: string;
  noiseType: NoiseType;
  icon: string;
}

const getIcon = (name: string) => {
  switch (name) {
    case "CloudRain": return <CloudRain className="w-5 h-5" />;
    case "Trees": return <Trees className="w-5 h-5" />;
    case "Coffee": return <Coffee className="w-5 h-5" />;
    case "Waves": return <Waves className="w-5 h-5" />;
    default: return <Volume2 className="w-5 h-5" />;
  }
};

// ---------- Web Audio noise generators ----------

function createWhiteNoiseNode(ctx: AudioContext): AudioBufferSourceNode {
  const bufferSize = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

function buildRainGraph(ctx: AudioContext, gainNode: GainNode) {
  // White noise → bandpass (1kHz) → lowpass (3kHz) gives a soft rain texture
  const noise = createWhiteNoiseNode(ctx);

  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1000;
  bp.Q.value = 0.5;

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 3500;

  noise.connect(bp);
  bp.connect(lp);
  lp.connect(gainNode);
  noise.start();
  return noise;
}

function buildForestGraph(ctx: AudioContext, gainNode: GainNode) {
  // Pink noise approximation: cascade of low-shelf filters on white noise
  const noise = createWhiteNoiseNode(ctx);

  const ls1 = ctx.createBiquadFilter();
  ls1.type = "lowshelf";
  ls1.frequency.value = 200;
  ls1.gain.value = 8;

  const ls2 = ctx.createBiquadFilter();
  ls2.type = "lowshelf";
  ls2.frequency.value = 600;
  ls2.gain.value = 4;

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 4000;

  noise.connect(ls1);
  ls1.connect(ls2);
  ls2.connect(lp);
  lp.connect(gainNode);
  noise.start();
  return noise;
}

function buildOceanGraph(ctx: AudioContext, gainNode: GainNode) {
  // Brown-ish noise for waves: heavy low-shelf boost + lowpass
  const noise = createWhiteNoiseNode(ctx);

  const ls = ctx.createBiquadFilter();
  ls.type = "lowshelf";
  ls.frequency.value = 100;
  ls.gain.value = 20;

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1200;

  // Slow LFO for "wave in / wave out" motion
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.12;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 400;
  lfo.connect(lfoGain);
  lfoGain.connect(lp.frequency);
  lfo.start();

  noise.connect(ls);
  ls.connect(lp);
  lp.connect(gainNode);
  noise.start();
  return noise;
}

function buildCafeGraph(ctx: AudioContext, gainNode: GainNode) {
  // Low rumble of a café: white noise heavily low-passed + subtle mid presence
  const noise = createWhiteNoiseNode(ctx);

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 800;

  const mid = ctx.createBiquadFilter();
  mid.type = "peaking";
  mid.frequency.value = 300;
  mid.gain.value = 6;
  mid.Q.value = 1.2;

  noise.connect(lp);
  lp.connect(mid);
  mid.connect(gainNode);
  noise.start();
  return noise;
}

// ------------------------------------------------

interface NoiseState {
  ctx: AudioContext;
  gainNode: GainNode;
  source: AudioBufferSourceNode;
}

export function AudioPlayer({ title, noiseType, icon }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([45]);
  const noiseRef = useRef<NoiseState | null>(null);

  const startNoise = useCallback(() => {
    const ctx = new AudioContext();
    const gainNode = ctx.createGain();
    gainNode.gain.value = volume[0] / 100;
    gainNode.connect(ctx.destination);

    let source: AudioBufferSourceNode;
    switch (noiseType) {
      case "rain":   source = buildRainGraph(ctx, gainNode);   break;
      case "forest": source = buildForestGraph(ctx, gainNode); break;
      case "ocean":  source = buildOceanGraph(ctx, gainNode);  break;
      case "cafe":   source = buildCafeGraph(ctx, gainNode);   break;
    }

    noiseRef.current = { ctx, gainNode, source };
    setIsPlaying(true);
  }, [noiseType, volume]);

  const stopNoise = useCallback(() => {
    if (noiseRef.current) {
      try { noiseRef.current.source.stop(); } catch {}
      noiseRef.current.ctx.close();
      noiseRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      stopNoise();
    } else {
      startNoise();
    }
  };

  const handleVolumeChange = (val: number[]) => {
    setVolume(val);
    if (noiseRef.current) {
      noiseRef.current.gainNode.gain.value = val[0] / 100;
    }
  };

  return (
    <Card className="flex flex-col p-4 bg-white/60 backdrop-blur-md border-white/40 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 text-primary">
          <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
            {getIcon(icon)}
          </div>
          <span className="font-medium">{title}</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className={`h-10 w-10 rounded-full ${
            isPlaying
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          } shadow-sm`}
        >
          {isPlaying
            ? <Pause className="w-4 h-4" fill="currentColor" />
            : <Play  className="w-4 h-4 ml-0.5" fill="currentColor" />}
        </Button>
      </div>

      <div className="flex items-center space-x-3 px-1 mt-auto">
        <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" />
        <Slider
          value={volume}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
          className="flex-1 cursor-pointer"
        />
      </div>

      {isPlaying && (
        <div className="flex items-center gap-1 mt-2 px-1">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div
              key={i}
              className="flex-1 bg-primary/50 rounded-full"
              style={{
                height: `${4 + Math.sin(Date.now() / 300 + i) * 3}px`,
                animation: `pulse ${0.6 + i * 0.1}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
