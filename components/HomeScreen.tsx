"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";
import {
	PencilIcon,
	SparklesIcon,
	LightBulbIcon,
	DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const SUGGESTIONS = [
	{
		icon: PencilIcon,
		label: "Help me write",
		prompt: "Help me write a ",
	},
	{
		icon: SparklesIcon,
		label: "Surprise me",
		prompt: "Tell me something surprising and interesting",
	},
	{
		icon: LightBulbIcon,
		label: "Brainstorm ideas",
		prompt: "Brainstorm ideas for ",
	},
	{
		icon: DocumentMagnifyingGlassIcon,
		label: "Summarize text",
		prompt: "Summarize the following text for me: ",
	},
];

const OpenAIIcon = () => (
	<svg viewBox="0 0 41 41" fill="currentColor" className="h-8 w-8">
		<path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.75-3.001 10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.75 3 10.075 10.075 0 0 0 9.614-6.976 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.239-11.818zm-17.217 24.259c-1.661 0-3.311-.574-4.63-1.627l.228-.13 7.686-4.437a.855.855 0 0 0 .43-.745v-10.82l3.248 1.875a.08.08 0 0 1 .043.063v8.977c-.004 3.752-3.047 6.79-7.005 6.844zm-15.006-6.244a6.79 6.79 0 0 1-.814-4.57l.228.137 7.686 4.438a.858.858 0 0 0 .861 0l9.382-5.416v3.752a.079.079 0 0 1-.031.067L15.958 37.3c-3.253 1.876-7.397.76-9.649-2.415zm-1.961-15.739a6.784 6.784 0 0 1 3.532-2.983v9.133a.855.855 0 0 0 .43.745l9.382 5.414-3.248 1.876a.081.081 0 0 1-.075.008L8.41 27.104a6.793 6.793 0 0 1-5.062-7.956zm26.87 5.836-9.375-5.417 3.248-1.875a.082.082 0 0 1 .075-.009l7.843 4.527a6.787 6.787 0 0 1-1.048 12.244v-9.132a.854.854 0 0 0-.743-.338zm3.234-4.608-.229-.138-7.685-4.437a.858.858 0 0 0-.862 0L15.1 21.235v-3.752a.079.079 0 0 1 .031-.067l7.851-4.522a6.793 6.793 0 0 1 10.075 7.03zM13.498 24.017l-3.248-1.875a.079.079 0 0 1-.042-.063v-8.978c.003-3.761 3.06-6.799 7.02-6.843a6.789 6.789 0 0 1 4.63 1.628l-.228.13-7.686 4.437a.855.855 0 0 0-.43.745l-.016 10.82zm1.766-3.799 4.179-2.413 4.179 2.412v4.825l-4.179 2.412-4.179-2.412V20.218z" />
	</svg>
);

const HomeScreen: React.FC = () => {
	const { data: session } = useSession();
	const router = useRouter();

	const handleSuggestion = async (prompt: string) => {
		if (!session?.user?.email) return;
		const doc = await addDoc(
			collection(db, "users", session.user.email, "chats"),
			{
				userId: session.user.email,
				createdAt: serverTimestamp(),
			}
		);
		// Store the prompt so ChatInput can pick it up via sessionStorage
		sessionStorage.setItem("pendingPrompt", prompt);
		router.push(`/chat/${doc.id}`);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white dark:bg-[#212121]">
			{/* Logo + heading */}
			<div className="flex flex-col items-center gap-4 mb-10">
				<div className="w-14 h-14 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
					<OpenAIIcon />
				</div>
				<h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
					How can I help you today?
				</h1>
			</div>

			{/* Suggestion tiles */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
				{SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
					<button
						key={label}
						onClick={() => handleSuggestion(prompt)}
						className="flex flex-col items-start gap-3 p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#2f2f2f] hover:bg-gray-100 dark:hover:bg-[#3a3a3a] text-left transition-colors"
					>
						<Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
						<span className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-snug">
							{label}
						</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default HomeScreen;
