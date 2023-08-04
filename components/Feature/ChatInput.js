"use client";

import { MessagesContext } from "@/context/messages";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useContext, useRef, useState } from "react";
import { toast } from "react-hot-toast";

const ChatInput = () => {
  const textareaRef = useRef(null);
  const [input, setInput] = useState("");
  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    setIsMessageUpdating,
  } = useContext(MessagesContext);

  const { mutate: sendMessage, isLoading } = useMutation({
    mutationKey: ["sendMessage"],
    // include message to later use it in onMutate
    mutationFn: async (_message) => {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      return response.body;
    },
    onMutate(message) {
      addMessage(message);
    },
    onSuccess: async (stream) => {
      if (!stream) throw new Error("No stream");

      // construct new message to add
      const id = nanoid();
      const responseMessage = {
        id,
        isUserMessage: false,
        text: "",
      };

      // add new message to state
      addMessage(responseMessage);

      setIsMessageUpdating(true);

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        updateMessage(id, (prev) => prev + chunkValue);
      }

      // clean up
      setIsMessageUpdating(false);
      setInput("");

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
    },
    onError: (_, message) => {
      toast.error("Something went wrong. Please try again.");
      removeMessage(message.id);
      textareaRef.current?.focus();
    },
  });

  const handleSendMessage = () => {
    const message = {
      id: nanoid(),
      isUserMessage: true,
      text: input,
    };

    sendMessage(message);
    setInput("");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% dark:from-background/10 dark:from-10% dark:to-background/80 z-20">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        {/*  */}
        {false && (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-4 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  className="h-4 w-4 mr-2"
                >
                  <path d="M197.67 186.37a8 8 0 0 1 0 11.29C196.58 198.73 170.82 224 128 224c-37.39 0-64.53-22.4-80-39.85V208a8 8 0 0 1-16 0v-48a8 8 0 0 1 8-8h48a8 8 0 0 1 0 16H55.44C67.76 183.35 93 208 128 208c36 0 58.14-21.46 58.36-21.68a8 8 0 0 1 11.31.05ZM216 40a8 8 0 0 0-8 8v23.85C192.53 54.4 165.39 32 128 32c-42.82 0-68.58 25.27-69.66 26.34a8 8 0 0 0 11.3 11.34C69.86 69.46 92 48 128 48c35 0 60.24 24.65 72.56 40H168a8 8 0 0 0 0 16h48a8 8 0 0 0 8-8V48a8 8 0 0 0-8-8Z"></path>
                </svg>
                Regenerate response
              </button>
            </div>
          </div>
        )}
        {/*  */}
        <div className="space-y-4 border-t bg-white dark:bg-[#09090b] px-4 py-2 shadow-lg sm:rounded-t-xl sm:border sm:border-gray-300 sm:dark:border-gray-600 md:py-4">
          <form>
            <div className="relative flex flex-col w-full overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:border-gray-400 sm:dark:border-gray-500">
              {/* Text Area */}
              <textarea
                ref={textareaRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                tabIndex="0"
                rows="1"
                placeholder="Send a message."
                spellCheck="false"
                className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm text-gray-500 dark:text-gray-200"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>

              <div className="absolute right-0 top-4 sm:right-4">
                <button
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-md hover:bg-primary/90 h-8 w-8 p-0"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                    <kbd className="inline-flex items-center rounded border bg-white dark:bg-[#09090bbb] border-gray-200 dark:border-gray-500 px-1 font-sans text-xs text-gray-400 dark:text-white">
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path d="M200 32v144a8 8 0 0 1-8 8H67.31l34.35 34.34a8 8 0 0 1-11.32 11.32l-48-48a8 8 0 0 1 0-11.32l48-48a8 8 0 0 1 11.32 11.32L67.31 168H184V32a8 8 0 0 1 16 0Z"></path>
                        </svg>
                      )}
                    </kbd>
                  </div>
                  <span className="sr-only">Send message</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
