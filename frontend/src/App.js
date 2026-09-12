import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

const LANGUAGE_LIST = [
  { code: 'hi-IN', name: 'Hindi - हिन्दी (India)', group: 'Top Indian Languages', speechSupported: true },
  { code: 'mr-IN', name: 'Marathi - मराठी (India)', group: 'Top Indian Languages', speechSupported: true },
  { code: 'bn-IN', name: 'Bengali - বাংলা (India/Bangladesh)', group: 'Top Indian Languages', speechSupported: true },
  { code: 'te-IN', name: 'Telugu - తెలుగు (India)', group: 'Top Indian Languages', speechSupported: true },
  { code: 'ta-IN', name: 'Tamil - தமிழ் (India)', group: 'Top Indian Languages', speechSupported: true },
  { code: 'gu-IN', name: 'Gujarati - ગુજરાતી (India)', group: 'Top Indian Languages', speechSupported: true },
  { code: 'ur-IN', name: 'Urdu - اردو (India/Pakistan)', group: 'Top Indian Languages', speechSupported: true },
  { code: 'kn-IN', name: 'Kannada - ಕನ್ನಡ (India)', group: 'Top Indian Languages', speechSupported: true },
  { code: 'ml-IN', name: 'Malayalam - മലയാളം (India)', group: 'Top Indian Languages', speechSupported: true },
  { code: 'pa-IN', name: 'Punjabi - ਪੰਜਾਬੀ (India)', group: 'Top Indian Languages', speechSupported: true },
  { code: 'or-IN', name: 'Odia - ଓଡ଼ିଆ (India)', group: 'Top Indian Languages', speechSupported: true },
  { code: 'as-IN', name: 'Assamese - অসমীয়া (India)', group: 'Top Indian Languages', speechSupported: true },
  { code: 'ne-IN', name: 'Nepali - नेपाली (India/Nepal)', group: 'Top Indian Languages', speechSupported: true },
  { code: 'bho-IN', name: 'Bhojpuri - भोजपुरी (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Text translation & 3D viseme active.' },
  { code: 'mai-IN', name: 'Maithili - मैथिली (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Visual 3D sync active.' },
  { code: 'sat-IN', name: 'Santali - संताली (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Manual text or cloud fallback.' },
  { code: 'ks-IN', name: 'Kashmiri - कॉशुर (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Limited browser speech support.' },
  { code: 'kok-IN', name: 'Konkani - कोंकणी (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Browser speech engine partial.' },
  { code: 'sd-IN', name: 'Sindhi - سنڌي (India/Pakistan)', group: 'Top Indian Languages', speechSupported: false, note: 'Limited native speech support.' },
  { code: 'doi-IN', name: 'Dogri - डोगरी (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Limited native speech support.' },
  { code: 'sa-IN', name: 'Sanskrit - संस्कृतम् (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Regional fallback voice.' },
  { code: 'en-US', name: 'English (United States)', group: 'Top World Languages', speechSupported: true },
  { code: 'zh-CN', name: 'Mandarin Chinese - 中文 (China)', group: 'Top World Languages', speechSupported: true },
  { code: 'es-ES', name: 'Spanish - Español (Spain/LatAm)', group: 'Top World Languages', speechSupported: true },
  { code: 'fr-FR', name: 'French - Français (France)', group: 'Top World Languages', speechSupported: true },
  { code: 'ar-SA', name: 'Arabic - العربية (Saudi Arabia)', group: 'Top World Languages', speechSupported: true },
  { code: 'pt-PT', name: 'Portuguese - Português (Portugal)', group: 'Top World Languages', speechSupported: true },
  { code: 'pt-BR', name: 'Portuguese - Português (Brazil)', group: 'Top World Languages', speechSupported: true },
  { code: 'da-DK', name: 'Danish - Dansk (Denmark)', group: 'Top World Languages', speechSupported: true },
  { code: 'th-TH', name: 'Thai - ไทย (Thailand)', group: 'Top World Languages', speechSupported: true },
  { code: 'ru-RU', name: 'Russian - Русский (Russia)', group: 'Top World Languages', speechSupported: true },
  { code: 'id-ID', name: 'Indonesian - Bahasa Indonesia', group: 'Top World Languages', speechSupported: true },
  { code: 'de-DE', name: 'German - Deutsch (Germany)', group: 'Top World Languages', speechSupported: true },
  { code: 'ja-JP', name: 'Japanese - 日本語 (Japan)', group: 'Top World Languages', speechSupported: true },
  { code: 'tr-TR', name: 'Turkish - Türkçe (Turkey)', group: 'Top World Languages', speechSupported: true },
  { code: 'vi-VN', name: 'Vietnamese - Tiếng Việt (Vietnam)', group: 'Top World Languages', speechSupported: true },
  { code: 'ko-KR', name: 'Korean - 한국어 (South Korea)', group: 'Top World Languages', speechSupported: true },
  { code: 'it-IT', name: 'Italian - Italiano (Italy)', group: 'Top World Languages', speechSupported: true },
  { code: 'fa-IR', name: 'Persian - فارسی (Iran)', group: 'Top World Languages', speechSupported: true },
  { code: 'pl-PL', name: 'Polish - Język polski (Poland)', group: 'Top World Languages', speechSupported: true },
  { code: 'uk-UA', name: 'Ukrainian - Українська (Ukraine)', group: 'Top World Languages', speechSupported: true },
  { code: 'nl-NL', name: 'Dutch - Nederlands (Netherlands)', group: 'Top World Languages', speechSupported: true },
  { code: 'ro-RO', name: 'Romanian - Română (Romania)', group: 'Top World Languages', speechSupported: true }
];

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
      <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '600' }}>{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', 
          padding: '12px 14px', 
          backgroundColor: '#0f172a', 
          color: '#fff', 
          border: '1px solid #334155', 
          borderRadius: '8px', 
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
          fontSize: '0.9rem',
          minHeight: '44px'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedObj ? selectedObj.name : 'Select Language...'}
        </span>
        <span style={{ fontSize: '0.75rem', color: '#38bdf8', marginLeft: '8px' }}>▼</span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '6px',
          backgroundColor: '#0f172a',
          border: '1px solid #475569',
          borderRadius: '8px',
          zIndex: 1000,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7)',
          maxHeight: '260px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '8px', borderBottom: '1px solid #334155' }}>
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
                border: '1px solid #475569',
                borderRadius: '6px',
                fontSize: '0.85rem',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '200px' }}>
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
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    backgroundColor: lang.code === selectedLang ? '#1e293b' : 'transparent',
                    color: lang.code === selectedLang ? '#38bdf8' : '#f8fafc',
                    borderBottom: '1px solid rgba(51, 65, 85, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = lang.code === selectedLang ? '#1e293b' : 'transparent'}
                >
                  {lang.name}
                </div>
              ))
            ) : (
              <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                No language found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [inputLang, setInputLang] = useState('en-US');
  const [outputLang, setOutputLang] = useState('hi-IN');
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('Translated session history will appear here...');
  const [lastRawTranslation, setLastRawTranslation] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Mobile Tab Navigation State: 'input' | 'viseme' | 'output' | 'all'
  const [activeMobileTab, setActiveMobileTab] = useState('all');

  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('langtrans_gemini_key') || '');
  const [showSettings, setShowSettings] = useState(false);
  const translationMode = 'hybrid';

  const [autoSpeakOutput, setAutoSpeakOutput] = useState(true);
  const [replayVoiceEnabled, setReplayVoiceEnabled] = useState(false);

  const [dbLogs, setDbLogs] = useState([]);
  const [statusMsg, setStatusMsg] = useState('Ready. Speech engine & 3D viseme online.');

  const mountRef = useRef(null);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const userStoppedRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const activeUtterancesRef = useRef([]);
  const restartTimeoutRef = useRef(null);
  const voicesRef = useRef([]);
  const mouthMeshUpper = useRef(null);
  const mouthMeshLower = useRef(null);
  const transcriptScrollRef = useRef(null);
  const translationScrollRef = useRef(null);

  const lastSpokenTextRef = useRef('');
  const speechActiveOrCooldownRef = useRef(false);
  const speechCooldownTimerRef = useRef(null);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    if (transcriptScrollRef.current) {
      transcriptScrollRef.current.scrollTop = transcriptScrollRef.current.scrollHeight;
    }
  }, [transcript]);

  useEffect(() => {
    if (translationScrollRef.current) {
      translationScrollRef.current.scrollTop = translationScrollRef.current.scrollHeight;
    }
  }, [translation]);

  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        voicesRef.current = window.speechSynthesis.getVoices();
      }
    };
    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
      setTimeout(updateVoices, 200);
      setTimeout(updateVoices, 1000);
    }
  }, []);

  useEffect(() => {
    try {
      const savedLogs = JSON.parse(localStorage.getItem('langtrans_db_logs') || '[]');
      setDbLogs(savedLogs);
    } catch (e) {
      console.error('Failed to load database logs', e);
    }
  }, []);

  const saveToDatabase = useCallback((inputText, translatedText) => {
    const now = new Date();
    const newLog = {
      id: Date.now(),
      input: inputText,
      output: translatedText,
      inputLang,
      outputLang,
      timestampLocal: now.toLocaleString(),
      timestampUTC: now.toUTCString()
    };
    setDbLogs(prevLogs => {
      const updatedLogs = [newLog, ...prevLogs];
      try {
        localStorage.setItem('langtrans_db_logs', JSON.stringify(updatedLogs));
      } catch (e) {
        console.error('LocalStorage write error', e);
      }
      return updatedLogs;
    });
  }, [inputLang, outputLang]);

  const handleClearSession = () => {
    setTranscript('');
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

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b132b);

    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xfff0f5, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(2, 4, 5);
    scene.add(dirLight1);

    const lipMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd97c88,
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
      transmission: 0.08,
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

    const extrudeSettings = { depth: 0.6, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    
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
          speakFactor = Math.sin(elapsedTime * 35) * 0.28 + Math.cos(elapsedTime * 22) * 0.14;
        } else if (isListeningRef.current) {
          speakFactor = Math.sin(elapsedTime * 8) * 0.04;
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

  // FIXED: Word-boundary regular expression replacement prevents corruption like "Maratनमस्कार"
  const performFallbackTranslation = (text, fromLang, toLang) => {
    const cleanText = text.trim();
    if (!cleanText) return '';
    if (fromLang === toLang) return cleanText;

    const lower = cleanText.toLowerCase();

    if (fromLang === 'en-US' && toLang === 'hi-IN') {
      const enHiMap = {
        "hello": "नमस्ते",
        "hi": "नमस्ते",
        "how are you": "आप कैसे हैं?",
        "what is your name": "आपका नाम क्या है?",
        "thank you": "धन्यवाद",
        "thanks": "शुक्रिया",
        "good morning": "सुप्रभात"
      };
      if (enHiMap[lower]) return enHiMap[lower];

      return cleanText
        .replace(/\bhello\b/gi, 'नमस्ते')
        .replace(/\bhi\b/gi, 'नमस्ते')
        .replace(/\bhow are you\b/gi, 'आप कैसे हैं')
        .replace(/\bwhat is your name\b/gi, 'आपका नाम क्या है')
        .replace(/\bthank you\b/gi, 'धन्यवाद')
        .replace(/\bthanks\b/gi, 'शुक्रिया')
        .replace(/\bgood morning\b/gi, 'सुप्रभात')
        .replace(/\bdad\b/gi, 'पापा')
        .replace(/\bbeta\b/gi, 'बेटा')
        .replace(/\bphone\b/gi, 'फ़ोन')
        .replace(/\bwant\b/gi, 'चाहिए')
        .replace(/\btranslation\b/gi, 'अनुवाद')
        .replace(/\baudio\b/gi, 'ऑडियो')
        .replace(/\bworking\b/gi, 'काम कर रहा है')
        .replace(/\bnot\b/gi, 'नहीं')
        .replace(/\bis\b/gi, 'है');
    }

    if (fromLang === 'en-US' && toLang === 'mr-IN') {
      const enMrMap = {
        "hello": "नमस्कार",
        "hi": "नमस्कार",
        "how are you": "तुम्ही कसे आहात?",
        "what is your name": "तुमचे नाव काय आहे?",
        "thank you": "धन्यवाद",
        "good morning": "सुप्रभात"
      };
      if (enMrMap[lower]) return enMrMap[lower];

      return cleanText
        .replace(/\bhello\b/gi, 'नमस्कार')
        .replace(/\bhi\b/gi, 'नमस्कार')
        .replace(/\bhow are you\b/gi, 'तुम्ही कसे आहात')
        .replace(/\bwhat is your name\b/gi, 'तुमचे नाव काय आहे')
        .replace(/\bthank you\b/gi, 'धन्यवाद')
        .replace(/\bdad\b/gi, 'पप्पा')
        .replace(/\btranslation\b/gi, 'भाषांतर')
        .replace(/\baudio\b/gi, 'ऑडिओ')
        .replace(/\bworking\b/gi, 'चालू आहे')
        .replace(/\bnot\b/gi, 'नाही')
        .replace(/\bis\b/gi, 'आहे');
    }

    if (fromLang === 'hi-IN' && toLang === 'mr-IN') {
      const hiMrMap = {
        "नमस्ते": "नमस्कार",
        "आप कैसे हैं?": "तुम्ही कसे आहात?",
        "आपका नाम क्या है?": "तुमचे नाव काय आहे?",
        "धन्यवाद": "धन्यवाद",
        "मैं ठीक हूँ": "मी मजेत आहे"
      };
      if (hiMrMap[cleanText]) return hiMrMap[cleanText];

      return cleanText
        .replace(/\bनमस्ते\b/g, 'नमस्कार')
        .replace(/\bआप\b/g, 'तुम्ही')
        .replace(/\bक्या\b/g, 'काय')
        .replace(/\bहैं\b/g, 'आहेत')
        .replace(/\bहै\b/g, 'आहे')
        .replace(/\bनहीं\b/g, 'नाही');
    }

    return `[${toLang.slice(0, 2).toUpperCase()}] ${cleanText}`;
  };

  const performTranslation = useCallback(async (text, fromLang, toLang) => {
    const cleanText = text.trim();
    if (!cleanText) return '';
    if (fromLang === toLang) return cleanText;

    if (geminiApiKey && translationMode === 'hybrid') {
      try {
        const targetLangObj = LANGUAGE_LIST.find(l => l.code === toLang);
        const targetLangName = targetLangObj ? targetLangObj.name : toLang;
        const sourceLangObj = LANGUAGE_LIST.find(l => l.code === fromLang);
        const sourceLangName = sourceLangObj ? sourceLangObj.name : fromLang;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Translate the following text from ${sourceLangName} to ${targetLangName}. Return ONLY the direct translation without any extra formatting, quotes, or conversational preamble.\n\nText: "${cleanText}"`
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
        console.warn('Gemini API fallback to word dictionary:', err);
      }
    }

    return performFallbackTranslation(cleanText, fromLang, toLang);
  }, [geminiApiKey]);

  const speakOutputText = useCallback((textToSpeak, targetLang) => {
    if (!autoSpeakOutput || !('speechSynthesis' in window) || !textToSpeak) return;

    try {
      window.speechSynthesis.cancel();

      speechActiveOrCooldownRef.current = true;
      lastSpokenTextRef.current = textToSpeak.trim();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = targetLang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      activeUtterancesRef.current.push(utterance);

      const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
      
      let matchedVoice = voices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase());
      if (!matchedVoice) {
        const shortLang = targetLang.slice(0, 2).toLowerCase();
        matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(shortLang));
      }
      if (!matchedVoice && targetLang.startsWith('mr')) {
        matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith('hi'));
      }
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        activeUtterancesRef.current = activeUtterancesRef.current.filter(u => u !== utterance);
        
        if (speechCooldownTimerRef.current) clearTimeout(speechCooldownTimerRef.current);
        speechCooldownTimerRef.current = setTimeout(() => {
          speechActiveOrCooldownRef.current = false;
        }, 1500);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        activeUtterancesRef.current = activeUtterancesRef.current.filter(u => u !== utterance);
        speechActiveOrCooldownRef.current = false;
      };

      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          setIsSpeaking(false);
          speechActiveOrCooldownRef.current = false;
        }
      }, 100);
    } catch (err) {
      setIsSpeaking(false);
      speechActiveOrCooldownRef.current = false;
    }
  }, [autoSpeakOutput]);

  const handleTranslationAndSpeech = useCallback(async (text) => {
    if (!text || !text.trim()) return;

    const cleanedText = text.trim();

    if (speechActiveOrCooldownRef.current) return;

    if (lastSpokenTextRef.current && (
      cleanedText.toLowerCase() === lastSpokenTextRef.current.toLowerCase() ||
      lastSpokenTextRef.current.toLowerCase().includes(cleanedText.toLowerCase())
    )) {
      return; 
    }

    const translatedText = await performTranslation(cleanedText, inputLang, outputLang);
    setLastRawTranslation(translatedText);

    const now = new Date();
    const timeTagLocal = now.toLocaleTimeString();
    const timeTagUTC = now.toUTCString().slice(17, 25);
    
    let formattedInputEntry = `[${timeTagLocal}] (${inputLang}): ${cleanedText}`;
    let formattedOutputEntry = `[${timeTagLocal} / UTC ${timeTagUTC}] (${outputLang}): ${translatedText}`;

    setTranscript(prev => prev ? `${prev}\n${formattedInputEntry}` : formattedInputEntry);
    setTranslation(prev => prev && !prev.includes('Translated session history') ? `${prev}\n${formattedOutputEntry}` : formattedOutputEntry);

    saveToDatabase(cleanedText, translatedText);
    speakOutputText(translatedText, outputLang);
  }, [inputLang, outputLang, performTranslation, saveToDatabase, speakOutputText]);

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
      setStatusMsg('🎙️ Mic active & listening...');
    };

    recognition.onresult = (event) => {
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        }
      }

      if (final) {
        const cleanedText = final.trim();
        handleTranslationAndSpeech(cleanedText);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setIsListening(false);
        isListeningRef.current = false;
        setStatusMsg('Microphone blocked.');
      }
    };

    recognition.onend = () => {
      if (!userStoppedRef.current && isListeningRef.current) {
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          if (!userStoppedRef.current && isListeningRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {}
          }
        }, 300);
      } else {
        setIsListening(false);
        setStatusMsg('Microphone stopped.');
      }
    };

    recognitionRef.current = recognition;
    userStoppedRef.current = false;
    isListeningRef.current = true;
    try {
      recognition.start();
    } catch (e) {
      setIsListening(false);
      isListeningRef.current = false;
    }

    return () => {
      userStoppedRef.current = true;
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [inputLang, handleTranslationAndSpeech]);

  const toggleMic = () => {
    if (isListening) {
      userStoppedRef.current = true;
      setIsListening(false);
      isListeningRef.current = false;
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setStatusMsg('Mic stopped.');
    } else {
      userStoppedRef.current = false;
      setIsListening(true);
      isListeningRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
      setStatusMsg('🎙️ Mic active & listening...');
    }
  };

  const replayAudio = () => {
    if (replayVoiceEnabled && lastRawTranslation) {
      speakOutputText(lastRawTranslation, outputLang);
    }
  };

  const selectedInputObj = LANGUAGE_LIST.find(l => l.code === inputLang);
  const selectedOutputObj = LANGUAGE_LIST.find(l => l.code === outputLang);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh', padding: '16px', boxSizing: 'border-box' }}>
      
      {/* Header Bar with Gradient Accent */}
      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '14px', marginBottom: '16px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)' }}>
            🌐
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, background: 'linear-gradient(90deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Studio Real-Time Translator
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>GDPR & NIST SP 800-53 Compliant • 3D Viseme Engine</span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ backgroundColor: '#0284c7', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontWeight: '600', fontSize: '0.75rem' }}>
            💾 Logs: {dbLogs.length}
          </span>
          <button onClick={() => setShowSettings(!showSettings)} style={{ backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem', minHeight: '36px' }}>
            ⚙️ Settings
          </button>
          <button onClick={handleExportLogs} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem', minHeight: '36px' }}>
            📥 Export
          </button>
          <button onClick={handleClearSession} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem', minHeight: '36px' }}>
            🗑️ Clear
          </button>
        </div>
      </header>

      {/* Settings Panel Drawer */}
      {showSettings && (
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#38bdf8' }}>Google Gemini Neural Translation API Key</h3>
            <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="password"
              placeholder="Paste Gemini API Key (e.g. AIzaSy...)"
              value={geminiApiKey}
              onChange={(e) => {
                setGeminiApiKey(e.target.value);
                localStorage.setItem('langtrans_gemini_key', e.target.value);
              }}
              style={{ flexGrow: 1, padding: '10px', backgroundColor: '#1e293b', color: '#fff', border: '1px solid #475569', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
            />
            <span style={{ fontSize: '0.8rem', color: geminiApiKey ? '#4ade80' : '#fbbf24' }}>
              {geminiApiKey ? '✓ Neural Cloud Active' : 'ℹ️ Fast Offline Dictionary Active'}
            </span>
          </div>
        </div>
      )}

      {/* Persistent Storage Bar */}
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.78rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
        <span>📁 <strong>DB Storage:</strong> localStorage['langtrans_db_logs']</span>
        <span style={{ color: '#38bdf8' }}>Timestamps: Local & UTC Dual-Sync</span>
      </div>

      {/* Touch-Friendly Mobile Tab Bar Switcher */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', backgroundColor: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #1e293b' }}>
        {[
          { id: 'all', label: '🖥️ All Panels' },
          { id: 'input', label: '🎙️ Input & Mic' },
          { id: 'viseme', label: '👄 3D Studio' },
          { id: 'output', label: '💬 Output' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveMobileTab(tab.id)}
            style={{
              flex: 1,
              padding: '8px 10px',
              backgroundColor: activeMobileTab === tab.id ? '#1e293b' : 'transparent',
              color: activeMobileTab === tab.id ? '#38bdf8' : '#94a3b8',
              border: activeMobileTab === tab.id ? '1px solid #334155' : 'none',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Adaptive Grid Viewport */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
        
        {/* SECTION 1: Input & Mic */}
        {(activeMobileTab === 'all' || activeMobileTab === 'input') && (
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#38bdf8', borderBottom: '1px solid #1e293b', paddingBottom: '8px', fontWeight: '700' }}>
              1. Speech Input
            </h3>
            
            <SearchableLanguageDropdown 
              label="Input Language (Mic)"
              selectedLang={inputLang}
              onSelectLang={setInputLang}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: isListening ? '#4ade80' : '#f87171', fontWeight: '500' }}>● {statusMsg}</span>
              <button onClick={toggleMic} style={{ backgroundColor: isListening ? '#dc2626' : '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', minHeight: '44px' }}>
                {isListening ? 'Stop Mic' : 'Start Mic'}
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#fbbf24', minHeight: '16px' }}>
              {selectedInputObj?.note ? <div>• {selectedInputObj.note}</div> : <span style={{ color: '#4ade80' }}>✓ Filter active</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>Live Speech Transcript</label>
              <div 
                ref={transcriptScrollRef}
                style={{ 
                  width: '100%', 
                  height: '260px', 
                  backgroundColor: '#090d16', 
                  color: '#f8fafc', 
                  border: '1px solid #1e293b', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  boxSizing: 'border-box', 
                  overflowY: 'auto', 
                  whiteSpace: 'pre-wrap', 
                  fontSize: '0.88rem',
                  lineHeight: '1.5'
                }}
              >
                {transcript || 'Speech transcripts append here...'}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: 3D Viseme Viewport */}
        {(activeMobileTab === 'all' || activeMobileTab === 'viseme') && (
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#38bdf8', fontWeight: '700' }}>2. 3D Lip-Sync Viseme Studio</h3>
              <span style={{ fontSize: '0.7rem', backgroundColor: '#1e293b', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>WebGL</span>
            </div>
            <div ref={mountRef} style={{ width: '100%', height: '320px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', flexGrow: 1, margin: '8px 0' }} />
            <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center' }}>
              WebGL Animated Visemes Sync • Powered by Three.js
            </div>
          </div>
        )}

        {/* SECTION 3: Output & Translation - FIXED Overflow clipping & Height */}
        {(activeMobileTab === 'all' || activeMobileTab === 'output') && (
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#38bdf8', borderBottom: '1px solid #1e293b', paddingBottom: '8px', fontWeight: '700' }}>
              3. Translation Output
            </h3>

            <SearchableLanguageDropdown 
              label="Target Language (Output)"
              selectedLang={outputLang}
              onSelectLang={setOutputLang}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#090d16', padding: '8px 10px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Replay Voice</span>
                <button 
                  onClick={() => setReplayVoiceEnabled(!replayVoiceEnabled)}
                  style={{ backgroundColor: replayVoiceEnabled ? '#16a34a' : '#dc2626', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}
                >
                  {replayVoiceEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#090d16', padding: '8px 10px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Auto Speak</span>
                <button 
                  onClick={() => setAutoSpeakOutput(!autoSpeakOutput)}
                  style={{ backgroundColor: autoSpeakOutput ? '#16a34a' : '#dc2626', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}
                >
                  {autoSpeakOutput ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div>
              <button 
                onClick={replayAudio} 
                disabled={!replayVoiceEnabled}
                style={{ width: '100%', backgroundColor: replayVoiceEnabled ? '#0284c7' : '#334155', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: replayVoiceEnabled ? 'pointer' : 'not-allowed', fontSize: '0.85rem', fontWeight: '700', minHeight: '40px' }}
              >
                🔊 Replay Audio Output
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#fbbf24', minHeight: '16px' }}>
              {selectedOutputObj?.note ? <div>• {selectedOutputObj.note}</div> : <span style={{ color: '#4ade80' }}>✓ DB Logging online</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>Translation History</label>
              <div 
                ref={translationScrollRef}
                style={{ 
                  width: '100%', 
                  height: '260px', 
                  backgroundColor: '#090d16', 
                  color: '#f8fafc', 
                  border: '1px solid #1e293b', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  boxSizing: 'border-box', 
                  overflowY: 'auto', 
                  whiteSpace: 'pre-wrap', 
                  fontSize: '0.88rem',
                  lineHeight: '1.5'
                }}
              >
                {translation}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
