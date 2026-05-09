"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db } from "../utils/firebase";

type Props = {
	onNewChat: () => void;
	iconOnly?: boolean;
};

const NewChat: React.FC<Props> = ({ onNewChat, iconOnly = false }) => {
	const { data: session } = useSession();
	const router = useRouter();

	const createNewChat = async () => {
		const doc = await addDoc(
			collection(db, "users", session?.user?.email!, "chats"),
			{
				userId: session?.user?.email!,
				createdAt: serverTimestamp(),
			}
		);
		onNewChat();
		router.push(`/chat/${doc.id}`);
	};

	if (iconOnly) {
		return (
			<button
				onClick={createNewChat}
				title="New chat"
				className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
			>
				<PencilSquareIcon className="h-5 w-5" />
			</button>
		);
	}

	return (
		<button
			onClick={createNewChat}
			className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-white/20 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm mb-1"
		>
			<PlusIcon className="h-4 w-4" />
			<span>New chat</span>
		</button>
	);
};

export default NewChat;
