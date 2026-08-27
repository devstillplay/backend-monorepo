export type MarketingTemplateId =
  | 'announcement'
  | 'newsletter'
  | 'minimal'
  | 'promotion';

export type MarketingTemplateFields = {
  title: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
};

export type MarketingTemplate = {
  id: MarketingTemplateId;
  name: string;
  description: string;
};

export const MARKETING_TEMPLATES: MarketingTemplate[] = [
  {
    id: 'announcement',
    name: 'Announcement',
    description: 'Brand header with logo and highlighted title',
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Clean layout with hero section and footer',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple text-focused email',
  },
  {
    id: 'promotion',
    name: 'Promotion',
    description: 'Bold CTA button for offers and updates',
  },
];

export const MARKETING_AUDIENCE_OPTIONS = [
  { id: 'customers', label: 'Customers', description: 'Registered user accounts' },
  { id: 'admins', label: 'Admins / Staff', description: 'Active employee accounts' },
  { id: 'waitlist', label: 'Waitlist', description: 'Landing page waitlist signups' },
  {
    id: 'financial_partners',
    label: 'Financial partners',
    description: 'Financial institution survey signups',
  },
  {
    id: 'partner_inquiries',
    label: 'Partner inquiries',
    description: 'Non-financial partner survey signups',
  },
  {
    id: 'all_survey',
    label: 'All survey respondents',
    description: 'Everyone from waitlist / partner / financial surveys',
  },
] as const;

const DEFAULT_LOGO =
  'https://still-play.com/assets/svg/STILL%20PLAYLOGOBL.svg';
const DEFAULT_LOGO_WHITE =
  'https://still-play.com/assets/svg/STILL%20PLAYLOGOWH.svg';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bodyHtml(body: string): string {
  const escaped = escapeHtml(body);
  return escaped
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px;line-height:1.6;color:#374151;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

function logoBlock(logoUrl: string): string {
  return `
    <div style="text-align:center;margin-bottom:24px;">
      <img src="${escapeHtml(logoUrl)}" alt="Still Play" width="160" style="max-width:160px;height:auto;display:block;margin:0 auto;" />
    </div>
  `;
}

function footerBlock(): string {
  return `
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
        Still Play · <a href="https://still-play.com" style="color:#6b7280;">still-play.com</a>
      </p>
    </div>
  `;
}

export function buildMarketingHtml(
  templateId: MarketingTemplateId,
  fields: MarketingTemplateFields,
  logoUrl = DEFAULT_LOGO
): string {
  const title = escapeHtml(fields.title || 'Still Play');
  const body = bodyHtml(fields.body || '');
  const ctaText = escapeHtml(fields.ctaText || '');
  const ctaUrl = escapeHtml(fields.ctaUrl || 'https://still-play.com');
  const logo = logoBlock(logoUrl);

  const ctaButton = ctaText
    ? `<div style="text-align:center;margin:28px 0;">
        <a href="${ctaUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">${ctaText}</a>
      </div>`
    : '';

  const wrapper = (inner: string) =>
    `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:24px 16px;">${inner}</div>
    </body></html>`;

  switch (templateId) {
    case 'announcement':
      return wrapper(`
        <div style="background:#fff;border-radius:12px;padding:32px 28px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <div style="background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);border-radius:8px;padding:24px;margin-bottom:24px;text-align:center;">
            ${logoBlock(DEFAULT_LOGO_WHITE)}
            <h1 style="margin:16px 0 0;color:#fff;font-size:22px;font-weight:700;">${title}</h1>
          </div>
          ${body}
          ${ctaButton}
          ${footerBlock()}
        </div>
      `);

    case 'newsletter':
      return wrapper(`
        <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <div style="background:#111827;padding:28px;text-align:center;">${logoBlock(DEFAULT_LOGO_WHITE)}</div>
          <div style="padding:32px 28px;">
            <h1 style="margin:0 0 20px;font-size:24px;color:#111827;">${title}</h1>
            ${body}
            ${ctaButton}
            ${footerBlock()}
          </div>
        </div>
      `);

    case 'minimal':
      return wrapper(`
        <div style="background:#fff;border-radius:12px;padding:32px 28px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          ${logo}
          <h1 style="margin:0 0 16px;font-size:20px;color:#111827;">${title}</h1>
          ${body}
          ${ctaButton}
          ${footerBlock()}
        </div>
      `);

    case 'promotion':
      return wrapper(`
        <div style="background:#fff;border-radius:12px;padding:32px 28px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          ${logo}
          <div style="background:#fef9c3;border-radius:8px;padding:20px;margin-bottom:20px;text-align:center;">
            <h1 style="margin:0;font-size:22px;color:#854d0e;">${title}</h1>
          </div>
          ${body}
          ${ctaButton || `<div style="text-align:center;margin:28px 0;">
            <a href="${ctaUrl}" style="display:inline-block;background:#eab308;color:#111827;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;">Learn more</a>
          </div>`}
          ${footerBlock()}
        </div>
      `);

    default:
      return wrapper(`
        <div style="background:#fff;border-radius:12px;padding:32px 28px;">
          ${logo}
          <h1>${title}</h1>
          ${body}
          ${ctaButton}
          ${footerBlock()}
        </div>
      `);
  }
}
