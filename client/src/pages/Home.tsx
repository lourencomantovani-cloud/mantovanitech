import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Phone, Code, Zap, Shield, Users, ArrowRight, Menu, X, ChevronDown, Globe, MessageSquare } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { PhoneMockup } from "@/components/PhoneMockup";
import { useLanguage } from "@/contexts/LanguageContext";
import { LeadCapturePopup } from "@/components/LeadCapturePopup";
import { ContactFormModal } from "@/components/ContactFormModal";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showLeadPopup, setShowLeadPopup] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const popupShownRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detectar tentativa de sair da página
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasInteracted && !popupShownRef.current) {
        e.preventDefault();
        e.returnValue = '';
        setShowLeadPopup(true);
        popupShownRef.current = true;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasInteracted]);

  // Rastrear interações com botões
  const handleButtonInteraction = () => {
    setHasInteracted(true);
    popupShownRef.current = true;
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷', flagImg: 'https://flagcdn.com/w40/br.png' },
    { code: 'en', name: 'English', flag: '🇺🇸', flagImg: 'https://flagcdn.com/w40/us.png' },
    { code: 'es', name: 'Español', flag: '🇪🇸', flagImg: 'https://flagcdn.com/w40/es.png' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', flagImg: 'https://flagcdn.com/w40/it.png' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', flagImg: 'https://flagcdn.com/w40/de.png' }
  ];

  const whatsappPY = "https://wa.me/393920172546?text=Olá%20Mantovani%20Tech,%20gostaria%20de%20conhecer%20seus%20serviços";
  const whatsappIT = "https://wa.me/393896665147?text=Ciao%20Mantovani%20Tech,%20vorrei%20conoscere%20i%20vostri%20servizi";
  const emailPY = "mailto:contact@mantovanitech.com";
  const emailIT = "mailto:felipe@mantovanitech.com";
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Coordenadas do EDIFICIO CÓRDOBA em Ciudad del Este
  const locationCoordinates = { lat: -25.5038661, lng: -54.6370043 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 text-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header/Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300 shadow-md">
              MT
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900">Mantovani</span>
              <span className="text-xs text-emerald-600">Tech</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <a href="#servicos" className="text-slate-700 hover:text-emerald-600 transition-colors duration-300 font-medium">{t('nav.servicos')}</a>
            <a href="#depoimentos" className="text-slate-700 hover:text-emerald-600 transition-colors duration-300 font-medium">{t('nav.depoimentos')}</a>
            <a href="#faq" className="text-slate-700 hover:text-emerald-600 transition-colors duration-300 font-medium">{t('nav.faq')}</a>
            <a href="#contato" className="text-slate-700 hover:text-emerald-600 transition-colors duration-300 font-medium">{t('nav.contato')}</a>
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border-2 border-emerald-500 text-slate-900 hover:bg-emerald-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <img 
                  src={languages.find(l => l.code === language)?.flagImg} 
                  alt={language}
                  className="w-6 h-4 object-cover rounded-sm shadow-sm"
                />
                <span className="text-sm font-semibold">{language.toUpperCase()}</span>
              </button>
              {showLanguageMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white border-2 border-emerald-500 rounded-xl shadow-xl overflow-hidden z-50 min-w-[160px]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-emerald-50 transition-colors text-sm ${
                        language === lang.code ? 'bg-emerald-100 font-bold text-emerald-700' : 'text-slate-700'
                      }`}
                    >
                      <img 
                        src={lang.flagImg} 
                        alt={lang.name}
                        className="w-7 h-5 object-cover rounded-sm shadow-sm flex-shrink-0"
                      />
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button 
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
              onClick={() => window.open(whatsappPY, '_blank')}
            >
              {t('nav.conversar')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} className="text-slate-900" /> : <Menu size={24} className="text-slate-900" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t-2 border-emerald-500">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#servicos" className="text-slate-700 hover:text-emerald-600 transition-colors">{t('nav.servicos')}</a>
              <a href="#depoimentos" className="text-slate-700 hover:text-emerald-600 transition-colors">{t('nav.depoimentos')}</a>
              <a href="#faq" className="text-slate-700 hover:text-emerald-600 transition-colors">{t('nav.faq')}</a>
              <a href="#contato" className="text-slate-700 hover:text-emerald-600 transition-colors">{t('nav.contato')}</a>
              
              {/* Mobile Language Selector */}
              <div className="grid grid-cols-5 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setIsMenuOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                      language === lang.code 
                        ? 'bg-emerald-500 shadow-md ring-2 ring-emerald-300' 
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <img 
                      src={lang.flagImg} 
                      alt={lang.name}
                      className="w-8 h-5 object-cover rounded-sm shadow-sm"
                    />
                    <span className={`text-[10px] font-bold ${language === lang.code ? 'text-white' : 'text-slate-700'}`}>
                      {lang.code.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold"
                onClick={() => window.open(whatsappPY, '_blank')}
              >
                {t('nav.conversar')}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-emerald-100 border-2 border-emerald-500 rounded-full text-emerald-700 text-sm font-semibold shadow-md">
                  {t('hero.badge')}
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  {t('hero.title')}
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  {t('hero.description')}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  className="group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold px-8 py-6 text-lg shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    handleButtonInteraction();
                    window.open(whatsappPY, '_blank');
                  }}
                >
                  <span className="flex items-center gap-2">
                    {t('hero.cta1')}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-lg transition-all duration-300 shadow-md hover:shadow-lg font-bold"
                  onClick={() => {
                    handleButtonInteraction();
                    document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('hero.cta2')}
                </Button>
                <Button 
                  className="group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold px-8 py-6 text-lg shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    handleButtonInteraction();
                    setShowContactForm(true);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare size={20} />
                    Enviar Mensagem
                  </span>
                </Button>
              </div>


            </div>

            {/* Right Content - Phone Mockup */}
            <div className="relative">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="relative py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">{t('services.title')}</h2>
            <p className="text-xl text-slate-600">{t('services.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Code, title: t('services.mobile'), desc: t('services.mobileSub') },
              { icon: Zap, title: t('services.web'), desc: t('services.webSub') },
              { icon: Shield, title: t('services.security'), desc: t('services.securitySub') },
              { icon: Users, title: t('services.integration'), desc: t('services.integrationSub') },
              { icon: Zap, title: t('services.infrastructure'), desc: t('services.infrastructureSub') },
              { icon: Code, title: t('services.support'), desc: t('services.supportSub') }
            ].map((service, idx) => (
              <Card 
                key={idx}
                className="group bg-white border-2 border-slate-200 hover:border-emerald-500 p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-md hover:shadow-emerald-500/30 cursor-pointer"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg flex items-center justify-center mb-6 group-hover:from-emerald-500/20 group-hover:to-cyan-500/20 transition-all duration-300 shadow-md">
                  <service.icon className="text-emerald-600 group-hover:text-cyan-600 transition-colors" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-emerald-600 transition-colors">{service.title}</h3>
                <p className="text-slate-600 group-hover:text-slate-700 transition-colors">{service.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="relative py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">{t('testimonials.title')}</h2>
            <p className="text-xl text-slate-600">{t('testimonials.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "João Silva", role: "CEO, Tech Startup", text: t('testimonials.testimonial1'), rating: 5 },
              { name: "Maria Santos", role: "Diretora, E-commerce", text: t('testimonials.testimonial2'), rating: 5 },
              { name: "Carlos Mendes", role: "Founder, SaaS", text: t('testimonials.testimonial3'), rating: 5 }
            ].map((testimonial, idx) => (
              <Card 
                key={idx}
                className="bg-white border-2 border-slate-200 p-8 rounded-2xl hover:border-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-emerald-500">★</span>
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">{t('faq.title')}</h2>
            <p className="text-xl text-slate-600">{t('faq.subtitle')}</p>
          </div>

          <div className="space-y-4">
            {[
              { id: "q1", question: t('faq.q1'), answer: t('faq.a1') },
              { id: "q2", question: t('faq.q2'), answer: t('faq.a2') },
              { id: "q3", question: t('faq.q3'), answer: t('faq.a3') },
              { id: "q4", question: t('faq.q4'), answer: t('faq.a4') },
              { id: "q5", question: t('faq.q5'), answer: t('faq.a5') }
            ].map((faq) => (
              <div 
                key={faq.id}
                className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-emerald-500 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-lg text-slate-900 text-left">{faq.question}</span>
                  <ChevronDown 
                    size={24} 
                    className={`text-emerald-600 transition-transform duration-300 ${activeAccordion === faq.id ? 'rotate-180' : ''}`}
                  />
                </button>
                {activeAccordion === faq.id && (
                  <div className="px-6 py-4 border-t-2 border-slate-200 text-slate-700 bg-slate-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="relative py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 border-2 border-emerald-500 rounded-3xl p-12 md:p-16 space-y-8 shadow-xl">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">{t('contact.title')}</h2>
              <p className="text-xl text-slate-600">{t('contact.subtitle')}</p>
            </div>

            {/* Paraguay and Italy Sections */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Paraguay */}
              <div className="space-y-6 bg-white p-8 rounded-2xl border-2 border-emerald-500 shadow-md">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  🇵🇾 {t('contact.py')}
                </h3>
                
                {/* WhatsApp PY */}
                <a 
                  href={whatsappPY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-start gap-3 p-4 bg-slate-50 rounded-xl border-2 border-emerald-500 hover:border-emerald-600 transition-all duration-300 hover:bg-emerald-50 shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300 shadow-md">
                      <Phone className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{t('contact.whatsapp')}</p>
                      <p className="text-sm text-slate-600">+39 392 017 2546</p>
                    </div>
                  </div>
                </a>

                {/* Email PY */}
                <a 
                  href={emailPY}
                  className="group flex flex-col items-start gap-3 p-4 bg-slate-50 rounded-xl border-2 border-emerald-500 hover:border-emerald-600 transition-all duration-300 hover:bg-emerald-50 shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300 shadow-md">
                      <Mail className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{t('contact.email')}</p>
                      <p className="text-sm text-slate-600">contact@mantovanitech.com</p>
                    </div>
                  </div>
                </a>
              </div>

              {/* Italy */}
              <div className="space-y-6 bg-white p-8 rounded-2xl border-2 border-cyan-500 shadow-md">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  🇮🇹 {t('contact.italy')}
                </h3>
                
                {/* WhatsApp IT */}
                <a 
                  href={whatsappIT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-start gap-3 p-4 bg-slate-50 rounded-xl border-2 border-cyan-500 hover:border-cyan-600 transition-all duration-300 hover:bg-cyan-50 shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300 shadow-md">
                      <Phone className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{t('contact.whatsapp')}</p>
                      <p className="text-sm text-slate-600">+39 389 666 5147</p>
                    </div>
                  </div>
                </a>

                {/* Email IT */}
                <a 
                  href={emailIT}
                  className="group flex flex-col items-start gap-3 p-4 bg-slate-50 rounded-xl border-2 border-cyan-500 hover:border-cyan-600 transition-all duration-300 hover:bg-cyan-50 shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300 shadow-md">
                      <Mail className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{t('contact.email')}</p>
                      <p className="text-sm text-slate-600">felipe@mantovanitech.com</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{t('contact.location')}</p>
                    <p className="text-slate-600 mt-2">EDIFICIO CÓRDOBA</p>
                    <p className="text-slate-600">Oficinas Corporativas</p>
                    <p className="text-slate-600 text-sm mt-2">Barrio Pablo Rojas, Calle Abdon Palacios, km 4<br/>Ciudad del Este - Sala 202</p>
                  </div>
                </div>
              </div>
              
              {/* Google Maps Embed */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3567.5038661!2d-54.6370043!3d-25.5038661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x945d8e8e8e8e8e8f%3A0x8e8e8e8e8e8e8e8e!2sEDIFICIO%20CÓRDOBA!5e0!3m2!1spt-BR!2spy!4v1234567890"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl"
                />
              </div>
            </div>

            {/* Main CTA Button */}
            <div className="flex justify-center pt-8">
              <Button 
                className="group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold px-12 py-7 text-lg shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
                onClick={() => window.open(whatsappPY, '_blank')}
              >
                <span className="flex items-center gap-2">
                  {t('contact.cta')}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t-2 border-slate-300 bg-white/80 backdrop-blur-xl py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-5 gap-4 mb-4">
            {/* Brand */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-md">
                  MT
                </div>
                <span className="font-bold text-slate-900 text-sm">Mantovani Tech</span>
              </div>
              <p className="text-xs text-slate-600">Soluções digitais inovadoras</p>
            </div>
            
            {/* Services */}
            <div>
              <p className="font-bold text-slate-900 mb-2 text-xs">{t('nav.servicos')}</p>
              <ul className="space-y-1 text-xs text-slate-600">
                <li><a href="#servicos" className="hover:text-emerald-600 transition-colors">Web</a></li>
                <li><a href="#servicos" className="hover:text-emerald-600 transition-colors">Mobile</a></li>
                <li><a href="#servicos" className="hover:text-emerald-600 transition-colors">Integração</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <p className="font-bold text-slate-900 mb-2 text-xs">Empresa</p>
              <ul className="space-y-1 text-xs text-slate-600">
                <li><a href="#depoimentos" className="hover:text-emerald-600 transition-colors">Clientes</a></li>
                <li><a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a></li>
                <li><a href="#contato" className="hover:text-emerald-600 transition-colors">Contato</a></li>
              </ul>
            </div>
            
            {/* Paraguay */}
            <div>
              <p className="font-bold text-slate-900 mb-2 text-xs">🇵🇾 PY</p>
              <ul className="space-y-1 text-xs text-slate-600">
                <li className="flex items-center gap-1">
                  <Phone size={12} className="text-emerald-600 flex-shrink-0" />
                  <a href="tel:+393920172546" className="hover:text-emerald-600 transition-colors">+39 392 017 2546</a>
                </li>
                <li className="flex items-start gap-1">
                  <Mail size={12} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <a href="mailto:contact@mantovanitech.com" className="hover:text-emerald-600 transition-colors break-all">contact@mantovanitech.com</a>
                </li>
              </ul>
            </div>
            
            {/* Italy */}
            <div>
              <p className="font-bold text-slate-900 mb-2 text-xs">🇮🇹 IT</p>
              <ul className="space-y-1 text-xs text-slate-600">
                <li className="flex items-center gap-1">
                  <Phone size={12} className="text-cyan-600 flex-shrink-0" />
                  <a href="tel:+393896665147" className="hover:text-cyan-600 transition-colors">+39 389 666 5147</a>
                </li>
                <li className="flex items-start gap-1">
                  <Mail size={12} className="text-cyan-600 flex-shrink-0 mt-0.5" />
                  <a href="mailto:felipe@mantovanitech.com" className="hover:text-cyan-600 transition-colors break-all">felipe@mantovanitech.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-slate-300 pt-3 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 gap-2">
            <p>© 2024 Mantovani Tech. {t('footer.copyright')}</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-emerald-600 transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">{t('footer.terms')}</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">{t('footer.cookies')}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={whatsappPY}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-110 z-40 animate-pulse"
        onClick={handleButtonInteraction}
      >
        <Phone className="text-white" size={28} />
      </a>

      {/* Lead Capture Popup (exit intent) */}
      <LeadCapturePopup 
        isOpen={showLeadPopup} 
        onClose={() => setShowLeadPopup(false)} 
      />

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        source="contact_form"
      />
    </div>
  );
}
