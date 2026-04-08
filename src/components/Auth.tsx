import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, LogOut, User as UserIcon, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function Auth({ onUserChange, profile }: { onUserChange: (user: FirebaseUser | null) => void, profile: any }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
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
    
    // Convert username to a dummy email for Firebase Auth
    const internalEmail = `${username.trim().toLowerCase()}@teen-growth.app`;

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, internalEmail, password);
      } else {
        const res = await createUserWithEmailAndPassword(auth, internalEmail, password);
        // Initialize user doc
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          username: username.trim(),
          email: internalEmail,
          xp: 0,
          streak: 0,
          level: 1,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('登录系统配置中，请稍后再试。');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('用户名或密码错误');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('该用户名已被占用');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      
      // Check if user doc exists, if not initialize it
      const docRef = doc(db, 'users', res.user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: res.user.uid,
          username: res.user.displayName || res.user.email?.split('@')[0] || 'User',
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
          <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">
            {profile?.username || user.email?.split('@')[0]}
          </p>
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
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="用户名" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-100"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-bold">
          <span className="bg-white px-2 text-zinc-400">或者</span>
        </div>
      </div>

      <button 
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full bg-white border border-zinc-200 text-zinc-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
      >
        <img src="https://www.gstatic.com/firebase/anonymous-scan.png" className="w-4 h-4 hidden" alt="" />
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        使用 Google 账号登录
      </button>
    </div>
  );
}
