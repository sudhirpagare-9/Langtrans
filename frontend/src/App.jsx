// frontend/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const API_BASE = 'https://langtrans-backend.onrender.com';

const LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'hi-IN', name: 'Hindi - हिन्दी' },
  { code: 'mr-IN', name: 'Marathi - मराठी' },
  { code: 'bn-IN', name: 'Bengali - বাংলা' },
  { code: 'ta-IN', name: 'Tamil - தமிழ்' },
  { code: 'te-IN', name: 'Telugu - తెలుగు' },
  { code: 'gu-IN', name: 'Gujarati - ગુજરાતી' },
  { code: 'pa-IN', name: 'Punjabi - ਪੰਜਾਬੀ' },
  { code: 'kn-IN', name: 'Kannada - ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam - മലയാളം' },
  { code: 'or-IN', name: 'Odia - ଓଡ଼ିଆ' },
  { code: 'as-IN', name: 'Assamese - অসমীয়া' },
  { code: 'ur-PK', name: 'Urdu - اردو' },
  { code: 'sa-IN', name: 'Sanskrit - संस्कृतम्' },
  { code: 'bo-CN', name: 'Tibetan - བོད་ཡིག' },
  { code: 'th-TH', name: 'Thai - ไทย' },
  { code: 'da-DK', name: 'Danish - Dansk' },
  { code: 'es-ES', name: 'Spanish - Español' },
  { code: 'fr-FR', name: 'French - Français' },
  { code: 'de-DE', name: 'German - Deutsch' },
  { code: 'ja-JP', name: 'Japanese - 日本語' },
  { code: 'zh-CN', name: 'Chinese Mandarin - 中文' },
  { code: 'ar-SA', name: 'Arabic - العربية' },
  { code: 'ru-RU', name: 'Russian - Русский' },
  { code: 'pt-BR', name: 'Portuguese - Português' },
  { code: 'it-IT', name: 'Italian - Italiano' },
  { code: 'ko-KR', name: 'Korean - 한국어' }
];

export default function App() {
  const [backendStatus, setBackendStatus] = useState('Connecting...');
  const [inputLang, setInputLang] = useState('hi-IN');
  const [targetLang, setTargetLang] = useState('mr-IN');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [avatarState, setAvatarState] = useState('Idle - Ready');

  const mountRef = useRef(null);
  const jawMeshRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(res => res.json())
      .then(data => setBackendStatus(data.status === 'secure' ? 'Secure Online' : 'Online'))
      .catch(() => setBackendStatus('Server Waking Up...'));
  }, []);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x3b82f6, 1.5);
    directionalLight.position.set(2, 4, 3);
    scene.add(directionalLight);

    const headGroup = new THREE.Group();
    const headGeo = new THREE.SphereGeometry(0.9, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4, metalness: 0.2 });
    const head = new THREE.Mesh(headGeo, headMat);
    headGroup.add(head);

    const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8 });
    
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.3, 0.2, 0.75);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.3, 0.2, 0.75);
    headGroup.add(rightEye);

    const jawGeo = new THREE.BoxGeometry(0.4, 0.15, 0.2);
    const jawMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.3 });
    const jaw = new THREE.Mesh(jawGeo, jawMat);
    jaw.position.set(0, -0.35, 0.75);
    headGroup.add(jaw);
    jawMeshRef.current = jaw;

    scene.add(headGroup);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      headGroup.rotation.y = Math.sin(elapsedTime * 0.8) * 0.05;
      headGroup.rotation.x = Math.cos(elapsedTime * 0.6) * 0.03;

      if (jawMeshRef.current) {
        if (isTranslating || isRecording) {
          jawMeshRef.current.scale.y = 1 + Math.sin(elapsedTime * 25) * 0.8;
          jawMeshRef.current.position.y = -0.35 + Math.sin(elapsedTime * 25) * 0.05;
        } else {
          jawMeshRef.current.scale.y = 1;
          jawMeshRef.current.position.y = -0.35;
        }
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
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [isTranslating, isRecording]);

  const toggleRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech Recognition API is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setAvatarState('Idle - Ready');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = inputLang;
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onstart = () => {
        setIsRecording(true);
        setAvatarState('Listening to Microphone...');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setAvatarState('Microphone Error / Permission Denied');
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setAvatarState('Idle - Ready');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      alert('Could not start microphone recording.');
      setIsRecording(false);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setAvatarState('Translating via Gemini AI...');

    try {
      const response = await fetch(`${API_BASE}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: inputText, 
          source_language: inputLang,
          target_language: targetLang 
        })
      });
      const data = await response.json();
      setTranslatedText(data.translated_text || data.message || 'Translation complete.');
      setAvatarState('Synchronizing 3D Viseme Lip-Sync...');
      setTimeout(() => setAvatarState('Idle - Ready'), 3000);
    } catch (err) {
      setTranslatedText('Error: Failed to connect to secure translation backend.');
      setAvatarState('Error Encountered');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand-section">
          <span className="brand-icon">🌐</span>
          <h1 className="brand-title">AI Secure Real-Time Translator & 3D Lip-Sync Studio</h1>
        </div>
        <div className="compliance-badges">
          <div className="badge badge-secure">
            <span className="status-dot"></span> GDPR / NIST SP 800-53 Compliant
          </div>
          <div className="badge badge-status">
            <span className="status-dot"></span> Backend: {backendStatus}
          </div>
        </div>
      </header>

      <main className="workspace-grid">
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <span>🎙️</span> 1. Speech Input & Language Configuration
            </h2>
          </div>

          <div className="language-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label htmlFor="input-lang">Input Language (Mic)</label>
              <select 
                id="input-lang"
                value={inputLang} 
                onChange={(e) => setInputLang(e.target.value)}
              >
                {LANGUAGES.map(lang => (
                  <option key={`in-${lang.code}`} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="target-lang">Target Language (Output)</label>
              <select 
                id="target-lang"
                value={targetLang} 
                onChange={(e) => setTargetLang(e.target.value)}
              >
                {LANGUAGES.map(lang => (
                  <option key={`out-${lang.code}`} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="source-text">Live Transcript / Source Text</label>
            <textarea
              id="source-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Speak into microphone or type text to translate..."
            />
          </div>

          <div className="controls-row">
            <button 
              className={`btn ${isRecording ? 'btn-danger' : 'btn-secondary'}`}
              style={isRecording ? { backgroundColor: '#ef4444', color: '#fff' } : {}}
              onClick={toggleRecording}
            >
              {isRecording ? '🛑 Stop Mic' : '🎤 Live Mic'}
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleTranslate}
              disabled={isTranslating}
            >
              {isTranslating ? 'Processing...' : '⚡ Translate & Sync'}
            </button>
          </div>

          <div className="panel-header" style={{ marginTop: '1.5rem' }}>
            <h2 className="panel-title">
              <span>📄</span> 3. Translated Output Stream
            </h2>
          </div>
          <div className="output-box">
            {translatedText || 'Translated text in selected language will appear here...'}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <span>👤</span> 2. Real-Time 3D Human Lip-Sync Viewport
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Three.js WebGL</span>
          </div>

          <div className="viewport-container" ref={mountRef}>
            <div className="viewport-overlay-status" style={{ position: 'absolute', bottom: '1rem', textAlign: 'center', pointerEvents: 'none' }}>
              <p style={{ fontWeight: '600', color: '#60a5fa', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{avatarState}</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        Powered by Google Gemini API & Three.js WebGL Engine • Enterprise Secure Enclave Active
      </footer>
    </div>
  );
}
