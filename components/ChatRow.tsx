"use client";

import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { collection, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../utils/firebase";

type Props = {
	id: string;
	onClickChat: () => void;
};

const ChatRow: React.FC<Props> = ({ id, onClickChat }) => {
	const [active, setActive] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const { data: session } = useSession();

	const [data] = useCollection(
		session &&
			query(
				collection(db, "users", session?.user?.email!, "chats", id, "messages"),
				orderBy("createdAt", "asc")
			)
	);

	useEffect(() => {
		if (!pathname) return;
		setActive(pathname.includes(id));
	}, [pathname]);

	const removeChat = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		await deleteDoc(doc(db, "users", session?.user?.email!, "chats", id));
		onClickChat();
		router.replace("/");
	};

	const title =
		data?.docs.length
			? data.docs[data.docs.length - 1]?.data().text
			: "New Chat";

	return (
		<Link
			href={`/chat/${id}`}
			onClick={onClickChat}
			className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
				active
					? "bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white"
					: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
			}`}
		>
			<ChatBubbleLeftIcon className="h-4 w-4 flex-shrink-0 opacity-70" />
			<span className="flex-1 truncate text-xs">{title}</span>
			<button
				onClick={removeChat}
				className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-500 hover:text-red-400 transition-all"
				title="Delete chat"
			>
				<TrashIcon className="h-3.5 w-3.5" />
			</button>
		</Link>
	);
};

export default ChatRow;
