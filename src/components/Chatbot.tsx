import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const FITNESS_KNOWLEDGE = [
  { keywords: ['肌肉', '增肌', '肌肉增长'], answer: '增肌需要充足的蛋白质摄入（每公斤体重1.6-2.2克）和渐进性超负荷训练。记得给肌肉48小时的恢复时间！' },
  { keywords: ['减脂', '减肥', '瘦身'], answer: '减脂的核心是热量缺口。建议结合力量训练和有氧运动，同时保证高纤维饮食。' },
  { keywords: ['蛋白质', '蛋白粉', '鸡蛋'], answer: '蛋白质是肌肉修复的基石。优质来源包括鸡胸肉、鱼、蛋、豆类和蛋白粉。' },
  { keywords: ['休息', '睡眠', '恢复', '生活'], answer: '生活习惯对健身至关重要。生长激素主要在深层睡眠中分泌，建议每晚保证7-9小时睡眠。同时减少压力，保持水分充足。' },
  { keywords: ['深蹲', '腿部'], answer: '深蹲是动作之王！它能锻炼全身，特别是股四头肌和臀大肌。注意膝盖不要内扣，背部挺直。' },
  { keywords: ['俯卧撑', '胸肌', '手臂'], answer: '俯卧撑是极佳的自重训练。它能锻炼胸肌、三角肌前束和三头肌。保持身体成一条直线，不要塌腰。' },
  { keywords: ['组数', '次数', 'sets', 'reps'], answer: '组数（Sets）和次数（Reps）决定了训练强度。通常增肌建议每组8-12次，做3-5组。力量训练建议每组1-5次。如果你想提高耐力，可以尝试每组15次以上。' },
  { keywords: ['引体向上', '背部'], answer: '引体向上是锻炼背部宽度的最佳动作。如果拉不上去，可以先从离心收缩（慢慢放下）或弹力带辅助开始。' },
  { keywords: ['核心', '腹肌', '平板支撑'], answer: '腹肌是在厨房里练出来的！除了核心训练（如平板支撑、卷腹），降低体脂率是看到腹肌的关键。' },
  { keywords: ['你好', '嗨', '谁'], answer: '你好！我是你的健身助手。你可以问我关于训练组数、营养、睡眠或具体动作（如深蹲、俯卧撑）的问题。' },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: '你好！我是你的健身小助手。有什么我可以帮你的吗？' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');

    // Simple matching logic
    setTimeout(() => {
      const match = FITNESS_KNOWLEDGE.find(k => 
        k.keywords.some(kw => userMessage.toLowerCase().includes(kw))
      );
      
      const botResponse = match 
        ? match.answer 
        : '这个问题有点深奥，我还在学习中。你可以尝试问我关于“增肌”、“蛋白质”或“深蹲”的问题！';
      
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed inset-0 z-50 bg-white flex flex-col md:inset-auto md:bottom-24 md:right-6 md:w-96 md:h-[500px] md:rounded-3xl md:shadow-2xl overflow-hidden"
          >
            <div className="bg-zinc-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                <span className="font-bold">健身助手 (离线版)</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500 text-white rounded-tr-none' 
                      : 'bg-white text-zinc-800 border border-zinc-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-zinc-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="问点什么..."
                className="flex-1 bg-zinc-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
