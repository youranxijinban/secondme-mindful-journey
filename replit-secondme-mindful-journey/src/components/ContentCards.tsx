import { BookOpen, Coffee, Moon, Waves } from "lucide-react";
import { Card } from "@/components/ui/card";

const COMPANIONS = [
  {
    title: "一分钟落地",
    description: "看向身边三个真实的物体，提醒自己：我在这里，我是安全的。",
    icon: Waves,
  },
  {
    title: "一句温柔的话",
    description: "把“我应该更好一点”换成“我已经很努力了，先照顾现在的自己”。",
    icon: BookOpen,
  },
  {
    title: "给身体一个信号",
    description: "慢慢喝一口温水，或者站起来走十步，让身体知道我们准备回来了。",
    icon: Coffee,
  },
  {
    title: "今晚收尾",
    description: "睡前只问自己一个问题：今天最值得被轻轻放下的是什么？",
    icon: Moon,
  },
];

export function ContentCards() {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Gentle prompts</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          不是任务清单，只是几种帮你把注意力带回来的小方式。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {COMPANIONS.map((item) => (
          <Card
            key={item.title}
            className="rounded-[24px] border-white/70 bg-white/68 px-5 py-5 shadow-lg shadow-stone-900/5 backdrop-blur-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <item.icon className="h-4 w-4" />
            </div>
            <h3 className="mt-4 text-base font-medium text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
