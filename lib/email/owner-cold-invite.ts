type OwnerColdInviteEmailParams = {
  baseUrl: string;
  propertyName: string;
  previewUrl: string;
  replyEmail?: string | null;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const renderOwnerColdInviteEmail = ({
  baseUrl,
  propertyName,
  previewUrl,
  replyEmail,
}: OwnerColdInviteEmailParams) => {
  const logoUrl = new URL("/logo.png", baseUrl).toString();
  const safePropertyName = escapeHtml(propertyName);
  const safePreviewUrl = escapeHtml(previewUrl);
  const safeReplyEmail = replyEmail ? escapeHtml(replyEmail) : null;
  const replyHref = safeReplyEmail
    ? `mailto:${safeReplyEmail}`
    : safePreviewUrl;

  return `
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Il tuo sito e pronto</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f3f5f7;color:#1f2a2e;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      La preview della tua proprieta ${safePropertyName} e pronta.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f5f7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 22px 50px rgba(15,23,42,0.12);">
            <tr>
              <td style="padding:28px 32px;background:linear-gradient(120deg,#fff6e9 0%,#e9f6f3 100%);">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="left" style="vertical-align:middle;">
                      <img src="${logoUrl}" width="64" height="64" alt="bnby.me" style="display:block;border-radius:14px;" />
                    </td>
                    <td align="right" style="font-size:13px;color:#5b6b73;">
                      Preview pronta
                    </td>
                  </tr>
                </table>
                <h1 style="margin:20px 0 6px;font-size:28px;line-height:1.2;color:#1f2a2e;">
                  Il sito della tua proprieta e gia pronto
                </h1>
                <p style="margin:0;font-size:15px;color:#55636b;">
                  Abbiamo preparato una landing personalizzata per <strong>${safePropertyName}</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafb;border-radius:16px;padding:18px 20px;">
                  <tr>
                    <td style="font-size:15px;color:#1f2a2e;">
                      Guarda subito l'anteprima:
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:10px;font-size:14px;line-height:1.6;color:#37474f;">
                      <a href="${safePreviewUrl}" style="color:#1f7a6a;text-decoration:none;">${safePreviewUrl}</a>
                    </td>
                  </tr>
                </table>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                  <tr>
                    <td style="font-size:13px;color:#6c7a80;padding-bottom:8px;">
                      Perche scegliere bnby.me
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:14px;color:#1f2a2e;line-height:1.6;">
                      <ul style="margin:0;padding-left:18px;">
                        <li>Un sito elegante pronto in pochi minuti</li>
                        <li>Richieste e contatti organizzati in un unico pannello</li>
                        <li>Calendario sincronizzato con Airbnb e Booking</li>
                        <li>Personalizzazioni su misura per la tua struttura</li>
                      </ul>
                    </td>
                  </tr>
                </table>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;">
                  <tr>
                    <td style="font-size:14px;color:#37474f;line-height:1.6;">
                      Vuoi attivare l'account e ricevere accesso completo? ${
                        safeReplyEmail
                          ? "Rispondi a questa email e ti attiviamo subito."
                          : "Apri l'anteprima e rispondi per attivare l'account."
                      }
                    </td>
                  </tr>
                </table>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                  <tr>
                    <td align="center">
                      <a href="${replyHref}" style="display:inline-block;background:#1f7a6a;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px;">
                        ${
                          safeReplyEmail ? "Richiedi accesso" : "Apri anteprima"
                        }
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 28px;border-top:1px solid #eef2f4;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:12px;color:#8a989e;">
                      Se hai gia un sito, possiamo importare i contenuti e migliorare il design.
                    </td>
                    <td align="right" style="font-size:12px;color:#8a989e;">
                      bnby.me
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
