import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Bot, User, HelpCircle, Loader2 } from 'lucide-react';

interface ContractQAChatProps {
  contractTitle: string;
  contractSnippet: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const ContractQAChat: React.FC<ContractQAChatProps> = ({ contractTitle, contractSnippet }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hola, soy tu Consultor Legal IA para el contrato "${contractTitle}". Hazme cualquier pregunta sobre cláusulas, penalidades, plazos o riesgos de este contrato.`,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    '¿Cómo puedo rescindir este contrato sin penalización?',
    '¿Qué responsabilidad asumo si hay mora o demora?',
    '¿Cuál es el fuero o jurisdicción aplicable?',
    'Explícame las cláusulas abusivas en palabras sencillas.',
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/audit/contract-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractTitle,
          contractSnippet,
          question: q,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.answer || 'No se pudo obtener respuesta legal en este momento.',
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Error de comunicación con el servidor');
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Ocurrió un error al consultar a Gemini IA. Por favor intenta de nuevo.',
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Consultorio Legal IA sobre este Contrato
            </h4>
            <p className="text-[10px] text-slate-500">Preguntas y Respuestas en tiempo real respaldadas por Gemini 3.6</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
          ● IA En Línea
        </span>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {quickQuestions.map((qq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qq)}
            disabled={isLoading}
            className="text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 font-bold px-2 py-1 rounded transition-colors cursor-pointer text-left"
          >
            + {qq}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="max-h-64 overflow-y-auto space-y-2.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2 ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'ai' && (
              <div className="p-1 bg-blue-600 text-white rounded shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white font-medium self-end'
                  : 'bg-white border border-slate-200 text-slate-800 shadow-2xs font-normal'
              }`}
            >
              <p className="whitespace-pre-wrap text-[11px]">{m.text}</p>
              <span
                className={`text-[9px] block mt-1 font-mono ${
                  m.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </span>
            </div>
            {m.sender === 'user' && (
              <div className="p-1 bg-slate-800 text-white rounded shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-500 text-xs italic p-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>Gemini analizando contrato y legislación...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Escriba su consulta legal sobre este contrato..."
          className="flex-1 bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
        />
        <button
          type="submit"
          disabled={isLoading || !inputQuery.trim()}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center space-x-1"
        >
          <span>Enviar</span>
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
