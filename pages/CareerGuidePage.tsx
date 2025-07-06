import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCareerAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

const CareerGuidePage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: `Hello ${user?.name}! I'm your AI Career Guide. How can I help you today? You can ask for career advice, or upload your CV for a review.` }
  ]);
  const [input, setInput] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !cvFile) return;

    const userMessage = input.trim() || `Please review my CV.`;
    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: userMessage }];
    if (cvFile) {
        newMessages.push({ sender: 'user', text: `(Uploaded CV: ${cvFile.name})` });
    }
    setMessages(newMessages);

    setInput('');
    setIsLoading(true);

    if (user) {
        const botResponseText = await getCareerAdvice(cvFile, userMessage, user);
        setMessages(prev => [...prev, { sender: 'bot', text: botResponseText }]);
    }
    
    setIsLoading(false);
    setCvFile(null); // Clear file after sending
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
         setCvFile(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white dark:bg-navy-900 rounded-xl shadow-2xl">
      <h1 className="text-2xl font-bold p-4 border-b dark:border-navy-700 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">AI Career Guide</h1>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && <img src="https://picsum.photos/seed/bot/40" alt="Bot" className="w-8 h-8 rounded-full"/>}
            <div className={`max-w-lg p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-navy-800 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
              <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: msg.text.toString().replace(/\n/g, '<br />') }}/>
            </div>
             {msg.sender === 'user' && <img src={user?.profilePicture} alt="User" className="w-8 h-8 rounded-full"/>}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-2 justify-start">
                 <img src="https://picsum.photos/seed/bot/40" alt="Bot" className="w-8 h-8 rounded-full"/>
                 <div className="max-w-lg p-3 rounded-2xl bg-gray-200 dark:bg-navy-800 text-gray-800 dark:text-gray-200 rounded-bl-none">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    </div>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t dark:border-navy-700">
        {cvFile && (
            <div className="mb-2 p-2 bg-blue-100 dark:bg-navy-700 rounded-lg flex justify-between items-center">
                <span className="text-sm text-blue-800 dark:text-blue-200">Attached: {cvFile.name}</span>
                <button onClick={() => setCvFile(null)} className="text-red-500 font-bold">X</button>
            </div>
        )}
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Ask for advice or describe your goal..."
            className="flex-1 p-3 rounded-lg border dark:border-navy-600 bg-gray-100 dark:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="p-3 rounded-lg bg-gray-200 dark:bg-navy-700 hover:bg-gray-300 dark:hover:bg-navy-600 transition">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </button>
          <button onClick={handleSend} disabled={isLoading} className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidePage;
