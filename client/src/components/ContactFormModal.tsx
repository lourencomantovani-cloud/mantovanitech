import { useState } from "react";
import { X, Send, CheckCircle, Loader2, User, Mail, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: "contact_form" | "exit_intent";
}

export function ContactFormModal({ isOpen, onClose, source = "contact_form" }: ContactFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setTimeout(() => {
        onClose();
        setFormData({ name: "", email: "", phone: "", message: "" });
        setSubmitted(false);
      }, 3000);
    },
    onError: (err) => {
      toast.error("Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.");
      console.error("[ContactForm] Erro:", err);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message || undefined,
      source,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        style={{ animation: "fadeInScale 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-all"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-white" size={22} />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Fale Conosco</h2>
              <p className="text-white/80 text-sm">Responderemos em até 24h</p>
            </div>
          </div>
        </div>

        {/* Body */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Nome */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
                <User size={14} className="text-emerald-500" />
                Nome Completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Seu nome completo"
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
                <Mail size={14} className="text-emerald-500" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
                <Phone size={14} className="text-emerald-500" />
                WhatsApp / Telefone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+55 (41) 98776-8901"
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Mensagem */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
                <MessageSquare size={14} className="text-emerald-500" />
                Mensagem (opcional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva seu projeto ou dúvida..."
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitLead.isPending}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105"
              >
                {submitLead.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={16} />
                    Enviar Mensagem
                  </span>
                )}
              </Button>
            </div>

            <p className="text-xs text-slate-400 text-center">
              Seus dados serão enviados para contact@mantovanitech.com
            </p>
          </form>
        ) : (
          <div className="p-10 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="text-emerald-500" size={56} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Mensagem Enviada!</h3>
            <p className="text-slate-600">
              Recebemos seu contato! Nossa equipe entrará em contato em breve pelo WhatsApp ou email informado.
            </p>
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
