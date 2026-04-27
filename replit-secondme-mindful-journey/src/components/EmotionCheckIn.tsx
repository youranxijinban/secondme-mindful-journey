import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getEmotionLogsQueryKey, useCreateEmotionLog } from "@/lib/emotion-store";

type EmotionChoice = {
  id: string;
  label: string;
  emoji: string;
  reflection: string;
  strategy: string;
};

type BodyChoice = {
  id: string;
  label: string;
  followUp: string;
};

type NeedChoice = {
  id: string;
  label: string;
  prompt: string;
};

const EMOTION_CHOICES: EmotionChoice[] = [
  {
    id: "anxious",
    label: "紧绷",
    emoji: "😮‍💨",
    reflection: "像是在努力撑住很多事，心和身体都没有真正放下。",
    strategy: "先把今天最着急解决的一件事放到旁边，只做三轮慢呼吸，再决定下一步。",
  },
  {
    id: "sad",
    label: "低落",
    emoji: "🌫️",
    reflection: "不是没事，只是现在需要一点被看见和被容纳的空间。",
    strategy: "给自己十分钟不做判断的空白，写下此刻最重的一句感受，让它先被放出来。",
  },
  {
    id: "calm",
    label: "平静",
    emoji: "🌿",
    reflection: "你正在一个比较稳的状态里，也许可以顺势照顾自己更深一点。",
    strategy: "趁着心还安静，做一个小小的感恩记录，把今天想留住的片刻写下来。",
  },
  {
    id: "energy",
    label: "有劲",
    emoji: "☀️",
    reflection: "能量还在，这很珍贵，也值得被好好安放，而不是被立刻耗尽。",
    strategy: "把这股劲用在一件真正重要的事上，然后留一点余地给休息和回看。",
  },
];

const BODY_CHOICES: BodyChoice[] = [
  {
    id: "chest",
    label: "胸口和呼吸",
    followUp: "像是身体先发出了信号。我们不急着解释，先承认它真的在发生。",
  },
  {
    id: "mind",
    label: "脑子停不下来",
    followUp: "你可能不是想太多，而是有些东西还没有被说清楚。",
  },
  {
    id: "stomach",
    label: "胃里发紧",
    followUp: "这通常不是小题大做，而是压力已经落到身体里了。",
  },
  {
    id: "whole",
    label: "整个人都被包住",
    followUp: "当感受很大时，先找到一个入口，比逼自己立刻想明白更重要。",
  },
];

const NEED_CHOICES: NeedChoice[] = [
  {
    id: "rest",
    label: "先缓一缓",
    prompt: "如果你允许自己暂停五分钟，最想放下的是什么？",
  },
  {
    id: "clarity",
    label: "想理清一点",
    prompt: "如果只抓住一个念头来看，哪个念头最值得先被说清楚？",
  },
  {
    id: "comfort",
    label: "想被安慰",
    prompt: "如果此刻有人真的懂你，你最希望对方先理解哪一部分？",
  },
  {
    id: "action",
    label: "想迈出一点",
    prompt: "如果只做一个很小的动作，哪一步会让你更靠近轻一点的状态？",
  },
];

const TOTAL_STEPS = 4;

function buildJourneyNote(
  emotion: EmotionChoice,
  body: BodyChoice,
  need: NeedChoice,
  reflection: string,
) {
  const lines = [
    `情绪起点：${emotion.label}`,
    `最明显的位置：${body.label}`,
    `此刻最需要：${need.label}`,
  ];

  if (reflection.trim()) {
    lines.push(`一句心声：${reflection.trim()}`);
  }

  return lines.join("\n");
}

export function EmotionCheckIn() {
  const [step, setStep] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionChoice | null>(null);
  const [selectedBody, setSelectedBody] = useState<BodyChoice | null>(null);
  const [selectedNeed, setSelectedNeed] = useState<NeedChoice | null>(null);
  const [reflection, setReflection] = useState("");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: createLog, isPending } = useCreateEmotionLog({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getEmotionLogsQueryKey() });
        toast({
          title: "这段旅程已经收下了",
          description: "你刚刚留下的感受，已经成为今天的一部分。",
        });
        setStep(0);
        setSelectedEmotion(null);
        setSelectedBody(null);
        setSelectedNeed(null);
        setReflection("");
      },
      onError: () => {
        toast({
          title: "还没来得及保存",
          description: "这一步没有丢，我们可以再试一次。",
          variant: "destructive",
        });
      },
    },
  });

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const summary = useMemo(() => {
    if (!selectedEmotion || !selectedBody || !selectedNeed) {
      return null;
    }

    return {
      title: `你现在更像是 ${selectedEmotion.label}，而且这种感觉主要落在 ${selectedBody.label}。`,
      insight: `${selectedEmotion.reflection} ${selectedBody.followUp}`,
      invitation: `你刚刚表达的是“${selectedNeed.label}”。${selectedNeed.prompt}`,
      strategy: selectedEmotion.strategy,
    };
  }, [selectedEmotion, selectedBody, selectedNeed]);

  const goNext = () => setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const handleSave = () => {
    if (!selectedEmotion || !selectedBody || !selectedNeed || !summary) {
      return;
    }

    createLog({
      data: {
        emotion: selectedEmotion.label,
        emoji: selectedEmotion.emoji,
        strategy: `${summary.insight} ${selectedEmotion.strategy}`,
        note: buildJourneyNote(selectedEmotion, selectedBody, selectedNeed, reflection),
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/60 px-3 py-1 text-xs font-medium text-foreground/70 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Mindful journey
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            现在，先不用把自己讲清楚。
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            我会一小步一小步陪你看。每次只回答一个问题，让感觉慢慢浮上来。
          </p>
        </div>
        <div className="hidden min-w-28 text-right sm:block">
          <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">step</div>
          <div className="mt-1 text-2xl font-semibold text-foreground">
            {step + 1}
            <span className="text-base text-muted-foreground"> / {TOTAL_STEPS}</span>
          </div>
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/60">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
      </div>

      <Card className="overflow-hidden rounded-[28px] border-white/70 bg-white/75 shadow-xl shadow-stone-900/5 backdrop-blur-sm">
        <div className="border-b border-border/60 px-6 py-5 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Brain className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm leading-6 text-foreground">
                {step === 0 && "先从最表面的感觉开始。今天的你，比较靠近哪一种状态？"}
                {step === 1 && selectedEmotion && `你说自己有点${selectedEmotion.label}。这股感觉，最明显地落在哪里？`}
                {step === 2 && selectedBody && `${selectedBody.followUp} 现在的你，更需要哪一种支持？`}
                {step === 3 && selectedNeed && `${selectedNeed.prompt} 你可以只写一句，不需要完整。`}
              </p>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                guided by secondme
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="space-y-6"
            >
              {step === 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {EMOTION_CHOICES.map((emotion) => {
                    const isActive = selectedEmotion?.id === emotion.id;
                    return (
                      <button
                        key={emotion.id}
                        type="button"
                        onClick={() => setSelectedEmotion(emotion)}
                        className={`min-h-28 rounded-[24px] border px-5 py-4 text-left transition-all duration-200 ${
                          isActive
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                            : "border-border/70 bg-stone-50/80 hover:border-primary/40 hover:bg-white"
                        }`}
                      >
                        <div className="text-2xl">{emotion.emoji}</div>
                        <div className="mt-4 text-base font-medium text-foreground">{emotion.label}</div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{emotion.reflection}</p>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {BODY_CHOICES.map((choice) => {
                    const isActive = selectedBody?.id === choice.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => setSelectedBody(choice)}
                        className={`rounded-[22px] border px-5 py-5 text-left transition-all duration-200 ${
                          isActive
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                            : "border-border/70 bg-stone-50/80 hover:border-primary/40 hover:bg-white"
                        }`}
                      >
                        <div className="text-base font-medium text-foreground">{choice.label}</div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{choice.followUp}</p>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {NEED_CHOICES.map((choice) => {
                    const isActive = selectedNeed?.id === choice.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => setSelectedNeed(choice)}
                        className={`rounded-[22px] border px-5 py-5 text-left transition-all duration-200 ${
                          isActive
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                            : "border-border/70 bg-stone-50/80 hover:border-primary/40 hover:bg-white"
                        }`}
                      >
                        <div className="text-base font-medium text-foreground">{choice.label}</div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{choice.prompt}</p>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  {summary && (
                    <div className="rounded-[24px] border border-primary/20 bg-primary/8 px-5 py-5">
                      <p className="text-base font-medium leading-7 text-foreground">{summary.title}</p>
                      <p className="mt-3 text-sm leading-6 text-foreground/80">{summary.insight}</p>
                      <p className="mt-3 text-sm leading-6 text-foreground/80">{summary.invitation}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label htmlFor="journey-reflection" className="text-sm font-medium text-foreground">
                      写一句现在最想照顾的话
                    </label>
                    <Textarea
                      id="journey-reflection"
                      value={reflection}
                      onChange={(event) => setReflection(event.target.value)}
                      placeholder="例如：我不是做不到，我只是已经太久没有停下来。"
                      className="min-h-32 resize-none rounded-[24px] border-border/70 bg-stone-50/90 px-4 py-4 text-sm leading-6 shadow-none focus-visible:ring-primary/30"
                    />
                  </div>

                  {summary && (
                    <div className="rounded-[24px] border border-border/70 bg-stone-50/85 px-5 py-5">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        给此刻的一个小建议
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{summary.strategy}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-3 border-t border-border/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={step === 0 || isPending}
            className="justify-center rounded-full px-5 text-foreground/70"
          >
            上一步
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row">
            {step < TOTAL_STEPS - 1 ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={
                  isPending ||
                  (step === 0 && !selectedEmotion) ||
                  (step === 1 && !selectedBody) ||
                  (step === 2 && !selectedNeed)
                }
                className="rounded-full px-6"
              >
                继续往里看
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSave}
                disabled={isPending || !summary}
                className="rounded-full px-6"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    正在收下这段旅程
                  </>
                ) : (
                  "保存这次探索"
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
