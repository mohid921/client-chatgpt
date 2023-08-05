// This is our home page (directory of "/")

"use client"; // It is used to run the code in the client side only, not in the server side. Introduced in Next 13 APP router

import Intro from "@/components/Design/Introduction";
import ChatInput from "@/components/Feature/ChatInput";
import ChatMessages from "@/components/Feature/ChatMessages";
import { MessagesContext } from "@/context/messages";
import { useContext } from "react";

export default function Home() {
  const { messages } = useContext(MessagesContext);
  return (
    <>
      <div className="pt-4 md:pt-10 pb-[200px]">
        {/* // if there are no messages, then introduction section will appear on our home page, otherwise messages among you and AI will appear */}
        {messages.length === 0 ? <Intro /> : <ChatMessages />}
      </div>
      {/* // This is chatInput to send prompt to open ai apis */}
      <ChatInput />
    </>
  );
}
