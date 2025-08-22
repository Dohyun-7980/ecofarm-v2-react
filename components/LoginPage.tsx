
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // 수정된 경로
import { SparklesIcon } from './icons';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-base-200 rounded-lg shadow-lg">
        <div className="text-center">
          <SparklesIcon className="w-12 h-12 mx-auto text-secondary"/>
          <h1 className="text-3xl font-bold text-white mt-4">에코팜 v2.0 로그인</h1>
          <p className="text-gray-400">스마트팜 제어 시스템에 오신 것을 환영합니다.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-300 block mb-2">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-base-300 rounded-md border border-gray-600 focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
              placeholder="admin@ecofarm.io"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-bold text-gray-300 block mb-2"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-base-300 rounded-md border border-gray-600 focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/80 text-white font-bold rounded-md transition-colors disabled:bg-base-300"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
