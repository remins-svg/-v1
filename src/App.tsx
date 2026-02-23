/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Sparkles, Send, Loader2, BookOpen, Youtube, MessageSquare, ExternalLink, ChevronRight, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { generateContentStrategy } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateContentStrategy(topic);
      setResult(data);
    } catch (err) {
      setError('콘텐츠를 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">SNS Content Builder</h1>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-500">
            <span>Real-time Data</span>
            <ChevronRight className="w-4 h-4" />
            <span>Customer Pain Points</span>
            <ChevronRight className="w-4 h-4" />
            <span>Hooking Titles</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Input Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              고객의 고민에서 시작하는 <span className="text-indigo-600">콘텐츠 전략</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              서비스나 업종을 입력하면 실제 데이터를 기반으로 고객의 페인 포인트를 분석하고, 
              사람들의 시선을 사로잡는 제목과 콘텐츠 구성을 제안해 드립니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 퍼스널 트레이닝, 무인 카페 창업, 비건 화장품..."
                className="block w-full pl-11 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>생성하기</span>
              </button>
            </div>
          </form>
        </section>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <div className="grid grid-cols-1 gap-8">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-600" />
              </div>
              <p className="mt-6 text-slate-600 font-medium animate-pulse">
                실제 데이터를 분석하여 전략을 수립하고 있습니다...
              </p>
            </div>
          )}

          {!loading && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-slate-800">콘텐츠 전략 리포트</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>복사됨</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>결과 복사</span>
                        </>
                      )}
                    </button>
                    <div className="h-4 w-px bg-slate-200" />
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Generated by Gemini AI
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="markdown-body">
                    <Markdown>{result.text}</Markdown>
                  </div>
                </div>
              </div>

              {/* Sources */}
              {result.sources.length > 0 && (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    분석에 참고한 실제 데이터 출처
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.sources.map((source: any, idx: number) => (
                      <a
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white border border-indigo-100 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all group"
                      >
                        <div className="w-8 h-8 flex-shrink-0 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <span className="text-xs font-bold">{idx + 1}</span>
                        </div>
                        <span className="text-sm text-slate-600 font-medium truncate group-hover:text-indigo-600">
                          {source.title}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {!loading && !result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
              <FeatureCard
                icon={<MessageSquare className="w-6 h-6 text-indigo-600" />}
                title="실제 고객 고민 분석"
                description="커뮤니티와 검색 데이터를 기반으로 고객이 진짜 궁금해하는 문제를 찾아냅니다."
              />
              <FeatureCard
                icon={<Youtube className="w-6 h-6 text-red-600" />}
                title="채널별 맞춤 제목"
                description="블로그와 유튜브의 특성에 맞는 후킹한 제목 리스트를 제안합니다."
              />
              <FeatureCard
                icon={<BookOpen className="w-6 h-6 text-emerald-600" />}
                title="콘텐츠 구성 가이드"
                description="어떤 흐름으로 내용을 전개해야 설득력이 있을지 아웃라인을 잡아드립니다."
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} SNS Content Strategy Builder. Powered by Gemini 3 Flash.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
