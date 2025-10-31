import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Message, Role } from '../types';
import ChatInput from './ChatInput';
import ImageInput from './ImageInput';
import MessageComponent from './Message';

export interface ChatWindowHandle {
  clearChat: () => void;
}

type Mode = 'chat' | 'image';

const ChatWindow = forwardRef<ChatWindowHandle, {}>((props, ref) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          return parsedHistory;
        }
      }
    } catch (error) {
      console.error("Failed to load or parse chat history from localStorage:", error);
    }
    return [
      {
        role: Role.MODEL,
        text: "Hello! I'm a Gemini-powered AI assistant. How can I help you today?",
      },
    ];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [mode, setMode] = useState<Mode>('chat');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const initChat = useCallback(() => {
    try {
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
      const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are a helpful and friendly AI assistant. Format your responses in markdown where appropriate.',
        },
      });
      setChat(chatSession);
    } catch (error) {
      console.error("Failed to initialize Gemini AI:", error);
      setMessages(prev => [...prev, { role: Role.MODEL, text: "Error: Could not initialize AI model. Please check your API key." }]);
    }
  }, []);

  useEffect(() => {
    initChat();
  }, [initChat]);

  useEffect(() => {
    try {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    } catch (error)      {
      console.error("Failed to save chat history to localStorage:", error);
    }
  }, [messages]);

  useImperativeHandle(ref, () => ({
    clearChat: () => {
      if (window.confirm('Are you sure you want to clear the chat history?')) {
        setMessages([
          {
            role: Role.MODEL,
            text: "Hello! I'm a Gemini-powered AI assistant. How can I help you today?",
          },
        ]);
        initChat();
      }
    }
  }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!chat || isLoading) return;

    const userMessage: Message = { role: Role.USER, text };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: text });
      let modelResponse = '';
      setMessages((prev) => [...prev, { role: Role.MODEL, text: '' }]);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        modelResponse += chunkText;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = modelResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: Role.MODEL,
        text: 'Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => {
          const newMessages = [...prev];
          // Replace the empty loading message with the error
          newMessages[newMessages.length - 1] = errorMessage;
          return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (prompt: string, aspectRatio: string) => {
    if (isLoading) return;

    const userMessage: Message = { role: Role.USER, text: prompt };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    // Add a placeholder for the model's response
    setMessages((prev) => [...prev, { role: Role.MODEL, text: '' }]);

    try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
            },
        });

        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        
        const imageMessage: Message = { role: Role.MODEL, text: '', imageUrl: imageUrl };
        
        setMessages((prev) => {
            const newMessages = [...prev];
            // Replace the empty loading message with the image
            newMessages[newMessages.length - 1] = imageMessage;
            return newMessages;
        });
    } catch (error) {
        console.error('Error generating image:', error);
        const errorMessage: Message = {
            role: Role.MODEL,
            text: 'Sorry, I couldn\'t generate that image. Please try again.',
        };
        setMessages((prev) => {
            const newMessages = [...prev];
            // Replace the empty loading message with the error
            newMessages[newMessages.length - 1] = errorMessage;
            return newMessages;
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  const renderInput = () => {
    switch(mode) {
      case 'chat':
        return <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />;
      case 'image':
        return <ImageInput onGenerateImage={handleGenerateImage} isLoading={isLoading} />;
      default:
        return null;
    }
  };
  
  const tabClasses = (tabMode: Mode) => 
    `px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors ${
      mode === tabMode 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-300 hover:bg-gray-700'
    }`;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <MessageComponent key={index} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-4xl mx-auto p-2 flex space-x-2">
            <button className={tabClasses('chat')} onClick={() => setMode('chat')}>Chat</button>
            <button className={tabClasses('image')} onClick={() => setMode('image')}>Image</button>
        </div>
      </div>
      {renderInput()}
    </div>
  );
});

export default ChatWindow;
