type NewContactOwnerEmailParams = {
  baseUrl: string;
  propertyName: string;
  contactName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  message: string;
  contactLink?: string | null;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatMessage = (value: string) =>
  escapeHtml(value).replace(/\r?\n/g, "<br />");

export const renderNewContactOwnerEmail = ({
  baseUrl,
  propertyName,
  contactName,
  contactEmail,
  contactPhone,
  message,
  contactLink,
}: NewContactOwnerEmailParams) => {
  const logoUrl = new URL("/logo.png", baseUrl).toString();
  const safePropertyName = escapeHtml(propertyName);
  const safeContactName = escapeHtml(contactName);
  const safeContactEmail = contactEmail ? escapeHtml(contactEmail) : null;
  const safeContactPhone = contactPhone ? escapeHtml(contactPhone) : null;
  const safeContactLink = contactLink ? escapeHtml(contactLink) : null;

  return `
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nuovo contatto</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f7;color:#1f2a2e;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Hai ricevuto un nuovo contatto per ${safePropertyName}.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 45px rgba(15,23,42,0.12);">
            <tr>
              <td style="padding:28px 32px 16px;background:linear-gradient(120deg,#f6fbf9 0%,#e7f4f1 100%);">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="left" style="vertical-align:middle;">
                      <img src="${logoUrl}" width="64" height="64" alt="bnby.me" style="display:block;border-radius:12px;" />
                    </td>
                    <td align="right" style="font-size:13px;color:#5b6b73;">
                      Nuovo contatto
                    </td>
                  </tr>
                </table>
                <h1 style="margin:20px 0 4px;font-size:28px;line-height:1.2;color:#1f2a2e;">
                  Hai una nuova richiesta
                </h1>
                <p style="margin:0;font-size:15px;color:#55636b;">
                  Per la tua proprietà <span style="display:inline-block;background:#1f7a6a;color:#ffffff;padding:4px 10px;border-radius:999px;font-size:13px;">${safePropertyName}</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafb;border-radius:16px;padding:18px 20px;">
                  <tr>
                    <td style="font-size:15px;color:#1f2a2e;">
                      <strong>${safeContactName}</strong> ti ha inviato questo messaggio:
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:12px;font-size:14px;line-height:1.6;color:#37474f;">
                      ${formatMessage(message)}
                    </td>
                  </tr>
                </table>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                  <tr>
                    <td style="font-size:13px;color:#6c7a80;padding-bottom:8px;">
                      Recapiti di contatto
                    </td>
                  </tr>
                  ${
                    safeContactEmail
                      ? `
                  <tr>
                    <td style="font-size:14px;color:#1f2a2e;padding:6px 0;">
                      Email: <a href="mailto:${safeContactEmail}" style="color:#1f7a6a;text-decoration:none;">${safeContactEmail}</a>
                    </td>
                  </tr>`
                      : ""
                  }
                  ${
                    safeContactPhone
                      ? `
                  <tr>
                    <td style="font-size:14px;color:#1f2a2e;padding:6px 0;">
                      Telefono: <a href="tel:${safeContactPhone}" style="color:#1f7a6a;text-decoration:none;">${safeContactPhone}</a>
                    </td>
                  </tr>`
                      : ""
                  }
                </table>
                ${
                  safeContactLink
                    ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                  <tr>
                    <td align="center">
                      <a href="${safeContactLink}" style="display:inline-block;background:#1f7a6a;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:14px;">
                        Vai alla lista contatti
                      </a>
                    </td>
                  </tr>
                </table>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 28px;border-top:1px solid #eef2f4;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:12px;color:#8a989e;">
                      Ricevi questa email perché sei il proprietario della proprietà.
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
