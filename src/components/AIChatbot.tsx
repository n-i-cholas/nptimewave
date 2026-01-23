import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, User, Loader2, Trash2, Sparkles, Lightbulb } from 'lucide-react';
import { getRandomFunFact } from '@/lib/npFunFacts';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  isFunFact?: boolean;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type QuickReply = {
  label: string;
  message: string;
  isFunFact?: boolean;
};

// Page-aware quick replies based on current route
const getQuickReplies = (pathname: string): QuickReply[] => {
  const baseReplies: QuickReply[] = [
    { label: '💡 Fun Fact', message: '__FUN_FACT__', isFunFact: true },
  ];

  if (pathname === '/' || pathname === '') {
    return [
      ...baseReplies,
      { label: '🚀 Get Started', message: 'How do I get started with NP Timewave?' },
      { label: '📝 Share Memory', message: 'How do I share a memory?' },
      { label: '🎮 Play Quests', message: 'Tell me about the quests!' },
    ];
  }

  if (pathname.startsWith('/memory-portal')) {
    return [
      ...baseReplies,
      { label: '📝 Submit Tips', message: 'What makes a great memory submission?' },
      { label: '❤️ Resonating', message: 'What does resonating with a memory mean?' },
      { label: '🔍 Finding Stories', message: 'How do I find memories from a specific decade?' },
    ];
  }

  if (pathname.startsWith('/quests')) {
    return [
      ...baseReplies,
      { label: '❤️ Lives System', message: 'How does the lives system work?' },
      { label: '🏆 Earn Points', message: 'How can I earn more points?' },
      { label: '🔄 Practice Mode', message: 'Can I replay completed quests?' },
    ];
  }

  if (pathname.startsWith('/wallet')) {
    return [
      ...baseReplies,
      { label: '🛒 Redeeming', message: 'How do I redeem items from the shop?' },
      { label: '🎁 Using Items', message: 'How do I use items in my wallet?' },
      { label: '💰 Earning Points', message: 'What are the best ways to earn points?' },
    ];
  }

  if (pathname.startsWith('/vr-gallery')) {
    return [
      ...baseReplies,
      { label: '🏛️ VR Features', message: 'What can I see in the VR Gallery?' },
      { label: '📱 Requirements', message: 'What do I need to use the VR Gallery?' },
    ];
  }

  // Default replies
  return [
    ...baseReplies,
    { label: '🎮 Quests', message: 'How do the quests work?' },
    { label: '📝 Memories', message: 'How do I share a memory?' },
    { label: '🎁 Rewards', message: 'How can I earn points and rewards?' },
  ];
};

// Simple markdown parser for bold and bullet points
const parseMarkdown = (text: string) => {
  const parts: (string | JSX.Element)[] = [];
  let key = 0;
  
  const lines = text.split('\n');
  
  lines.forEach((line, lineIdx) => {
    const bulletMatch = line.match(/^\s*[\*\-]\s+(.*)$/);
    const isBullet = bulletMatch !== null;
    const lineContent = isBullet ? bulletMatch[1] : line;
    
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;
    const lineParts: (string | JSX.Element)[] = [];
    
    while ((match = boldRegex.exec(lineContent)) !== null) {
      if (match.index > lastIndex) {
        lineParts.push(lineContent.slice(lastIndex, match.index));
      }
      lineParts.push(<strong key={key++} className="font-semibold">{match[1]}</strong>);
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < lineContent.length) {
      lineParts.push(lineContent.slice(lastIndex));
    }
    
    if (lineParts.length === 0) {
      lineParts.push(lineContent);
    }
    
    if (isBullet) {
      parts.push(
        <div key={key++} className="flex gap-2 ml-2">
          <span className="text-primary">•</span>
          <span>{lineParts}</span>
        </div>
      );
    } else {
      if (lineIdx > 0) parts.push(<br key={key++} />);
      parts.push(<span key={key++}>{lineParts}</span>);
    }
  });
  
  return parts;
};

const AIChatbot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! 👋 I\'m your NP Timewave guide. How can I help you explore our platform today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [shownFunFacts, setShownFunFacts] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = getQuickReplies(location.pathname);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages.map(m => ({ role: m.role, content: m.content })) }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to get response');
    }
    
    if (!resp.body) throw new Error('No response body');

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = '';
    let assistantContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === 'assistant' && prev.length > 1) {
                return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
              }
              return [...prev, { role: 'assistant', content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + '\n' + textBuffer;
          break;
        }
      }
    }
  };

  const showFunFact = () => {
    const { fact, index } = getRandomFunFact(shownFunFacts);
    setShownFunFacts(prev => [...prev, index]);
    
    const funFactMessage: Message = {
      role: 'assistant',
      content: `💡 **Did you know?**\n\n${fact.fact}`,
      isFunFact: true,
    };
    
    setMessages(prev => [...prev, funFactMessage]);
    setShowQuickReplies(true);
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Handle fun fact request
    if (messageText === '__FUN_FACT__') {
      showFunFact();
      return;
    }

    setShowQuickReplies(false);
    const userMessage: Message = { role: 'user', content: messageText.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      await streamChat(newMessages.filter(m => m.content.trim()));
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
      setShowQuickReplies(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleQuickReply = (message: string) => {
    sendMessage(message);
  };

  const clearChat = () => {
    setMessages([
      { role: 'assistant', content: 'Hi! 👋 I\'m your NP Timewave guide. How can I help you explore our platform today?' }
    ]);
    setShowQuickReplies(true);
    setShownFunFacts([]);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full animate-pulse" />
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-8rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold flex items-center gap-2">
                  NP Timewave Guide
                  <Sparkles className="w-4 h-4 text-primary-foreground/70" />
                </h3>
                <p className="text-xs opacity-80">Powered by AI</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : msg.isFunFact ? <Lightbulb className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : msg.isFunFact
                      ? 'bg-gradient-to-br from-primary/20 to-accent/20 text-foreground rounded-tl-sm border border-primary/20'
                      : 'bg-secondary text-secondary-foreground rounded-tl-sm'
                }`}>
                  {msg.role === 'assistant' ? parseMarkdown(msg.content) : msg.content}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div className="bg-secondary p-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            {/* Quick Replies */}
            {showQuickReplies && !isLoading && (
              <div className="space-y-2 pt-2">
                <p className="text-xs text-muted-foreground text-center">Suggestions:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(reply.message)}
                      className={`px-3 py-1.5 text-xs rounded-full transition-colors border ${
                        reply.isFunFact 
                          ? 'bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 text-primary border-primary/30'
                          : 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/20'
                      }`}
                    >
                      {reply.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
