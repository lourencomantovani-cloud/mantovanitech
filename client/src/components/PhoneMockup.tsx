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
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      icon: Zap,
      title: t('features.performance'),
      subtitle: t('features.performanceSub'),
      color: 'from-cyan-400 to-cyan-600'
    },
    {
      icon: Shield,
      title: t('features.security'),
      subtitle: t('features.securitySub'),
      color: 'from-emerald-400 to-cyan-600'
    }
  ];

  return (
    <div className="relative flex items-center justify-center py-8">
      {/* Tablet Frame — portrait: largura menor que altura */}
      <div
        style={{
          width: '260px',
          height: '360px',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '24px',
          border: '8px solid #334155',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(16,185,129,0.15)',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Camera / Notch */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '8px',
            height: '8px',
            background: '#475569',
            borderRadius: '50%',
            zIndex: 10,
          }}
        />

        {/* Screen area */}
        <div
          style={{
            position: 'absolute',
            inset: '4px',
            borderRadius: '18px',
            overflow: 'hidden',
            background: '#0f172a',
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
                  padding: '24px',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'scale(1)' : 'scale(0.95)',
                  transition: 'opacity 0.8s ease, transform 0.8s ease',
                }}
              >
                {/* Background glow */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(135deg, ${idx === 0 ? '#10b981' : idx === 1 ? '#06b6d4' : '#10b981'}, ${idx === 0 ? '#059669' : idx === 1 ? '#0891b2' : '#06b6d4'})`,
                    opacity: 0.08,
                  }}
                />

                {/* Icon */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    background: `linear-gradient(135deg, ${idx === 0 ? '#10b981, #059669' : idx === 1 ? '#06b6d4, #0891b2' : '#10b981, #06b6d4'})`,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <IconComp color="white" size={28} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '18px',
                    textAlign: 'center',
                    marginBottom: '8px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {screen.title}
                </h3>

                {/* Subtitle */}
                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: '13px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                    marginBottom: '20px',
                  }}
                >
                  {screen.subtitle}
                </p>

                {/* Dots */}
                <div style={{ display: 'flex', gap: '6px', position: 'relative', zIndex: 1 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: '6px',
                        width: i === activeScreen ? '20px' : '6px',
                        borderRadius: '3px',
                        background: i === activeScreen ? '#10b981' : '#475569',
                        transition: 'width 0.3s ease, background 0.3s ease',
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
            bottom: '6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '3px',
            background: '#475569',
            borderRadius: '2px',
          }}
        />
      </div>

      {/* Glow behind */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 70%)',
          borderRadius: '32px',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
