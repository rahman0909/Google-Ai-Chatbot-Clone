import React, { useState } from 'react';
import { Message, Role } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface MessageProps {
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!message.text || !navigator.clipboard) {
      return;
    }
    navigator.clipboard.writeText(message.text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text:', err);
    });
  };

  const isUser = message.role === Role.USER;
  const isModelLoading = message.text === '' && message.role === Role.MODEL && !message.imageUrl;

  const containerClasses = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
  const bubbleClasses = `max-w-lg lg:max-w-2xl rounded-2xl px-4 py-3 shadow-md ${
    isUser
      ? 'bg-blue-600 text-white rounded-br-none'
      : 'bg-gray-700 text-gray-200 rounded-bl-none'
  }`;

  const imageBubbleClasses = `max-w-lg lg:max-w-2xl rounded-2xl shadow-md overflow-hidden ${
    isUser
      ? 'bg-blue-600 rounded-br-none'
      : 'bg-gray-700 rounded-bl-none'
  }`;

  if (message.imageUrl) {
    return (
      <div className={containerClasses}>
        <div className={imageBubbleClasses}>
            <img src={message.imageUrl} alt="Generated content" className="w-full h-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={`${bubbleClasses} relative group`}>
        {isModelLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <p className="whitespace-pre-wrap break-words">{message.text}</p>
            <button
              onClick={handleCopy}
              className={`absolute top-1 right-1 p-1.5 rounded-full text-gray-300 transition-all duration-200
                ${isUser ? 'hover:bg-blue-700' : 'hover:bg-gray-600'}
                opacity-0 group-hover:opacity-100 focus:opacity-100`}
              aria-label={isCopied ? "Copied to clipboard" : "Copy message"}
              title={isCopied ? "Copied!" : "Copy"}
            >
              {isCopied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
