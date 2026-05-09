import openai from "./chatgpt";

// o1/o3/o4 reasoning models use different parameters
const isReasoningModel = (model: string) => /^o[0-9]/.test(model);

const query = async (text: string, _chatId: string, model: string) => {
    try {
        const params = isReasoningModel(model)
            ? {
                  model,
                  messages: [{ role: "user" as const, content: text }],
                  max_completion_tokens: 5000,
                  stream: false as const,
              }
            : {
                  model,
                  messages: [{ role: "user" as const, content: text }],
                  temperature: 0.7,
                  max_tokens: 1000,
                  stream: false as const,
              };

        const res = await openai.chat.completions.create(params);
        return res.choices[0].message.content;
    } catch (err: any) {
        const status: number = err?.status;
        const detail: string = err?.error?.message ?? err?.message ?? "Unknown error";

        console.error(`OpenAI error [${status}] model="${model}": ${detail}`);

        if (status === 429) {
            return `OpenAI rate limit or quota error: ${detail}`;
        }
        if (status === 400) {
            return `Bad request to OpenAI (model "${model}"): ${detail}`;
        }
        return `ChatGPT was unable to find an answer for that! (${detail})`;
    }
};

export default query;
