"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";
import { db } from "../utils/firebase";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import ModelSelection from "./ModelSelection";

type Props = {
  chatId: string;
};

const ChatInput: React.FC<Props> = ({ chatId }) => {
  const [prompt, setPrompt] = useState("");
  const { data: session } = useSession();

  const { data: model } = useSWR("selectedModel", {
    fallbackData: "text-davinci-003",
  });

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;

    // TOAST NOTIFICATION
    const notification = toast.loading("ChatGPT is thinking...");

    const input = prompt.trim();
    setPrompt("");

    const message: Message = {
      text: input,
      // createdAt: serverTimestamp(),
      createdAt: Timestamp.now(),
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image ||
          `https://ui-avatars.com/api?name=${session?.user?.name}`,
      },
    };

    // ADD ROW MESSAGE TO FIREBASE
    await addDoc(
      collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      ),
      message
    );

    // ASK QUESTION TO OPENAI
    await fetch("/api/ask-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: input,
        chatId,
        model,
        session,
        timestamp: Timestamp.now(),
      }),
    })
      .then(() => {
        // TOAST NOTIFICATION TO SAY SUCCESS
        toast.success("ChatGPT has responded!", {
          id: notification,
        });
      })
      .catch((err) => {
        toast.error(`Backend (Error: ${err.message})`, {
          id: notification,
        });
      });
  };

  return (
    <div className="bg-white text-gray-800 dark:bg-gray-700/50 dark:text-gray-400 rounded-lg text-sm border-t-2 border-gray-300 dark:border-transparent dark:border-none">
      <form onSubmit={sendMessage} className="p-5 space-x-5 flex">
        <input
          className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300"
          disabled={!session}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
        />
        <button
          type="submit"
          disabled={!prompt || !session}
          className="bg-[#11A37F] hover:opacity-50 text-white font-semibold px-4 py-2 rounded cursor-pointer duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
        </button>
      </form>

      <div className="sm:hidden">
        {/* MODEL SELECTION */}
        <ModelSelection />
      </div>
    </div>
  );
};

export default ChatInput;
