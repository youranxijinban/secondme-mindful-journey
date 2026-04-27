export const EMOTIONS = [
  {
    id: "energy",
    label: "充满能量",
    emoji: "🤩",
    strategy: "你的能量满满！建议尝试一次新挑战，或把这份能量分享给身边的人。记得也给自己留一些休息时间哦。",
    color: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200",
  },
  {
    id: "calm",
    label: "平静放松",
    emoji: "😌",
    strategy: "平静是一种力量。可以做5分钟的正念冥想，感受此刻的平和。也可以写下今天让你感恩的三件事。",
    color: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
  },
  {
    id: "anxious",
    label: "有点焦虑",
    emoji: "🤔",
    strategy: "焦虑是身体在提醒你关注自己。试试4-7-8呼吸法：吸气4秒，屏住7秒，呼气8秒。做三次，感受焦虑慢慢减退。",
    color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
  },
  {
    id: "sad",
    label: "情绪低落",
    emoji: "🌧️",
    strategy: "低落的心情也是值得被接纳的。给自己一个温暖的拥抱，喝一杯热茶，或者听一首喜欢的歌。明天的阳光还在等你。",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200",
  },
];

export const AUDIO_SOURCES = [
  {
    id: "rain",
    title: "雨声",
    noiseType: "rain" as const,
    icon: "CloudRain",
  },
  {
    id: "forest",
    title: "森林",
    noiseType: "forest" as const,
    icon: "Trees",
  },
  {
    id: "cafe",
    title: "咖啡馆",
    noiseType: "cafe" as const,
    icon: "Coffee",
  },
  {
    id: "ocean",
    title: "海浪",
    noiseType: "ocean" as const,
    icon: "Waves",
  },
];
