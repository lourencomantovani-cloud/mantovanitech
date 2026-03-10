import { useState, useEffect } from 'react';
import { Code, Zap, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function PhoneMockup() {
  const { t } = useLanguage();
  const [activeScreen, setActiveScreen] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const screens = [
    {
      icon: Code,
      title: t('features.development'),
      subtitle: t('features.developmentSub'),
      gradientStart: '#10b981',
      gradientEnd: '#059669',
    },
    {
      icon: Zap,
      title: t('features.performance'),
      subtitle: t('features.performanceSub'),
      gradientStart: '#06b6d4',
      gradientEnd: '#0891b2',
    },
    {
      icon: Shield,
      title: t('features.security'),
      subtitle: t('features.securitySub'),
      gradientStart: '#10b981',
      gradientEnd: '#06b6d4',
    },
  ];

  return (
    /* Outer wrapper — takes full height of grid cell, centers content */
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '420px',
        position: 'relative',
      }}
    >
      {/* Glow behind the device */}
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '400px',
          background:
            'radial-gradient(ellipse at center, rgba(16,185,129,0.18) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Device shell ── portrait: width < height ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '240px',       /* narrower  */
          height: '420px',      /* taller    */
          flexShrink: 0,
          background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '36px',
          border: '8px solid #334155',
          boxShadow:
            '0 30px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Top camera dot */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '10px',
            height: '10px',
            background: '#475569',
            borderRadius: '50%',
            zIndex: 10,
          }}
        />

        {/* Screen area */}
        <div
          style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            right: '6px',
            bottom: '6px',
            borderRadius: '30px',
            background: '#0f172a',
            overflow: 'hidden',
          }}
        >
          {screens.map((screen, idx) => {
            const IconComp = screen.icon;
            const isActive = idx === activeScreen;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '28px 20px',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(8px)',
                  transition: 'opacity 0.7s ease, transform 0.7s ease',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                {/* Subtle color wash */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(135deg, ${screen.gradientStart}18, ${screen.gradientEnd}10)`,
                  }}
                />

                {/* Icon badge */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '72px',
                    height: '72px',
                    background: `linear-gradient(135deg, ${screen.gradientStart}, ${screen.gradientEnd})`,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    boxShadow: `0 10px 30px ${screen.gradientStart}55`,
                  }}
                >
                  <IconComp color="white" size={32} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    color: '#f1f5f9',
                    fontWeight: 700,
                    fontSize: '17px',
                    textAlign: 'center',
                    margin: '0 0 8px',
                    lineHeight: 1.3,
                  }}
                >
                  {screen.title}
                </h3>

                {/* Subtitle */}
                <p
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    color: '#94a3b8',
                    fontSize: '12px',
                    textAlign: 'center',
                    margin: '0 0 24px',
                    lineHeight: 1.5,
                  }}
                >
                  {screen.subtitle}
                </p>

                {/* Progress dots */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: '6px',
                        width: i === activeScreen ? '22px' : '6px',
                        borderRadius: '3px',
                        background: i === activeScreen ? screen.gradientStart : '#334155',
                        transition: 'width 0.4s ease, background 0.4s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Home bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '56px',
            height: '4px',
            background: '#475569',
            borderRadius: '2px',
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}
