"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { FormEvent, useRef, useState } from "react";
import { db } from "../utils/firebase";
import { toast } from "react-hot-toast";
import useSWR from "swr";

type Props = {
	chatId: string;
};

const ChatInput: React.FC<Props> = ({ chatId }) => {
	const [prompt, setPrompt] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { data: session } = useSession();

	const { data: model } = useSWR("selectedModel", {
		fallbackData: "text-davinci-003",
	});

	const sendMessage = async (e?: FormEvent<HTMLFormElement>) => {
		e?.preventDefault();
		const input = prompt.trim();
		if (!input) return;

		const notification = toast.loading("ChatGPT is thinking...");
		setPrompt("");
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}

		const message: Message = {
			text: input,
			createdAt: Timestamp.now(),
			user: {
				_id: session?.user?.email!,
				name: session?.user?.name!,
				avatar:
					session?.user?.image ||
					`https://ui-avatars.com/api?name=${session?.user?.name}`,
			},
		};

		await addDoc(
			collection(db, "users", session?.user?.email!, "chats", chatId, "messages"),
			message
		);

		await fetch("/api/ask-question", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				text: input,
				chatId,
				model,
				session,
				timestamp: Timestamp.now(),
			}),
		})
			.then(() =>
				toast.success("ChatGPT has responded!", { id: notification })
			)
			.catch((err) =>
				toast.error(`Error: ${err.message}`, { id: notification })
			);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPrompt(e.target.value);
		const el = e.target;
		el.style.height = "auto";
		el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
	};

	return (
		<div className="bg-white dark:bg-[#212121] px-4 pb-4 pt-3 border-t border-gray-200 dark:border-white/10">
			<div className="max-w-3xl mx-auto">
				<form
					onSubmit={sendMessage}
					className="flex items-end gap-3 bg-[#f4f4f4] dark:bg-[#2f2f2f] rounded-2xl px-4 py-3 border border-gray-200/80 dark:border-white/10 focus-within:border-gray-400 dark:focus-within:border-white/20 transition-colors"
				>
					<textarea
						ref={textareaRef}
						rows={1}
						className="flex-1 bg-transparent focus:outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none overflow-y-auto disabled:cursor-not-allowed"
						style={{ maxHeight: "200px" }}
						disabled={!session}
						value={prompt}
						onChange={handleInput}
						onKeyDown={handleKeyDown}
						placeholder="Message ChatGPT"
					/>
					<button
						type="submit"
						disabled={!prompt.trim() || !session}
						className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 dark:bg-white flex items-center justify-center text-white dark:text-black disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
					>
						<PaperAirplaneIcon className="h-4 w-4" />
					</button>
				</form>
				<p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-2">
					ChatGPT can make mistakes. Consider checking important information.
				</p>
			</div>
		</div>
	);
};

export default ChatInput;
