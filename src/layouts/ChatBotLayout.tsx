import React from "react";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen bg-base-100 text-black overflow-hidden">
			<main className="flex flex-col flex-1 items-center overflow-hidden">
				{children}
			</main>
		</div>
  );
}
