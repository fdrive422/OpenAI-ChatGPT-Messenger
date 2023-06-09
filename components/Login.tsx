"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { AiOutlineInstagram, AiFillGithub } from "react-icons/ai";

type Props = {};

// TODO: Don't forget to add redirect URL in https://console.cloud.google.com/apis/credentials

const Login: React.FC<Props> = ({}) => {
	return (
		<>
			<div className="bg-[#11A37F] h-screen flex flex-col items-center justify-center text-center">
				<Image
					src="https://links.papareact.com/2i6"
					width={150}
					height={150}
					alt="chatgpt-logo"
				/>
				<button
					className="text-white font-semibold text-3xl animate-pulse"
					onClick={() => signIn("google")}>
					<p className="text-4xl mb-2 ">OpenAI</p>
					<p className="text-2xl underline">
						Sign In to use ChatGPT{" "}
					</p>
				</button>

				<div className="flex flex-col justify-center items-center mt-52 md:mt-36 text-gray-200 gap-3">
					{/* <a href="https://www.instagram.com/fdrive/">
						<div className=" flex items-center gap-1 text-sm">
							<AiOutlineInstagram size={23} />
							<p className=" font-semibold ">fdrive</p>
						</div>
					</a> */}

					<a href="https://github.com/fdrive422/OpenAI-ChatGPT-Messenger">
						<div className=" flex items-center gap-1 rounded-lg text-sm ">
							{/* <div className=" flex items-center gap-1 ring-2 ring-gray-300 px-3 py-2 rounded-lg text-sm "> */}
							<AiFillGithub size={23} />
							<p>Code Repository</p>
						</div>
					</a>
				</div>
			</div>
		</>
	);
};

export default Login;
