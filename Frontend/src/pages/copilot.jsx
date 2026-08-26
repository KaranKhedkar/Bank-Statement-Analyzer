import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, Sliders, RefreshCw, Trash2, ArrowUpRight, 
  TrendingUp, AlertTriangle, Lightbulb, CornerDownLeft, Loader2, Zap 
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { sendCopilotMessage } from '../lib/api';
import DynamicChartRenderer from '../components/chat/DynamicChartRenderer';
import ToolCallBadge from '../components/chat/ToolCallBadge';
import WhatIfSimulator from '../components/widgets/WhatIfSimulator';

const QUICK_PROMPTS = [
  "How much did I spend on Food & Dining?",
  "Compare this month with last month",
  "What if I reduce shopping expenses by 25%?",
  "Show me a bar chart of my top 5 categories",
  "List all recurring subscriptions and bills",
  "Why was my highest transaction flagged?"
];

export default function CopilotPage() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'what-if'
  const [inputMessage, setInputMessage] = useState('');
  const chatBottomRef = useRef(null);

  const {
    transactions,
    categoryData,
    forecastData,
    anomalies,
    fetchForecast,
    fetchAnomalies,
    copilotMessages,
    addCopilotMessage,
    clearCopilotMessages,
    isCopilotLoading,
    setCopilotLoading,
    proactiveInsights,
    fetchProactiveInsights,
    isInsightsLoading
  } = useAppStore();

  // Load baseline financial data if needed
  useEffect(() => {
    if (transactions.length > 0) {
      if (Object.keys(forecastData).length === 0) fetchForecast();
      if (anomalies.length === 0) fetchAnomalies();
      if (proactiveInsights.length === 0) fetchProactiveInsights();
    }
  }, [transactions.length, forecastData, anomalies.length, proactiveInsights.length, fetchForecast, fetchAnomalies, fetchProactiveInsights]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, isCopilotLoading]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isCopilotLoading) return;

    setInputMessage('');

    // Append user message
    const userMsg = {
      role: 'user',
      content: text,
      toolCalls: [],
      chart: null,
      suggestedActions: []
    };
    addCopilotMessage(userMsg);
    setCopilotLoading(true);

    try {
      // Build history payload
      const historyPayload = copilotMessages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.content
        }));

      const response = await sendCopilotMessage(text, historyPayload);

      // Append assistant response
      addCopilotMessage({
        role: 'assistant',
        content: response.response || 'I have analyzed your statement data.',
        toolCalls: response.tool_calls || [],
        chart: response.chart || null,
        suggestedActions: response.suggested_actions || []
      });
    } catch (err) {
      addCopilotMessage({
        role: 'assistant',
        content: `⚠️ Sorry, I encountered an error analyzing your request: ${err.message || 'Please verify the backend connection.'}`,
        toolCalls: [],
        chart: null,
        suggestedActions: [
          "How much did I spend on Food & Dining?",
          "Compare spending with last month"
        ]
      });
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <Bot className="w-12 h-12 text-stone-700" />
        <p className="text-stone-400 font-medium">Please upload a bank statement to enable your AI Financial Copilot.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/30">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">AI Financial Copilot</h1>
              <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Agentic RAG
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Ask natural language queries, simulate scenarios, and explore conversational charts.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-stone-950/60 p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Bot size={15} />
            Conversational Copilot
          </button>
          <button
            onClick={() => setActiveTab('what-if')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'what-if'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sliders size={15} />
            What-If Scenario Lab
          </button>
        </div>
      </div>

      {/* Proactive Insights Ribbon */}
      {proactiveInsights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {proactiveInsights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-stone-900/40 hover:bg-stone-900/80 backdrop-blur-md rounded-2xl border border-white/5 transition-all duration-200 flex items-start gap-3 group"
            >
              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                insight.type === 'warning' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                insight.type === 'trend' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              }`}>
                {insight.type === 'warning' ? <AlertTriangle size={15} /> : <Lightbulb size={15} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{insight.title}</p>
                <p className="text-[11px] text-stone-400 line-clamp-2 mt-0.5">{insight.description}</p>
                {insight.prompt && (
                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      handleSendMessage(insight.prompt);
                    }}
                    className="mt-1.5 text-[11px] font-semibold text-indigo-300 hover:text-indigo-200 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{insight.action_text || 'Ask Copilot'}</span>
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'what-if' ? (
        <WhatIfSimulator />
      ) : (
        <div className="bg-stone-900/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[680px]">
          {/* Chat Header Bar */}
          <div className="px-6 py-3.5 border-b border-white/5 bg-stone-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-stone-300">Google Gemini 2.0 • Live Financial Knowledge</span>
            </div>

            <button
              onClick={clearCopilotMessages}
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-rose-300 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Clear conversation history"
            >
              <Trash2 size={13} />
              <span>Clear Chat</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {copilotMessages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';

              return (
                <div
                  key={msg.id || index}
                  className={`flex gap-3.5 max-w-3xl ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-md ${
                      isAssistant
                        ? 'bg-indigo-600/30 border border-indigo-500/40 text-indigo-300'
                        : 'bg-stone-700 border border-white/10 text-stone-200'
                    }`}
                  >
                    {isAssistant ? <Bot size={16} /> : 'YOU'}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-4.5 text-xs leading-relaxed shadow-sm transition-all duration-200 ${
                      isAssistant
                        ? 'bg-stone-900/90 border border-white/10 text-stone-200'
                        : 'bg-indigo-600 text-white rounded-br-none'
                    }`}
                  >
                    {/* Tool Call Badges */}
                    {isAssistant && msg.toolCalls && msg.toolCalls.length > 0 && (
                      <ToolCallBadge toolCalls={msg.toolCalls} />
                    )}

                    {/* Text Body */}
                    <div className="whitespace-pre-wrap font-sans text-stone-200 text-[13px] leading-relaxed">
                      {msg.content}
                    </div>

                    {/* Dynamic Conversational Recharts */}
                    {isAssistant && msg.chart && (
                      <DynamicChartRenderer chart={msg.chart} />
                    )}

                    {/* Suggested Action Chips */}
                    {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-white/5 space-y-1.5">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Suggested Questions</p>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedActions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(sug)}
                              className="px-2.5 py-1 bg-stone-950/60 hover:bg-indigo-600/20 hover:border-indigo-500/30 border border-white/5 rounded-lg text-[11px] text-stone-300 hover:text-indigo-200 transition-all cursor-pointer text-left"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Bubble */}
            {isCopilotLoading && (
              <div className="flex gap-3.5 max-w-3xl mr-auto animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Bot size={16} />
                </div>
                <div className="bg-stone-900/90 border border-white/10 rounded-2xl p-4 text-xs text-stone-400 flex items-center gap-3">
                  <Loader2 size={16} className="text-indigo-400 animate-spin" />
                  <span>Analyzing ledger, running financial tools & generating insights...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-6 py-2 bg-stone-950/30 border-t border-white/5 overflow-x-auto flex items-center gap-2 scrollbar-none">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Zap size={11} className="text-amber-400" /> Starters:
            </span>
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isCopilotLoading}
                className="px-2.5 py-1 bg-stone-900/70 hover:bg-indigo-600/20 hover:border-indigo-500/30 border border-white/5 rounded-full text-[11px] text-stone-300 hover:text-indigo-200 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-4 bg-stone-950/60 border-t border-white/5">
            <div className="relative flex items-center">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your expenses, budgets, anomalies, or future forecasts..."
                rows={1}
                disabled={isCopilotLoading}
                className="w-full pl-4 pr-12 py-3 bg-stone-900 border border-white/10 rounded-2xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-indigo-500 resize-none transition-all shadow-inner"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isCopilotLoading}
                className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/30"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 mt-2 text-center">
              Copilot uses tool calling on your bank statement data. For financial decisions, please audit with certified advisors.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
