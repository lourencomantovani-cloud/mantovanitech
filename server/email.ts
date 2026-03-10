import nodemailer from "nodemailer";

interface LeadEmailData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  source?: string;
}

function createTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "465");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("[Email] SMTP não configurado. Emails serão apenas logados.");
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

export async function sendLeadEmail(data: LeadEmailData): Promise<boolean> {
  const transporter = createTransporter();
  const destinatario = "contact@mantovanitech.com";

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #06b6d4); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; }
        .body { padding: 30px; }
        .field { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #10b981; }
        .field .label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }
        .field .value { display: block; font-size: 16px; color: #1e293b; margin-top: 4px; font-weight: 600; }
        .footer { background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
        .badge { display: inline-block; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Novo Lead Capturado!</h1>
          <p>Mantovani Tech — Sistema de Captação</p>
        </div>
        <div class="body">
          <div class="field">
            <div class="label">👤 Nome</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">📧 Email do Lead</div>
            <div class="value">${data.email}</div>
          </div>
          <div class="field">
            <div class="label">📱 WhatsApp / Telefone</div>
            <div class="value">${data.phone}</div>
          </div>
          ${data.message ? `
          <div class="field">
            <div class="label">💬 Mensagem</div>
            <div class="value">${data.message}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">📍 Origem</div>
            <div class="value">${data.source === 'exit_intent' ? 'Popup de Saída (Exit Intent)' : 'Formulário de Contato'}</div>
            <span class="badge">${new Date().toLocaleString('pt-BR', { timeZone: 'America/Asuncion' })}</span>
          </div>
        </div>
        <div class="footer">
          <p>Este email foi gerado automaticamente pelo sistema da Mantovani Tech.</p>
          <p>Para responder ao lead, entre em contato com: <strong>${data.email}</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textBody = `
NOVO LEAD - Mantovani Tech
==========================
Nome: ${data.name}
Email do Lead: ${data.email}
Telefone: ${data.phone}
${data.message ? `Mensagem: ${data.message}` : ''}
Origem: ${data.source === 'exit_intent' ? 'Popup de Saída' : 'Formulário de Contato'}
Data: ${new Date().toLocaleString('pt-BR')}
  `.trim();

  if (!transporter) {
    console.log("[Email] Lead recebido (sem SMTP configurado):", data);
    console.log("[Email] Destinatário seria:", destinatario);
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Mantovani Tech - Leads" <${process.env.SMTP_USER}>`,
      to: destinatario,
      replyTo: data.email,
      subject: `🚀 Novo Lead: ${data.name} — Mantovani Tech`,
      text: textBody,
      html: htmlBody,
    });
    console.log(`[Email] Lead enviado com sucesso para ${destinatario}`);
    return true;
  } catch (error) {
    console.error("[Email] Erro ao enviar email:", error);
    return false;
  }
}
