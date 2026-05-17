"use client";

import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";

type Props = {
	variant?: "header" | "sidebar";
};

const fetchModels = () => fetch("/api/get-engines").then((res) => res.json());

const ModelSelection: React.FC<Props> = ({ variant = "sidebar" }) => {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const { data, isLoading } = useSWR("listModels", fetchModels);
	const { data: model, mutate: setModel } = useSWR("selectedModel", {
		fallbackData: "gpt-4o-mini",
	});

	const modelOptions: { value: string; label: string }[] =
		data?.modelOptions || [];
	const selectedLabel =
		modelOptions.find((m) => m.value === model)?.label || model;

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	if (variant === "header") {
		return (
			<div className="relative" ref={dropdownRef}>
				<button
					onClick={() => setOpen((v) => !v)}
					className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-medium text-sm"
				>
					<span>{isLoading ? "Loading…" : selectedLabel}</span>
					<ChevronDownIcon
						className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-150 ${
							open ? "rotate-180" : ""
						}`}
					/>
				</button>

				{open && (
					<div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-52 bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden z-50 shadow-xl max-h-60 overflow-y-auto">
						{modelOptions.length === 0 && (
							<div className="px-3 py-2 text-xs text-gray-500">
								No models found
							</div>
						)}
						{modelOptions.map((opt) => (
							<button
								key={opt.value}
								onClick={() => {
									setModel(opt.value);
									setOpen(false);
								}}
								className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors ${
									model === opt.value
										? "text-gray-900 dark:text-white"
										: "text-gray-600 dark:text-gray-400"
								}`}
							>
								<span className="truncate">{opt.label}</span>
								{model === opt.value && (
									<CheckIcon className="h-4 w-4 text-emerald-500 flex-shrink-0" />
								)}
							</button>
						))}
					</div>
				)}
			</div>
		);
	}

	// sidebar variant
	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setOpen((v) => !v)}
				className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-xs"
			>
				<span className="truncate font-medium">
					{isLoading ? "Loading models…" : selectedLabel}
				</span>
				<ChevronDownIcon
					className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-150 ${
						open ? "rotate-180" : ""
					}`}
				/>
			</button>

			{open && (
				<div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden z-50 shadow-xl max-h-60 overflow-y-auto">
					{modelOptions.length === 0 && (
						<div className="px-3 py-2 text-xs text-gray-500">
							No models found
						</div>
					)}
					{modelOptions.map((opt) => (
						<button
							key={opt.value}
							onClick={() => {
								setModel(opt.value);
								setOpen(false);
							}}
							className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-white/10 transition-colors ${
								model === opt.value
									? "text-gray-900 dark:text-white"
									: "text-gray-600 dark:text-gray-400"
							}`}
						>
							<span className="truncate">{opt.label}</span>
							{model === opt.value && (
								<CheckIcon className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default ModelSelection;
