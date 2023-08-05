"use client";

// This function will cache all the messages or conversation happened among chatgpt and you
// The layout page (app/layout.js ) imports and wrap itself with this function

import { MessagesProvider } from "@/context/messages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Provider = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MessagesProvider>{children}</MessagesProvider>
    </QueryClientProvider>
  );
};

export default Provider;
