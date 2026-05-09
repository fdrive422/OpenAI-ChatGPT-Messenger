import React from "react";
import {
	BoltIcon,
	ExclamationTriangleIcon,
	SunIcon,
} from "@heroicons/react/24/outline";

const examples = [
	'"Explain quantum computing in simple terms"',
	'"Any creative ideas for a 10 year old\'s birthday?"',
	'"How do I make an HTTP request in Javascript?"',
];

const capabilities = [
	"Remembers what user said earlier in the conversation",
	"Allows user to provide follow-up corrections",
	"Trained to decline inappropriate requests",
];

const limitations = [
	"May occasionally generate incorrect information",
	"May produce harmful or biased content",
	"Limited knowledge of world and events after 2021",
];

const columns = [
	{ icon: SunIcon, title: "Examples", items: examples },
	{ icon: BoltIcon, title: "Capabilities", items: capabilities },
	{ icon: ExclamationTriangleIcon, title: "Limitations", items: limitations },
];

const Page = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white dark:bg-[#212121] overflow-y-auto">
			<div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl mb-5">
				AI
			</div>
			<h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">
				How can I help you today?
			</h1>
			<p className="text-sm text-gray-500 dark:text-gray-500 mb-12">
				Powered by OpenAI
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl">
				{columns.map(({ icon: Icon, title, items }) => (
					<div key={title}>
						<div className="flex items-center gap-2 mb-3 justify-center">
							<Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
							<h2 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
								{title}
							</h2>
						</div>
						<div className="space-y-2">
							{items.map((item) => (
								<div key={item} className="infoText text-center mx-auto">
									{item}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Page;
