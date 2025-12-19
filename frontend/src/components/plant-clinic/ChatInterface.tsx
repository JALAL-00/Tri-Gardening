'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, User, Bot, Loader2, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useAuthStore } from '@/store/authStore';

// Define the shape of a message in our state
interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { token } = useAuthStore();

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                { id: '0', role: 'system', content: 'Welcome to the TriGardening Plant Clinic! My name is Gardy. How can I help you today?' }
            ]);
        }
    }, [messages.length]);
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(URL.createObjectURL(file));
                setImageBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() && !imageBase64) return;

        const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setInput('');

        // Prepare the history for the backend
        const historyForApi = messages
            .filter(m => m.role === 'user' || m.role === 'assistant')
            .map(({ role, content }) => ({ role, content }));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/plant-clinic/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    messages: historyForApi,
                    input: input,
                    image: imageBase64,
                }),
            });

            if (!response.ok || !response.body) {
                throw new Error('Failed to get a response from the server.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessageContent = '';
            const assistantMessageId = (Date.now() + 1).toString();

            // Add an empty assistant message to start updating
            setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                assistantMessageContent += decoder.decode(value, { stream: true });
                
                // Update the last message (the assistant's) with the new content
                setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId ? { ...msg, content: assistantMessageContent } : msg
                ));
            }
        } catch (error) {
            console.error("Chat failed:", error);
            // Add an error message to the chat
            setMessages(prev => [...prev, { id: 'error', role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
            setImagePreview(null);
            setImageBase64(null);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <Card className="h-[80vh] w-full flex flex-col bg-white shadow-2xl">
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
                        <div className="space-y-6">
                            {messages.map(m => (
                                <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : (m.role === 'system' ? 'justify-center' : '')}`}>
                                    {m.role === 'assistant' && (<div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white flex-shrink-0"><Bot size={20} /></div>)}
                                    <div className={`p-4 rounded-lg max-w-lg ${m.role === 'user' ? 'bg-green-600 text-white' : (m.role === 'system' ? 'bg-transparent text-gray-500' : 'bg-gray-100 text-gray-800')}`}>
                                        <article className={`prose prose-sm max-w-none ${m.role === 'system' ? 'italic' : ''}`}>
                                            <ReactMarkdown>{m.content}</ReactMarkdown>
                                        </article>
                                    </div>
                                    {m.role === 'user' && (<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0"><User size={20} /></div>)}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white flex-shrink-0"><Loader2 size={20} className="animate-spin" /></div>
                                    <div className="p-4 rounded-lg bg-gray-100 text-gray-500">Gardy is thinking...</div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>

                <div className="border-t bg-white p-4">
                    {imagePreview && (<div className="relative w-24 h-24 mb-2"><Image src={imagePreview} alt="Image preview" layout="fill" className="rounded-md object-cover" /><button onClick={() => { setImagePreview(null); setImageBase64(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"><X size={14} /></button></div>)}
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip className="text-gray-500" /></Button>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your plant or describe an issue..."
                            className="flex-1 bg-gray-100 text-black"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700" disabled={isLoading}><Send /></Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}