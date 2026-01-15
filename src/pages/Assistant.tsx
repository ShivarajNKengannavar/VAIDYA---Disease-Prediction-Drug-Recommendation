import { ChatInterface } from '@/components/chat/ChatInterface';
import { MessageCircle } from 'lucide-react';

export default function Assistant() {
  return (
    <div className="container py-4 max-w-4xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm font-medium">AI Health Assistant</span>
        </div>
        <h1 className="text-4xl font-bold mb-3 text-primary">VAIDYA Chat</h1>
        <p className="text-muted-foreground text-lg">Your 24/7 AI-powered health companion</p>
      </div>
      
      <ChatInterface />
    </div>
  );
}
