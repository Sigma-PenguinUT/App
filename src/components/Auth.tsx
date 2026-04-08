import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, LogOut, User as UserIcon, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function Auth({ onUserChange }: { onUserChange: (user: FirebaseUser | null) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<FirebaseUser | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      onUserChange(u);
    });
    return unsubscribe;
  }, [onUserChange]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        // Initialize user doc
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          email: res.user.email,
          xp: 0,
          streak: 0,
          level: 1,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-3 bg-zinc-100 p-2 rounded-2xl border border-zinc-200">
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
          <UserIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">{user.email}</p>
        </div>
        <button 
          onClick={() => signOut(auth)}
          className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${isLogin ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}
        >
          登录
        </button>
        <button 
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${!isLogin ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}
        >
          注册
        </button>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="email" 
            placeholder="邮箱" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="password" 
            placeholder="密码" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
            required
          />
        </div>
        {error && <p className="text-[10px] text-rose-500 font-medium px-1">{error}</p>}
        <button 
          disabled={loading}
          className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? '处理中...' : (isLogin ? '立即登录' : '创建账号')}
        </button>
      </form>
    </div>
  );
}
