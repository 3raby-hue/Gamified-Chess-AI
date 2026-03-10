import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send } from 'lucide-react';

export interface Message {
    id?: string | number;
    sender: string;
    text: string;
}

interface ChatInterfaceProps {
    placeholder?: string;
    messages?: Message[];
    isThinking?: boolean;
    onSendMessage?: (text: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    placeholder = "Ask me anything about this move...",
    messages = [],
    isThinking = false,
    onSendMessage
}) => {
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isThinking]);

    const handleSend = () => {
        // Prevent sending empty messages or sending while the AI is thinking
        if (inputText.trim() && onSendMessage && !isThinking) {
            onSendMessage(inputText.trim());
            setInputText("");
        }
    };

    return (
        <div data-cmp="ChatInterface" className="flex flex-col h-full bg-card rounded-3xl shadow-custom border border-border overflow-hidden">

            {/* Header Profile */}
            <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-primary shadow-sm">
                    <Bot size={28} className="text-primary" />
                </div>
                <div>
                    <h3 className="font-bold text-foreground">Mohamed Alaraby Coach</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: 'rgb(34, 197, 94)' }}></span>
                        Online and computing
                    </p>
                </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-muted/10 min-h-[400px]">
                {messages.map((msg, index) => {
                    const isCoach = msg.sender === 'coach';
                    return (
                        <div key={msg.id || index} className={isCoach ? "flex items-end gap-2 self-start max-w-[85%]" : "flex items-end gap-2 self-end max-w-[85%] flex-row-reverse"}>
                            <div className={isCoach ? "w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center shrink-0" : "hidden"}>
                                <Bot size={18} className="text-primary" />
                            </div>
                            <div
                                className="p-4 shadow-sm text-[15px] leading-relaxed relative"
                                style={{
                                    backgroundColor: isCoach ? 'rgb(255, 255, 255)' : 'rgb(139, 92, 246)', // Changed blue to a nice purple
                                    color: isCoach ? 'rgb(10, 10, 10)' : 'rgb(255, 255, 255)',
                                    borderRadius: isCoach ? '20px 20px 20px 4px' : '20px 20px 4px 20px'
                                }}
                            >
                                {msg.text}
                            </div>
                        </div>
                    );
                })}

                {/* Thinking Animation */}
                {isThinking && (
                    <div className="flex items-end gap-2 self-start max-w-[85%]">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center shrink-0">
                            <Bot size={18} className="text-primary" />
                        </div>
                        <div
                            className="p-4 shadow-sm relative flex gap-1.5 items-center h-[52px]"
                            style={{ backgroundColor: 'rgb(255, 255, 255)', borderRadius: '20px 20px 20px 4px' }}
                        >
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-border bg-card">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isThinking} // Disable typing while AI is thinking
                        className="w-full pl-6 pr-14 py-4 rounded-full bg-muted/50 border border-border focus:border-primary focus:bg-background outline-none transition-all text-foreground disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isThinking || !inputText.trim()} // Disable button if empty or thinking
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all shadow-custom disabled:opacity-50 disabled:active:scale-100"
                        style={{ backgroundColor: 'rgb(139, 92, 246)' }} // Match the user bubble color
                    >
                        <Send size={18} className="ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;