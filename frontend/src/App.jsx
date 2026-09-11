import React, { useState } from 'react';
import axios from 'axios';
import { Mic, Volume2, Globe, ShieldCheck, Play } from 'lucide-react';
import AvatarViewer from './components/AvatarViewer';

const API_BASE_URL = 'https://langtrans-backend.onrender.com';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState('mr-IN');
  const [translatedOutput, setTranslatedOutput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleTranslate = async () => {
    if (!inputText) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/api/translate`, {
        text: inputText,
        target_language: targetLang
      });
      const translated = res.data.translated_text;
      setTranslatedOutput(translated);
      speakText(translated, targetLang);
    } catch (err) {
      console.error('Translation Error:', err);
    }
  };

  const speakText = (text, langCode) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 px-6 py-4 flex justify-between items-center bg-slate-900/50 backdrop-blur">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-sky-400" />
          <h1 className="text-lg font-bold tracking-tight">AI Secure Real-Time Translator & 3D Lip-Sync Studio</h1>
        </div>
        <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-800/50">
          <ShieldCheck className="w-4 h-4" />
          <span>GDPR / NIST Secure Enclave</span>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto w-full">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">1. Input Speech / Text</h2>
            <textarea
              className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-sky-500 resize-none"
              placeholder="Speak or type text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition ${isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
            >
              <Mic className="w-4 h-4" />
              <span>{isRecording ? 'Listening...' : 'Record Mic'}</span>
            </button>
            <button
              onClick={handleTranslate}
              className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-sky-600/20 transition flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Translate & Sync</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-between shadow-xl relative overflow-hidden">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider w-full text-left">2. Real-Time 3D Human Lip-Sync</h2>
          <div className="w-full h-64 my-4">
            <AvatarViewer isSpeaking={isSpeaking} audioAmplitude={0.8} />
          </div>
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-sky-400 animate-bounce' : 'text-slate-600'}`} />
            <span>{isSpeaking ? 'Synthesizing Audio & Articulating Visemes...' : 'Idle - Ready for Translation'}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">3. Translation Output</h2>
              <select
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-slate-300 focus:outline-none"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                <option value="mr-IN">Marathi (mr-IN)</option>
                <option value="hi-IN">Hindi (hi-IN)</option>
                <option value="es-ES">Spanish (es-ES)</option>
                <option value="fr-FR">French (fr-FR)</option>
              </select>
            </div>
            <div className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sky-300 overflow-y-auto">
              {translatedOutput || <span className="text-slate-600 italic">Translated text will appear here...</span>}
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500 text-right">
            <span>Powered by Gemini & Three.js WebGL</span>
          </div>
        </div>
      </main>
    </div>
  );
}