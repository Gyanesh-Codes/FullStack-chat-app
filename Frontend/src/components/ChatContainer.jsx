// WE ARE TRYING TO BUILD THE CHAT SCREEN : WHERE WE HAVE 3 COMPONENT IN THERE !

// 1. CHAT HEADER WHERE WE GET TO SEE THE NAME OF THE ANOTHER USER WE ARE INTERACTING TOO AND WETHER HE/SHE IS ONLINE OR NOT !

// 2. MESSAGE HISTORY - WHERE WE SEE THE MESSAGES BEING EXCHANGED !

// 3. THEN WE HAVE WHAT TO TYPE MESSAGE BOX!!


import React from 'react'
import { useChatStore } from '../store/useChatStore';
import { useEffect } from 'react';

import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';
import { useRef } from 'react';

const ChatContainer = () => {
  const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect (() => {
    getMessages(selectedUser._id)

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, unsubscribeFromMessages, subscribeToMessages]);

  useEffect(() => 
    {
      if (messageEndRef.current && messages) 
      {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages])
    
  if(isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      
      {/* CREATING THE MESSAGE BOX PART - READ THE DAISY UI DOCUMENTATION FOR BETTER UNDERSTANDING FOR THIS PART ! */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((messages) => (
          <div key={messages._id}
          
          className={`chat ${messages.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          ref={messageEndRef}
          >
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img 
                src={
                  messages.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"
                } 

                alt="profile pic" 
                />
              </div>
            </div>

            <div className='chat-header mb-1'>
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(messages.createdAt)}
              </time>
            </div> 

            {/* chat bubble */}
            <div className="chat-bubble flex flex-col">
              {messages.image && (
                <img
                  src={messages.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {messages.text && <p>{messages.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
};

export default ChatContainer
