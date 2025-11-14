'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface PomodoroSettings {
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  autoStartNext: boolean;
}

interface PomodoroState {
  isRunning: boolean;
  isPaused: boolean;
  currentPhase: 'work' | 'shortBreak' | 'longBreak';
  cycleCount: number;
  todayCount: number;
  endTime: number | null;
  remainingTime: number | null;
}

export default function PomodoroPage() {
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    autoStartNext: true,
  });

  const [state, setState] = useState<PomodoroState>({
    isRunning: false,
    isPaused: false,
    currentPhase: 'work',
    cycleCount: 0,
    todayCount: 0,
    endTime: null,
    remainingTime: null,
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    loadSettings();
    loadState();
    checkTodayCount();
    const interval = setInterval(() => checkTimer(), 1000);
    return () => clearInterval(interval);
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('pomodoroSettings');
    if (saved) {
      setSettings({ ...settings, ...JSON.parse(saved) });
    }
  };

  const loadState = () => {
    const saved = localStorage.getItem('pomodoroState');
    if (saved) {
      setState({ ...state, ...JSON.parse(saved) });
    }
  };

  const checkTodayCount = () => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('pomodoroLastDate');
    if (savedDate !== today) {
      setState((prev) => ({ ...prev, todayCount: 0 }));
      localStorage.setItem('pomodoroLastDate', today);
    }
  };

  const getCurrentPhaseDuration = () => {
    switch (state.currentPhase) {
      case 'work': return settings.workDuration;
      case 'shortBreak': return settings.shortBreak;
      case 'longBreak': return settings.longBreak;
      default: return settings.workDuration;
    }
  };

  const getPhaseText = () => {
    switch (state.currentPhase) {
      case 'work': return '工作中...';
      case 'shortBreak': return '短休息中...';
      case 'longBreak': return '长休息中...';
      default: return '准备开始';
    }
  };

  const getPhaseColor = () => {
    switch (state.currentPhase) {
      case 'work': return 'from-red-500 to-pink-500';
      case 'shortBreak': return 'from-green-500 to-emerald-500';
      case 'longBreak': return 'from-blue-500 to-cyan-500';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  const start = () => {
    if (state.isPaused) {
      resume();
    } else {
      setState((prev) => ({
        ...prev,
        isRunning: true,
        isPaused: false,
        endTime: Date.now() + (prev.remainingTime || getCurrentPhaseDuration() * 60 * 1000),
      }));
    }
  };

  const pause = () => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: true,
      remainingTime: prev.endTime ? prev.endTime - Date.now() : null,
    }));
  };

  const resume = () => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      endTime: Date.now() + (prev.remainingTime || 0),
      remainingTime: null,
    }));
  };

  const reset = () => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      endTime: null,
      remainingTime: null,
    }));
  };

  const checkTimer = () => {
    if (!state.isRunning || !state.endTime) return;

    const remaining = state.endTime - Date.now();

    if (remaining <= 0) {
      completePhase();
    }
  };

  const completePhase = () => {
    showCompletionNotification();
    playSound();

    setState((prev) => {
      let newCycleCount = prev.cycleCount;
      let nextPhase: 'work' | 'shortBreak' | 'longBreak' = 'work';
      let newTodayCount = prev.todayCount;

      if (prev.currentPhase === 'work') {
        newCycleCount++;
        newTodayCount++;
        nextPhase = newCycleCount % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
      } else {
        nextPhase = 'work';
      }

      return {
        ...prev,
        cycleCount: newCycleCount,
        todayCount: newTodayCount,
        currentPhase: nextPhase,
        endTime: null,
        remainingTime: null,
        isRunning: settings.autoStartNext,
        isPaused: false,
      };
    });
  };

  const showCompletionNotification = () => {
    const nextPhase = state.currentPhase === 'work'
      ? (state.cycleCount % settings.longBreakInterval === 0 ? '长休息' : '短休息')
      : '工作';

    setNotificationText(`✅ ${getPhaseText()} 完成！准备${nextPhase}`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const playSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const saveSettings = () => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    setShowSettings(false);
    setNotificationText('✅ 设置已保存');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  useEffect(() => {
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  const getDisplayTime = () => {
    let seconds: number;

    if (state.isRunning && state.endTime) {
      seconds = Math.ceil((state.endTime - Date.now()) / 1000);
    } else if (state.isPaused && state.remainingTime) {
      seconds = Math.ceil(state.remainingTime / 1000);
    } else {
      seconds = getCurrentPhaseDuration() * 60;
    }

    seconds = Math.max(0, seconds);

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTomatoIcons = () => {
    const count = state.cycleCount % settings.longBreakInterval;
    return '🍅'.repeat(Math.min(count, 6));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回工具列表</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black mb-4 text-gray-900 dark:text-white">
              🍅 番茄钟
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              高效专注工作法，提升你的生产力
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2"
            >
              <div className={`rounded-3xl bg-gradient-to-br ${getPhaseColor()} p-12 text-white text-center shadow-2xl`}>
                <div className="text-7xl md:text-8xl font-black mb-6 font-mono">
                  {getDisplayTime()}
                </div>
                <div className="text-2xl md:text-3xl font-semibold mb-4">
                  {getPhaseText()}
                </div>
                <div className="text-xl opacity-90">
                  第 <span className="font-bold">{state.cycleCount}</span> 个番茄
                </div>
                <div className="text-4xl mt-4">
                  {getTomatoIcons()}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center mt-6">
                {!state.isRunning && !state.isPaused && (
                  <button
                    onClick={start}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    开始
                  </button>
                )}
                {state.isRunning && (
                  <button
                    onClick={pause}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    暂停
                  </button>
                )}
                {state.isPaused && (
                  <button
                    onClick={resume}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    继续
                  </button>
                )}
                <button
                  onClick={reset}
                  className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  重置
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 border border-white/20">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">今日统计</div>
                <div className={`text-4xl font-bold bg-gradient-to-r ${getPhaseColor()} bg-clip-text text-transparent`}>
                  {state.todayCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">个番茄完成</div>
              </div>

              <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 border border-white/20">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">当前循环</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {state.cycleCount % settings.longBreakInterval}/{settings.longBreakInterval}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">距离长休息</div>
              </div>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                ⚙️ 设置
              </button>
            </motion.div>
          </div>

          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">个性化设置</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    工作时长（分钟）
                  </label>
                  <input
                    type="number"
                    value={settings.workDuration}
                    onChange={(e) => setSettings({ ...settings, workDuration: parseInt(e.target.value) || 25 })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    短休息（分钟）
                  </label>
                  <input
                    type="number"
                    value={settings.shortBreak}
                    onChange={(e) => setSettings({ ...settings, shortBreak: parseInt(e.target.value) || 5 })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    长休息（分钟）
                  </label>
                  <input
                    type="number"
                    value={settings.longBreak}
                    onChange={(e) => setSettings({ ...settings, longBreak: parseInt(e.target.value) || 15 })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    长休息间隔（番茄数）
                  </label>
                  <input
                    type="number"
                    value={settings.longBreakInterval}
                    onChange={(e) => setSettings({ ...settings, longBreakInterval: parseInt(e.target.value) || 4 })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="2"
                    max="10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  id="autoStart"
                  checked={settings.autoStartNext}
                  onChange={(e) => setSettings({ ...settings, autoStartNext: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="autoStart" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  自动开始下一个阶段
                </label>
              </div>
              <button
                onClick={saveSettings}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                保存设置
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {showNotification && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          className="fixed bottom-8 right-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 z-50"
        >
          {notificationText}
        </motion.div>
      )}
    </div>
  );
}
