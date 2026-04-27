import { format, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Clock3, Sparkles, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEmotionLogs } from "@/lib/emotion-store";

function parseNote(note?: string) {
  if (!note) {
    return [];
  }

  return note
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function JourneyTimeline() {
  const { data: logs, isLoading, isError } = useGetEmotionLogs();

  if (isLoading) {
    return (
      <Card className="rounded-[28px] border-white/70 bg-white/70 p-6 shadow-xl shadow-stone-900/5 backdrop-blur-sm">
        <div className="space-y-5">
          {[1, 2, 3].map((index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-24 w-full rounded-[22px]" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (isError || !logs) {
    return (
      <Card className="rounded-[28px] border-white/70 bg-white/70 p-6 shadow-xl shadow-stone-900/5 backdrop-blur-sm">
        <p className="text-sm leading-6 text-muted-foreground">
          暂时还没有办法展开你的 journey，稍后再试试。
        </p>
      </Card>
    );
  }

  const sortedLogs = [...logs].sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
  );

  return (
    <Card className="rounded-[28px] border-white/70 bg-white/72 p-6 shadow-xl shadow-stone-900/5 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Clock3 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Journey archive</h2>
          <p className="text-sm text-muted-foreground">你一路上留下来的片刻，会慢慢在这里长出来。</p>
        </div>
      </div>

      {sortedLogs.length === 0 ? (
        <div className="mt-6 rounded-[24px] border border-dashed border-border/70 bg-stone-50/70 px-5 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Wind className="h-5 w-5" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">第一段探索还没开始</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            当你完成一次分步对话，这里会留下那一刻的情绪、需要，以及你写给自己的话。
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {sortedLogs.map((log) => {
            const date = parseISO(log.createdAt);
            const noteLines = parseNote(log.note);

            return (
              <div
                key={log.id}
                className="rounded-[24px] border border-border/70 bg-stone-50/80 px-5 py-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                      {log.emoji}
                    </div>
                    <div>
                      <p className="text-base font-medium text-foreground">{log.emotion}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(date, "M月d日 HH:mm", { locale: zhCN })}
                      </p>
                    </div>
                  </div>
                  <Sparkles className="mt-1 h-4 w-4 flex-shrink-0 text-primary/70" />
                </div>

                {noteLines.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {noteLines.map((line) => (
                      <p key={line} className="text-sm leading-6 text-foreground/78">
                        {line}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-4 rounded-[18px] bg-white/80 px-4 py-3">
                  <p className="text-sm leading-6 text-muted-foreground">{log.strategy}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
