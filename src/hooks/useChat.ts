import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const sendMessage = useCallback(async (content: string, consultationId?: string) => {
    if (!user) {
      toast.error('Please sign in to chat');
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setStreaming(true);

    try {
      // Save user message to database
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        consultation_id: consultationId || null,
        role: 'user',
        content
      });

      // Call streaming chat edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vaidya-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(m => ({
            role: m.role,
            content: m.content
          })),
          userId: user.id,
          consultationId
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error('Rate limit exceeded. Please try again later.');
          return;
        }
        if (response.status === 402) {
          toast.error('AI credits depleted. Please add credits to continue.');
          return;
        }
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      let textBuffer = '';
      
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
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantMessage.id
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Save assistant message to database
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        consultation_id: consultationId || null,
        role: 'assistant',
        content: assistantContent
      });

    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error('Failed to send message: ' + error.message);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }, [user, messages]);

  const clearMessages = () => {
    setMessages([]);
  };

  const loadChatHistory = async (consultationId?: string) => {
    if (!user) return;

    try {
      let query = supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (consultationId) {
        query = query.eq('consultation_id', consultationId);
      }

      const { data, error } = await query;
      if (error) throw error;

      setMessages(
        data.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at)
        }))
      );
    } catch (error: any) {
      console.error('Failed to load chat history:', error);
    }
  };

  return {
    messages,
    loading,
    streaming,
    sendMessage,
    clearMessages,
    loadChatHistory
  };
};
