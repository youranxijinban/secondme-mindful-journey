import { useMutation, useQuery } from "@tanstack/react-query";

export type EmotionLog = {
  id: number;
  emotion: string;
  emoji: string;
  strategy: string;
  note?: string;
  createdAt: string;
};

type CreateEmotionLogInput = {
  emotion: string;
  emoji: string;
  strategy: string;
  note?: string;
};

const STORAGE_KEY = "secondme:emotion-logs";

function readLogs(): EmotionLog[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as EmotionLog[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

function writeLogs(logs: EmotionLog[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function getEmotionLogsQueryKey() {
  return ["emotion-logs"];
}

export function useGetEmotionLogs() {
  return useQuery({
    queryKey: getEmotionLogsQueryKey(),
    queryFn: async () => readLogs(),
    initialData: [],
  });
}

export function useCreateEmotionLog(options?: {
  mutation?: {
    onSuccess?: () => void;
    onError?: () => void;
  };
}) {
  return useMutation({
    mutationFn: async ({ data }: { data: CreateEmotionLogInput }) => {
      const logs = readLogs();
      const nextLog: EmotionLog = {
        id: Date.now(),
        emotion: data.emotion,
        emoji: data.emoji,
        strategy: data.strategy,
        note: data.note,
        createdAt: new Date().toISOString(),
      };

      writeLogs([nextLog, ...logs]);
      return nextLog;
    },
    onSuccess: () => {
      options?.mutation?.onSuccess?.();
    },
    onError: () => {
      options?.mutation?.onError?.();
    },
  });
}
