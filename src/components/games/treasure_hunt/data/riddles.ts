import type { Riddle } from "../types";

export 
const TREASURE_RIDDLES: Riddle[] = [
  {
    id: "1",
    title: "Qadimiy maqbar",
    story: "Cho'l qaqrida bir maqbaraga yetib keldingiz...",
    question: "Qaysi hayvon eng uzoq yashaydi?",
    options: ["Toshbaqa", "Fil", "Kit", "Kaptar"],
    answerIndex: 0,
    hint: "Bu hayvon 150 yilgacha yashay oladi",
    reward: 120
  },
  {
    id: "2",
    title: "Yo'qolgan shahar",
    story: "Qum ostida qolgan shahar qoldiqlari...",
    question: "Piramidalar qaysi davlatda joylashgan?",
    options: ["Gretsiya", "Misr", "Rim", "Iroq"],
    answerIndex: 1,
    hint: "Nil daryosi bo'yida joylashgan",
    reward: 150
  },
  {
    id: "3",
    title: "Sirli g'or",
    story: "G'or devorida qadimiy yozuvlar bor...",
    question: "Yerning eng yuqori nuqtasi?",
    options: ["Everest", "Kilimanjaro", "Elbrus", "Mont Blanc"],
    answerIndex: 0,
    hint: "Himolay tog'larida joylashgan",
    reward: 130
  },
  {
    id: "4",
    title: "Dengiz qaroqchilari",
    story: "Kema vayronalari orasida bir shisha topdingiz...",
    question: "Eng katta okean qaysi?",
    options: ["Atlantika", "Tinch", "Hind", "Shimoliy Muz"],
    answerIndex: 1,
    hint: "Bu okean dunyodagi eng katta",
    reward: 140
  }
];
