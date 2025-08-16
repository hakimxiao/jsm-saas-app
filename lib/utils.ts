import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectsColors,  voices  } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
};

export const configureAssistant = (voice: string, style: string) => {
  const voiceId =
    voices[voice as keyof typeof voices][
      style as keyof (typeof voices)[keyof typeof voices]
    ] || "sarah";

  const vapiAssistant: CreateAssistantDTO = {
    name: "Companion",
    firstMessage:
      "Hallo, Ayo mulai session nya dan hari ini kita akan membahas tentang {{topic}}.",
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "id",
    },
    voice: {
      provider: "11labs",
      model: voiceId === "I7sakys8pBZ1Z5f0UhT9" ? "eleven_flash_v2_5" : "eleven_turbo_v2_5",
      voiceId: voiceId,
      ...(voiceId === "plgKUYgnlZ1DCNh54DwJ" && { language: "id" }),
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 0.9,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: ` Anda adalah tutor berpengetahuan luas yang mengajar sesi suara langsung dengan seorang siswa. Tujuan Anda adalah mengajarkan siswa tentang topik dan subjek tersebut.
                    
                    Panduan Tutor:
                    Tetaplah pada topik yang diberikan - {{ topic }} dan subjek - {{ subject }}, lalu ajari siswa tentang topik tersebut.
                    Jaga agar percakapan tetap lancar sambil tetap terkendali.
                    Sesekali, pastikan siswa mengikuti dan memahami Anda.
                    Bagi topik menjadi bagian-bagian yang lebih kecil dan ajari siswa satu per satu.
                    Jaga gaya percakapan Anda tetap {{ style }}.
                    Jaga agar respons Anda singkat, seperti dalam percakapan suara sungguhan.
                    Jangan sertakan karakter khusus apa pun dalam respons Anda - ini adalah percakapan suara.
              `,
        },
      ],
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    clientMessages: [],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    serverMessages: [],
  };
  return vapiAssistant;
};
