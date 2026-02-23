import { X, Video, Play, Maximize2 } from "lucide-react";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  camera: string;
  time: string;
  alertMessage: string;
}

export function VideoModal({ open, onClose, camera, time, alertMessage }: VideoModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface overflow-hidden animate-scale-in"
        style={{ boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface-raised">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(var(--danger)/0.12)]">
              <Video className="h-3.5 w-3.5 text-[hsl(var(--danger))]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate">Vidéo de l'incident</p>
              <p className="text-xs text-muted-foreground">{camera} · {time}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Video player area */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {/* Simulated camera feed */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />

          {/* Camera overlay UI */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-md bg-[hsl(var(--danger))] px-2 py-1 text-xs font-bold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              REC
            </span>
            <span className="rounded-md bg-black/60 px-2 py-1 text-xs font-mono text-white/80">
              {camera}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="rounded-md bg-black/60 px-2 py-1 text-xs font-mono text-white/80">
              {time}
            </span>
          </div>

          {/* Play button */}
          <button className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/15 border border-white/25 backdrop-blur-sm hover:bg-white/25 transition-colors group">
            <Play className="h-7 w-7 text-white ml-1 group-hover:scale-110 transition-transform" fill="white" />
          </button>

          {/* Bottom camera bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <div className="flex items-center gap-3">
              {/* Progress bar */}
              <div className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-[hsl(var(--danger))]" />
              </div>
              <span className="text-[10px] font-mono text-white/60">00:42 / 02:15</span>
              <Maximize2 className="h-3.5 w-3.5 text-white/60 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        {/* Alert info footer */}
        <div className="px-5 py-3 border-t border-border bg-[hsl(var(--danger-dim))]">
          <p className="text-sm text-[hsl(var(--danger))] font-medium leading-snug">
            ⚠️ {alertMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
