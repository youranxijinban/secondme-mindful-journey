import { motion } from "framer-motion";
import { MoonStar } from "lucide-react";
import { EmotionCheckIn } from "@/components/EmotionCheckIn";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { ContentCards } from "@/components/ContentCards";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(220,232,220,0.95),_transparent_65%)]" />
        <div className="absolute left-[-10rem] top-36 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-8rem] top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-16 pt-10 sm:px-8 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto w-full max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.24em] text-foreground/65 shadow-sm backdrop-blur-sm">
            <MoonStar className="h-3.5 w-3.5 text-primary" />
            SecondMe
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            不是打卡情绪，
            <br />
            是陪自己走一小段路。
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            这里不需要一次说完整。你只要跟着问题走，让当下的感觉一点点显形，然后收下一句适合自己的提醒。
          </p>
        </motion.header>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_22rem] lg:items-start">
          <motion.section
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="space-y-8"
          >
            <EmotionCheckIn />
            <ContentCards />
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
            className="lg:sticky lg:top-8"
          >
            <JourneyTimeline />
          </motion.aside>
        </div>
      </main>
    </div>
  );
}
