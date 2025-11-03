import { useRef, useState, useEffect } from 'react';
import { 
  FaReact, 
  FaJs, 
  FaNodeJs, 
  FaFigma, 
  FaGitAlt,
  FaCode,
  FaHeart,
  FaGraduationCap,
  FaRocket
} from 'react-icons/fa';
import { 
  SiTypescript, 
  SiHtml5, 
  SiCss3,
  SiTailwindcss,
  SiNextdotjs,
  SiVite
} from 'react-icons/si';

// AOS import qilish
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  const aboutRef = useRef(null);
  const [activeTab, setActiveTab] = useState('skills');

  // AOS ni initialize qilish
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  const skills = [
    { name: 'React', level: 90, icon: <FaReact />, color: '#61DAFB', gradient: 'var(--gradient-3)' },
    { name: 'JavaScript', level: 90, icon: <FaJs />, color: '#F7DF1E', gradient: 'var(--gradient-5)' },
    { name: 'TypeScript', level: 90, icon: <SiTypescript />, color: '#3178C6', gradient: 'var(--gradient-1)' },
    { name: 'Next.js', level: 85, icon: <SiNextdotjs />, color: '#000000', gradient: 'var(--gradient-2)' },
    { name: 'HTML5', level: 95, icon: <SiHtml5 />, color: '#E34F26', gradient: 'var(--gradient-2)' },
    { name: 'CSS3', level: 100, icon: <SiCss3 />, color: '#1572B6', gradient: 'var(--gradient-3)' },
    { name: 'Tailwind', level: 50, icon: <SiTailwindcss />, color: '#06B6D4', gradient: 'var(--gradient-4)' },
    { name: 'Vite', level: 80, icon: <SiVite />, color: '#646CFF', gradient: 'var(--gradient-5)' },
    { name: 'Node.js', level: 75, icon: <FaNodeJs />, color: '#339933', gradient: 'var(--gradient-4)' },
    { name: 'UI/UX Design', level: 90, icon: <FaFigma />, color: '#FF6B6B', gradient: 'var(--gradient-2)' },
    { name: 'Git', level: 85, icon: <FaGitAlt />, color: '#F05032', gradient: 'var(--gradient-2)' }
  ];

  const education = [
    {
      year: '2023 - Present',
      degree: 'Programming Technology',
      institution: 'Asia International University (AIU)',
      description: 'Pursuing a Bachelor\'s degree in Programming Technology, focusing on software development, algorithms, and data structures.',
      icon: <FaGraduationCap />,
      gradient: 'var(--gradient-1)'
    }
  ];

  return (
    <section id="about" className="about-section" ref={aboutRef}>
      <div className="about-container">
        {/* Animated Background Elements */}
        <div className="about-background">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
        </div>

        {/* Header with AOS animatsiyasi */}
        <div 
          className="about-header"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <div className="header-decoration">
            <div className="decoration-line"></div>
            <FaRocket className="decoration-icon" />
            <div className="decoration-line"></div>
          </div>
          <h2 className="about-title">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="about-subtitle">
            Crafting digital experiences with passion, precision and pixel-perfect design
          </p>
        </div>

        <div className="about-content">
          {/* Left Side - Personal Card with AOS */}
          <div 
            className="about-personal"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <div className="personal-card">
              <div className="card-glow"></div>
              <div className="avatar-section">
                <div className="avatar-wrapper">
                  <div className="about-avatar">
                    <div className="avatar-inner">
                      <FaHeart className="avatar-icon" />
                    </div>
                    <div className="avatar-ring ring-1"></div>
                    <div className="avatar-ring ring-2"></div>
                    <div className="avatar-ring ring-3"></div>
                  </div>
                </div>
                <div className="status-indicator">
                  <div className="status-dot"></div>
                  <span>Available for projects</span>
                </div>
              </div>
              
              <div className="personal-info">
                <h3>Muslima Radjabova</h3>
                <p className="role">Frontend Developer & UI/UX Designer</p>
                <p className="bio">
                  I specialize in creating beautiful, functional, and user-centered digital experiences. 
                  With 2+ years of experience in frontend development and design, I bridge the gap between 
                  aesthetic design and technical implementation.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Tabs Content with AOS */}
          <div 
            className="about-details"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="tabs-container">
              <div className="tabs-header">
                <button 
                  className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                  onClick={() => setActiveTab('skills')}
                  data-aos="zoom-in"
                  data-aos-delay="400"
                >
                  <FaCode className="tab-icon" />
                  Skills
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                  onClick={() => setActiveTab('education')}
                  data-aos="zoom-in"
                  data-aos-delay="500"
                >
                  <FaGraduationCap className="tab-icon" />
                  Education
                </button>
              </div>

              <div className="tabs-content">
                {activeTab === 'skills' && (
                  <div className="skills-grid">
                    {skills.map((skill, index) => (
                      <div 
                        key={skill.name}
                        className="skill-card"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="skill-header">
                          <div 
                            className="skill-icon-wrapper"
                            style={{ background: skill.gradient }}
                          >
                            <div className="skill-icon">
                              {skill.icon}
                            </div>
                          </div>
                          <div className="skill-info">
                            <span className="skill-name">{skill.name}</span>
                            <span className="skill-percent">{skill.level}%</span>
                          </div>
                        </div>
                        <div className="skill-bar">
                          <div 
                            className="skill-progress"
                            style={{ 
                              width: `${skill.level}%`,
                              background: skill.gradient
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="timeline">
                    {education.map((edu, index) => (
                      <div 
                        key={index}
                        className="timeline-item"
                        data-aos="fade-up"
                        data-aos-delay={index * 200}
                      >
                        <div 
                          className="timeline-icon"
                          style={{ background: edu.gradient }}
                        >
                          {edu.icon}
                        </div>
                        <div className="timeline-content">
                          <span className="timeline-year">{edu.year}</span>
                          <h4 className="timeline-role">{edu.degree}</h4>
                          <span className="timeline-company">{edu.institution}</span>
                          <p className="timeline-description">{edu.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;