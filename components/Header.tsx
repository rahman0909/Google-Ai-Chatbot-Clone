
import React from 'react';

interface HeaderProps {
  onClearChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClearChat }) => {
  return (
    <header className="bg-gray-800 p-4 border-b border-gray-700 flex items-center space-x-3 shadow-lg">
      <svg
        className="w-8 h-8 text-blue-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M16.934 7.992a1 1 0 0 0-1.868-.696 7.502 7.502 0 0 1-11.132 11.132 1 1 0 1 0 .696 1.868A9.502 9.502 0 0 0 16.934 7.992Z" />
        <path d="M20.434 3.566a1 1 0 0 0-1.414-1.414L3.566 17.566a1 1 0 0 0 1.414 1.414L20.434 3.566Z" />
        <path d="M18.803 10.33a1 1 0 0 0-1.606.326 5.502 5.502 0 0 1-8.153 8.153 1 1 0 1 0 .972 1.744 7.502 7.502 0 0 0 10.4-10.4 1 1 0 0 0-1.613-.123h.001Z" />
      </svg>
      <h1 className="text-xl font-bold text-gray-200">Gemini AI Chatbot</h1>
      <button
        onClick={onClearChat}
        className="ml-auto p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
        aria-label="Clear chat history"
        title="Clear Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </header>
  );
};

export default Header;
