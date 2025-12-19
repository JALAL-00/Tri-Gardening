'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, User, Bot, Loader2, X, Plus, Menu, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRef, useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { getAuthToken } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery';

interface Message {
  id: string;
  role: 'user' | 'model' | 'assistant' | 'system';
  content: string;
  imagePreview?: string;
  createdAt?: string;
}
interface Session {
  id: string;
  title: string;
}

const getSessions = async (): Promise<Session[]> => (await api.get('/plant-clinic/sessions')).data;
const getSessionMessages = async (id: string): Promise<{ messages: Message[] }> => (await api.get(`/plant-clinic/sessions/${id}`)).data;

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const router = useRouter();
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const currentSessionId = searchParams.get('id');

    const { data: sessions, isLoading: isLoadingSessions } = useAuthenticatedQuery({ 
        queryKey: ['chatSessions'], 
        queryFn: getSessions 
    });

    const { data: sessionData, isLoading: isLoadingMessages } = useAuthenticatedQuery({
        queryKey: ['chatSession', currentSessionId],
        queryFn: () => getSessionMessages(currentSessionId!),
        // The custom hook will only enable this if currentSessionId is truthy AND user is authenticated
        // We add an extra check in useEffect to be safe.
    });

    useEffect(() => {
        if (currentSessionId && sessionData?.messages) {
            setMessages(sessionData.messages.map((m) => ({ ...m, role: m.role === 'model' ? 'assistant' : m.role })));
        } else if (!currentSessionId) {
            setMessages([{ id: '0', role: 'assistant', content: "Welcome to the Plant Clinic! Ask me anything." }]);
        }
    }, [sessionData, currentSessionId]);
    
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
    
    const handleNewChat = () => {
        router.push('/plant-clinic');
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() && !imageBase64) return;

        const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input, imagePreview: imagePreview || undefined };
        setMessages(prev => [...prev.filter(m => m.id !== '0'), userMessage]);
        setIsLoading(true);
        setInput('');
        
        const currentToken = getAuthToken();
        if (!currentToken) {
            setMessages(prev => [...prev, { id: `error-${Date.now()}`, role: 'assistant', content: "Authentication error. Please log in and try again." }]);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/plant-clinic/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentToken}` },
                body: JSON.stringify({ message: input, image: imageBase64, sessionId: currentSessionId }),
            });

            if (!response.ok || !response.body) {
                if (response.status === 401) throw new Error('Authentication failed. Please log in again.');
                throw new Error('Failed to get a response from the server.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessageContent = '';
            const assistantMessageId = (Date.now() + 1).toString();

            setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

            let finalChunk = '';
            while (true) {
                const { done, value } = await reader.read();
                const decodedChunk = decoder.decode(value || new Uint8Array(), { stream: true });
                assistantMessageContent += decodedChunk;
                
                setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId ? { ...msg, content: assistantMessageContent } : msg
                ));

                if (done) {
                    finalChunk = decoder.decode(value || new Uint8Array(), { stream: false });
                    break;
                }
            }
            
            if (finalChunk) {
                try {
                    const jsonPart = finalChunk.substring(finalChunk.lastIndexOf('{'));
                    const { newSessionId } = JSON.parse(jsonPart);
                    if (newSessionId && !currentSessionId) {
                        await queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
                        router.push(`/plant-clinic?id=${newSessionId}`);
                    }
                } catch (e) { /* End of stream without JSON is okay */ }
            }

        } catch (error: any) {
            setMessages(prev => [...prev, { id: `error-${Date.now()}`, role: 'assistant', content: `Sorry, I encountered an error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
            setImagePreview(null);
            setImageBase64(null);
        }
    };

    return (
        <div className="h-screen w-full flex text-gray-800">
            <aside className={`flex flex-col bg-[#5A8743] text-white transition-all duration-300 ${isSidebarOpen ? 'w-80 p-4' : 'w-0 p-0' } overflow-hidden flex-shrink-0`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Bot className="h-8 w-8 rounded-full bg-white/20 p-1.5" />
                        <h1 className="font-bold text-lg">TriGardening</h1>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="hover:bg-white/20"><ArrowLeft/></Button>
                </div>
                <Button onClick={handleNewChat} className="w-full justify-start gap-2 bg-white/20 hover:bg-white/30 text-base h-12"><Plus className="h-4 w-4"/> New Chat</Button>
                <div className="mt-6">
                    <h2 className="font-bold text-white mb-2 px-3">History</h2>
                    <ScrollArea className="h-full">
                        <div className="space-y-1">
                           {isLoadingSessions ? <div className="p-3"><Loader2 className="animate-spin"/></div> :
                           sessions?.map((session) => (
                            <div key={session.id} onClick={() => router.push(`/plant-clinic?id=${session.id}`)} 
                                 className={`p-3 rounded-lg cursor-pointer text-sm truncate ${currentSessionId === session.id ? 'bg-white/30 font-semibold' : 'hover:bg-white/10'}`}>
                                {session.title}
                            </div>
                           ))}
                        </div>
                    </ScrollArea>
                </div>
            </aside>

            <main className="flex-1 flex flex-col bg-[#F7F7F7] h-screen">
                <ScrollArea className="flex-1" ref={scrollAreaRef}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                       {!isSidebarOpen && <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10 bg-white shadow-md" onClick={() => setIsSidebarOpen(true)}><Menu/></Button>}
                        {messages.map((m) => (
                            <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : ''}`}>
                                {m.role === 'assistant' && (<div className="w-10 h-10 rounded-full bg-[#5A8743] flex items-center justify-center text-white flex-shrink-0"><Bot size={24} /></div>)}
                                <div className={`p-4 rounded-2xl max-w-2xl shadow-sm ${m.role === 'user' ? 'bg-[#5A8743] text-white rounded-br-none' : (m.role === 'system' ? 'bg-transparent text-gray-500 text-center italic w-full max-w-full shadow-none' : 'bg-[#EBF0E8] text-gray-800 rounded-bl-none')}`}>
                                    {m.imagePreview && m.role === 'user' && (<Image src={m.imagePreview} alt="User upload" width={300} height={300} className="rounded-md mb-2"/>)}
                                    <article className={`prose prose-sm max-w-none prose-p:my-1 ${m.role === 'user' ? 'prose-invert' : ''}`}><ReactMarkdown>{m.content}</ReactMarkdown></article>
                                </div>
                                {m.role === 'user' && (<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0"><User size={24} /></div>)}
                            </div>
                        ))}
                        {isLoading && (<div className="flex gap-4"><div className="w-10 h-10 rounded-full bg-[#5A8743] flex items-center justify-center text-white flex-shrink-0"><Loader2 size={24} className="animate-spin" /></div><div className="p-4 rounded-lg bg-gray-100 text-gray-500 shadow-sm">Gardy is thinking...</div></div>)}
                    </div>
                </ScrollArea>
                <div className="bg-[#F7F7F7] p-4 border-t border-gray-200">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSubmit} className="relative">
                            {imagePreview && (<div className="absolute bottom-20 left-0"><div className="relative w-24 h-24 mb-2"><Image src={imagePreview} alt="Image preview" layout="fill" className="rounded-md object-cover border bg-white p-1" /><button type="button" onClick={() => { setImagePreview(null); setImageBase64(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"><X size={14} /></button></div></div>)}
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            <Button type="button" variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2" onClick={() => fileInputRef.current?.click()}><Paperclip className="text-gray-500" /></Button>
                            <Input value={input} onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} placeholder="Enter a prompt here..." className="bg-white text-black rounded-full h-14 px-12 border-gray-300 focus-visible:ring-green-500" disabled={isLoading} />
                            <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#5A8743] hover:bg-green-800 rounded-full h-10 w-10" disabled={isLoading || (!input.trim() && !imageBase64)}><Send className="text-white"/></Button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}