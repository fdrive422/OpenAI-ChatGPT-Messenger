import { DocumentData } from "firebase/firestore";
import React, { useState } from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

type Props = {
	message: DocumentData;
};

const Message: React.FC<Props> = ({ message }) => {
	const isAI = message.user.name === "ChatGPT";
	const [copied, setCopied] = useState(false);

	const text = (message.text as string).trimStart();

	const handleCopy = () => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	if (!isAI) {
		return (
			<div className="flex justify-end px-4 py-3">
				<div className="max-w-[75%] bg-[#2f2f2f] dark:bg-[#2f2f2f] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed">
					{text}
				</div>
			</div>
		);
	}

	return (
		<div className="group px-4 py-6">
			<div className="max-w-3xl mx-auto flex gap-4 items-start">
				<div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold mt-0.5">
					AI
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
						{text}
					</p>
					<button
						onClick={handleCopy}
						title="Copy to clipboard"
						className="mt-2 p-1 rounded text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-150"
					>
						{copied ? (
							<CheckIcon className="h-4 w-4 text-emerald-500" />
						) : (
							<ClipboardDocumentIcon className="h-4 w-4" />
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Message;
