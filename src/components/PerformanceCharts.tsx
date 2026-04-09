import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Award, Zap } from 'lucide-react';

interface LogEntry {
  date: string;
  value: number;
}

export default function PerformanceCharts({ logs, exerciseName }: { logs: LogEntry[], exerciseName: string }) {
  if (logs.length === 0) {
    return (
      <div className="bg-zinc-50 rounded-3xl p-8 text-center border border-dashed border-zinc-200">
        <Zap className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
        <p className="text-sm text-zinc-400">暂无数据，开始训练来记录你的第一次表现吧！</p>
      </div>
    );
  }

  // Sort logs by date
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Format for chart
  const data = sortedLogs.map(log => {
    const dateObj = new Date(log.date);
    const dateStr = dateObj.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    return {
      fullDate: `${dateStr} ${timeStr}`,
      date: dateStr,
      time: timeStr,
      value: log.value,
      prediction: null
    };
  });

  // Add prediction (simple linear projection for demonstration)
  const lastValue = data[data.length - 1].value;
  const predictionData = [
    ...data,
    { fullDate: '未来1周', date: '未来1周', time: '', value: null, prediction: Math.round(lastValue * 1.05) },
    { fullDate: '未来2周', date: '未来2周', time: '', value: null, prediction: Math.round(lastValue * 1.10) },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-bold text-zinc-900">{exerciseName} 表现趋势</h4>
            <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mt-1">Performance Tracking</p>
          </div>
          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +5% 预期增长
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictionData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="fullDate" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 8, fill: '#94a3b8' }}
                dy={10}
              />
              <YAxis 
                hide 
                domain={['dataMin - 5', 'dataMax + 10']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                name="实际表现"
              />
              <Area 
                type="monotone" 
                dataKey="prediction" 
                stroke="#94a3b8" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1} 
                fill="url(#colorPred)" 
                name="科学预测"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 text-white p-5 rounded-3xl">
          <Award className="w-5 h-5 text-emerald-400 mb-2" />
          <p className="text-[10px] text-zinc-500 font-bold uppercase">历史最高</p>
          <p className="text-2xl font-display font-bold">{Math.max(...logs.map(l => l.value))}</p>
        </div>
        <div className="bg-emerald-500 text-white p-5 rounded-3xl">
          <Zap className="w-5 h-5 text-white/50 mb-2" />
          <p className="text-[10px] text-white/70 font-bold uppercase">下周目标</p>
          <p className="text-2xl font-display font-bold">{Math.round(lastValue * 1.05)}</p>
        </div>
      </div>
    </div>
  );
}
