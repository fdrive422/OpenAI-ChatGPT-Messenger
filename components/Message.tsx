import { DocumentData } from "firebase/firestore";
import React, { useState } from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

type Props = {
	message: DocumentData;
};

const OpenAIAvatar = () => (
	<div className="flex-shrink-0 w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center mt-0.5">
		<svg
			viewBox="0 0 41 41"
			fill="currentColor"
			className="h-4 w-4 text-white dark:text-black"
		>
			<path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.75-3.001 10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.75 3 10.075 10.075 0 0 0 9.614-6.976 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.239-11.818zm-17.217 24.259c-1.661 0-3.311-.574-4.63-1.627l.228-.13 7.686-4.437a.855.855 0 0 0 .43-.745v-10.82l3.248 1.875a.08.08 0 0 1 .043.063v8.977c-.004 3.752-3.047 6.79-7.005 6.844zm-15.006-6.244a6.79 6.79 0 0 1-.814-4.57l.228.137 7.686 4.438a.858.858 0 0 0 .861 0l9.382-5.416v3.752a.079.079 0 0 1-.031.067L15.958 37.3c-3.253 1.876-7.397.76-9.649-2.415zm-1.961-15.739a6.784 6.784 0 0 1 3.532-2.983v9.133a.855.855 0 0 0 .43.745l9.382 5.414-3.248 1.876a.081.081 0 0 1-.075.008L8.41 27.104a6.793 6.793 0 0 1-5.062-7.956zm26.87 5.836-9.375-5.417 3.248-1.875a.082.082 0 0 1 .075-.009l7.843 4.527a6.787 6.787 0 0 1-1.048 12.244v-9.132a.854.854 0 0 0-.743-.338zm3.234-4.608-.229-.138-7.685-4.437a.858.858 0 0 0-.862 0L15.1 21.235v-3.752a.079.079 0 0 1 .031-.067l7.851-4.522a6.793 6.793 0 0 1 10.075 7.03zM13.498 24.017l-3.248-1.875a.079.079 0 0 1-.042-.063v-8.978c.003-3.761 3.06-6.799 7.02-6.843a6.789 6.789 0 0 1 4.63 1.628l-.228.13-7.686 4.437a.855.855 0 0 0-.43.745l-.016 10.82zm1.766-3.799 4.179-2.413 4.179 2.412v4.825l-4.179 2.412-4.179-2.412V20.218z" />
		</svg>
	</div>
);

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
				<div className="max-w-[75%] bg-[#ececec] dark:bg-[#2f2f2f] text-gray-900 dark:text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed">
					{text}
				</div>
			</div>
		);
	}

	return (
		<div className="group px-4 py-6">
			<div className="max-w-3xl mx-auto flex gap-4 items-start">
				<OpenAIAvatar />
				<div className="flex-1 min-w-0">
					<p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
						{text}
					</p>
					<button
						onClick={handleCopy}
						title="Copy to clipboard"
						className="mt-2 p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-150"
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
