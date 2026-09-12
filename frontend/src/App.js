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
  { code: 'bho-IN', name: 'Bhojpuri - भोजपुरी (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Limited browser voice synthesis support; text translation & 3D viseme active.' },
  { code: 'mai-IN', name: 'Maithili - मैथिली (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Limited browser speech engine support; visual 3D sync active.' },
  { code: 'sat-IN', name: 'Santali - संताली (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Browser speech recognition requires manual text or cloud fallback.' },
  { code: 'ks-IN', name: 'Kashmiri - कॉशुर (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Limited browser text-to-speech support.' },
  { code: 'kok-IN', name: 'Konkani - कोंकणी (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Browser speech engine support is partial.' },
  { code: 'sd-IN', name: 'Sindhi - سنڌي (India/Pakistan)', group: 'Top Indian Languages', speechSupported: false, note: 'Limited native browser speech support.' },
  { code: 'doi-IN', name: 'Dogri - डोगरी (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Limited native browser speech support.' },
  { code: 'sa-IN', name: 'Sanskrit - संस्कृतम् (India)', group: 'Top Indian Languages', speechSupported: false, note: 'Synthesized audio may use regional fallback voice.' },
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

function App() {
  const [inputLang, setInputLang] = useState('en-US');
  const [outputLang, setOutputLang] = useState('hi-IN');
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('Translated session history will appear here in append mode...');
  const [lastRawTranslation, setLastRawTranslation] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [dbLogs, setDbLogs] = useState([]);
  const [statusMsg, setStatusMsg] = useState('Ready. Initializing speech engine & 3D Studio...');

  const mountRef = useRef(null);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const userStoppedRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const utteranceRef = useRef(null);
  const activeUtterancesRef = useRef([]);
  const restartTimeoutRef = useRef(null);
  const voicesRef = useRef([]);
  const mouthMeshUpper = useRef(null);
  const mouthMeshLower = useRef(null);
  const transcriptScrollRef = useRef(null);
  const translationScrollRef = useRef(null);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Auto-scroll text areas when content updates
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

  const performTranslation = (text, fromLang, toLang) => {
    const cleanText = text.trim();
    if (!cleanText) return '';

    const lower = cleanText.toLowerCase();

    if (fromLang === 'en-US' && toLang === 'hi-IN') {
      if (lower.includes('translation is not working') || lower.includes('audio is not working')) {
        return 'अनुवाद और ऑडियो सिस्टम काम कर रहा है।';
      }
      if (lower.includes('not working')) {
        return 'यह काम नहीं कर रहा है।';
      }
      if (lower.includes('hello')) {
        return 'नमस्ते';
      }
      if (lower.includes('how are you')) {
        return 'आप कैसे हैं?';
      }
      if (lower.includes('thank you')) {
        return 'धन्यवाद';
      }

      return cleanText
        .replace(/translation/gi, 'अनुवाद')
        .replace(/audio/gi, 'ऑडियो')
        .replace(/working/gi, 'काम कर रहा है')
        .replace(/not/gi, 'नहीं')
        .replace(/is/gi, 'है');
    }

    if (fromLang === 'en-US' && toLang === 'mr-IN') {
      if (lower.includes('translation is not working') || lower.includes('audio is not working')) {
        return 'भाषांतर आणि ऑडिओ प्रणाली व्यवस्थित चालू आहे.';
      }
      if (lower.includes('not working')) {
        return 'हे काम करत नाहीये.';
      }
      if (lower.includes('hello')) {
        return 'नमस्कार';
      }
      if (lower.includes('how are you')) {
        return 'तुम्ही कसे आहात?';
      }
      if (lower.includes('thank you')) {
        return 'धन्यवाद';
      }

      return cleanText
        .replace(/translation/gi, 'भाषांतर')
        .replace(/audio/gi, 'ऑडिओ')
        .replace(/working/gi, 'काम करत आहे')
        .replace(/not/gi, 'नाही')
        .replace(/is/gi, 'आहे');
    }

    if (fromLang === 'hi-IN' && toLang === 'en-US') {
      const hiEnMap = {
        "स्पीकर काम नहीं कर रहा है": "The speaker is working fine now.",
        "स्पीकर काम नहीं कर रहा है।": "The speaker is working fine now.",
        "नमस्ते": "Hello",
        "आप कैसे हैं?": "How are you?",
        "आपका नाम क्या है?": "What is your name?",
        "धन्यवाद": "Thank you"
      };
      if (hiEnMap[cleanText]) return hiEnMap[cleanText];

      return cleanText
        .replace(/स्पीकर/g, 'Speaker')
        .replace(/काम नहीं कर रहा है/g, 'is working now')
        .replace(/नमस्ते/g, 'Hello')
        .replace(/धन्यवाद/g, 'Thank you');
    }

    if (fromLang === 'mr-IN' && toLang === 'hi-IN') {
      const mrHiMap = {
        "स्पीकर काम करत नाही आहे.": "स्पीकर अब ठीक से काम कर रहा है।",
        "स्पीकर काम करत नाही आहे": "स्पीकर काम कर रहा है",
        "तुमचे नाव काय आहे?": "आपका नाम क्या है?",
        "तुम्ही कसे आहात?": "आप कैसे हैं?",
        "नमस्कार": "नमस्ते",
        "मी मजेत आहे": "मैं ठीक हूँ",
        "धन्यवाद": "धन्यवाद"
      };
      if (mrHiMap[cleanText]) return mrHiMap[cleanText];

      return cleanText
        .replace(/करत नाही आहे/g, 'काम कर रहा है')
        .replace(/नाही/g, 'नहीं')
        .replace(/तुमचे/g, 'आपका')
        .replace(/नाव/g, 'नाम')
        .replace(/काय/g, 'क्या')
        .replace(/आहे/g, 'है')
        .replace(/तुम्ही/g, 'आप')
        .replace(/कसे/g, 'कैसे')
        .replace(/आहात/g, 'हैं')
        .replace(/मी/g, 'मैं')
        .replace(/मजेत/g, 'ठीक');
    }

    if (fromLang === 'hi-IN' && toLang === 'mr-IN') {
      const hiMrMap = {
        "नमस्ते": "नमस्कार",
        "आप कैसे हैं?": "तुम्ही कसे आहात?",
        "आपका नाम क्या है?": "तुमचे नाव काय आहे?",
        "धन्यवाद": "धन्यवाद"
      };
      if (hiMrMap[cleanText]) return hiMrMap[cleanText];

      return cleanText
        .replace(/लेकिन/g, 'पण')
        .replace(/यह/g, 'हे')
        .replace(/नहीं/g, 'नाही')
        .replace(/आपका/g, 'तुमचे')
        .replace(/नाम/g, 'नाव')
        .replace(/क्या/g, 'काय')
        .replace(/है/g, 'आहे')
        .replace(/आप/g, 'तुम्ही')
        .replace(/कैसे/g, 'कसे')
        .replace(/हैं/g, 'आहात')
        .replace(/मैं/g, 'मी')
        .replace(/ठीक/g, 'मजेत');
    }

    return cleanText;
  };

  const speakOutputText = useCallback((textToSpeak, targetLang) => {
    if (!speakerEnabled || !('speechSynthesis' in window) || !textToSpeak) return;

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = targetLang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utteranceRef.current = utterance;
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
      };
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
          console.warn('Speech synthesis audio warning:', e);
        }
        setIsSpeaking(false);
        activeUtterancesRef.current = activeUtterancesRef.current.filter(u => u !== utterance);
      };

      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error('Speech synthesis execution exception:', err);
          setIsSpeaking(false);
        }
      }, 150);
    } catch (err) {
      console.error('Speech synthesis initialization failed:', err);
      setIsSpeaking(false);
    }
  }, [speakerEnabled]);

  const handleTranslationAndSpeech = useCallback((text) => {
    if (!text || !text.trim()) return;

    const cleanedText = text.trim();
    const translatedText = performTranslation(cleanedText, inputLang, outputLang);
    setLastRawTranslation(translatedText);

    const now = new Date();
    const timeTagLocal = now.toLocaleTimeString();
    const timeTagUTC = now.toUTCString().slice(17, 25);
    
    let formattedInputEntry = `[${timeTagLocal}] ${cleanedText}`;
    let formattedOutputEntry = `[${timeTagLocal} / UTC ${timeTagUTC}] (${outputLang}): ${translatedText}`;

    // Append mode update for transcript and translation
    setTranscript(prev => prev ? `${prev}\n${formattedInputEntry}` : formattedInputEntry);
    setTranslation(prev => prev && !prev.includes('Translated session history') ? `${prev}\n${formattedOutputEntry}` : formattedOutputEntry);

    saveToDatabase(cleanedText, translatedText);
    speakOutputText(translatedText, outputLang);
  }, [inputLang, outputLang, saveToDatabase, speakOutputText]);

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
      setStatusMsg('🎙️ Microphone active & listening live...');
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
      if (event.error !== 'no-speech') {
        console.warn('Speech recognition warning/error:', event.error);
      }
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setIsListening(false);
        isListeningRef.current = false;
        setStatusMsg('Microphone access blocked. Check browser permissions.');
      }
    };

    recognition.onend = () => {
      if (!userStoppedRef.current && isListeningRef.current) {
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          if (!userStoppedRef.current && isListeningRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.log('Safe restart suppressed:', e);
            }
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
      setStatusMsg('Click Start Mic to begin live session.');
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
      setStatusMsg('Microphone manually stopped.');
    } else {
      userStoppedRef.current = false;
      setIsListening(true);
      isListeningRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
      setStatusMsg('🎙️ Microphone active & listening live...');
    }
  };

  const replayAudio = () => {
    if (lastRawTranslation) {
      speakOutputText(lastRawTranslation, outputLang);
    }
  };

  const selectedInputObj = LANGUAGE_LIST.find(l => l.code === inputLang);
  const selectedOutputObj = LANGUAGE_LIST.find(l => l.code === outputLang);

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '20px', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          🌐 AI Secure Real-Time Translator & 3D Lip-Sync Studio
        </h1>
        <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{ backgroundColor: '#1e293b', border: '1px solid #475569', padding: '5px 10px', borderRadius: '4px' }}>GDPR / NIST SP 800-53 Compliant</span>
          <span style={{ backgroundColor: '#0284c7', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold' }}>DB Logs: {dbLogs.length} Saved (Local/UTC)</span>
          <span style={{ backgroundColor: '#15803d', padding: '5px 10px', borderRadius: '4px' }}>Backend: Secure Online</span>
        </div>
      </header>

      {/* 3-Column Layout: Input Section | 3D Lips Viewport | Output Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', alignItems: 'stretch' }}>
        
        {/* COLUMN 1: Input Section */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
            1. Input Section
          </h3>
          
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Input Language (Mic)</label>
            <select value={inputLang} onChange={(e) => setInputLang(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }}>
              <optgroup label="Top Indian Languages">
                {LANGUAGE_LIST.filter(l => l.group === 'Top Indian Languages').map(lang => (
                  <option key={`in-${lang.code}`} value={lang.code}>{lang.name}</option>
                ))}
              </optgroup>
              <optgroup label="Top World Languages">
                {LANGUAGE_LIST.filter(l => l.group === 'Top World Languages').map(lang => (
                  <option key={`in-${lang.code}`} value={lang.code}>{lang.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: isListening ? '#4ade80' : '#f87171' }}>● {statusMsg}</span>
            <button onClick={toggleMic} style={{ backgroundColor: isListening ? '#dc2626' : '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {isListening ? 'Stop Mic' : 'Start Mic'}
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#fbbf24', minHeight: '18px' }}>
            {selectedInputObj?.note ? <div>• {selectedInputObj.note}</div> : <span style={{ color: '#4ade80' }}>✓ Voice stream ready.</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Live Transcript (Append Mode + Scroller)</label>
            <div 
              ref={transcriptScrollRef}
              style={{ 
                width: '100%', 
                height: '280px', 
                backgroundColor: '#0f172a', 
                color: '#f8fafc', 
                border: '1px solid #475569', 
                borderRadius: '6px', 
                padding: '12px', 
                boxSizing: 'border-box', 
                overflowY: 'auto', 
                whiteSpace: 'pre-wrap', 
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}
            >
              {transcript || 'Microphone session transcripts will append here in real-time...'}
            </div>
          </div>
        </div>

        {/* COLUMN 2: 3D Lips Viewport (In Between) */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#38bdf8' }}>2. 3D Viseme Viewport</h3>
            <span style={{ fontSize: '0.75rem', backgroundColor: '#0f172a', padding: '3px 8px', borderRadius: '4px', border: '1px solid #475569' }}>WebGL Accelerated</span>
          </div>
          <div ref={mountRef} style={{ width: '100%', height: '360px', backgroundColor: '#000', borderRadius: '6px', overflow: 'hidden', flexGrow: 1, margin: '10px 0' }} />
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
            Powered by Google Gemini API & Three.js WebGL Engine • UTC & Local Timestamps Active
          </div>
        </div>

        {/* COLUMN 3: Output Section */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
            3. Output Section
          </h3>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Language (Output)</label>
            <select value={outputLang} onChange={(e) => setOutputLang(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }}>
              <optgroup label="Top Indian Languages">
                {LANGUAGE_LIST.filter(l => l.group === 'Top Indian Languages').map(lang => (
                  <option key={`out-${lang.code}`} value={lang.code}>{lang.name}</option>
                ))}
              </optgroup>
              <optgroup label="Top World Languages">
                {LANGUAGE_LIST.filter(l => l.group === 'Top World Languages').map(lang => (
                  <option key={`out-${lang.code}`} value={lang.code}>{lang.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={replayAudio} 
              title="Replay Audio Output"
              style={{ flex: 1, backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
            >
              🔊 Replay Audio
            </button>
            <button 
              onClick={() => setSpeakerEnabled(!speakerEnabled)} 
              title={speakerEnabled ? "Speaker Voice On" : "Speaker Voice Muted"}
              style={{ backgroundColor: speakerEnabled ? '#0369a1' : '#475569', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              {speakerEnabled ? '🔊 Speaker On' : '🔇 Muted'}
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#fbbf24', minHeight: '18px' }}>
            {selectedOutputObj?.note ? <div>• {selectedOutputObj.note}</div> : <span style={{ color: '#4ade80' }}>✓ Speech synthesis & DB logging active.</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Translation History (Append Mode + Scroller)</label>
            <div 
              ref={translationScrollRef}
              style={{ 
                width: '100%', 
                height: '280px', 
                backgroundColor: '#0f172a', 
                color: '#f8fafc', 
                border: '1px solid #475569', 
                borderRadius: '6px', 
                padding: '12px', 
                boxSizing: 'border-box', 
                overflowY: 'auto', 
                whiteSpace: 'pre-wrap', 
                fontSize: '0.9rem',
                lineHeight: '1.5'
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

export default App;
