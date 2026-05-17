"use client";

import React from "react";
import ModelSelection from "./ModelSelection";

const ChatHeader: React.FC = () => {
	return (
		<div className="flex items-center justify-center px-4 py-2 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#212121] flex-shrink-0">
			<ModelSelection variant="header" />
		</div>
	);
};

export default ChatHeader;
