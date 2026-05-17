"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import NewChat from "./NewChat";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../utils/firebase";
import ChatRow from "./ChatRow";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import LogoutModal from "./LogoutModal";
import { ThemeContext } from "../providers/ThemeProvider";

const Sidebar = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { data: session } = useSession();
	const { theme, setTheme } = useContext(ThemeContext);
	const trigger = useRef<any>(null);
	const sidebar = useRef<any>(null);

	const [data, loading] = useCollection(
		session &&
			query(
				collection(db, "users", session.user?.email!, "chats"),
				orderBy("createdAt", "asc")
			)
	);

	useEffect(() => {
		const clickHandler = ({ target }: any) => {
			if (!sidebar.current || !trigger.current) return;
			if (
				!sidebarOpen ||
				sidebar.current.contains(target) ||
				trigger.current.contains(target)
			)
				return;
			setSidebarOpen(false);
		};
		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	});

	useEffect(() => {
		const keyHandler = ({ keyCode }: any) => {
			if (!sidebarOpen || keyCode !== 27) return;
			setSidebarOpen(false);
		};
		document.addEventListener("keydown", keyHandler);
		return () => document.removeEventListener("keydown", keyHandler);
	});

	return (
		<>
			{/* Mobile overlay */}
			<div
				className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-200 ${
					sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={() => setSidebarOpen(false)}
			/>

			{/* Mobile top bar */}
			<div className="lg:hidden sticky top-0 w-full z-30 bg-[#f9f9f9] dark:bg-[#212121] border-b border-gray-200 dark:border-white/10">
				<div className="flex items-center justify-between px-4 py-3">
					<button
						ref={trigger}
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
					>
						{sidebarOpen ? (
							<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						) : (
							<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						)}
					</button>
					<span className="text-gray-900 dark:text-white font-semibold text-sm">ChatGPT</span>
					<NewChat onNewChat={() => setSidebarOpen(false)} iconOnly />
				</div>
			</div>

			{/* Sidebar panel */}
			<div
				id="sidebar"
				ref={sidebar}
				className={`bg-[#f9f9f9] dark:bg-[#171717] fixed z-40 left-0 top-0 lg:static h-screen flex flex-col
					w-64 xl:w-[17rem]
					${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
					transform transition-transform duration-300 ease-in-out`}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-3 py-3 flex-shrink-0">
					<span className="text-gray-900 dark:text-white font-semibold text-sm px-1">
						ChatGPT
					</span>
					<NewChat onNewChat={() => setSidebarOpen(false)} iconOnly />
				</div>

				{/* Chat history */}
				<div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 min-h-0">
					{loading && (
						<div className="flex items-center gap-2 px-3 py-2 text-gray-400 text-xs">
							<div className="animate-spin h-3 w-3 border border-gray-400 border-t-transparent rounded-full" />
							Loading chats...
						</div>
					)}

					{data?.docs.map((item) => (
						<ChatRow
							id={item.id}
							key={item.id}
							onClickChat={() => setSidebarOpen(false)}
						/>
					))}
				</div>

				{/* Bottom section */}
				<div className="flex-shrink-0 border-t border-gray-200 dark:border-white/10 p-2 space-y-0.5">
					<button
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-sm"
					>
						{theme === "dark" ? (
							<>
								<SunIcon className="h-4 w-4 flex-shrink-0" />
								<span>Light mode</span>
							</>
						) : (
							<>
								<MoonIcon className="h-4 w-4 flex-shrink-0" />
								<span>Dark mode</span>
							</>
						)}
					</button>

					{session && (
						<label
							htmlFor="logout-modal"
							className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
						>
							<img
								src={session.user?.image!}
								alt="avatar"
								className="h-7 w-7 rounded-full flex-shrink-0"
							/>
							<span className="text-sm truncate flex-1">{session.user?.name}</span>
						</label>
					)}
				</div>
			</div>

			<LogoutModal modalId="logout-modal" onContinue={() => signOut()} />
		</>
	);
};

export default Sidebar;
