"use client";

import Intro from "@/components/Design/Introduction";
import ChatInput from "@/components/Feature/ChatInput";
import ChatMessages from "@/components/Feature/ChatMessages";
import { MessagesContext } from "@/context/messages";
import { useContext } from "react";

export default function Home() {
  const { messages } = useContext(MessagesContext);
  return (
    <>
      <div className="pt-4 md:pt-10">
        {messages.length === 0 ? <Intro /> : <ChatMessages />}
      </div>
      <ChatInput />
    </>
  );
}
