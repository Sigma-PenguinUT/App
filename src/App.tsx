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
  Search,
  Library,
  Target,
  Wrench,
  ChevronDown,
  Filter,
  Volume2,
  VolumeX,
  SkipForward,
  Clock,
  Trophy,
  ChevronLeft,
  X,
  LayoutGrid,
  AlertCircle,
  Activity,
  User as UserIcon,
  TrendingUp,
  Award,
  Trash2,
  Users,
  Bell
} from 'lucide-react';
import { WEEKLY_PLAN, NUTRITION_TIPS, MASTER_EXERCISE_LIBRARY, WORKOUT_SETS, COMMON_WARMUP, COMMON_COOLDOWN } from './constants';
import { DayPlan, Exercise, WorkoutSet } from './types';
import { translations } from './translations';
import Auth from './components/Auth';
import Chatbot from './components/Chatbot';
import PerformanceCharts from './components/PerformanceCharts';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

const IconMap: Record<string, React.ReactNode> = {
  Egg: <Egg className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  Ban: <Ban className="w-5 h-5" />,
};

type WorkoutState = 'idle' | 'warmup' | 'exercise' | 'rest' | 'round_rest' | 'cooldown' | 'finished';

const REWARDS = [
  { id: 'badge1', name: '初学者', xp: 100, icon: <Trophy className="w-6 h-6 text-amber-500" />, desc: '完成第一组训练' },
  { id: 'badge2', name: '肌肉先锋', xp: 500, icon: <Zap className="w-6 h-6 text-indigo-500" />, desc: '积累 500 XP' },
  { id: 'badge3', name: '自律达人', xp: 1000, icon: <Flame className="w-6 h-6 text-rose-500" />, desc: '达到 10 级' },
  { id: 'badge4', name: '力量之源', xp: 2500, icon: <Target className="w-6 h-6 text-emerald-500" />, desc: '完成 50 次大循环' },
];

const LEVEL_REWARDS = [
  { level: 2, reward: '解锁新背景音乐', icon: <Volume2 className="w-4 h-4" /> },
  { level: 5, reward: '解锁高级训练计划', icon: <Target className="w-4 h-4" /> },
  { level: 10, reward: '获得“自律达人”称号', icon: <Award className="w-4 h-4" /> },
  { level: 20, reward: '解锁专业营养建议', icon: <Utensils className="w-4 h-4" /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'schedule' | 'library' | 'nutrition' | 'profile'>('today');
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // User & Progress State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<{ 
    xp: number; 
    streak: number; 
    level: number; 
    lastCheckIn?: string;
    language?: 'zh' | 'en';
    friends?: string[];
    completedGoals?: string[];
  } | null>(null);
  const [userLogs, setUserLogs] = useState<any[]>([]);
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const t = translations[language];

  // Friend System State
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Workout Timer State
  const [workoutState, setWorkoutState] = useState<WorkoutState>('idle');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [extraTime, setExtraTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [manualPerformance, setManualPerformance] = useState('');
  const [pendingLog, setPendingLog] = useState<{ id: string; name: string; type: string; baseValue: number; extraValue: number; actualElapsed?: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<'success' | 'error' | null>(null);
  const [chartExerciseId, setChartExerciseId] = useState<string>('squats');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseStartTimeRef = useRef<number>(0);

  // Get current day of week (0-6, Monday = 0)
  const todayIndex = (new Date().getDay() + 6) % 7;
  const todayPlan = WEEKLY_PLAN[todayIndex];
  const [currentPlan, setCurrentPlan] = useState<DayPlan>(todayPlan);

  useEffect(() => {
    if (workoutState === 'idle') {
      setCurrentPlan(todayPlan);
    }
  }, [todayPlan, workoutState]);

  useEffect(() => {
    if (!selectedDay) setSelectedDay(todayPlan);
  }, [todayPlan]);

  // Fetch User Profile & Logs
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as any;
            setProfile(data);
            if (data.language) setLanguage(data.language);
          }
          
          const logsRef = collection(db, 'users', user.uid, 'logs');
          const logsSnap = await getDocs(logsRef);
          setUserLogs(logsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      };
      fetchProfile();
    } else {
      setProfile(null);
      setUserLogs([]);
    }
  }, [user]);

  // Auto-collect XP from Daily Goals
  useEffect(() => {
    if (!user || !profile) return;

    const today = new Date().toISOString().split('T')[0];
    const completedGoalsToday = profile.completedGoals || [];

    const goals = [
      { id: 'goal1', xp: 50, check: () => userLogs.filter(l => l.date.includes(today)).length >= 3 },
      // Goal 2 and 3 are harder to track without more state, but let's stick to goal 1 for now
    ];

    const newCompleted = [...completedGoalsToday];
    let xpToAdd = 0;
    let changed = false;

    goals.forEach(goal => {
      const goalKey = `${goal.id}_${today}`;
      if (!newCompleted.includes(goalKey) && goal.check()) {
        newCompleted.push(goalKey);
        xpToAdd += goal.xp;
        changed = true;
      }
    });

    if (changed) {
      const updateXP = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          await updateDoc(docRef, {
            xp: profile.xp + xpToAdd,
            completedGoals: newCompleted
          });
          setProfile(prev => prev ? { ...prev, xp: prev.xp + xpToAdd, completedGoals: newCompleted } : null);
        } catch (err) {
          console.error('Error auto-collecting XP:', err);
        }
      };
      updateXP();
    }
  }, [userLogs, profile, user]);

  // Daily Check-in Logic
  const handleCheckIn = async () => {
    if (!user || !profile) return;
    const today = new Date().toISOString().split('T')[0];
    const lastCheckIn = profile.lastCheckIn?.split('T')[0];

    if (lastCheckIn === today) return;

    let newStreak = profile.streak;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastCheckIn === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        streak: newStreak,
        xp: profile.xp + 50, // 50 XP for check-in
        lastCheckIn: new Date().toISOString()
      });
      setProfile(prev => prev ? { ...prev, streak: newStreak, xp: prev.xp + 50, lastCheckIn: new Date().toISOString() } : null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  // Friend System Logic
  const searchUsers = async () => {
    if (!searchUsername.trim()) return;
    setIsSearching(true);
    try {
      const q = query(
        collection(db, 'users'),
        where('displayName', '>=', searchUsername),
        where('displayName', '<=', searchUsername + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs
        .map(d => ({ uid: d.id, ...d.data() }))
        .filter((u: any) => u.uid !== user?.uid);
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const sendFriendRequest = async (targetUid: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'friendRequests'), {
        from: user.uid,
        to: targetUid,
        status: 'pending',
        timestamp: new Date().toISOString(),
        fromName: profile?.displayName || user.email?.split('@')[0]
      });
      alert('Friend request sent!');
    } catch (err) {
      console.error('Error sending friend request:', err);
    }
  };

  const handleFriendRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    if (!user || !profile) return;
    try {
      const requestRef = doc(db, 'friendRequests', requestId);
      const requestSnap = await getDoc(requestRef);
      if (!requestSnap.exists()) return;
      const requestData = requestSnap.data();

      await updateDoc(requestRef, { status });

      if (status === 'accepted') {
        // Add to both users' friends list
        const myRef = doc(db, 'users', user.uid);
        const theirRef = doc(db, 'users', requestData.from);

        const myFriends = [...(profile.friends || []), requestData.from];
        await updateDoc(myRef, { friends: myFriends });
        setProfile(prev => prev ? { ...prev, friends: myFriends } : null);

        const theirSnap = await getDoc(theirRef);
        if (theirSnap.exists()) {
          const theirFriends = [...(theirSnap.data().friends || []), user.uid];
          await updateDoc(theirRef, { friends: theirFriends });
        }
      }
      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      console.error('Error handling friend request:', err);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchFriendRequests = async () => {
        const q = query(collection(db, 'friendRequests'), where('to', '==', user.uid), where('status', '==', 'pending'));
        const snap = await getDocs(q);
        setFriendRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      };
      
      const fetchFriends = async () => {
        if (!profile?.friends?.length) {
          setFriendsList([]);
          return;
        }
        const friends = [];
        for (const fUid of profile.friends) {
          const d = await getDoc(doc(db, 'users', fUid));
          if (d.exists()) friends.push({ uid: d.id, ...d.data() });
        }
        setFriendsList(friends);
      };

      fetchFriendRequests();
      fetchFriends();
    }
  }, [user, profile?.friends]);

  const toggleLanguage = async () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { language: newLang });
      } catch (err) {
        console.error('Error saving language preference:', err);
      }
    }
  };
  useEffect(() => {
    if (workoutState !== 'idle' && workoutState !== 'finished' && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            if (workoutState === 'exercise') {
              setExtraTime(e => e + 1);
              return 0;
            }
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

  // Audio Beep
  const playBeep = () => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  const handlePhaseTransition = async () => {
    playBeep();
    
    const elapsed = Math.floor((Date.now() - phaseStartTimeRef.current) / 1000);
    
    // Auto-submit any pending log from previous set before moving on
    if (pendingLog) {
      await submitSetPerformance();
    }
    
    // Capture performance for the current set
    if (workoutState === 'exercise') {
      const currentEx = currentPlan.exercises[currentExerciseIndex];
      const isSeconds = currentEx.reps.includes('s');
      
      setPendingLog({
        id: currentEx.id,
        name: currentEx.name,
        type: isSeconds ? 'seconds' : 'reps',
        baseValue: isSeconds ? elapsed : parseInt(currentEx.reps) || 0,
        extraValue: extraTime,
        actualElapsed: elapsed
      });
      setExtraTime(0);
    }
    
    phaseStartTimeRef.current = Date.now();

    if (workoutState === 'warmup') {
      const isLastWarmup = currentExerciseIndex === (currentPlan.warmup?.length || 0) - 1;
      if (isLastWarmup) {
        startExercise(0, 1);
      } else {
        const nextIndex = currentExerciseIndex + 1;
        setCurrentExerciseIndex(nextIndex);
        setTimeLeft(getSeconds(currentPlan.warmup![nextIndex].reps));
      }
    } else if (workoutState === 'exercise') {
      const isLastExercise = currentExerciseIndex === currentPlan.exercises.length - 1;
      if (isLastExercise) {
        if (currentRound < totalRounds) {
          setWorkoutState('round_rest');
          setTimeLeft(90);
        } else {
          setWorkoutState('cooldown');
          setCurrentExerciseIndex(0);
          setTimeLeft(getSeconds(currentPlan.cooldown![0].reps));
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
      const isLastCooldown = currentExerciseIndex === (currentPlan.cooldown?.length || 0) - 1;
      if (isLastCooldown) {
        setWorkoutState('finished');
        handleWorkoutComplete();
      } else {
        const nextIndex = currentExerciseIndex + 1;
        setCurrentExerciseIndex(nextIndex);
        setTimeLeft(getSeconds(currentPlan.cooldown![nextIndex].reps));
      }
    }
  };

  const submitSetPerformance = async () => {
    if (!user) {
      setSubmitFeedback('error');
      setTimeout(() => setSubmitFeedback(null), 3000);
      return;
    }
    if (!pendingLog) return;
    
    // Don't auto-submit if the set was too short (likely a skip)
    // Unless it's a manual submission (manualPerformance is set)
    if (!manualPerformance && pendingLog.actualElapsed && pendingLog.actualElapsed < 3) {
      setPendingLog(null);
      return;
    }
    
    setIsSubmitting(true);
    const finalValue = manualPerformance ? parseInt(manualPerformance) : (pendingLog.baseValue + pendingLog.extraValue);
    
    try {
      // 1. Log the performance
      await addDoc(collection(db, 'users', user.uid, 'logs'), {
        exerciseId: pendingLog.id,
        date: new Date().toISOString(),
        value: finalValue,
        type: pendingLog.type
      });

      // 2. Award XP immediately (Bonus for effort)
      const baseXP = 25;
      const effortBonus = Math.floor((pendingLog.actualElapsed || 0) / 10); // 1 XP per 10 seconds
      const xpGained = baseXP + effortBonus;
      
      const newXp = (profile?.xp || 0) + xpGained;
      const newLevel = Math.floor(newXp / 1000) + 1;
      
      await updateDoc(doc(db, 'users', user.uid), {
        xp: newXp,
        level: newLevel
      });

      setProfile(prev => prev ? { ...prev, xp: newXp, level: newLevel } : null);
      
      setPendingLog(null);
      setManualPerformance('');
      setSubmitFeedback('success');
      setTimeout(() => setSubmitFeedback(null), 3000);
    } catch (err) {
      console.error('Error logging performance:', err);
      setSubmitFeedback('error');
      setTimeout(() => setSubmitFeedback(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWorkoutComplete = async () => {
    if (!user || !profile) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      const xpGained = 300; // Bonus for full workout
      const newXp = profile.xp + xpGained;
      const newLevel = Math.floor(newXp / 1000) + 1;
      
      await updateDoc(docRef, {
        xp: newXp,
        level: newLevel
      });
      
      setProfile(prev => prev ? { 
        ...prev, 
        xp: newXp, 
        level: newLevel 
      } : null);
    } catch (err) {
      console.error('Error updating XP:', err);
    }
  };

  const startExercise = (index: number, round: number) => {
    setCurrentExerciseIndex(index);
    setCurrentRound(round);
    setWorkoutState('exercise');
    setTimeLeft(getSeconds(currentPlan.exercises[index].reps));
    phaseStartTimeRef.current = Date.now();
  };

  const startWorkout = (plan: DayPlan = todayPlan) => {
    setCurrentPlan(plan);
    phaseStartTimeRef.current = Date.now();
    if (plan.warmup && plan.warmup.length > 0) {
      setWorkoutState('warmup');
      setCurrentExerciseIndex(0);
      setTimeLeft(getSeconds(plan.warmup[0].reps));
    } else {
      setCurrentExerciseIndex(0);
      setCurrentRound(1);
      setWorkoutState('exercise');
      setTimeLeft(getSeconds(plan.exercises[0].reps));
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
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
            {language === 'zh' ? '14岁增肌成长计划' : '14yo Muscle Growth Plan'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {profile && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[10px] font-black">
                <Flame className="w-3 h-3 fill-current" /> {profile.streak}
              </div>
              <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-black">
                <Zap className="w-3 h-3 fill-current" /> {profile.xp} XP
              </div>
            </div>
          )}
          <div className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
            {t.level} {profile?.level || 1}
          </div>
        </div>
      </div>
    </header>
  );

  const renderWorkoutOverlay = () => {
    let currentEx: Exercise | undefined;
    if (workoutState === 'warmup') {
      currentEx = currentPlan.warmup?.[currentExerciseIndex];
    } else if (workoutState === 'exercise') {
      currentEx = currentPlan.exercises[currentExerciseIndex];
    } else if (workoutState === 'cooldown') {
      currentEx = currentPlan.cooldown?.[currentExerciseIndex];
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
              {workoutState === 'warmup' ? `${t.warmupPhase} - ${currentExerciseIndex + 1}/${currentPlan.warmup?.length}` : 
               workoutState === 'exercise' ? (language === 'zh' ? `第 ${currentRound} 轮 - 动作 ${currentExerciseIndex + 1}/${currentPlan.exercises.length}` : `Round ${currentRound} - Exercise ${currentExerciseIndex + 1}/${currentPlan.exercises.length}`) :
               workoutState === 'rest' ? t.rest :
               workoutState === 'round_rest' ? t.rest :
               workoutState === 'cooldown' ? `${t.cooldownPhase} - ${currentExerciseIndex + 1}/${currentPlan.cooldown?.length}` : t.startWorkout}
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
              className="w-full space-y-12"
            >
              {(workoutState === 'exercise' || workoutState === 'warmup' || workoutState === 'cooldown') && currentEx ? (
                <>
                  <div 
                    onClick={handlePhaseTransition}
                    className="w-72 h-72 mx-auto bg-zinc-900 rounded-[3rem] flex items-center justify-center border-8 border-zinc-800 relative overflow-hidden group shadow-2xl shadow-emerald-500/10 cursor-pointer active:scale-95 transition-transform"
                  >
                    <Dumbbell className="w-32 h-32 text-emerald-500 opacity-20" />
                    
                    <svg className="absolute inset-0 -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="46" 
                        fill="none" stroke="currentColor" strokeWidth="4" 
                        className="text-zinc-800/50" 
                      />
                      <motion.circle 
                        cx="50" cy="50" r="46" 
                        fill="none" stroke="currentColor" strokeWidth="4" 
                        strokeDasharray="289.02"
                        animate={{ strokeDashoffset: 289.02 * (1 - timeLeft / getSeconds(currentEx.reps)) }}
                        className="text-emerald-500" 
                        strokeLinecap="round"
                      />
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">
                        {timeLeft > 0 ? 'Remaining' : 'Extra Time'}
                      </span>
                      <span className={`text-7xl font-display font-black tabular-nums tracking-tighter ${timeLeft > 0 ? 'text-white' : 'text-emerald-400'}`}>
                        {timeLeft > 0 ? timeLeft : extraTime}s
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-display font-bold tracking-tight">{currentEx.name}</h2>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-base max-w-xs mx-auto leading-relaxed">
                        {currentEx.description.split('\n')[0]}
                      </p>
                      {currentEx.demonstrationSteps && (
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-left max-w-sm mx-auto space-y-3">
                          <div>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 opacity-70">当前要领</p>
                            <p className="text-sm text-zinc-100 font-medium leading-relaxed">
                              {currentEx.demonstrationSteps[Math.floor((1 - timeLeft / getSeconds(currentEx.reps)) * currentEx.demonstrationSteps.length)]?.instruction || currentEx.tips[0]}
                            </p>
                          </div>
                          {currentEx.demonstrationSteps[Math.floor((1 - timeLeft / getSeconds(currentEx.reps)) * currentEx.demonstrationSteps.length)]?.safetyTip && (
                            <div className="pt-2 border-t border-white/5">
                              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1 opacity-70 flex items-center gap-1">
                                <AlertCircle className="w-2.5 h-2.5" /> 安全提示
                              </p>
                              <p className="text-xs text-zinc-400 italic">
                                {currentEx.demonstrationSteps[Math.floor((1 - timeLeft / getSeconds(currentEx.reps)) * currentEx.demonstrationSteps.length)]?.safetyTip}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : workoutState === 'finished' ? (
                <div className="space-y-6 max-w-sm mx-auto">
                  <div className="w-24 h-24 bg-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-4xl font-display font-bold">训练完成！</h2>
                    <p className="text-zinc-400">你今天表现得非常棒，获得了 150 XP。</p>
                  </div>
                  
                  <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">记录今日最佳表现</p>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="输入深蹲次数" 
                        id="perf-input"
                        className="flex-1 bg-zinc-800 border-none rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <button 
                        onClick={async () => {
                          const val = (document.getElementById('perf-input') as HTMLInputElement).value;
                          if (val && user) {
                            try {
                              await addDoc(collection(db, 'users', user.uid, 'logs'), {
                                exerciseId: 'squats',
                                date: new Date().toISOString(),
                                value: parseInt(val),
                                type: 'reps'
                              });
                              alert('记录成功！');
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                        className="bg-emerald-500 text-white px-6 rounded-xl font-bold text-sm"
                      >
                        记录
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={resetWorkout}
                    className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg"
                  >
                    回到首页
                  </button>
                </div>
              ) : (
                <div className="space-y-8 w-full max-w-sm mx-auto">
                  <div className="space-y-2">
                    <div className="text-8xl font-display font-black text-zinc-100 tabular-nums">
                      {timeLeft}
                    </div>
                    <p className="text-xl text-zinc-400 font-medium">
                      {workoutState === 'warmup' ? '准备热身...' : 
                       workoutState === 'rest' ? `即将开始: ${currentPlan.exercises[currentExerciseIndex + 1]?.name}` :
                       workoutState === 'round_rest' ? '深呼吸，准备下一轮' : '放松身体'}
                    </p>
                  </div>

                  {pendingLog && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800 space-y-4 shadow-2xl"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">记录上组表现: {pendingLog.name}</p>
                        <span className="text-[10px] font-bold text-emerald-500">自动计时: {pendingLog.baseValue + pendingLog.extraValue}{pendingLog.type === 'seconds' ? 's' : '次'}</span>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="number"
                          placeholder={pendingLog.type === 'seconds' ? "输入实际秒数" : "输入实际次数"}
                          value={manualPerformance}
                          onChange={(e) => setManualPerformance(e.target.value)}
                          className="flex-1 bg-zinc-800 border-none rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <button 
                          onClick={submitSetPerformance}
                          disabled={isSubmitting}
                          className={`${
                            submitFeedback === 'success' ? 'bg-emerald-600' : 
                            submitFeedback === 'error' ? 'bg-rose-500' : 
                            'bg-emerald-500'
                          } text-white px-6 rounded-xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center min-w-[80px] h-12 disabled:opacity-50`}
                        >
                          {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : submitFeedback === 'success' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : submitFeedback === 'error' ? (
                            '失败'
                          ) : (
                            '提交'
                          )}
                        </button>
                      </div>
                      {submitFeedback === 'error' && !user && (
                        <p className="text-[10px] text-rose-400 font-bold text-center">请先登录以保存数据</p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="p-12 flex flex-col items-center justify-center gap-8">
          <div className="flex items-center justify-center gap-8">
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
          
          <div className="w-full max-w-sm">
            <iframe 
              style={{ borderRadius: '12px' }} 
              src="https://open.spotify.com/embed/playlist/65lHTVbYdKBfz7z8CbreWA?utm_source=generator&theme=0" 
              width="100%" 
              height="80" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderToday = () => {
    // Calculate weekly activity (fire thing)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    
    const activeDays = new Set(userLogs.map(l => l.date.split('T')[0]));

    // Dynamic Growth Prediction
    const getPrediction = () => {
      if (userLogs.length < 3) return null;
      
      const exerciseGroups: Record<string, any[]> = {};
      userLogs.forEach(log => {
        if (!exerciseGroups[log.exerciseId]) exerciseGroups[log.exerciseId] = [];
        exerciseGroups[log.exerciseId].push(log);
      });
      
      let bestExId = 'squats';
      let maxLogs = 0;
      Object.entries(exerciseGroups).forEach(([id, logs]) => {
        if (logs.length > maxLogs) {
          maxLogs = logs.length;
          bestExId = id;
        }
      });
      
      const ex = MASTER_EXERCISE_LIBRARY.find(e => e.id === bestExId);
      const logs = exerciseGroups[bestExId].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const lastLog = logs[0];
      const maxVal = Math.max(...logs.map(l => l.value));
      
      const isBodyweight = ex?.equipment === 'None' || ex?.name.includes('俯卧撑') || ex?.name.includes('深蹲');
      const unit = lastLog.type === 'seconds' ? 's' : (isBodyweight ? (language === 'zh' ? '次' : 'reps') : 'kg');

      return {
        exercise: ex?.name || bestExId,
        maxSet: maxVal,
        predictedNext: lastLog.type === 'seconds' ? maxVal + 5 : (isBodyweight ? maxVal + 2 : maxVal + 2.5),
        type: lastLog.type,
        unit
      };
    };

    const prediction = getPrediction();

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <section className="bg-zinc-900 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden text-center">
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {todayPlan.isRest ? t.restDay : t.trainingDay}
              </span>
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{todayPlan.day}</span>
            </div>
            <h2 className="text-5xl font-display font-bold leading-tight mb-6">
              {todayPlan.focus}
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
              {language === 'zh' ? (
                <>
                  明白，我懂了！你现在的动力非常足，想要更有挑战性、密度更高的训练。
                  采用<span className="text-white font-bold">“循环训练法”</span>，挑战你的极限。
                </>
              ) : (
                <>
                  I get it! You're highly motivated and want more challenging, high-density training.
                  Using <span className="text-white font-bold">"Circuit Training"</span> to push your limits.
                </>
              )}
            </p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startWorkout()}
              className="w-full max-w-xs bg-emerald-500 hover:bg-emerald-400 text-white py-5 rounded-[2rem] font-black text-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 transition-colors"
            >
              <Play className="w-6 h-6 fill-current" />
              {t.startWorkout}
            </motion.button>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Flame size={200} />
          </div>
        </section>

        {/* Hotspots / 热点 */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-zinc-200 shadow-sm overflow-hidden relative">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">{t.dailyHotspots}</h3>
          </div>
          
          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <Flame className="w-7 h-7 text-amber-500" />
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-zinc-900 text-base">{t.checkIn}</h4>
                  <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full uppercase">Streak: {profile?.streak || 0}</span>
                </div>
                <div className="flex gap-1.5 mb-4">
                  {last7Days.map(date => (
                    <div 
                      key={date} 
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeDays.has(date) ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)] scale-110' : 'bg-zinc-100'}`}
                      title={date}
                    />
                  ))}
                </div>
                {!profile?.lastCheckIn?.includes(new Date().toISOString().split('T')[0]) && (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckIn}
                    className="w-full bg-zinc-900 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-zinc-200 active:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {t.checkInNow} +50 XP
                  </motion.button>
                )}
              </div>
            </div>

            <div className="h-px bg-zinc-100 w-full" />

            <div className="flex gap-5">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <Trophy className="w-7 h-7 text-indigo-600" />
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-zinc-900 text-base">{t.growthPrediction}</h4>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <UserIcon className="w-3 h-3" />
                    {t.addFriendQuick}
                  </button>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100">
                  {prediction ? (
                    <div className="space-y-2">
                      <p className="text-xs text-zinc-500">
                        {language === 'zh' ? '针对' : 'For'} <span className="text-indigo-600 font-bold">{prediction.exercise}</span>:
                      </p>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-[8px] text-zinc-400 font-black uppercase tracking-widest">{t.maxSet}</p>
                          <p className="text-sm font-black text-zinc-900">{prediction.maxSet}{prediction.unit}</p>
                        </div>
                        <div className="w-px h-8 bg-zinc-200" />
                        <div>
                          <p className="text-[8px] text-zinc-400 font-black uppercase tracking-widest">{t.predictedSet}</p>
                          <p className="text-sm font-black text-emerald-600">+{prediction.predictedNext}{prediction.unit}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {language === 'zh' ? '开始你的第一次训练以查看成长预测' : 'Start your first workout to see growth predictions'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 rounded-3xl p-6 border border-zinc-200">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500" /> {t.dailyGoals}
          </h3>
          <div className="space-y-3">
            {[
              { id: 'goal1', text: t.goal1, xp: 50, done: userLogs.filter(l => l.date.includes(new Date().toISOString().split('T')[0])).length >= 3 },
              { id: 'goal2', text: t.goal2, xp: 100, done: false },
              { id: 'goal3', text: t.goal3, xp: 30, done: false },
            ].map(goal => (
              <div key={goal.id} className="flex items-center justify-between bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm">
                <div className="flex items-center gap-3">
                  {goal.done ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border-2 border-zinc-200" />}
                  <span className={`text-xs font-bold ${goal.done ? 'text-zinc-400 line-through' : 'text-zinc-700'}`}>{goal.text}</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600">+{goal.xp} XP</span>
              </div>
            ))}
          </div>
        </section>

      {todayPlan.isCircuit && (
        <section className="bg-zinc-100 rounded-2xl p-4 border border-zinc-200">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Zap className="w-3 h-3" /> {t.circuitGuide} (30min)
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white p-2 rounded-xl border border-zinc-200">
              <p className="text-[10px] text-zinc-400 uppercase font-bold">{t.work}</p>
              <p className="text-lg font-display font-bold text-zinc-900">45s</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-zinc-200">
              <p className="text-[10px] text-zinc-400 uppercase font-bold">{t.rest}</p>
              <p className="text-lg font-display font-bold text-zinc-900">15s</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-zinc-200 relative group">
              <p className="text-[10px] text-zinc-400 uppercase font-bold">{t.rounds}</p>
              <input 
                type="number" 
                value={totalRounds}
                onChange={(e) => setTotalRounds(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-center text-lg font-display font-bold text-emerald-600 bg-transparent border-none focus:ring-0 p-0"
              />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {t.clickToEdit}
              </div>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-3 text-center italic">{t.restAfterRound}</p>
        </section>
      )}

      <section className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-display font-bold px-1 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-amber-400 rounded-full" />
            {t.warmupPhase} (5min)
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
                    <Activity className="w-6 h-6 text-zinc-400" />
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
            {t.mainTraining}
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
                    <Activity className="w-6 h-6 text-zinc-400" />
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
            {t.cooldownPhase} (5min)
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
                    <Activity className="w-6 h-6 text-zinc-400" />
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
            <h4 className="font-bold text-amber-900 text-sm">{t.importantReminder}</h4>
            <p className="text-amber-800 text-xs mt-1 leading-relaxed">
              {t.reminderDesc}
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

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
            <span className="text-lg font-display font-bold mt-1">{plan.day === todayPlan.day ? (language === 'zh' ? '今' : 'T') : plan.day.slice(-1)}</span>
            {plan.isRest && <div className="w-1 h-1 bg-amber-400 rounded-full mt-1" />}
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-display font-bold">{selectedDay.focus}</h3>
            {selectedDay.isRest && (
              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold uppercase">{t.restDay}</span>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider px-1">{t.warmupPhase}</h4>
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
                          <Activity className="w-5 h-5 text-zinc-300" />
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
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider px-1">{t.mainTraining}</h4>
              <div className="grid gap-3">
                {selectedDay.exercises.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex)}
                    className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center overflow-hidden">
                        <Activity className="w-5 h-5 text-zinc-300" />
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
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider px-1">{t.cooldownPhase}</h4>
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
                          <Activity className="w-5 h-5 text-zinc-300" />
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <section className="bg-emerald-500 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-display font-bold mb-2">🥗 {language === 'zh' ? '30 分钟“魔鬼训练”后的营养公式' : '30-Minute Post-Workout Nutrition Formula'}</h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            {language === 'zh' ? '因为你的强度上来了，55kg 的体重必须摄入足够的建筑材料。' : 'As your intensity increases, your 55kg body needs sufficient building materials.'}
          </p>
        </div>
        <Utensils className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
      </section>

      <div className="grid gap-4">
        {NUTRITION_TIPS.map((tip, idx) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex gap-4"
          >
            <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center shrink-0">
              {IconMap[tip.icon] || <Info className="w-5 h-5 text-zinc-400" />}
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 mb-1">{tip.title}</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">{tip.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Moon className="w-6 h-6 text-indigo-400" />
          <h4 className="font-bold">{language === 'zh' ? '睡眠是关键' : 'Sleep is Key'}</h4>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">
          {language === 'zh' ? (
            <>生长激素主要在深层睡眠中分泌，建议每晚保证 <span className="text-white font-bold">9-10 小时</span> 睡眠。睡前 1 小时尽量不看电子产品。</>
          ) : (
            <>Growth hormone is primarily secreted during deep sleep. It is recommended to get <span className="text-white font-bold">9-10 hours</span> of sleep every night. Avoid electronic devices 1 hour before bed.</>
          )}
        </p>
      </section>

      <section className="bg-zinc-100 rounded-[2.5rem] p-6 border border-zinc-200">
        <h4 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-emerald-500" /> {language === 'zh' ? '训练背景音乐' : 'Workout Background Music'}
        </h4>
        <iframe 
          style={{ borderRadius: '12px' }} 
          src="https://open.spotify.com/embed/playlist/65lHTVbYdKBfz7z8CbreWA?utm_source=generator" 
          width="100%" 
          height="152" 
          frameBorder="0" 
          allowFullScreen 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
        ></iframe>
      </section>
    </motion.div>
  );

  const renderLibrary = () => {
    const filteredExercises = MASTER_EXERCISE_LIBRARY.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           ex.targetMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'All' || ex.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Lower', 'Upper Push', 'Upper Pull', 'Core', 'Full Body', 'Cardio'];

    return (
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 pb-12"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              type="text" 
              placeholder={language === 'zh' ? '搜索动作或肌肉部位...' : 'Search exercises or muscles...'} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  filterCategory === cat 
                    ? 'bg-zinc-900 text-white' 
                    : 'bg-white text-zinc-500 border border-zinc-200'
                }`}
              >
                {cat === 'All' ? (language === 'zh' ? '全部' : 'All') : cat}
              </button>
            ))}
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-lg font-display font-bold px-1 flex items-center gap-2">
            <Library className="w-5 h-5 text-emerald-500" />
            {t.library}
          </h3>
          <div className="grid gap-4">
            {WORKOUT_SETS.map(set => (
              <motion.button
                key={set.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSet(set)}
                className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm text-left group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-zinc-900 text-lg">{set.name}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{set.description}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                    set.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                    set.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {set.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> {set.exercises.length} {language === 'zh' ? '动作' : 'Exercises'}</span>
                  <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {set.category}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-display font-bold px-1 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-500" />
            {language === 'zh' ? `动作库 (${filteredExercises.length})` : `Exercise Library (${filteredExercises.length})`}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {filteredExercises.map(ex => (
              <motion.button
                key={ex.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedExercise(ex)}
                className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm group"
              >
                <div className="aspect-square bg-zinc-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-zinc-300 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/50 backdrop-blur-md text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded">
                      {ex.category}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-zinc-900 text-sm truncate">{ex.name}</h4>
                  <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
                    <Target className="w-2.5 h-2.5" /> {ex.targetMuscles.slice(0, 2).join(', ')}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </motion.div>
    );
  };

  const renderSetDetail = (set: WorkoutSet) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 bg-zinc-50 overflow-y-auto"
    >
      <div className="max-w-md mx-auto px-6 py-8">
        <button 
          onClick={() => setSelectedSet(null)}
          className="mb-6 flex items-center gap-2 text-zinc-500 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回库</span>
        </button>

        <div className="space-y-6">
          <div className="bg-zinc-900 text-white p-8 rounded-3xl shadow-xl">
            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{set.category}</span>
            <h2 className="text-3xl font-display font-bold mt-2">{set.name}</h2>
            <p className="text-zinc-400 text-sm mt-2">{set.description}</p>
            <div className="flex gap-4 mt-6">
              <div className="bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold">
                {set.difficulty}
              </div>
              <div className="bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold">
                {set.exercises.length} 个动作
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-display font-bold px-1">包含动作</h3>
            <div className="grid gap-3">
              {set.exercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExercise(ex)}
                  className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-50 rounded-xl overflow-hidden flex items-center justify-center">
                      <Activity className="w-6 h-6 text-zinc-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900">{ex.name}</h4>
                      <p className="text-xs text-zinc-500">{ex.sets} × {ex.reps}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-300" />
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => {
              const plan: DayPlan = {
                day: 'Practice',
                focus: set.name,
                exercises: set.exercises,
                warmup: COMMON_WARMUP,
                cooldown: COMMON_COOLDOWN,
                isCircuit: true
              };
              startWorkout(plan);
              setSelectedSet(null);
            }}
            className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20"
          >
            开始此训练
          </button>
        </div>
      </div>
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
          <div className="aspect-video bg-zinc-100 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-inner border border-zinc-200">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-indigo-500/10" />
            <div className="relative z-10 text-center p-6">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">TeenGrowth Pro · 动作演示</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-display font-bold text-zinc-900">{ex.name}</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="bg-zinc-100 px-3 py-1 rounded-lg text-xs font-bold text-zinc-600">
                {ex.sets}
              </div>
              <div className="bg-zinc-100 px-3 py-1 rounded-lg text-xs font-bold text-zinc-600">
                {ex.reps}
              </div>
              <div className="bg-emerald-50 px-3 py-1 rounded-lg text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Wrench className="w-3 h-3" /> {ex.equipment}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {ex.targetMuscles.map(m => (
                <span key={m} className="bg-zinc-100 px-2 py-0.5 rounded text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold px-1">数据分析</h3>
            <PerformanceCharts 
              exerciseName={ex.name} 
              logs={userLogs.filter(l => l.exerciseId === ex.id).map(l => ({ date: l.date, value: l.value }))} 
            />
          </div>

          {ex.demonstrationSteps && (
            <div className="space-y-4">
              <h3 className="text-lg font-display font-bold border-b border-zinc-100 pb-2">动作演示</h3>
              <div className="space-y-4">
                {ex.demonstrationSteps.map((step, i) => (
                  <div key={i} className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                        {i + 1}
                      </span>
                      <h4 className="font-bold text-sm text-zinc-900">{step.instruction}</h4>
                    </div>
                    {step.safetyTip && (
                      <div className="flex gap-2 text-[10px] text-amber-600 font-medium bg-amber-50 p-2 rounded-lg">
                        <Info className="w-3 h-3 shrink-0" />
                        <span>安全提示: {step.safetyTip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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

  const renderProfile = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 pb-12"
    >
      <section className="bg-white p-6 rounded-[2.5rem] border border-zinc-200 shadow-sm">
        <h3 className="text-xl font-display font-bold mb-6">账户中心</h3>
        <Auth onUserChange={setUser} profile={profile} />
      </section>

      {user && (
        <>
          <section className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Current Progress</p>
              <h2 className="text-4xl font-display font-bold mb-4">Level {profile?.level || 1}</h2>
              <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden mb-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((profile?.xp || 0) % 1000) / 10}%` }}
                  className="h-full bg-emerald-500"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
                <span>{(profile?.xp || 0) % 1000} XP</span>
                <span>1000 XP to Level {(profile?.level || 1) + 1}</span>
              </div>
            </div>
            <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-display font-bold px-1 text-center">等级奖励</h3>
            <div className="space-y-2">
              {LEVEL_REWARDS.map(item => (
                <div 
                  key={item.level}
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    (profile?.level || 1) >= item.level ? 'bg-white border-zinc-200' : 'bg-zinc-50 border-zinc-100 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">{item.reward}</p>
                      <p className="text-[8px] text-zinc-400 uppercase font-black tracking-widest">Level {item.level} Required</p>
                    </div>
                  </div>
                  {(profile?.level || 1) >= item.level ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-zinc-300" />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-display font-bold px-1 text-center">成就与奖品</h3>
            <div className="grid grid-cols-2 gap-4">
              {REWARDS.map(reward => {
                const isUnlocked = (profile?.xp || 0) >= reward.xp;
                return (
                  <div 
                    key={reward.id}
                    className={`p-4 rounded-3xl border transition-all text-center space-y-2 ${
                      isUnlocked ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-50 border-zinc-100 opacity-50 grayscale'
                    }`}
                  >
                    <div className="w-12 h-12 mx-auto bg-zinc-50 rounded-2xl flex items-center justify-center">
                      {reward.icon}
                    </div>
                    <h4 className="font-bold text-xs">{reward.name}</h4>
                    <p className="text-[8px] text-zinc-400 leading-tight">{reward.desc}</p>
                    {isUnlocked && (
                      <span className="inline-block text-[8px] font-black text-emerald-500 uppercase tracking-widest">已解锁</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-display font-bold px-1 text-center">数据分析</h3>
            
            <div className="flex gap-2 overflow-x-auto pb-2 px-1 no-scrollbar">
              {Array.from(new Set(userLogs.map(l => l.exerciseId))).map(id => {
                const ex = MASTER_EXERCISE_LIBRARY.find(e => e.id === id);
                return (
                  <button
                    key={id}
                    onClick={() => setChartExerciseId(id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${
                      chartExerciseId === id ? 'bg-zinc-900 text-white shadow-lg' : 'bg-white text-zinc-400 border border-zinc-200'
                    }`}
                  >
                    {ex?.name || id}
                  </button>
                );
              })}
            </div>

            <PerformanceCharts 
              exerciseName={MASTER_EXERCISE_LIBRARY.find(e => e.id === chartExerciseId)?.name || chartExerciseId} 
              logs={userLogs.filter(l => l.exerciseId === chartExerciseId).map(l => ({ date: l.date, value: l.value }))} 
            />
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-display font-bold px-1 text-center">训练历史</h3>
            <div className="space-y-3">
              {[...userLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10).map((log, i) => {
                const ex = MASTER_EXERCISE_LIBRARY.find(e => e.id === log.exerciseId);
                const dateObj = new Date(log.date);
                return (
                  <div key={log.id || i} className="bg-white p-4 rounded-2xl border border-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900">{ex?.name || log.exerciseId}</h4>
                        <p className="text-[10px] text-zinc-400 font-medium">
                          {dateObj.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} · {dateObj.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-sm font-black text-emerald-500">
                          {log.value}{log.type === 'seconds' ? 's' : (MASTER_EXERCISE_LIBRARY.find(e => e.id === log.exerciseId)?.equipment === 'None' ? (language === 'zh' ? '次' : 'reps') : 'kg')}
                        </p>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Performance</p>
                      </div>
                      <button 
                        onClick={async () => {
                          if (window.confirm(language === 'zh' ? '确定要删除这条记录吗？' : 'Are you sure you want to delete this log?')) {
                            try {
                              await deleteDoc(doc(db, 'logs', log.id));
                              setUserLogs(prev => prev.filter(l => l.id !== log.id));
                            } catch (error) {
                              handleFirestoreError(error, OperationType.DELETE, 'logs');
                            }
                          }
                        }}
                        className="p-2 text-zinc-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {userLogs.length === 0 && (
                <div className="bg-zinc-50 rounded-2xl p-8 text-center border border-dashed border-zinc-200">
                  <Clock className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                  <p className="text-sm text-zinc-400">暂无历史记录</p>
                </div>
              )}
            </div>
          </section>
          <section className="bg-white p-6 rounded-[2.5rem] border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold">{t.friends}</h3>
              <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Users className="w-3 h-3" /> {friendsList.length}
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Search Users Section */}
              <div className="bg-zinc-50 p-5 rounded-3xl border border-zinc-100 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <Search className="w-3 h-3" /> {language === 'zh' ? '发现新伙伴' : 'Discover New Friends'}
                </h4>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="text"
                      placeholder={language === 'zh' ? '输入用户名搜索...' : 'Search by username...'}
                      value={searchUsername}
                      onChange={(e) => setSearchUsername(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-2xl py-3 pl-10 text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={searchUsers}
                    disabled={isSearching}
                    className="bg-zinc-900 text-white px-6 rounded-2xl text-xs font-bold disabled:opacity-50 shadow-lg shadow-zinc-200"
                  >
                    {isSearching ? '...' : t.searchFriends}
                  </motion.button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    {searchResults.map(res => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={res.uid} 
                        className="flex items-center justify-between bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{res.displayName}</p>
                            <p className="text-[10px] text-zinc-400">Level {res.level || 1}</p>
                          </div>
                        </div>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => sendFriendRequest(res.uid)}
                          className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                        >
                          {t.addFriend}
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                ) : searchUsername && !isSearching && (
                  <p className="text-[10px] text-zinc-400 text-center py-2 italic">
                    {language === 'zh' ? '未找到用户' : 'No users found'}
                  </p>
                )}
              </div>

              {/* Friend Requests */}
              {friendRequests.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{t.friendRequests}</p>
                  {friendRequests.map(req => (
                    <div key={req.id} className="flex items-center justify-between bg-amber-50 p-3 rounded-2xl border border-amber-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900">{req.fromName}</p>
                          <p className="text-[8px] text-zinc-400">{t.pending}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleFriendRequest(req.id, 'accepted')}
                          className="bg-emerald-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold"
                        >
                          {t.accept}
                        </button>
                        <button 
                          onClick={() => handleFriendRequest(req.id, 'rejected')}
                          className="bg-zinc-200 text-zinc-600 px-2 py-1 rounded-lg text-[10px] font-bold"
                        >
                          {t.reject}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Friends List */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{t.myFriends}</p>
                {friendsList.length > 0 ? (
                  friendsList.map(friend => (
                    <div key={friend.uid} className="flex items-center justify-between bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900">{friend.displayName}</p>
                          <p className="text-[10px] text-zinc-400">Level {friend.level || 1} · {friend.xp || 0} XP</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{friend.streak || 0} DAY STREAK</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 text-center py-4 italic">{t.noFriends}</p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-[2.5rem] border border-zinc-200 shadow-sm">
            <h3 className="text-xl font-display font-bold mb-6">{t.settings}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <LayoutGrid className="w-4 h-4 text-zinc-400" />
                  </div>
                  <span className="text-sm font-bold text-zinc-700">{t.language}</span>
                </div>
                <button 
                  onClick={toggleLanguage}
                  className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest"
                >
                  {language === 'zh' ? 'English' : '中文'}
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      {renderHeader()}

      <main className="max-w-md mx-auto px-6 pt-6">
        <AnimatePresence mode="wait">
          {activeTab === 'today' && renderToday()}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'library' && renderLibrary()}
          {activeTab === 'nutrition' && renderNutrition()}
          {activeTab === 'profile' && renderProfile()}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-zinc-200 px-6 pt-3 pb-6 z-[100] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('today')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'today' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <Flame className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tight">{t.today}</span>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'schedule' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tight">{t.schedule}</span>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('library')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'library' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <Library className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tight">{t.library}</span>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('nutrition')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'nutrition' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <Utensils className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tight">{t.nutrition}</span>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <UserIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tight">{t.profile}</span>
          </motion.button>
        </div>
      </nav>

      <Chatbot />

      <AnimatePresence>
        {selectedExercise && renderExerciseDetail(selectedExercise)}
        {selectedSet && renderSetDetail(selectedSet)}
        {workoutState !== 'idle' && renderWorkoutOverlay()}
      </AnimatePresence>
    </div>
  );
}
