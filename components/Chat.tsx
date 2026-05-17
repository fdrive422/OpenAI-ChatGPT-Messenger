"use client";

import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../utils/firebase";
import Message from "./Message";

type Props = {
	chatId: string;
};

const Chat: React.FC<Props> = ({ chatId }) => {
	const { data: session } = useSession();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const [data] = useCollection(
		session &&
			query(
				collection(
					db,
					"users",
					session?.user?.email!,
					"chats",
					chatId,
					"messages"
				),
				orderBy("createdAt", "asc")
			)
	);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [data?.docs.length]);

	return (
		<div className="flex-1 overflow-y-auto overflow-x-hidden">
			{data?.empty && (
				<div className="flex flex-col items-center justify-center h-full text-center px-4 py-20">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Type a message below to start the conversation
					</p>
				</div>
			)}

			{data?.docs.map((item) => (
				<Message key={item.id} message={item.data()} />
			))}

			<div ref={messagesEndRef} />
		</div>
	);
};

export default Chat;
