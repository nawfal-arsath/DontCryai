import React, { useState, useEffect, useRef } from 'react';

export default function DontCryComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailJSLoaded, setEmailJSLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [reviewOffset, setReviewOffset] = useState(0);
  const [launchingHover, setLaunchingHover] = useState({ x: 0, y: 0, isHovering: false });
  const canvasRef = useRef(null);
  const launchingRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    script.onload = () => {
      window.emailjs.init('l3tYCimjD-2MdyRYF');
      setEmailJSLoaded(true);
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Auto-scroll reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewOffset(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLaunchingMouseMove = (e) => {
    if (launchingRef.current) {
      const rect = launchingRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setLaunchingHover({ x, y, isHovering: true });
    }
  };

  const handleLaunchingMouseLeave = () => {
    setLaunchingHover({ x: 0, y: 0, isHovering: false });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.5 ? 'rgba(74, 144, 226, 0.4)' : 'rgba(255, 105, 180, 0.4)'
    }));

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.strokeStyle = `rgba(74, 144, 226, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !window.emailjs || !emailJSLoaded) return;

    const notificationParams = {
      to_name: 'Don\'t Cry Team',
      user_email: email,
      from_name: 'Website Notification',
      reply_to: email
    };

    const confirmationParams = {
      to_name: 'User',
      to_email: email,
      user_email: email,
      from_name: 'Don\'t Cry Team',
      reply_to: 'dontcrytech@gmail.com'
    };

    window.emailjs.send('service_570a2jz', 'template_f4zbwzj', notificationParams, 'l3tYCimjD-2MdyRYF')
    .then(() => window.emailjs.send('service_570a2jz', 'template_dwrxbl8', confirmationParams, 'l3tYCimjD-2MdyRYF'))
    .then(() => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 4000);
    })
    .catch((error) => console.error('Failed to send email:', error));
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const features = [
    {
      num: '01',
      title: 'Neural Intelligence',
      desc: 'Advanced deep learning architecture trained on 1,000+ acoustic patterns for precise cry analysis',
      gradient: 'linear-gradient(135deg, #4A90E2 0%, #FF69B4 100%)'
    },
    {
      num: '02',
      title: 'Real-Time Analysis',
      desc: 'Instant cry classification with sub-second response times for immediate parenting support',
      gradient: 'linear-gradient(135deg, #FF69B4 0%, #4A90E2 100%)'
    },
    {
      num: '03',
      title: 'Clinical Precision',
      desc: '95% accuracy validated through rigorous testing protocols and clinical research',
      gradient: 'linear-gradient(135deg, #4A90E2 0%, #5FB8E8 100%)'
    },
    {
      num: '04',
      title: 'Intuitive Design',
      desc: 'Seamless experience crafted specifically for modern parents and caregivers',
      gradient: 'linear-gradient(135deg, #FF69B4 0%, #FFB3D9 100%)'
    }
  ];

  const stats = [
    { value: '1,000+', label: 'Training Samples' },
    { value: '95%', label: 'Accuracy Rate' },
    { value: '5', label: 'Cry Types' },
    { value: '<10s', label: 'Response Time' }
  ];

  const reviews = [
    {
      name: "Jesina-India.",
      role: "New Mom",
      text: "Finally got sleep! Don't Cry helped me understand my baby's needs instantly. No more guessing games at 3 AM.",
      rating: 5
    },
    {
      name: "Nasrin-India.",
      role: "Mom of Three",
      text: "This app is a lifesaver. It's like having a baby expert in your pocket 24/7. Highly recommend to all new parents!",
      rating: 5
    },
    {
      name: "Priya-USA.",
      role: "First-Time Parent",
      text: "I was so anxious about not knowing what my baby needed. Don't Cry gave me confidence and peace of mind.",
      rating: 5
    }
  ];

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />
      
      <div 
        className="gradient-orb orb-1"
        style={{
          ...styles.gradientOrb,
          background: 'radial-gradient(circle, rgba(74, 144, 226, 0.25) 0%, transparent 70%)',
          left: `${20 + mousePosition.x * 0.03}%`,
          top: `${10 + mousePosition.y * 0.03 - scrollY * 0.05}%`
        }}
      />
      <div 
        className="gradient-orb orb-2"
        style={{
          ...styles.gradientOrb,
          background: 'radial-gradient(circle, rgba(255, 105, 180, 0.2) 0%, transparent 70%)',
          right: `${15 + mousePosition.x * 0.02}%`,
          top: `${30 + mousePosition.y * 0.02 - scrollY * 0.03}%`
        }}
      />
      
      <div style={styles.backgroundOverlay} />

      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.logoNav}>
            <div style={styles.logoContainer}>
              <img src="logo.png" alt="Don't Cry Logo" style={styles.logoImage} />
            </div>
            <span style={styles.logoText}>DontCry ai</span>
          </div>
          
          <div style={styles.navLinks} className="desktop-nav">
            <a href="#features" style={styles.navLink} onClick={(e) => {
              e.preventDefault();
              scrollToSection('features');
            }}>
              <span>Features</span>
              <div className="nav-underline" style={styles.navUnderline} />
            </a>
            <a href="#technology" style={styles.navLink} onClick={(e) => {
              e.preventDefault();
              scrollToSection('technology');
            }}>
              <span>Technology</span>
              <div className="nav-underline" style={styles.navUnderline} />
            </a>
            <a href="#about" style={styles.navLink} onClick={(e) => {
              e.preventDefault();
              scrollToSection('about');
            }}>
              <span>About</span>
              <div className="nav-underline" style={styles.navUnderline} />
            </a>
          </div>

          <button 
            style={styles.mobileMenuButton}
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div style={styles.mobileMenu} className="mobile-menu">
            <a href="#features" style={styles.mobileNavLink} onClick={(e) => {
              e.preventDefault();
              scrollToSection('features');
            }}>Features</a>
            <a href="#technology" style={styles.mobileNavLink} onClick={(e) => {
              e.preventDefault();
              scrollToSection('technology');
            }}>Technology</a>
            <a href="#about" style={styles.mobileNavLink} onClick={(e) => {
              e.preventDefault();
              scrollToSection('about');
            }}>About</a>
          </div>
        )}
      </nav>

      <div style={styles.content}>
        <div style={styles.heroSection}>
          <div className="badge" style={styles.badge}>
            <span style={styles.badgeDot} />
            <span>Trusted by Parents</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={styles.verifiedIcon}>
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 className="main-title" style={{
            ...styles.mainTitle,
            transform: `translateY(${scrollY * -0.08}px)`
          }}>
            <span style={styles.titleLine}>Know What Your</span>
            <span style={styles.titleLineGradient}>Baby Needs</span>
            <span style={styles.titleLine}>In Seconds</span>
          </h1>
          
          <p style={styles.subtitle}>
            AI-powered cry analysis that tells you instantly if your baby is hungry, tired, needs a diaper change, or just wants comfort.
            <br className="hide-mobile"/> Simple. Accurate. Peace of mind.
          </p>

          <div className="hero-visual" style={styles.heroVisual}>
            <div style={styles.brandVisual}>
              <div className="rotating-circles" style={styles.rotatingCircles}>
                <div className="orbit-circle orbit-1" style={styles.orbitCircle} />
                <div className="orbit-circle orbit-2" style={{...styles.orbitCircle, animationDelay: '1s'}} />
                <div className="orbit-circle orbit-3" style={{...styles.orbitCircle, animationDelay: '2s'}} />
              </div>
              <div className="brand-center" style={styles.brandCenter}>
                <div className="brand-ring" style={styles.brandRing} />
                <div className="brand-ring" style={{...styles.brandRing, animationDelay: '0.5s'}} />
                <div className="brand-logo" style={styles.brandLogo}>
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4A90E2" />
                        <stop offset="50%" stopColor="#7B68EE" />
                        <stop offset="100%" stopColor="#FF69B4" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FF69B4" />
                        <stop offset="50%" stopColor="#7B68EE" />
                        <stop offset="100%" stopColor="#4A90E2" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    {/* Diamond shape made of 4 triangular faces */}
                    <path d="M30 5 L50 30 L30 45 L30 5" fill="url(#gradient1)" opacity="0.9" className="diamond-face diamond-face-1" filter="url(#glow)"/>
                    <path d="M30 5 L10 30 L30 45 L30 5" fill="url(#gradient2)" opacity="0.7" className="diamond-face diamond-face-2" filter="url(#glow)"/>
                    <path d="M30 45 L50 30 L30 55 L30 45" fill="url(#gradient1)" opacity="0.6" className="diamond-face diamond-face-3" filter="url(#glow)"/>
                    <path d="M30 45 L10 30 L30 55 L30 45" fill="url(#gradient2)" opacity="0.5" className="diamond-face diamond-face-4" filter="url(#glow)"/>
                    {/* Highlight line */}
                    <line x1="30" y1="5" x2="30" y2="55" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" className="diamond-highlight"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.comingSoonSection}>
            <div className="launching-container" style={styles.launchingContainer}>
              <div 
                ref={launchingRef}
                className="launching-text" 
                style={styles.launchingText}
                onMouseMove={handleLaunchingMouseMove}
                onMouseLeave={handleLaunchingMouseLeave}
              >
                <div style={styles.launchingLine}>
                  {'LAUNCHING'.split('').map((char, index) => {
                    if (launchingHover.isHovering && launchingRef.current) {
                      const rect = launchingRef.current.getBoundingClientRect();
                      const charWidth = rect.width / 'LAUNCHING SOON'.length;
                      const charX = (index * charWidth) + (charWidth / 2);
                      const charXPercent = (charX / rect.width) * 100;
                      const distance = Math.abs(charXPercent - launchingHover.x);
                      const isNear = distance < 15;
                      
                      return (
                        <span
                          key={index}
                          style={{
                            color: isNear ? '#888888' : 'rgba(255, 255, 255, 0.9)',
                            transition: 'color 0.15s ease',
                            display: 'inline-block'
                          }}
                        >
                          {char}
                        </span>
                      );
                    }
                    return (
                      <span 
                        key={index} 
                        style={{ 
                          color: 'rgba(255, 255, 255, 0.9)',
                          display: 'inline-block'
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
                <div style={styles.launchingLine}>
                  {'SOON'.split('').map((char, index) => {
                    const adjustedIndex = index + 10; // Offset for "LAUNCHING "
                    if (launchingHover.isHovering && launchingRef.current) {
                      const rect = launchingRef.current.getBoundingClientRect();
                      const charWidth = rect.width / 'LAUNCHING SOON'.length;
                      const charX = (adjustedIndex * charWidth) + (charWidth / 2);
                      const charXPercent = (charX / rect.width) * 100;
                      const distance = Math.abs(charXPercent - launchingHover.x);
                      const isNear = distance < 15;
                      
                      return (
                        <span
                          key={index}
                          style={{
                            color: isNear ? '#888888' : 'rgba(255, 255, 255, 0.9)',
                            transition: 'color 0.15s ease',
                            display: 'inline-block'
                          }}
                        >
                          {char}
                        </span>
                      );
                    }
                    return (
                      <span 
                        key={index} 
                        style={{ 
                          color: 'rgba(255, 255, 255, 0.9)',
                          display: 'inline-block'
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
                <div style={styles.elegantUnderline} />
              </div>
            </div>
            <p style={styles.launchingSubtext}>
              Trusted Intelligence. Confident Care.
            </p>
          </div>

          <div style={styles.signupSection}>
            {!submitted ? (
              <div className="signup-form" style={styles.signupForm}>
                <div style={styles.inputWrapper}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.emailInput}
                  />
                  <div className="input-glow" style={styles.inputGlow} />
                </div>
                <button onClick={handleSubmit} className="cta-button" style={styles.ctaButton}>
                  <span>Get Early Access</span>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={styles.buttonIcon}>
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="success-message" style={styles.successMessage}>
                <div className="success-icon" style={styles.successIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>You're on the list. We'll be in touch.</span>
              </div>
            )}
          </div>
        </div>

        {/* Parent Reviews Section */}
        <div style={styles.reviewsSection}>
          <div style={styles.reviewsHeader}>
            <div style={styles.reviewsBadge}>
              <span style={styles.reviewsBadgeDot} />
              <span>TESTIMONIALS</span>
            </div>
            <h2 style={styles.reviewsTitle}>What Parents Are Saying</h2>
            <p style={styles.reviewsSubtitle}>Join the happy parents who trust Don't Cry</p>
          </div>
          <div style={styles.reviewsWrapper}>
            <div 
              style={{
                ...styles.reviewsTrack,
                transform: `translateX(-${reviewOffset * 33.333}%)`
              }}
            >
              {[...reviews, ...reviews].map((review, index) => (
                <div key={index} style={styles.reviewCard}>
                  <div style={styles.quoteIcon}>"</div>
                  <p style={styles.reviewText}>{review.text}</p>
                  <div style={styles.reviewFooter}>
                    <div style={styles.reviewStars}>
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} style={styles.star}>★</span>
                      ))}
                    </div>
                    <div style={styles.reviewAuthorInfo}>
                      <div style={styles.authorNameWrapper}>
                        <div style={styles.authorName}>{review.name}</div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.verifiedBadge}>
                          <circle cx="12" cy="12" r="10" fill="#4A90E2"/>
                          <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div style={styles.authorRole}>{review.role}</div>
                      <div style={styles.certifiedText}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{marginRight: '4px'}}>
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Verified
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={styles.reviewsDots}>
            {reviews.map((_, idx) => (
              <div 
                key={idx} 
                style={{
                  ...styles.reviewDot,
                  opacity: reviewOffset === idx ? 1 : 0.3
                }}
              />
            ))}
          </div>
        </div>

        <div id="features" style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>Designed for Modern Parents</h2>
          <div className="features-grid" style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                style={styles.featureCard}
              >
                <div className="feature-number" style={{
                  ...styles.featureNumber,
                  background: feature.gradient
                }}>
                  {feature.num}
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
                <div className="card-border" style={styles.cardBorder} />
              </div>
            ))}
          </div>
        </div>

        <div id="about" style={styles.statsSection}>
          <div className="stats-container" style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <div key={index} className="stat-item" style={styles.statItem}>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
                <div className="stat-accent" style={styles.statAccent} />
              </div>
            ))}
          </div>
        </div>

        <div id="technology" style={styles.techSection}>
          <h2 style={styles.sectionTitle}>Advanced Technology</h2>
          <div style={styles.techGrid}>
            {[
              {
                num: '01',
                title: 'Acoustic Analysis',
                desc: 'Our neural network processes complex audio patterns, identifying subtle variations in pitch, frequency, and rhythm that indicate specific needs.'
              },
              {
                num: '02',
                title: 'Machine Learning',
                desc: 'Trained on thousands of validated cry samples, our model continuously improves its accuracy through advanced deep learning algorithms.'
              },
              {
                num: '03',
                title: 'Instant Insights',
                desc: 'Real-time classification delivers immediate, actionable guidance—helping you respond to your baby needs with confidence.'
              }].map((tech, i) => (
              <div key={i} className="tech-card" style={styles.techCard}>
                <div style={styles.techNumber}>{tech.num}</div>
                <h3 style={styles.techTitle}>{tech.title}</h3>
                <p style={styles.techDesc}>{tech.desc}</p>
                <div className="tech-accent" style={styles.techAccent} />
              </div>
            ))}
          </div>
        </div>

        <footer style={styles.footer}>
          <div style={styles.footerContent}>
            <div style={styles.footerBrand}>
              <span style={styles.footerLogo}>DontCry ai</span>
              <p style={styles.footerTagline}>Trusted Intelligence. Confident Care.</p>
            </div>
            <div style={styles.footerContact}>
              <a href="mailto:dontcrytech@gmail.com" className="email-link" style={styles.emailLink}>
                dontcrytech@gmail.com
              </a>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p style={styles.copyright}>© 2025 DontCry ai. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ${KEYFRAMES_AND_STYLES}
      `}</style>
    </div>
  );
}

const KEYFRAMES_AND_STYLES = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  
  @keyframes floatingParticles {
    0% { 
      transform: translate(0, 0) scale(1);
      opacity: 0.8;
    }
    25% { 
      transform: translate(40px, -30px) scale(1.2);
      opacity: 1;
    }
    50% { 
      transform: translate(20px, -50px) scale(0.9);
      opacity: 0.9;
    }
    75% { 
      transform: translate(-30px, -25px) scale(1.1);
      opacity: 0.85;
    }
    100% { 
      transform: translate(0, 0) scale(1);
      opacity: 0.8;
    }
  }
  
  @keyframes orbitRotate {
    from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
    to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
  }
  
  @keyframes brandRingPulse {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.15);
      opacity: 0.3;
    }
  }
  
  @keyframes diamondRotate {
    0% { 
      transform: rotateY(0deg) rotateX(5deg);
    }
    100% { 
      transform: rotateY(360deg) rotateX(5deg);
    }
  }
  
  @keyframes diamondShimmer {
    0%, 100% { 
      opacity: 0.5;
    }
    50% { 
      opacity: 1;
    }
  }
  
  .diamond-face {
    transform-origin: center;
    animation: diamondRotate 8s linear infinite;
  }
  
  .diamond-face-1 {
    animation-delay: 0s;
  }
  
  .diamond-face-2 {
    animation-delay: 2s;
  }
  
  .diamond-face-3 {
    animation-delay: 4s;
  }
  
  .diamond-face-4 {
    animation-delay: 6s;
  }
  
  .diamond-highlight {
    animation: diamondShimmer 2s ease-in-out infinite;
  }
  
  .brand-logo svg {
    animation: diamondRotate 10s linear infinite;
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideUnderline {
    from { width: 0; }
    to { width: 100%; }
  }
  
  .orbit-circle {
    animation: orbitRotate 8s linear infinite;
  }
  
  .brand-ring {
    animation: brandRingPulse 3s ease-in-out infinite;
  }
  
  .nav-link:hover {
    color: rgba(255, 255, 255, 1);
  }
  
  .nav-link:hover .nav-underline {
    width: 100%;
  }
  
  input:focus + .input-glow {
    width: 100% !important;
  }
  
  .cta-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(74, 144, 226, 0.4);
  }
  
  .cta-button:hover svg {
    transform: translateX(3px);
  }
  
  .cta-button:active {
    transform: translateY(0);
  }
  
  .feature-card {
    animation: fadeInUp 0.7s ease both;
  }
  
  .feature-card:nth-child(1) { animation-delay: 0.1s; }
  .feature-card:nth-child(2) { animation-delay: 0.2s; }
  .feature-card:nth-child(3) { animation-delay: 0.3s; }
  .feature-card:nth-child(4) { animation-delay: 0.4s; }
  
  .feature-card:hover {
    transform: translateY(-6px);
    border-color: rgba(255, 255, 255, 0.25);
  }
  
  .feature-card:hover .card-border {
    width: 100%;
  }
  
  .stat-item:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .stat-item:hover .stat-accent {
    width: 100%;
  }
  
  .tech-card {
    animation: fadeInUp 0.7s ease both;
  }
  
  .tech-card:nth-child(1) { animation-delay: 0.15s; }
  .tech-card:nth-child(2) { animation-delay: 0.3s; }
  .tech-card:nth-child(3) { animation-delay: 0.45s; }
  
  .tech-card:hover {
    transform: translateY(-6px);
    border-color: rgba(255, 255, 255, 0.25);
  }
  
  .tech-card:hover .tech-accent {
    width: 100%;
  }
  
  .email-link:hover {
    color: #4A90E2;
  }
  
  .success-message {
    animation: fadeInUp 0.5s ease;
  }
  
  @media (max-width: 768px) {
    .desktop-nav {
      display: none !important;
    }
    
    .mobile-menu-btn {
      display: block !important;
    }
    
    .hide-mobile {
      display: none;
    }
    
    .signup-form {
      flex-direction: column;
      gap: 10px;
    }
    
    .features-grid {
      grid-template-columns: 1fr;
    }
    
    .stats-container {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .tech-grid {
      grid-template-columns: 1fr;
    }
    
    .footer-content {
      flex-direction: column;
      gap: 24px;
      text-align: center;
    }
    
    .hero-visual {
      height: 160px !important;
      margin-bottom: 30px !important;
    }
    
    .main-title {
      margin-bottom: 20px !important;
    }
    
    .subtitle {
      margin-bottom: 35px !important;
      font-size: 15px !important;
    }
    
    .badge {
      margin-bottom: 24px !important;
    }
    
    .launching-container {
      margin-bottom: 12px !important;
    }
    
    .launching-text {
      font-size: clamp(32px, 10vw, 48px) !important;
    }
    
    .coming-soon-section {
      margin-bottom: 30px !important;
    }
  }
  
  @media (min-width: 769px) {
    .mobile-menu-btn {
      display: none !important;
    }
  }
`;

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    color: '#ffffff',
    background: '#000000'
  },
  canvas: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
    opacity: 0.25
  },
  gradientOrb: {
    position: 'fixed',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    filter: 'blur(100px)',
    opacity: 0.4,
    pointerEvents: 'none',
    zIndex: 1,
    transition: 'all 0.5s ease'
  },
  backgroundOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at center, rgba(15, 15, 15, 0.6) 0%, rgba(0, 0, 0, 0.95) 100%)',
    zIndex: 2,
    pointerEvents: 'none'
  },
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: '18px 0',
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  navContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoContainer: {
    position: 'relative'
  },
  logoImage: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    objectFit: 'cover'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: '"Poppins", sans-serif'
  },
  navLinks: {
    display: 'flex',
    gap: '40px',
    alignItems: 'center'
  },
  navLink: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    fontWeight: '400',
    transition: 'color 0.2s ease',
    letterSpacing: '0.3px',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  navUnderline: {
    width: '0%',
    height: '1px',
    background: 'linear-gradient(90deg, #4A90E2 0%, #FF69B4 100%)',
    transition: 'width 0.3s ease'
  },
  mobileMenuButton: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    padding: '8px',
    fontSize: '22px'
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  mobileNavLink: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    fontWeight: '400',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    cursor: 'pointer'
  },
  content: {
    position: 'relative',
    zIndex: 10,
    padding: '100px 24px 60px'
  },
  heroSection: {
    maxWidth: '1100px',
    margin: '0 auto 100px',
    textAlign: 'center'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '400',
    marginBottom: '32px',
    letterSpacing: '0.8px'
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4A90E2 0%, #FF69B4 100%)',
    animation: 'pulse 2s ease-in-out infinite'
  },
  verifiedIcon: {
    marginLeft: '2px'
  },
  mainTitle: {
    fontSize: 'clamp(36px, 7vw, 84px)',
    fontWeight: '300',
    lineHeight: '1.15',
    marginBottom: '28px',
    letterSpacing: '-0.025em',
    transition: 'transform 0.1s ease'
  },
  titleLine: {
    display: 'block',
    color: '#ffffff'
  },
  titleLineGradient: {
    display: 'block',
    background: 'linear-gradient(135deg, #4A90E2 0%, #FF69B4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: '400'
  },
  subtitle: {
    fontSize: 'clamp(15px, 2vw, 19px)',
    lineHeight: '1.7',
    color: 'rgba(255, 255, 255, 0.65)',
    maxWidth: '750px',
    margin: '0 auto 50px',
    fontWeight: '300',
    letterSpacing: '0.01em'
  },
  heroVisual: {
    position: 'relative',
    width: '100%',
    maxWidth: '750px',
    height: '260px',
    margin: '0 auto 50px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    backdropFilter: 'blur(8px)'
  },
  brandVisual: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rotatingCircles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orbitCircle: {
    position: 'absolute',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4A90E2 0%, #FF69B4 100%)',
    boxShadow: '0 0 15px rgba(74, 144, 226, 0.5)'
  },
  brandCenter: {
    position: 'relative',
    width: '140px',
    height: '140px',
    zIndex: 2
  },
  brandRing: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    border: '2px solid rgba(74, 144, 226, 0.2)',
    borderRadius: '50%'
  },
  brandLogo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100px',
    height: '100px',
    background: 'rgba(0, 0, 0, 0.6)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)'
  },
  comingSoonSection: {
    marginBottom: '40px',
    position: 'relative'
  },
  launchingContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '16px'
  },
  launchingText: {
    fontSize: 'clamp(40px, 7vw, 72px)',
    fontWeight: '700',
    letterSpacing: '0.15em',
    color: 'rgba(255, 255, 255, 0.9)',
    position: 'relative',
    zIndex: 1,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  launchingLine: {
    display: 'block',
    whiteSpace: 'nowrap'
  },
  elegantUnderline: {
    width: '100%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, #4A90E2 20%, #FF69B4 80%, transparent 100%)',
    marginTop: '12px',
    opacity: 0.6
  },
  launchingSubtext: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '300',
    letterSpacing: '1px',
    marginTop: '8px'
  },
  signupSection: {
    maxWidth: '580px',
    margin: '0 auto'
  },
  signupForm: {
    display: 'flex',
    gap: '12px',
    padding: '6px',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px'
  },
  inputWrapper: {
    flex: 1,
    position: 'relative'
  },
  emailInput: {
    width: '100%',
    padding: '14px 18px',
    fontSize: '14px',
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontWeight: '300',
    letterSpacing: '0.02em',
    outline: 'none',
    position: 'relative',
    zIndex: 1
  },
  inputGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '0%',
    height: '1px',
    background: 'linear-gradient(90deg, #4A90E2 0%, #FF69B4 100%)',
    transition: 'width 0.3s ease'
  },
  ctaButton: {
    padding: '14px 24px',
    fontSize: '14px',
    fontWeight: '500',
    background: 'linear-gradient(135deg, #4A90E2 0%, #FF69B4 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    letterSpacing: '0.02em',
    boxShadow: '0 4px 16px rgba(74, 144, 226, 0.3)',
    whiteSpace: 'nowrap'
  },
  buttonIcon: {
    transition: 'transform 0.3s ease'
  },
  successMessage: {
    padding: '16px 20px',
    background: 'rgba(74, 144, 226, 0.1)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(74, 144, 226, 0.3)',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#4A90E2',
    fontWeight: '400',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  successIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(74, 144, 226, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    stroke: '#4A90E2'
  },
  reviewsSection: {
    maxWidth: '1400px',
    margin: '0 auto 100px',
    overflow: 'hidden',
    padding: '60px 0'
  },
  reviewsHeader: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  reviewsBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    background: 'rgba(255, 215, 0, 0.1)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    borderRadius: '50px',
    fontSize: '11px',
    fontWeight: '500',
    marginBottom: '20px',
    letterSpacing: '1.2px',
    color: '#FFD700'
  },
  reviewsBadgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#FFD700',
    animation: 'pulse 2s ease-in-out infinite'
  },
  reviewsTitle: {
    fontSize: 'clamp(32px, 5vw, 48px)',
    fontWeight: '500',
    marginBottom: '12px',
    letterSpacing: '-0.02em'
  },
  reviewsSubtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '300',
    letterSpacing: '0.3px'
  },
  reviewsWrapper: {
    overflow: 'hidden',
    position: 'relative',
    padding: '0 24px'
  },
  reviewsTrack: {
    display: 'flex',
    gap: '24px',
    transition: 'transform 0.8s ease-in-out',
    width: '200%'
  },
  reviewCard: {
    minWidth: 'calc(33.333% - 16px)',
    padding: '40px 32px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  },
  quoteIcon: {
    fontSize: '64px',
    lineHeight: '1',
    background: 'linear-gradient(135deg, #4A90E2 0%, #FF69B4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontFamily: 'Georgia, serif',
    opacity: 0.3,
    position: 'absolute',
    top: '20px',
    left: '24px'
  },
  reviewText: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '300',
    fontStyle: 'italic',
    position: 'relative',
    zIndex: 1,
    paddingTop: '30px'
  },
  reviewFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '20px'
  },
  reviewStars: {
    display: 'flex',
    gap: '4px'
  },
  star: {
    fontSize: '20px',
    color: '#FFD700'
  },
  reviewAuthorInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  authorNameWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  authorName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#ffffff'
  },
  verifiedBadge: {
    flexShrink: 0
  },
  authorRole: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '300'
  },
  certifiedText: {
    fontSize: '11px',
    color: '#4A90E2',
    fontWeight: '400',
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
    letterSpacing: '0.3px'
  },
  reviewsDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '32px'
  },
  reviewDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4A90E2 0%, #FF69B4 100%)',
    transition: 'opacity 0.3s ease'
  },
  featuresSection: {
    maxWidth: '1300px',
    margin: '0 auto 100px',
    scrollMarginTop: '100px'
  },
  sectionTitle: {
    fontSize: 'clamp(28px, 5vw, 52px)',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: '50px',
    letterSpacing: '-0.015em'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px'
  },
  featureCard: {
    position: 'relative',
    padding: '32px 26px',
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    transition: 'all 0.4s ease',
    overflow: 'hidden'
  },
  featureNumber: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '18px',
    color: '#ffffff',
    letterSpacing: '0.5px'
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '500',
    marginBottom: '10px',
    letterSpacing: '-0.01em'
  },
  featureDesc: {
    fontSize: '13px',
    lineHeight: '1.7',
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '300'
  },
  cardBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '0%',
    height: '2px',
    background: 'linear-gradient(90deg, #4A90E2 0%, #FF69B4 100%)',
    transition: 'width 0.5s ease'
  },
  statsSection: {
    maxWidth: '1100px',
    margin: '0 auto 100px',
    scrollMarginTop: '100px'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px'
  },
  statItem: {
    textAlign: 'center',
    padding: '28px 20px',
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  statValue: {
    fontSize: '48px',
    fontWeight: '300',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #4A90E2 0%, #FF69B4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em'
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
    letterSpacing: '0.5px'
  },
  statAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '0%',
    height: '2px',
    background: 'linear-gradient(90deg, #4A90E2 0%, #FF69B4 100%)',
    transition: 'width 0.5s ease'
  },
  techSection: {
    maxWidth: '1300px',
    margin: '0 auto 100px',
    scrollMarginTop: '100px'
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  techCard: {
    padding: '36px 28px',
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    transition: 'all 0.4s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  techNumber: {
    display: 'inline-block',
    padding: '6px 16px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '20px',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: '0.5px'
  },
  techTitle: {
    fontSize: '24px',
    fontWeight: '500',
    marginBottom: '12px',
    letterSpacing: '-0.01em'
  },
  techDesc: {
    fontSize: '14px',
    lineHeight: '1.8',
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '300'
  },
  techAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '0%',
    height: '2px',
    background: 'linear-gradient(90deg, #4A90E2 0%, #FF69B4 100%)',
    transition: 'width 0.5s ease'
  },
  footer: {
    maxWidth: '1300px',
    margin: '0 auto',
    paddingTop: '50px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '36px',
    flexWrap: 'wrap',
    gap: '24px'
  },
  footerBrand: {
    maxWidth: '300px'
  },
  footerLogo: {
    fontSize: '22px',
    fontWeight: '700',
    display: 'block',
    marginBottom: '10px',
    letterSpacing: '0.5px',
    color: '#ffffff',
    fontFamily: '"Poppins", sans-serif'
  },
  footerTagline: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: '1.6',
    fontWeight: '300',
    letterSpacing: '0.3px'
  },
  footerContact: {
    display: 'flex',
    alignItems: 'center'
  },
  emailLink: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    fontWeight: '400',
    transition: 'color 0.2s ease',
    letterSpacing: '0.02em'
  },
  footerBottom: {
    paddingTop: '24px',
    paddingBottom: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    textAlign: 'center'
  },
  copyright: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '300'
  }
}