// This file is used for the context of the messages, which is be accessed by any components in the app.
// The context is a react Hook same as state management libraries like Redux, but it is much simpler and builtin
// The context is used to store the messages and the functions to add, remove and update the messages.

"use client" // It is used to run the code in the client side only, not in the server side. Introduced in Next 13 APP router

import { createContext, useState } from "react"; // import the createContext and useState from react


import { nanoid } from "nanoid"; // import the nanoid to generate the unique id for each message

// The default values are commented out, and the initial state is kept empty array [].
// UnCommenting these values will give a new look to introduction section of web application

// this sets the initial message
const defaultValue = [
  {
    id: nanoid(),
    text: "You are an expert in analysing python code",
    isUserMessage: true, // isUserMessage true means that the role is user otherwise the role is system.
  },
];

export const MessagesContext = createContext({
  messages: [],
  isMessageUpdating: false,
  addMessage: () => {},
  removeMessage: () => {},
  updateMessage: () => {},
  setIsMessageUpdating: () => {},
});

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState(defaultValue); // put default values array (if default values are unCommented otherwise put empty array [])
  const [isMessageUpdating, setIsMessageUpdating] = useState(false); // these variable will be used to check if the message is updating or not. (it will showing the loading icon when being updated)

  // The following functions are used to add, remove and update the messages
  // The functions are passed to the context, so that they can be accessed by any components in the app.

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const removeMessage = (id) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  };

  const updateMessage = (id, updateFn) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id === id) {
          return { ...message, text: updateFn(message.text) };
        }
        return message;
      })
    );
  };

  return (
    // The context is returned with the values and functions
    <MessagesContext.Provider
      value={{
        messages,
        isMessageUpdating,
        addMessage,
        removeMessage,
        updateMessage,
        setIsMessageUpdating,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
