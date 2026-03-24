import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { insforge } from '../lib/insforge';

interface ChatMessage {
  from: 'user' | 'assistant';
  text: string;
}

const AIChat: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const send = async () => {
    if (!query.trim()) return;
    const userMessage: ChatMessage = { from: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);
    setError('');

    try {
      const prompt = `You are an internal issue tracker assistant. The user asks: \n${query}\nProvide concise help with project/issue workflows and next steps.`;

      const modelCandidates = ['x-ai/grok-4.1-fast', 'anthropic/claude-sonnet-4.5', 'openai/gpt-4o-mini'];
      let responseData: any = null;
      let responseError: any = null;
      let assistantText: string | undefined;

      for (const model of modelCandidates) {
        try {
          const { data, error } = await insforge.ai.chat.completions.create({
            model,
            messages: [
              { role: 'system', content: 'You are a helpful issue tracking assistant.' },
              { role: 'user', content: prompt }
            ],
            maxTokens: 300,
            temperature: 0.3
          });

          console.debug('AI response', { model, data, error });

          responseData = data;
          responseError = error;

          if (error) {
            // try next model
            continue;
          }

          const normalize = (value: any): string | undefined => {
            if (typeof value === 'string' && value.trim()) return value;
            if (Array.isArray(value)) {
              const textParts = value
                .map((item) => {
                  if (!item) return '';
                  if (typeof item === 'string') return item;
                  if (typeof item.text === 'string') return item.text;
                  if (item.type === 'text' && typeof item.text === 'string') return item.text;
                  if (item.type === 'paragraph' && Array.isArray(item.content)) {
                    return item.content.map((p: any) => (typeof p.text === 'string' ? p.text : '')).join('');
                  }
                  return '';
                })
                .filter(Boolean)
                .join('');
              return textParts.trim() || undefined;
            }
            return undefined;
          };

          const possibilityCandidates = [
            data?.choices?.[0]?.message?.content,
            data?.choices?.[0]?.text,
            data?.output_text,
            data?.choices?.[0]?.delta?.content,
            data?.text,
            data?.message?.content
          ];

          for (const candidate of possibilityCandidates) {
            const candidateText = normalize(candidate);
            if (candidateText) {
              assistantText = candidateText;
              break;
            }
          }

          if (assistantText) break;

        } catch (e) {
          console.error('AI request exception', model, e);
          responseError = e;
          continue;
        }
      }

      if (responseError && !assistantText) {
        const errMessage = responseError?.message ?? JSON.stringify(responseError);
        setError(`AI assistant error: ${errMessage}`);
      } else if (!assistantText) {
        console.error('No assistant text found in AI response', responseData);
        setError('AI returned no content. Check console for details and verify model availability.');
      } else {
        setMessages((prev) => [...prev, { from: 'assistant', text: assistantText }]);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <Link to="/" className="text-indigo-600 hover:text-indigo-800">Back to Dashboard</Link>
        </div>

        <div className="bg-white p-4 rounded shadow mb-4">
          <div className="h-72 overflow-auto border rounded p-3 bg-gray-100 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded ${msg.from === 'user' ? 'bg-indigo-100 text-indigo-900 self-end' : 'bg-gray-200 text-gray-900'}`}>
                <p className="text-sm"><strong>{msg.from === 'user' ? 'You' : 'Assistant'}:</strong></p>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask the assistant something..." className="flex-1 border rounded p-2" />
            <button onClick={send} disabled={loading} className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Thinking...' : 'Send'}</button>
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>

        <div className="text-sm text-gray-600">
          Ask about project management, issue workflows, or request summaries for issues. Use generated responses as guidance.
        </div>
      </div>
    </div>
  );
};

export default AIChat;
