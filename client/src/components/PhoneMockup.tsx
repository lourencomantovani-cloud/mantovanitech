import { useState, useEffect } from 'react';
import { Code, Zap, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function PhoneMockup() {
  const { t } = useLanguage();
  const [activeScreen, setActiveScreen] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % 3);
    }, 4000);
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

  const Screen = screens[activeScreen];
  const IconComponent = Screen.icon;

  return (
    <div className="relative h-96 md:h-full flex items-center justify-center">
      {/* Phone Frame */}
      <div className="relative w-72 h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl border-8 border-slate-700 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-10"></div>

        {/* Screen Content */}
        <div className="absolute inset-8 top-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
          {/* Screen Transitions */}
          {screens.map((screen, idx) => {
            const isActive = idx === activeScreen;
            return (
              <div
                key={idx}
                className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-1000 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${screen.color} opacity-10`}></div>

                {/* Content */}
                <div className="relative z-10 text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${screen.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <IconComponent className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{screen.title}</h3>
                  <p className="text-sm text-slate-300">{screen.subtitle}</p>

                  {/* Animated Dots */}
                  <div className="flex gap-2 justify-center pt-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i === activeScreen
                            ? 'bg-emerald-400 w-6'
                            : 'bg-slate-600'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Home Button */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-slate-600 rounded-full"></div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-3xl -z-10"></div>
    </div>
  );
}
