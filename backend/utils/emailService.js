import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection on startup
transporter.verify()
  .then(() => console.log('SMTP connected'))
  .catch((err) => console.error('SMTP connection failed:', err.message));

/**
 * Send an email
 */
const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`Email failed to ${to}:`, err.message);
    throw err;
  }
};

/**
 * Booking confirmation email
 */
export const sendBookingConfirmation = async (booking, user) => {
  const dateStr = new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const html = `
    <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 0;">
      <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px 28px;">
          <h1 style="margin: 0; color: #fff; font-size: 18px; font-weight: 700;">Booking Confirmed</h1>
          <p style="margin: 4px 0 0; color: rgba(255,255,255,.85); font-size: 13px;">OCS IITH Room Booking System</p>
        </div>
        <div style="padding: 28px;">
          <p style="margin: 0 0 20px; color: #334155; font-size: 14px; line-height: 1.6;">
            Hi ${user.name},<br/>Your room booking has been confirmed. Here are the details:
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr><td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9; width: 120px;">Room</td><td style="padding: 10px 0; color: #0f172a; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${booking.room?.name || 'N/A'}</td></tr>
            <tr><td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Block</td><td style="padding: 10px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${booking.room?.block?.name || 'N/A'}</td></tr>
            <tr><td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Date</td><td style="padding: 10px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${dateStr}</td></tr>
            <tr><td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Time</td><td style="padding: 10px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${booking.startTime} - ${booking.endTime}</td></tr>
            <tr><td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Purpose</td><td style="padding: 10px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${booking.purpose}</td></tr>
            <tr><td style="padding: 10px 0; color: #64748b;">Participants</td><td style="padding: 10px 0; color: #0f172a;">${booking.participantCount}</td></tr>
          </table>
        </div>
        <div style="padding: 16px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #94a3b8;">Office of Career Services, IIT Hyderabad</p>
        </div>
      </div>
    </div>
  `;

  return sendMail({
    to: user.email,
    subject: `Booking Confirmed: ${booking.room?.name || 'Room'} on ${dateStr}`,
    html,
  });
};

/**
 * Booking reminder email (5 min before start or end)
 */
export const sendBookingReminder = async (booking, user, type = 'start') => {
  const dateStr = new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  const isStart = type === 'start';
  const title = isStart ? 'Your booking starts in 5 minutes' : 'Your booking ends in 5 minutes';
  const color = isStart ? '#f97316' : '#dc2626';

  const html = `
    <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 0;">
      <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: ${color}; padding: 20px 28px;">
          <h1 style="margin: 0; color: #fff; font-size: 16px; font-weight: 700;">${title}</h1>
        </div>
        <div style="padding: 24px 28px;">
          <p style="margin: 0 0 12px; color: #334155; font-size: 14px;">
            <strong>${booking.room?.name}</strong> (${booking.room?.block?.name || ''})
          </p>
          <p style="margin: 0; color: #64748b; font-size: 13px;">
            ${dateStr} &middot; ${booking.startTime} - ${booking.endTime} &middot; ${booking.purpose}
          </p>
        </div>
        <div style="padding: 12px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #94a3b8;">OCS IITH Room Booking System</p>
        </div>
      </div>
    </div>
  `;

  return sendMail({
    to: user.email,
    subject: `Reminder: ${booking.room?.name || 'Room'} ${isStart ? 'starts' : 'ends'} in 5 min`,
    html,
  });
};

export default sendMail;
