interface Env {
  RESEND_API_KEY: string;
}

interface Inquiry {
  name: string;
  email: string;
  phone: string;
  destination?: string;
  dates?: string;
  groupSize?: string;
  activityBudget?: string;
  housingBudget?: string;
  vibe?: string;
  details?: string;
  website?: string; // honeypot
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json<Inquiry>();

  // Honeypot — if filled, silently 200
  if (body.website) return Response.json({ ok: true });

  // Bare-minimum validation
  if (!body.name || !body.email || !body.phone) {
    return Response.json({ error: 'missing_fields' }, { status: 400 });
  }

  // Notify Kat
  await sendEmail(env.RESEND_API_KEY, {
    to: 'kat@the-party-architect.com',
    from: 'inquiries@the-party-architect.com',
    replyTo: body.email,
    subject: `New inquiry: ${body.name}`,
    html: renderInquiryEmail(body),
  });

  // Auto-ack to submitter
  await sendEmail(env.RESEND_API_KEY, {
    to: body.email,
    from: 'kat@the-party-architect.com',
    subject: "Got your inquiry — talk soon!",
    html: renderAckEmail(body),
  });

  return Response.json({ ok: true });
};

async function sendEmail(
  apiKey: string,
  opts: { to: string; from: string; replyTo?: string; subject: string; html: string },
) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(opts),
  });
}

function renderInquiryEmail(data: Inquiry): string {
  return `
    <h2>New Inquiry from ${data.name}</h2>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    ${data.destination ? `<p><strong>Destination:</strong> ${data.destination}</p>` : ''}
    ${data.dates ? `<p><strong>Dates:</strong> ${data.dates}</p>` : ''}
    ${data.groupSize ? `<p><strong>Group Size:</strong> ${data.groupSize}</p>` : ''}
    ${data.activityBudget ? `<p><strong>Activity Budget:</strong> ${data.activityBudget}</p>` : ''}
    ${data.housingBudget ? `<p><strong>Housing Budget:</strong> ${data.housingBudget}</p>` : ''}
    ${data.vibe ? `<p><strong>Vibe:</strong> ${data.vibe}</p>` : ''}
    ${data.details ? `<p><strong>Details:</strong> ${data.details}</p>` : ''}
  `;
}

function renderAckEmail(data: Inquiry): string {
  return `
    <p>Hey ${data.name}!</p>
    <p>Got your inquiry — I'm excited to start planning. I'll be in touch within 48 hours to chat details.</p>
    <p>In the meantime, feel free to check out my <a href="https://instagram.com/__thepartyarchitect">Instagram</a> for past weekend inspo.</p>
    <p>Talk soon,<br/>Kat</p>
  `;
}
