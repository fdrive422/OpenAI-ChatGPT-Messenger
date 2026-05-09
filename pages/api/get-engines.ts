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
            label: model.id,
        }));

    return res.status(200).json({ modelOptions });
}
