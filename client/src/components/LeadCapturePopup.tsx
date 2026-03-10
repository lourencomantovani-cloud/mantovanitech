import { useState } from 'react';
import { X, Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface LeadCapturePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadCapturePopup({ isOpen, onClose }: LeadCapturePopupProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success(t('popup.successText'));
      setTimeout(() => {
        onClose();
        setFormData({ name: '', email: '', phone: '' });
        setSubmitted(false);
      }, 2500);
    },
    onError: () => {
      toast.error("Erro ao enviar. Tente pelo WhatsApp!");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      source: 'exit_intent',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        style={{ animation: 'fadeInScale 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-xs font-bold mb-2">
            {t('popup.badge')}
          </div>
          <h2 className="text-white font-bold text-2xl">{t('popup.title')}</h2>
          <p className="text-white/90 text-sm mt-1">{t('popup.subtitle')}</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                {t('popup.name')} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t('popup.namePlaceholder')}
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                {t('popup.email')} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('popup.emailPlaceholder')}
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                {t('popup.phone')} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder={t('popup.phonePlaceholder')}
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                {t('popup.maybe')}
              </Button>
              <Button
                type="submit"
                disabled={submitLead.isPending}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold shadow-lg hover:shadow-emerald-500/50 transition-all"
              >
                {submitLead.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    ...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={16} />
                    {t('popup.submit')}
                  </span>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="text-emerald-500 mx-auto" size={52} />
            <h3 className="text-xl font-bold text-slate-900">{t('popup.successTitle')}</h3>
            <p className="text-slate-600">{t('popup.successText')}</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
