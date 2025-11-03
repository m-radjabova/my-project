import { useEffect, useState } from 'react';
import { FaCode, FaHeart, FaReact } from 'react-icons/fa';

const IsLoading = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  const loadingTexts = [
    "Crafting digital experiences...",
    "Initializing creativity...", 
    "Loading awesome projects...",
    "Preparing portfolio...",
    "Almost there..."
  ];

  useEffect(() => {
    const text = loadingTexts[currentIndex];
    if (currentText.length < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(text.slice(0, currentText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentText('');
        setCurrentIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentText, currentIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loading-container">
      {/* Animated Background */}
      <div className="loading-bg">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="loading-content">
        {/* Animated Logo */}
        <div className="logo-animation">
          <div className="logo-orbital">
            <div className="logo-core">
              <FaCode className="logo-icon" />
            </div>
            <div className="orbit-ring ring-1"></div>
            <div className="orbit-ring ring-2"></div>
            <div className="orbit-ring ring-3"></div>
          </div>
        </div>

        {/* Welcome Text */}
        {showWelcome && (
          <div className="welcome-text">
            <h1 className="welcome-title">
              Welcome to My 
              <span className="gradient-text-loading"> Portfolio</span>
            </h1>
            <div className="typing-text-loading">
              <span className="typed-text-loading">{currentText}</span>
              <span className="cursor">|</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill"></div>
            <div className="progress-glow"></div>
          </div>
          <div className="progress-stats">
            <span className="stat">
              <FaReact className="stat-icon" />
              <span>React Powered</span>
            </span>
            <span className="stat">
              <FaHeart className="stat-icon" />
              <span>Crafted with Love</span>
            </span>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-element el-1">{'</>'}</div>
          <div className="floating-element el-2">{'{}'}</div>
          <div className="floating-element el-3">{'=>'}</div>
          <div className="floating-element el-4">⚡</div>
          <div className="floating-element el-5">✨</div>
        </div>
      </div>
    </div>
  );
};

export default IsLoading;