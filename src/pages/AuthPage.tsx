import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, LogOut, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  // If already logged in, show Profile View
  if (user) {
    return (
      <div className="max-w-md mx-auto px-6 pt-10 pb-24">
        <div className="glass dark:glass-dark rounded-3xl p-8 text-center border border-slate-200/50 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-200 dark:border-brand-800 shadow-[0_0_20px_rgba(13,148,136,0.15)]">
            <User className="w-10 h-10 text-brand-600 dark:text-brand-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">My Profile</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium bg-slate-50 dark:bg-slate-800/50 py-2 rounded-lg break-all">
            {user.email}
          </p>

          <div className="space-y-4">
            <button 
              onClick={() => navigate('/inventory')}
              className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl shadow-glass transition-all flex items-center justify-center gap-2"
            >
              View My Tools
            </button>
            <button 
              onClick={signOut}
              className="w-full py-4 bg-white dark:bg-slate-800 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 border border-slate-200 dark:border-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Auth Form View
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // On success, redirect to inventory where sync occurs
        navigate('/inventory');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Welcome! Your account has been created.');
        navigate('/inventory');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'An error occurred during authentication.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-8 pb-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {isLogin 
            ? 'Sign in to sync your tools and repair plans across devices.' 
            : 'Join to instantly backup your tool inventory to the cloud safely.'}
        </p>
      </div>

      <div className="glass dark:glass-dark rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-lg relative overflow-hidden">
        {/* Decorative blur elements for modern feel */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-400/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10" />

        <form onSubmit={handleAuth} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={authLoading}
            className="w-full py-4 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-400 text-white font-bold text-lg rounded-2xl shadow-glass flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2 group"
          >
            {authLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Sign Up'}
                <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
            }}
            className="mt-2 text-brand-600 dark:text-brand-400 font-bold hover:underline"
          >
            {isLogin ? 'Create one now' : 'Sign in to existing'}
          </button>
        </div>
      </div>
    </div>
  );
}
