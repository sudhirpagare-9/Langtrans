import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

const LANGUAGE_LIST = [
  { code: 'hi-IN', name: 'Hindi - हिन्दी (India)', group: 'Top Indian Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'mr-IN', name: 'Marathi - मराठी (India)', group: 'Top Indian Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'te-IN', name: 'Telugu - తెలుగు (India)', group: 'Top Indian Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'ta-IN', name: 'Tamil - தமிழ் (India)', group: 'Top Indian Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'bn-IN', name: 'Bengali - বাংলা (India/Bangladesh)', group: 'Top Indian Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'gu-IN', name: 'Gujarati - ગુજરાતી (India)', group: 'Top Indian Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'kn-IN', name: 'Kannada - ಕನ್ನಡ (India)', group: 'Top Indian Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'ml-IN', name: 'Malayalam - മലയാളം (India)', group: 'Top Indian Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'ur-IN', name: 'Urdu - اردو (India/Pakistan)', group: 'Top Indian Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'pa-IN', name: 'Punjabi - ਪੰਜਾਬੀ (India)', group: 'Top Indian Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'or-IN', name: 'Odia - ଓଡ଼ିଆ (India)', group: 'Top Indian Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'as-IN', name: 'Assamese - অসমীয়া (India)', group: 'Top Indian Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'ne-IN', name: 'Nepali - नेपाली (India/Nepal)', group: 'Top Indian Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'bho-IN', name: 'Bhojpuri - भोजपुरी (India)', group: 'Top Indian Languages', sttSupported: false, ttsStreamSupported: true },
  { code: 'mai-IN', name: 'Maithili - मैथिली (India)', group: 'Top Indian Languages', sttSupported: false, ttsStreamSupported: true },
  { code: 'sat-IN', name: 'Santali - संताली (India)', group: 'Top Indian Languages', sttSupported: false, ttsStreamSupported: false },
  { code: 'ks-IN', name: 'Kashmiri - कॉशुर (India)', group: 'Top Indian Languages', sttSupported: false, ttsStreamSupported: false },
  { code: 'kok-IN', name: 'Konkani - कोंकणी (India)', group: 'Top Indian Languages', sttSupported: false, ttsStreamSupported: true },
  { code: 'sd-IN', name: 'Sindhi - سنڌي (India/Pakistan)', group: 'Top Indian Languages', sttSupported: false, ttsStreamSupported: true },
  { code: 'doi-IN', name: 'Dogri - डोगरी (India)', group: 'Top Indian Languages', sttSupported: false, ttsStreamSupported: false },
  { code: 'sa-IN', name: 'Sanskrit - संस्कृतम् (India)', group: 'Top Indian Languages', sttSupported: false, ttsStreamSupported: true },
  { code: 'en-US', name: 'English (United States)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'zh-CN', name: 'Mandarin Chinese - 中文 (China)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'es-ES', name: 'Spanish - Español (Spain/LatAm)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'fr-FR', name: 'French - Français (France)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'ar-SA', name: 'Arabic - العربية (Saudi Arabia)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'pt-PT', name: 'Portuguese - Português (Portugal)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'da-DK', name: 'Danish - Dansk (Denmark)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'th-TH', name: 'Thai - ไทย (Thailand)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'ru-RU', name: 'Russian - Русский (Russia)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'id-ID', name: 'Indonesian - Bahasa Indonesia', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'de-DE', name: 'German - Deutsch (Germany)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'ja-JP', name: 'Japanese - 日本語 (Japan)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'tr-TR', name: 'Turkish - Türkçe (Turkey)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'vi-VN', name: 'Vietnamese - Tiếng Việt (Vietnam)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'ko-KR', name: 'Korean - 한국어 (South Korea)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true },
  { code: 'it-IT', name: 'Italian - Italiano (Italy)', group: 'Top World Languages', sttSupported: true, ttsStreamSupported: true }
];

// Helper to select native system voice matching gender and language
const getGenderFilteredVoice = (voices, langCode, gender) => {
  const targetIso = langCode.split('-')[0].toLowerCase();
  const langMatchVoices = voices.filter(v => 
    v.lang.toLowerCase() === langCode.toLowerCase() || 
    v.lang.toLowerCase().startsWith(targetIso)
  );

  if (langMatchVoices.length === 0) return null;

  const maleKeywords = ['male', 'david', 'george', 'mark', 'ravi', 'hemant', 'guy', 'stefan', 'pablo', 'google us english male'];
  const femaleKeywords = ['female', 'zira', 'hazel', 'heera', 'susan', 'catherine', 'aria', 'jenny', 'google हिन्दी'];

  const keywords = gender === 'male' ? maleKeywords : femaleKeywords;
  const matched = langMatchVoices.find(v => keywords.some(kw => v.name.toLowerCase().includes(kw)));

  return matched || langMatchVoices[0];
};

function FeatureStatusBanner({ type, langCode, availableVoices, gender }) {
  const langObj = LANGUAGE_LIST.find(l => l.code === langCode);
  const iso = langCode ? langCode.split('-')[0].toLowerCase() : '';

  if (type === 'input') {
    const isSTTSupported = langObj ? langObj.sttSupported : true;
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 8px',
        borderRadius: '6px',
        backgroundColor: isSTTSupported ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
        border: `1px solid ${isSTTSupported ? '#10b981' : '#ef4444'}`,
        fontSize: '0.72rem',
        fontWeight: '600',
        color: isSTTSupported ? '#34d399' : '#f87171',
        marginBottom: '6px'
      }}>
        <span>🎙️ Speech Recognition (STT):</span>
        <span>{isSTTSupported ? '✓ Live Recognition Active' : '⚠️ Limited Speech Support'}</span>
      </div>
    );
  } else {
    const hasNativeVoice = availableVoices.some(v => 
      v.lang.toLowerCase() === langCode.toLowerCase() || v.lang.toLowerCase().startsWith(iso)
    );
    const hasHDStream = langObj ? langObj.ttsStreamSupported : true;

    let statusText = '❌ Audio Unsupported';
    let statusColor = '#f87171';
    let bgColor = 'rgba(239, 68, 68, 0.12)';
    let borderClr = '#ef4444';

    if (hasNativeVoice) {
      statusText = `⚡ Native ${gender.toUpperCase()} Voice Active`;
      statusColor = '#34d399';
      bgColor = 'rgba(16, 185, 129, 0.12)';
      borderClr = '#10b981';
    } else if (hasHDStream) {
      statusText = `🌐 Neural ${gender.toUpperCase()} Audio Stream`;
      statusColor = '#38bdf8';
      bgColor = 'rgba(56, 189, 248, 0.12)';
      borderClr = '#0284c7';
    }

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 8px',
        borderRadius: '6px',
        backgroundColor: bgColor,
        border: `1px solid ${borderClr}`,
        fontSize: '0.72rem',
        fontWeight: '600',
        color: statusColor,
        marginBottom: '6px'
      }}>
        <span>🔊 Voice Synthesis (TTS):</span>
        <span>{statusText}</span>
      </div>
    );
  }
}

function SearchableLanguageDropdown({ selectedLang, onSelectLang, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const selectedObj = LANGUAGE_LIST.find(l => l.code === selectedLang);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = LANGUAGE_LIST.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      <label style={{ fontSize: '0.78rem', color: '#38bdf8', display: 'block', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', 
          padding: '10px 14px', 
          backgroundColor: '#0f172a', 
          color: '#f8fafc', 
          border: '1px solid #1e293b', 
          borderRadius: '8px', 
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
          fontSize: '0.85rem',
          minHeight: '40px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedObj ? selectedObj.name : 'Select Language...'}
        </span>
        <span style={{ fontSize: '0.7rem', color: '#38bdf8', marginLeft: '8px' }}>▼</span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '6px',
          backgroundColor: '#0f172a',
          border: '1px solid #38bdf8',
          borderRadius: '8px',
          zIndex: 1000,
          boxShadow: '0 12px 30px rgba(0,0,0,0.8)',
          maxHeight: '240px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '8px', borderBottom: '1px solid #1e293b' }}>
            <input 
              type="text"
              placeholder="🔍 Search language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#1e293b',
                color: '#fff',
                border: '1px solid #334155',
                borderRadius: '6px',
                fontSize: '0.82rem',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '180px' }}>
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map(lang => (
                <div
                  key={lang.code}
                  onClick={() => {
                    onSelectLang(lang.code);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    backgroundColor: lang.code === selectedLang ? '#1e293b' : 'transparent',
                    color: lang.code === selectedLang ? '#38bdf8' : '#e2e8f0',
                    borderBottom: '1px solid rgba(51, 65, 85, 0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = lang.code === selectedLang ? '#1e293b' : 'transparent'}
                >
                  {lang.name}
                </div>
              ))
            ) : (
              <div style={{ padding: '10px', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                No language found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [inputLang, setInputLang] = useState('hi-IN');
  const [outputLang, setOutputLang] = useState('mr-IN');
  const [inputGender, setInputGender] = useState('female');
  const [outputGender, setOutputGender] = useState('female');

  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [translation, setTranslation] = useState('Translated session history will appear here...');
  const [lastRawTranslation, setLastRawTranslation] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [micSensitivity, setMicSensitivity] = useState(75);
  const [audioLevel, setAudioLevel] = useState(0);

  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('langtrans_gemini_key') || '');
  const [showSettings, setShowSettings] = useState(false);

  const [autoSpeakOutput, setAutoSpeakOutput] = useState(true);
  const [replayVoiceEnabled, setReplayVoiceEnabled] = useState(true);

  const [dbLogs, setDbLogs] = useState([]);
  const [statusMsg, setStatusMsg] = useState('Ready. Real-time neural voice engine active.');
  const [availableVoices, setAvailableVoices] = useState([]);

  // React Refs for Mic & Speech Engine Recovery
  const mountRef = useRef(null);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const userStoppedRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const currentAudioRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const mouthMeshUpper = useRef(null);
  const mouthMeshLower = useRef(null);
  const transcriptScrollRef = useRef(null);
  const translationScrollRef = useRef(null);

  const inputLangRef = useRef(inputLang);
  const outputLangRef = useRef(outputLang);
  const inputGenderRef = useRef(inputGender);
  const outputGenderRef = useRef(outputGender);
  const autoSpeakOutputRef = useRef(autoSpeakOutput);
  const geminiApiKeyRef = useRef(geminiApiKey);

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastSpokenTextRef = useRef('');

  useEffect(() => { inputLangRef.current = inputLang; }, [inputLang]);
  useEffect(() => { outputLangRef.current = outputLang; }, [outputLang]);
  useEffect(() => { inputGenderRef.current = inputGender; }, [inputGender]);
  useEffect(() => { outputGenderRef.current = outputGender; }, [outputGender]);
  useEffect(() => { autoSpeakOutputRef.current = autoSpeakOutput; }, [autoSpeakOutput]);
  useEffect(() => { geminiApiKeyRef.current = geminiApiKey; }, [geminiApiKey]);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);

  useEffect(() => {
    if (transcriptScrollRef.current) {
      transcriptScrollRef.current.scrollTop = transcriptScrollRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  useEffect(() => {
    if (translationScrollRef.current) {
      translationScrollRef.current.scrollTop = translationScrollRef.current.scrollHeight;
    }
  }, [translation]);

  // Audio Visualizer Meter
  useEffect(() => {
    const initAudioMeter = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioCtxRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateLevel = () => {
          if (analyserRef.current && isListeningRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            const sensitivityMultiplier = (micSensitivity / 50);
            const rawPct = Math.min(100, Math.round((average / 128) * 100 * sensitivityMultiplier));
            setAudioLevel(rawPct);
          } else {
            setAudioLevel(0);
          }
          animFrameRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      } catch (err) {
        console.warn('Audio metering disabled:', err);
      }
    };

    if (isListening) {
      initAudioMeter();
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
      setAudioLevel(0);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, [isListening, micSensitivity]);

  // Voices auto loader
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const v = window.speechSynthesis.getVoices();
        setAvailableVoices(v);
      }
    };
    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
      setTimeout(updateVoices, 300);
    }
  }, []);

  // Load database logs
  useEffect(() => {
    try {
      const savedLogs = JSON.parse(localStorage.getItem('langtrans_db_logs') || '[]');
      setDbLogs(savedLogs);
    } catch (e) {
      console.error('Failed to load logs', e);
    }
  }, []);

  const saveToDatabase = useCallback((inputText, translatedText) => {
    const now = new Date();
    const currentInLang = inputLangRef.current;
    const currentOutLang = outputLangRef.current;

    const newLog = {
      id: Date.now(),
      input: inputText,
      output: translatedText,
      inputLang: currentInLang,
      outputLang: currentOutLang,
      inputGender: inputGenderRef.current,
      outputGender: outputGenderRef.current,
      timestampLocal: now.toLocaleString(),
      timestampUTC: now.toUTCString()
    };

    setDbLogs(prevLogs => {
      const updatedLogs = [newLog, ...prevLogs];
      try {
        localStorage.setItem('langtrans_db_logs', JSON.stringify(updatedLogs));
        const unicodeTextBuffer = updatedLogs.map(log => 
          `[${log.timestampLocal}] (${log.inputLang} - ${log.inputGender}): ${log.input}\n[${log.timestampLocal} / UTC ${log.timestampUTC}] (${log.outputLang} - ${log.outputGender}): ${log.output}\n---`
        ).join('\n');
        localStorage.setItem('langtrans_unicode_transcript_txt', unicodeTextBuffer);
      } catch (e) {
        console.error('Storage error', e);
      }
      return updatedLogs;
    });
  }, []);

  const handleClearSession = () => {
    setTranscript('');
    setInterimTranscript('');
    setTranslation('Translated session history will appear here...');
    setLastRawTranslation('');
    setStatusMsg('Session reset.');
  };

  const handleExportLogs = () => {
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      inputLanguage: inputLang,
      outputLanguage: outputLang,
      logs: dbLogs
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translation_session_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportUnicodeTxt = () => {
    const rawText = localStorage.getItem('langtrans_unicode_transcript_txt') || transcript;
    const unicodeBlob = new Blob(['\uFEFF' + rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(unicodeBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unicode_transcript_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 3D Lip-Sync Canvas
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070a12);

    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight1.position.set(2, 4, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 1.8);
    dirLight2.position.set(-2, -4, 3);
    scene.add(dirLight2);

    const lipMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      roughness: 0.18,
      metalness: 0.1,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95
    });

    const upperShape = new THREE.Shape();
    upperShape.moveTo(-1.6, 0);
    upperShape.quadraticCurveTo(-0.8, 0.8, 0, 0.2);
    upperShape.quadraticCurveTo(0.8, 0.8, 1.6, 0);
    upperShape.quadraticCurveTo(0, -0.4, -1.6, 0);

    const lowerShape = new THREE.Shape();
    lowerShape.moveTo(-1.5, -0.1);
    lowerShape.quadraticCurveTo(0, -0.9, 1.5, -0.1);
    lowerShape.quadraticCurveTo(0, -0.2, -1.5, -0.1);

    const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 0.18, bevelThickness: 0.18 };
    
    const upperGeo = new THREE.ExtrudeGeometry(upperShape, extrudeSettings);
    const lowerGeo = new THREE.ExtrudeGeometry(lowerShape, extrudeSettings);

    const upperLip = new THREE.Mesh(upperGeo, lipMaterial);
    upperLip.position.set(0, 0.3, 0);
    upperLip.rotation.x = 0.2;
    scene.add(upperLip);
    mouthMeshUpper.current = upperLip;

    const lowerLip = new THREE.Mesh(lowerGeo, lipMaterial);
    lowerLip.position.set(0, -0.3, 0);
    lowerLip.rotation.x = -0.1;
    scene.add(lowerLip);
    mouthMeshLower.current = lowerLip;

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (upperLip && lowerLip) {
        let speakFactor = 0;
        if (isSpeakingRef.current) {
          speakFactor = Math.sin(elapsedTime * 35) * 0.35 + Math.cos(elapsedTime * 22) * 0.18;
        } else if (isListeningRef.current) {
          speakFactor = Math.sin(elapsedTime * 8) * 0.05;
        } else {
          speakFactor = Math.sin(elapsedTime * 2) * 0.02;
        }
        upperLip.position.y = 0.3 + (speakFactor * 0.65);
        lowerLip.position.y = -0.3 - (speakFactor * 0.85);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount) {
        currentMount.innerHTML = '';
      }
    };
  }, []);

  // Neural Translation Engine
  const performTranslation = useCallback(async (text, fromLang, toLang) => {
    const cleanText = text.trim();
    if (!cleanText) return '';
    if (fromLang === toLang) return cleanText;

    const sourceIso = fromLang.split('-')[0];
    const targetIso = toLang.split('-')[0];
    const currentKey = geminiApiKeyRef.current;

    if (currentKey) {
      try {
        const targetLangObj = LANGUAGE_LIST.find(l => l.code === toLang);
        const targetLangName = targetLangObj ? targetLangObj.name : toLang;
        const sourceLangObj = LANGUAGE_LIST.find(l => l.code === fromLang);
        const sourceLangName = sourceLangObj ? sourceLangObj.name : fromLang;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${currentKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Translate accurately from ${sourceLangName} to ${targetLangName}. Return ONLY the final translated text.\n\nText: "${cleanText}"`
              }]
            }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (translated) return translated;
        }
      } catch (err) {
        console.warn('Gemini fallback:', err);
      }
    }

    try {
      const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceIso}&tl=${targetIso}&dt=t&q=${encodeURIComponent(cleanText)}`;
      const res = await fetch(gtxUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]) {
          const translated = data[0].map(item => item[0]).join('');
          if (translated) return translated;
        }
      }
    } catch (e) {
      console.warn('GTX translation fallback:', e);
    }

    return cleanText;
  }, []);

  // Online TTS Stream Engine
  const playOnlineTTSStream = useCallback((text, langCode, gender) => {
    return new Promise((resolve) => {
      try {
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
          currentAudioRef.current = null;
        }

        const iso = langCode.split('-')[0].toLowerCase();
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${iso}&client=tw-ob`;
        const audio = new Audio(ttsUrl);
        currentAudioRef.current = audio;

        // Apply pitch adjustment for gender tone
        audio.playbackRate = gender === 'male' ? 0.95 : 1.05;

        audio.onplay = () => {
          setIsSpeaking(true);
        };

        audio.onended = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
          resolve(true);
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
          resolve(false);
        };

        audio.play().catch(() => {
          setIsSpeaking(false);
          resolve(false);
        });
      } catch (e) {
        setIsSpeaking(false);
        resolve(false);
      }
    });
  }, []);

  // Multi-Tier Gender-Aware Speech Synthesis
  const speakOutputText = useCallback(async (textToSpeak, targetLang, gender = outputGenderRef.current) => {
    if (!textToSpeak || !textToSpeak.trim()) return;
    const cleanText = textToSpeak.trim();
    lastSpokenTextRef.current = cleanText;

    const voices = availableVoices.length > 0 ? availableVoices : (('speechSynthesis' in window) ? window.speechSynthesis.getVoices() : []);
    const matchedVoice = getGenderFilteredVoice(voices, targetLang, gender);

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = targetLang;
        
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        // Configure gender-specific pitch & rate tone dynamically
        if (gender === 'male') {
          utterance.pitch = 0.85;
          utterance.rate = 0.95;
        } else {
          utterance.pitch = 1.18;
          utterance.rate = 1.02;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = async () => {
          setIsSpeaking(false);
          await playOnlineTTSStream(cleanText, targetLang, gender);
        };

        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) {
        console.warn('SpeechSynthesis error, falling back to audio stream:', err);
      }
    }

    await playOnlineTTSStream(cleanText, targetLang, gender);
  }, [availableVoices, playOnlineTTSStream]);

  const handleTranslationAndSpeech = useCallback(async (text) => {
    if (!text || !text.trim()) return;
    const cleanedText = text.trim();
    const currentInLang = inputLangRef.current;
    const currentOutLang = outputLangRef.current;
    const currentOutGender = outputGenderRef.current;

    const translatedText = await performTranslation(cleanedText, currentInLang, currentOutLang);
    setLastRawTranslation(translatedText);

    const now = new Date();
    const timeTagLocal = now.toLocaleTimeString();
    const timeTagUTC = now.toUTCString().slice(17, 25);
    
    let formattedInputEntry = `[${timeTagLocal}] (${currentInLang} - ${inputGenderRef.current}): ${cleanedText}`;
    let formattedOutputEntry = `[${timeTagLocal} / UTC ${timeTagUTC}] (${currentOutLang} - ${currentOutGender}): ${translatedText}`;

    setTranscript(prev => prev ? `${prev}\n${formattedInputEntry}` : formattedInputEntry);
    setTranslation(prev => prev && !prev.includes('Translated session history') ? `${prev}\n${formattedOutputEntry}` : formattedOutputEntry);

    saveToDatabase(cleanedText, translatedText);

    if (autoSpeakOutputRef.current) {
      speakOutputText(translatedText, currentOutLang, currentOutGender);
    }
  }, [performTranslation, saveToDatabase, speakOutputText]);

  // Continuous Auto-Healing Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMsg('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = inputLang;

    recognition.onstart = () => {
      setIsListening(true);
      setStatusMsg('🎙️ Mic active & listening live...');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setInterimTranscript(interim);

      if (final) {
        setInterimTranscript('');
        handleTranslationAndSpeech(final.trim());
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition status notification:', event.error);
      if (!userStoppedRef.current && isListeningRef.current) {
        setStatusMsg('🔄 Mic auto-reconnecting...');
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          if (!userStoppedRef.current && recognitionRef.current) {
            try { 
              recognitionRef.current.abort();
              recognitionRef.current.start(); 
            } catch (e) {}
          }
        }, 250);
      }
    };

    recognition.onend = () => {
      if (!userStoppedRef.current && isListeningRef.current) {
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          if (!userStoppedRef.current && isListeningRef.current && recognitionRef.current) {
            try { recognitionRef.current.start(); } catch (e) {}
          }
        }, 150);
      } else {
        setIsListening(false);
        setStatusMsg('Microphone idle.');
      }
    };

    recognitionRef.current = recognition;
    userStoppedRef.current = false;
    isListeningRef.current = true;
    try { recognition.start(); } catch (e) { setIsListening(false); }

    return () => {
      userStoppedRef.current = true;
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [inputLang, handleTranslationAndSpeech]);

  const toggleMic = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }

    if (isListening) {
      userStoppedRef.current = true;
      setIsListening(false);
      isListeningRef.current = false;
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setStatusMsg('Mic stopped.');
    } else {
      userStoppedRef.current = false;
      setIsListening(true);
      isListeningRef.current = true;
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (e) {}
      }
      setStatusMsg('🎙️ Mic active & listening live...');
    }
  };

  const replayAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    if (replayVoiceEnabled && lastRawTranslation) {
      speakOutputText(lastRawTranslation, outputLang, outputGender);
    }
  };

  return (
    <div style={{ 
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", 
      backgroundColor: '#070a12', 
      color: '#f8fafc', 
      height: '100vh', 
      padding: '12px 16px', 
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      
      {/* Top Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #1e293b', 
        paddingBottom: '10px', 
        marginBottom: '10px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.2rem', 
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)' 
          }}>
            ⚡
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, background: 'linear-gradient(90deg, #38bdf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Vibrant AI Studio Real-Time Viseme Studio
            </h1>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Male/Female Voice Gender Selection • Auto-Healing Continuous Mic Stream</span>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', border: '1px solid #0284c7', padding: '5px 10px', borderRadius: '6px', fontWeight: '700', fontSize: '0.75rem' }}>
            💾 Storage Logs: {dbLogs.length}
          </span>
          <button onClick={() => setShowSettings(!showSettings)} style={{ backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.78rem' }}>
            ⚙️ API Key
          </button>
          <button onClick={handleExportUnicodeTxt} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '0.78rem' }}>
            📄 TXT (Unicode)
          </button>
          <button onClick={handleExportLogs} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '0.78rem' }}>
            📥 JSON
          </button>
          <button onClick={handleClearSession} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '0.78rem' }}>
            🗑️ Clear
          </button>
        </div>
      </header>

      {/* Settings Bar */}
      {showSettings && (
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '700' }}>Gemini API Key:</span>
          <input 
            type="password"
            placeholder="Paste Gemini API Key..."
            value={geminiApiKey}
            onChange={(e) => {
              setGeminiApiKey(e.target.value);
              localStorage.setItem('langtrans_gemini_key', e.target.value);
            }}
            style={{ flexGrow: 1, padding: '6px 10px', backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
          />
          <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>
      )}

      {/* Gain & Meter Bar */}
      <div style={{ 
        backgroundColor: '#0f172a', 
        border: '1px solid #1e293b', 
        borderRadius: '10px', 
        padding: '8px 14px', 
        marginBottom: '10px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        gap: '16px',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#38bdf8', whiteSpace: 'nowrap' }}>
            🎚️ Mic Sensitivity Gain: <span style={{ color: '#a78bfa' }}>{micSensitivity}%</span>
          </span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={micSensitivity} 
            onChange={(e) => setMicSensitivity(Number(e.target.value))}
            style={{ flexGrow: 1, accentColor: '#38bdf8', cursor: 'pointer', height: '6px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>Live Meter:</span>
          <div style={{ flexGrow: 1, height: '10px', backgroundColor: '#1e293b', borderRadius: '5px', overflow: 'hidden', border: '1px solid #334155' }}>
            <div style={{ 
              height: '100%', 
              width: `${audioLevel}%`, 
              background: audioLevel > 80 ? 'linear-gradient(90deg, #10b981, #ef4444)' : 'linear-gradient(90deg, #06b6d4, #10b981)',
              transition: 'width 0.05s ease-out'
            }} />
          </div>
          <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700', width: '28px', textAlign: 'right' }}>{audioLevel}%</span>
        </div>
      </div>

      {/* 3-Panel Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1.1fr 1fr', 
        gap: '12px', 
        flexGrow: 1, 
        overflow: 'hidden' 
      }}>
        
        {/* PANEL 1: Mic Speech Input */}
        <div style={{ 
          backgroundColor: '#0f172a', 
          padding: '14px', 
          borderRadius: '12px', 
          border: '1px solid #1e293b', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          overflow: 'hidden'
        }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#38bdf8', borderBottom: '1px solid #1e293b', paddingBottom: '6px', fontWeight: '700' }}>
            1. Speech Input Panel
          </h3>

          <FeatureStatusBanner type="input" langCode={inputLang} availableVoices={availableVoices} gender={inputGender} />
          
          <SearchableLanguageDropdown 
            label="Input Language (Mic)"
            selectedLang={inputLang}
            onSelectLang={setInputLang}
          />

          {/* Input Voice Gender Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#070a12', padding: '6px 10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>🎙️ Speaker Gender Tone:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setInputGender('female')}
                style={{
                  backgroundColor: inputGender === 'female' ? '#ec4899' : '#1e293b',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ♀ Female
              </button>
              <button
                onClick={() => setInputGender('male')}
                style={{
                  backgroundColor: inputGender === 'male' ? '#3b82f6' : '#1e293b',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ♂ Male
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: isListening ? '#10b981' : '#f87171', fontWeight: '600' }}>● {statusMsg}</span>
            <button 
              onClick={toggleMic} 
              style={{ 
                backgroundColor: isListening ? '#ef4444' : '#10b981', 
                color: '#fff', 
                border: 'none', 
                padding: '8px 14px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: '800', 
                fontSize: '0.8rem',
                boxShadow: isListening ? '0 0 12px rgba(239,68,68,0.4)' : '0 0 12px rgba(16,185,129,0.4)'
              }}
            >
              {isListening ? 'Stop Mic' : 'Start Mic'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: '600' }}>Live Speech Log</label>
            <div 
              ref={transcriptScrollRef}
              style={{ 
                width: '100%', 
                flexGrow: 1, 
                backgroundColor: '#070a12', 
                color: '#f8fafc', 
                border: '1px solid #1e293b', 
                borderRadius: '8px', 
                padding: '10px', 
                boxSizing: 'border-box', 
                overflowY: 'auto', 
                whiteSpace: 'pre-wrap', 
                fontSize: '0.82rem',
                lineHeight: '1.4'
              }}
            >
              {transcript || 'Speech transcripts append here in real-time...'}
              {interimTranscript && (
                <span style={{ color: '#38bdf8', fontStyle: 'italic', display: 'block', marginTop: '4px' }}>
                  💬 Listening: {interimTranscript}...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* PANEL 2: 3D Lip Viseme Mesh */}
        <div style={{ 
          backgroundColor: '#0f172a', 
          padding: '14px', 
          borderRadius: '12px', 
          border: '1px solid #1e293b', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#38bdf8', fontWeight: '700' }}>2. 3D Lip-Sync Viseme Studio</h3>
            <span style={{ fontSize: '0.68rem', backgroundColor: '#1e293b', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>Three.js WebGL</span>
          </div>

          <div ref={mountRef} style={{ width: '100%', flexGrow: 1, backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', margin: '4px 0' }} />

          <div style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center', paddingTop: '4px' }}>
            Real-time lip animation synced to selected voice & tone
          </div>
        </div>

        {/* PANEL 3: Translation & Output Voice Controls */}
        <div style={{ 
          backgroundColor: '#0f172a', 
          padding: '14px', 
          borderRadius: '12px', 
          border: '1px solid #1e293b', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          overflow: 'hidden'
        }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#38bdf8', borderBottom: '1px solid #1e293b', paddingBottom: '6px', fontWeight: '700' }}>
            3. Translation Output Panel
          </h3>

          <FeatureStatusBanner type="output" langCode={outputLang} availableVoices={availableVoices} gender={outputGender} />

          <SearchableLanguageDropdown 
            label="Target Language (Output)"
            selectedLang={outputLang}
            onSelectLang={setOutputLang}
          />

          {/* Output Voice Gender Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#070a12', padding: '6px 10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>🔊 Output Voice Gender:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setOutputGender('female')}
                style={{
                  backgroundColor: outputGender === 'female' ? '#ec4899' : '#1e293b',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ♀ Female Voice
              </button>
              <button
                onClick={() => setOutputGender('male')}
                style={{
                  backgroundColor: outputGender === 'male' ? '#3b82f6' : '#1e293b',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ♂ Male Voice
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#070a12', padding: '6px 8px', borderRadius: '6px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Replay Voice</span>
              <button 
                onClick={() => setReplayVoiceEnabled(!replayVoiceEnabled)}
                style={{ backgroundColor: replayVoiceEnabled ? '#10b981' : '#ef4444', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '700' }}
              >
                {replayVoiceEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#070a12', padding: '6px 8px', borderRadius: '6px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Auto Speak</span>
              <button 
                onClick={() => setAutoSpeakOutput(!autoSpeakOutput)}
                style={{ backgroundColor: autoSpeakOutput ? '#10b981' : '#ef4444', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '700' }}
              >
                {autoSpeakOutput ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <button 
            onClick={replayAudio} 
            disabled={!replayVoiceEnabled}
            style={{ width: '100%', backgroundColor: replayVoiceEnabled ? '#0284c7' : '#334155', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: replayVoiceEnabled ? 'pointer' : 'not-allowed', fontSize: '0.8rem', fontWeight: '700' }}
          >
            🔊 Replay Output Audio ({outputGender.toUpperCase()})
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: '600' }}>Translation Log</label>
            <div 
              ref={translationScrollRef}
              style={{ 
                width: '100%', 
                flexGrow: 1, 
                backgroundColor: '#070a12', 
                color: '#f8fafc', 
                border: '1px solid #1e293b', 
                borderRadius: '8px', 
                padding: '10px', 
                boxSizing: 'border-box', 
                overflowY: 'auto', 
                whiteSpace: 'pre-wrap', 
                fontSize: '0.82rem',
                lineHeight: '1.4'
              }}
            >
              {translation}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
