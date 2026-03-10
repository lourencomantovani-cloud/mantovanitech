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

  const dataHora = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Asuncion",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const origemLabel =
    data.source === "exit_intent"
      ? "🚪 Popup de Saída (Exit Intent)"
      : "📋 Formulário de Contato";

  const whatsappLink = data.phone
    ? `https://wa.me/${data.phone.replace(/\D/g, "")}?text=Olá%20${encodeURIComponent(data.name)},%20vi%20seu%20contato%20no%20site%20da%20Mantovani%20Tech!`
    : null;

  const htmlBody = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Novo Lead — Mantovani Tech</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#10b981,#06b6d4);padding:32px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:12px;padding:10px 20px;margin-bottom:12px;">
                <span style="color:#ffffff;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Mantovani Tech</span>
              </div>
              <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:800;">🚀 Novo Lead Capturado!</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">${dataHora} — ${origemLabel}</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:32px 40px;">

              <!-- Alert box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;color:#166534;font-size:14px;font-weight:600;">
                      ✅ Um novo potencial cliente entrou em contato pelo seu site. Responda o quanto antes para aumentar a conversão!
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Fields -->
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Nome -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;border-left:4px solid #10b981;">
                      <tr>
                        <td style="padding:14px 18px;">
                          <p style="margin:0 0 4px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">👤 Nome Completo</p>
                          <p style="margin:0;font-size:17px;color:#0f172a;font-weight:700;">${data.name}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;border-left:4px solid #06b6d4;">
                      <tr>
                        <td style="padding:14px 18px;">
                          <p style="margin:0 0 4px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">📧 E-mail do Lead</p>
                          <p style="margin:0;font-size:16px;color:#0f172a;font-weight:600;">
                            <a href="mailto:${data.email}" style="color:#0891b2;text-decoration:none;">${data.email}</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Telefone -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;border-left:4px solid #10b981;">
                      <tr>
                        <td style="padding:14px 18px;">
                          <p style="margin:0 0 4px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">📱 WhatsApp / Telefone</p>
                          <p style="margin:0;font-size:16px;color:#0f172a;font-weight:600;">${data.phone}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${
                  data.message
                    ? `
                <!-- Mensagem -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;border-left:4px solid #8b5cf6;">
                      <tr>
                        <td style="padding:14px 18px;">
                          <p style="margin:0 0 8px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;">💬 Mensagem do Lead</p>
                          <p style="margin:0;font-size:15px;color:#334155;line-height:1.6;">${data.message}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`
                    : ""
                }

              </table>

              <!-- Action Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <a href="mailto:${data.email}?subject=Mantovani Tech — Recebemos seu contato!&body=Olá ${encodeURIComponent(data.name)},%0A%0AObrigado por entrar em contato com a Mantovani Tech!%0A%0AEm breve retornaremos."
                       style="display:inline-block;background:linear-gradient(135deg,#10b981,#06b6d4);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;width:100%;box-sizing:border-box;text-align:center;">
                      📧 Responder por E-mail
                    </a>
                  </td>
                </tr>
                ${
                  whatsappLink
                    ? `<tr>
                  <td align="center">
                    <a href="${whatsappLink}"
                       style="display:inline-block;background:#25d366;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;width:100%;box-sizing:border-box;text-align:center;">
                      💬 Responder pelo WhatsApp
                    </a>
                  </td>
                </tr>`
                    : ""
                }
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;">Este email foi gerado automaticamente pelo sistema da <strong>Mantovani Tech</strong>.</p>
              <p style="margin:0;color:#94a3b8;font-size:12px;">Origem: ${origemLabel} • ${dataHora}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `;

  const textBody = `
NOVO LEAD — Mantovani Tech
==========================
Data/Hora : ${dataHora}
Origem    : ${origemLabel}

DADOS DO LEAD
-------------
Nome      : ${data.name}
E-mail    : ${data.email}
Telefone  : ${data.phone}
${data.message ? `Mensagem  : ${data.message}` : ""}

AÇÕES RÁPIDAS
-------------
Responder por e-mail : mailto:${data.email}
${whatsappLink ? `Responder no WhatsApp : ${whatsappLink}` : ""}
  `.trim();

  if (!transporter) {
    console.log("[Email] Lead recebido (sem SMTP configurado):", data);
    console.log("[Email] Destinatário seria:", destinatario);
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Mantovani Tech — Leads" <${process.env.SMTP_USER}>`,
      to: destinatario,
      replyTo: data.email,
      subject: `🚀 Novo Lead: ${data.name} — ${dataHora}`,
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
