import type { NextApiRequest, NextApiResponse } from "next";
import openai from "../../lib/chatgpt";

type Option = {
    value: string;
    label: string;
};

type Data = {
    modelOptions: Option[];
};

// Prefixes that identify chat-compatible models
const CHAT_PREFIXES = ["gpt-3.5", "gpt-4", "o1", "o3", "o4"];

// Non-chat model variants to exclude (audio, TTS, transcription, search, realtime)
const EXCLUDE_PATTERNS = [
    "instruct", "vision-preview", "0301", "0314",
    "audio", "tts", "transcribe", "search", "realtime",
];

// Maps raw API model IDs to human-friendly ChatGPT-style display names
const LABEL_MAP: Record<string, string> = {
    "gpt-4o":                "GPT-4o",
    "gpt-4o-mini":           "GPT-4o mini",
    "gpt-4-turbo":           "GPT-4 Turbo",
    "gpt-4-turbo-preview":   "GPT-4 Turbo (preview)",
    "gpt-4":                 "GPT-4",
    "gpt-3.5-turbo":         "GPT-3.5 Turbo",
    "gpt-3.5-turbo-16k":     "GPT-3.5 Turbo 16K",
    "o1":                    "o1",
    "o1-mini":               "o1 mini",
    "o1-preview":            "o1 (preview)",
    "o3":                    "o3",
    "o3-mini":               "o3 mini",
    "o4-mini":               "o4 mini",
};

// Fallback: converts raw IDs like "gpt-4-0613" into "GPT-4 0613"
const formatModelId = (id: string): string =>
    id
        .replace(/^gpt-/i, "GPT-")
        .replace(/-/g, " ")
        .replace(/\bgpt\b/gi, "GPT");

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const models = await openai.models.list();

    const modelOptions = models.data
        .filter((model) =>
            CHAT_PREFIXES.some((prefix) => model.id.startsWith(prefix)) &&
            !EXCLUDE_PATTERNS.some((pattern) => model.id.includes(pattern))
        )
        .sort((a, b) => b.id.localeCompare(a.id)) // newest first
        .map((model) => ({
            value: model.id,
            label: LABEL_MAP[model.id] ?? formatModelId(model.id),
        }));

    return res.status(200).json({ modelOptions });
}
