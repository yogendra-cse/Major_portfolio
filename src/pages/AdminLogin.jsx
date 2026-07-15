import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Redirect if already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/admin/check-auth');
          if (res.data.success) {
            navigate('/admin');
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };
    checkAuthStatus();
  }, [navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/admin/login', data);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        toast.success(`Welcome back, ${res.data.admin.name}!`);
        navigate('/admin');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-800 relative">
      {/* Decorative gradient overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-600/5 blur-[90px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-mono text-blue-600 hover:text-blue-500 transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO PORTFOLIO
        </button>

        <div className="glass-panel p-8 rounded-2xl border border-slate-200/60 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 mb-4">
              <ShieldAlert size={24} />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-slate-800">Admin Gate</h1>
            <p className="text-xs font-mono text-slate-500 mt-2">SECURE PORTAL ACCESS REQUIREMENT</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1.5" htmlFor="username">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-colors text-sm font-sans text-slate-800"
                placeholder="Enter admin username"
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && (
                <p className="text-red-600 text-xs font-mono mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1.5" htmlFor="password">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-colors text-sm font-sans text-slate-800"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className="text-red-600 text-xs font-mono mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-display font-medium text-sm text-white rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                'ENTER DASHBOARD'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-[10px] font-mono text-slate-500">
            SECURE SHA256 / JWT HANDSHAKES ENABLED
          </div>
        </div>
      </div>
    </div>
  );
}
