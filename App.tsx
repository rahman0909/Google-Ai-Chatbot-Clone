
import React, { useRef } from 'react';
import Header from './components/Header';
import ChatWindow, { ChatWindowHandle } from './components/ChatWindow';

const App: React.FC = () => {
  const chatWindowRef = useRef<ChatWindowHandle>(null);

  const handleClearChat = () => {
    chatWindowRef.current?.clearChat();
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col font-sans">
      <Header onClearChat={handleClearChat} />
      <ChatWindow ref={chatWindowRef} />
    </div>
  );
};

export default App;
