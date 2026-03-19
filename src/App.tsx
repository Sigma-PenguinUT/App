import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Utensils, 
  Moon, 
  Calendar, 
  ChevronRight, 
  Info, 
  CheckCircle2, 
  Flame, 
  ArrowLeft,
  Egg,
  Sun,
  Ban,
  Zap,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX
} from 'lucide-react';
import { WEEKLY_PLAN, NUTRITION_TIPS } from './constants';
import { DayPlan, Exercise } from './types';
import { StickmanAnimation } from './components/StickmanAnimation';

const IconMap: Record<string, React.ReactNode> = {
  Egg: <Egg className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  Ban: <Ban className="w-5 h-5" />,
};

type WorkoutState = 'idle' | 'warmup' | 'exercise' | 'rest' | 'round_rest' | 'cooldown' | 'finished';

export default function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'schedule' | 'nutrition'>('today');
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Workout Timer State
  const [workoutState, setWorkoutState] = useState<WorkoutState>('idle');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Get current day of week (0-6, Monday = 0)
  const todayIndex = (new Date().getDay() + 6) % 7;
  const todayPlan = WEEKLY_PLAN[todayIndex];

  useEffect(() => {
    if (!selectedDay) setSelectedDay(todayPlan);
  }, [todayPlan]);

  // Timer Logic
  useEffect(() => {
    if (workoutState !== 'idle' && workoutState !== 'finished' && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handlePhaseTransition();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [workoutState, isPaused, currentExerciseIndex, currentRound]);

  const getSeconds = (reps: string) => {
    const match = reps.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 45;
  };

  const handlePhaseTransition = () => {
    if (workoutState === 'warmup') {
      const isLastWarmup = currentExerciseIndex === (todayPlan.warmup?.length || 0) - 1;
      if (isLastWarmup) {
        startExercise(0, 1);
      } else {
        const nextIndex = currentExerciseIndex + 1;
        setCurrentExerciseIndex(nextIndex);
        setTimeLeft(getSeconds(todayPlan.warmup![nextIndex].reps));
      }
    } else if (workoutState === 'exercise') {
      const isLastExercise = currentExerciseIndex === todayPlan.exercises.length - 1;
      if (isLastExercise) {
        if (currentRound < 3) {
          setWorkoutState('round_rest');
          setTimeLeft(90);
        } else {
          setWorkoutState('cooldown');
          setCurrentExerciseIndex(0);
          setTimeLeft(getSeconds(todayPlan.cooldown![0].reps));
        }
      } else {
        setWorkoutState('rest');
        setTimeLeft(15);
      }
    } else if (workoutState === 'rest') {
      startExercise(currentExerciseIndex + 1, currentRound);
    } else if (workoutState === 'round_rest') {
      startExercise(0, currentRound + 1);
    } else if (workoutState === 'cooldown') {
      const isLastCooldown = currentExerciseIndex === (todayPlan.cooldown?.length || 0) - 1;
      if (isLastCooldown) {
        setWorkoutState('finished');
      } else {
        const nextIndex = currentExerciseIndex + 1;
        setCurrentExerciseIndex(nextIndex);
        setTimeLeft(getSeconds(todayPlan.cooldown![nextIndex].reps));
      }
    }
  };

  const startExercise = (index: number, round: number) => {
    setCurrentExerciseIndex(index);
    setCurrentRound(round);
    setWorkoutState('exercise');
    setTimeLeft(getSeconds(todayPlan.exercises[index].reps));
  };

  const startWorkout = () => {
    if (todayPlan.warmup && todayPlan.warmup.length > 0) {
      setWorkoutState('warmup');
      setCurrentExerciseIndex(0);
      setTimeLeft(getSeconds(todayPlan.warmup[0].reps));
    } else {
      startExercise(0, 1);
    }
    setCurrentRound(1);
    setIsPaused(false);
  };

  const resetWorkout = () => {
    setWorkoutState('idle');
    setTimeLeft(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const skipPhase = () => {
    handlePhaseTransition();
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold tracking-tight text-zinc-900">TeenGrowth</h1>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">14岁增肌成长计划</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
            BMI 19.3
          </div>
        </div>
      </div>
    </header>
  );

  const renderWorkoutOverlay = () => {
    let currentEx: Exercise | undefined;
    if (workoutState === 'warmup') {
      currentEx = todayPlan.warmup?.[currentExerciseIndex];
    } else if (workoutState === 'exercise') {
      currentEx = todayPlan.exercises[currentExerciseIndex];
    } else if (workoutState === 'cooldown') {
      currentEx = todayPlan.cooldown?.[currentExerciseIndex];
    }
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-zinc-950 text-white flex flex-col"
      >
        {/* Top Bar */}
        <div className="p-6 flex items-center justify-between">
          <button onClick={resetWorkout} className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {workoutState === 'warmup' ? `热身阶段 - ${currentExerciseIndex + 1}/${todayPlan.warmup?.length}` : 
               workoutState === 'exercise' ? `第 ${currentRound} 轮 - 动作 ${currentExerciseIndex + 1}/${todayPlan.exercises.length}` :
               workoutState === 'rest' ? '短暂休息' :
               workoutState === 'round_rest' ? '大组休息' :
               workoutState === 'cooldown' ? `拉伸放松 - ${currentExerciseIndex + 1}/${todayPlan.cooldown?.length}` : '训练完成'}
            </p>
          </div>
          <button onClick={() => setIsMuted(!isMuted)} className="text-zinc-400">
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={workoutState + currentExerciseIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full space-y-8"
            >
              {(workoutState === 'exercise' || workoutState === 'warmup' || workoutState === 'cooldown') && currentEx ? (
                <>
                  <div className="w-64 h-64 mx-auto bg-zinc-900 rounded-3xl flex items-center justify-center border-4 border-zinc-800 relative overflow-hidden group">
                    {currentEx.imageUrl ? (
                      <img 
                        src={currentEx.imageUrl} 
                        alt={currentEx.name}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <StickmanAnimation exerciseId={currentEx.id} className="w-32 h-32 text-emerald-400" />
                    )}
                    
                    <svg className="absolute inset-0 -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="48" 
                        fill="none" stroke="currentColor" strokeWidth="2" 
                        className="text-zinc-800/50" 
                      />
                      <motion.circle 
                        cx="50" cy="50" r="48" 
                        fill="none" stroke="currentColor" strokeWidth="2" 
                        strokeDasharray="301.59"
                        animate={{ strokeDashoffset: 301.59 * (1 - timeLeft / getSeconds(currentEx.reps)) }}
                        className="text-emerald-500" 
                      />
                    </svg>
                    
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <span className="text-2xl font-display font-black tabular-nums">{timeLeft}</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold mb-2">{currentEx.name}</h2>
                    <p className="text-zinc-400 text-sm max-w-xs mx-auto leading-relaxed">
                      {currentEx.description.split('\n')[0]}
                    </p>
                  </div>
                </>
              ) : workoutState === 'finished' ? (
                <div className="space-y-6">
                  <div className="w-24 h-24 bg-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-4xl font-display font-bold">训练完成！</h2>
                  <p className="text-zinc-400">你今天表现得非常棒，记得补充蛋白质。</p>
                  <button 
                    onClick={resetWorkout}
                    className="bg-white text-black px-8 py-3 rounded-full font-bold"
                  >
                    回到首页
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-8xl font-display font-black text-zinc-100 tabular-nums">
                    {timeLeft}
                  </div>
                  <p className="text-xl text-zinc-400 font-medium">
                    {workoutState === 'warmup' ? '准备热身...' : 
                     workoutState === 'rest' ? `即将开始: ${todayPlan.exercises[currentExerciseIndex + 1]?.name}` :
                     workoutState === 'round_rest' ? '深呼吸，准备下一轮' : '放松身体'}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="p-12 flex items-center justify-center gap-8">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
          >
            {isPaused ? <Play className="w-8 h-8 fill-current" /> : <Pause className="w-8 h-8 fill-current" />}
          </button>
          <button 
            onClick={skipPhase}
            className="w-12 h-12 bg-zinc-800 text-white rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    );
  };

  const renderToday = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <section className="bg-zinc-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">今日训练重点</span>
            {todayPlan.isCircuit && (
              <span className="bg-amber-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black uppercase">魔鬼循环</span>
            )}
          </div>
          <h2 className="text-2xl font-display font-bold mb-4 leading-tight">{todayPlan.focus}</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
              <Calendar className="w-4 h-4" />
              <span>{todayPlan.day}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
              <Dumbbell className="w-4 h-4" />
              <span>{todayPlan.exercises.length} 个动作</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startWorkout}
            className="mt-6 w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-5 h-5 fill-current" />
            立即开始训练
          </motion.button>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-10">
          <Flame size={180} />
        </div>
      </section>

      {todayPlan.isCircuit && (
        <section className="bg-zinc-100 rounded-2xl p-4 border border-zinc-200">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Zap className="w-3 h-3" /> 循环训练指南 (30分钟)
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white p-2 rounded-xl border border-zinc-200">
              <p className="text-[10px] text-zinc-400 uppercase font-bold">工作</p>
              <p className="text-lg font-display font-bold text-zinc-900">45s</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-zinc-200">
              <p className="text-[10px] text-zinc-400 uppercase font-bold">休息</p>
              <p className="text-lg font-display font-bold text-zinc-900">15s</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-zinc-200">
              <p className="text-[10px] text-zinc-400 uppercase font-bold">轮数</p>
              <p className="text-lg font-display font-bold text-zinc-900">3轮</p>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-3 text-center italic">每轮结束后休息 90 秒</p>
        </section>
      )}

      <section className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-display font-bold px-1 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-amber-400 rounded-full" />
            热身阶段 (5分钟)
          </h3>
          <div className="grid gap-3">
            {todayPlan.warmup?.map((ex) => (
              <motion.button
                key={ex.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedExercise(ex)}
                className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm hover:border-zinc-300 transition-colors text-left w-full"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {ex.imageUrl ? (
                      <img src={ex.imageUrl} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                    ) : (
                      <StickmanAnimation exerciseId={ex.id} className="w-8 h-8 text-zinc-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">{ex.name}</h4>
                    <p className="text-sm text-zinc-500">{ex.reps}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-display font-bold px-1 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            正式训练
          </h3>
          <div className="grid gap-3">
            {todayPlan.exercises.map((ex) => (
              <motion.button
                key={ex.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedExercise(ex)}
                className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm hover:border-zinc-300 transition-colors text-left w-full"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {ex.imageUrl ? (
                      <img src={ex.imageUrl} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                    ) : (
                      <StickmanAnimation exerciseId={ex.id} className="w-8 h-8 text-zinc-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">{ex.name}</h4>
                    <p className="text-sm text-zinc-500">{ex.sets} × {ex.reps}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-display font-bold px-1 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-400 rounded-full" />
            拉伸放松 (5分钟)
          </h3>
          <div className="grid gap-3">
            {todayPlan.cooldown?.map((ex) => (
              <motion.button
                key={ex.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedExercise(ex)}
                className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm hover:border-zinc-300 transition-colors text-left w-full"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {ex.imageUrl ? (
                      <img src={ex.imageUrl} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                    ) : (
                      <StickmanAnimation exerciseId={ex.id} className="w-8 h-8 text-zinc-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">{ex.name}</h4>
                    <p className="text-sm text-zinc-500">{ex.reps}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">重要提醒</h4>
            <p className="text-amber-800 text-xs mt-1 leading-relaxed">
              训练前请务必进行 5 分钟热身。如果在训练过程中感到关节疼痛（非肌肉酸痛），请立即停止。
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );

  const renderSchedule = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {WEEKLY_PLAN.map((plan) => (
          <button
            key={plan.day}
            onClick={() => setSelectedDay(plan)}
            className={`shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${
              selectedDay?.day === plan.day 
                ? 'bg-zinc-900 text-white shadow-lg' 
                : 'bg-white text-zinc-500 border border-zinc-200'
            }`}
          >
            <span className="text-[10px] font-bold uppercase">{plan.day.replace('周', '')}</span>
            <span className="text-lg font-display font-bold mt-1">{plan.day === todayPlan.day ? '今' : plan.day.slice(-1)}</span>
            {plan.isRest && <div className="w-1 h-1 bg-amber-400 rounded-full mt-1" />}
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-display font-bold">{selectedDay.focus}</h3>
            {selectedDay.isRest && (
              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold uppercase">休息日</span>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider px-1">热身</h4>
              <div className="grid gap-3">
                {selectedDay.warmup?.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex)}
                    className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center overflow-hidden">
                        {ex.imageUrl ? (
                          <img src={ex.imageUrl} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                        ) : (
                          <StickmanAnimation exerciseId={ex.id} className="w-6 h-6 text-zinc-300" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900">{ex.name}</h4>
                        <p className="text-sm text-zinc-500">{ex.reps}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-300" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider px-1">正式训练</h4>
              <div className="grid gap-3">
                {selectedDay.exercises.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex)}
                    className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center overflow-hidden">
                        {ex.imageUrl ? (
                          <img src={ex.imageUrl} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                        ) : (
                          <StickmanAnimation exerciseId={ex.id} className="w-6 h-6 text-zinc-300" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900">{ex.name}</h4>
                        <p className="text-sm text-zinc-500">{ex.sets} × {ex.reps}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-300" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider px-1">拉伸</h4>
              <div className="grid gap-3">
                {selectedDay.cooldown?.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex)}
                    className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center overflow-hidden">
                        {ex.imageUrl ? (
                          <img src={ex.imageUrl} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                        ) : (
                          <StickmanAnimation exerciseId={ex.id} className="w-6 h-6 text-zinc-300" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900">{ex.name}</h4>
                        <p className="text-sm text-zinc-500">{ex.reps}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderNutrition = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <section className="bg-emerald-600 text-white rounded-3xl p-6 shadow-xl">
        <h2 className="text-2xl font-display font-bold mb-2">营养与生长建议</h2>
        <p className="text-emerald-50 text-sm leading-relaxed">
          14岁是身体发育的黄金期，营养补充与充足睡眠同等重要。
        </p>
      </section>

      <div className="grid gap-4">
        {NUTRITION_TIPS.map((tip, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
              {IconMap[tip.icon] || <Info />}
            </div>
            <div>
              <h4 className="font-bold text-zinc-900">{tip.title}</h4>
              <p className="text-sm text-zinc-600 mt-1 leading-relaxed">{tip.content}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-zinc-900 text-white rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <Moon className="w-5 h-5 text-indigo-400" />
          <h4 className="font-bold">睡眠是关键</h4>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">
          生长激素主要在深层睡眠中分泌，建议每晚保证 <span className="text-white font-bold">9-10 小时</span> 睡眠。睡前 1 小时尽量不看电子产品。
        </p>
      </section>
    </motion.div>
  );

  const renderExerciseDetail = (ex: Exercise) => (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      className="fixed inset-0 z-50 bg-white overflow-y-auto"
    >
      <div className="max-w-md mx-auto px-6 py-8">
        <button 
          onClick={() => setSelectedExercise(null)}
          className="mb-6 flex items-center gap-2 text-zinc-500 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </button>

        <div className="space-y-8">
          <div className="aspect-video bg-zinc-900 rounded-3xl flex items-center justify-center relative overflow-hidden">
            {ex.imageUrl ? (
              <img 
                src={ex.imageUrl} 
                alt={ex.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <StickmanAnimation exerciseId={ex.id} className="w-32 h-32 text-emerald-400" />
            )}
          </div>

          <div>
            <h2 className="text-3xl font-display font-bold text-zinc-900">{ex.name}</h2>
            <div className="flex gap-4 mt-3">
              <div className="bg-zinc-100 px-3 py-1 rounded-lg text-sm font-medium text-zinc-600">
                {ex.sets}
              </div>
              <div className="bg-zinc-100 px-3 py-1 rounded-lg text-sm font-medium text-zinc-600">
                {ex.reps}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold border-b border-zinc-100 pb-2">动作描述</h3>
            <div className="space-y-2">
              {ex.description.split('\n').map((line, i) => (
                <p key={i} className="text-zinc-600 leading-relaxed">{line}</p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold border-b border-zinc-100 pb-2">动作要点</h3>
            <ul className="space-y-3">
              {ex.tips.map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-zinc-700 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => setSelectedExercise(null)}
            className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-zinc-200 active:scale-95 transition-transform"
          >
            我已了解
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {renderHeader()}

      <main className="max-w-md mx-auto px-6 pt-6">
        <AnimatePresence mode="wait">
          {activeTab === 'today' && renderToday()}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'nutrition' && renderNutrition()}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-zinc-200 px-6 py-3 z-40">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button 
            onClick={() => setActiveTab('today')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'today' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <Flame className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">今日</span>
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'schedule' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">计划</span>
          </button>
          <button 
            onClick={() => setActiveTab('nutrition')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'nutrition' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <Utensils className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">营养</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {selectedExercise && renderExerciseDetail(selectedExercise)}
        {workoutState !== 'idle' && renderWorkoutOverlay()}
      </AnimatePresence>
    </div>
  );
}
