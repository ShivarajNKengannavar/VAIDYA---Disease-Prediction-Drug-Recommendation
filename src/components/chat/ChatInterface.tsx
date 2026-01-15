import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChat, ChatMessage } from '@/hooks/useChat';
import { Send, Loader2, HeartPulse, User, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  consultationId?: string;
}

export const ChatInterface = ({ consultationId }: ChatInterfaceProps) => {
  const { messages, loading, streaming, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    sendMessage(input.trim(), consultationId);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestedQuestions = [
    "What could be causing my headache?",
    "How can I improve my sleep?",
    "What are common cold remedies?",
    "Should I be worried about my symptoms?",
    "What lifestyle changes can improve my health?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <HeartPulse className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Welcome to VAIDYA</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              I'm your AI health assistant. Ask me about symptoms, health conditions, 
              medications, or general wellness advice.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {suggestedQuestions.map((question, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => sendMessage(question, consultationId)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} streaming={streaming} />
            ))}
            {loading && !streaming && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">VAIDYA is thinking...</span>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4 bg-background">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask VAIDYA about your health..."
              className="min-h-[52px] max-h-32 resize-none pr-12"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
            {messages.length > 0 && (
              <Button 
                type="button" 
                size="icon" 
                variant="outline" 
                onClick={clearMessages}
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-2">
          VAIDYA is an AI assistant. Always consult a healthcare professional for medical advice.
        </p>
      </div>
    </div>
  );
};

const MessageBubble = ({ message, streaming }: { message: ChatMessage; streaming: boolean }) => {
  const isUser = message.role === 'user';
  const isLatestAssistant = !isUser && streaming && !message.content;

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(
          isUser ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <HeartPulse className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <Card className={cn(
        "max-w-[80%] p-3",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message.content ? (
            <p className="whitespace-pre-wrap m-0 text-sm leading-relaxed">
              {message.content}
            </p>
          ) : (
            <span className="inline-block w-2 h-4 bg-current animate-pulse" />
          )}
        </div>
      </Card>
    </div>
  );
};
