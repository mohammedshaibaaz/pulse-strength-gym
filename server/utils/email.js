import nodemailer from 'nodemailer';

// Validate email configuration
const validateEmailConfig = () => {
  const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_FROM'];
  const missing = requiredEnvVars.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Email configuration incomplete. Missing: ${missing.join(', ')}`);
    return false;
  }
  return true;
};

// Create reusable transporter (only if config is valid)
let transporter = null;

if (validateEmailConfig()) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: parseInt(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  console.warn('⚠️  Email service disabled - configuration missing');
}

/**
 * Send booking confirmation email
 * @param {string} to - Recipient email
 * @param {string} userName - User's name
 * @param {Object} classData - Class details
 */
export const sendBookingEmail = async (to, userName, classData) => {
  // Skip if email service is not configured
  if (!transporter) {
    console.warn('⚠️  Email service not configured - skipping email');
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: `✅ Class Booking Confirmed - ${classData.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, sans-serif; background-color: #0a0a0a; color: #e5e5e5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { background-color: #e63946; padding: 30px; text-align: center; }
            .header h1 { margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; }
            .content { background-color: #141414; padding: 40px 30px; border-radius: 8px; margin-top: 20px; }
            .greeting { font-size: 18px; margin-bottom: 20px; }
            .class-details { background-color: #0a0a0a; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #e63946; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
            .detail-label { color: #b5b5b5; font-weight: 500; }
            .detail-value { color: #e5e5e5; font-weight: 600; }
            .footer { text-align: center; margin-top: 30px; color: #b5b5b5; font-size: 14px; }
            .button { display: inline-block; background-color: #e63946; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PULSE STRENGTH CLUB</h1>
            </div>
            <div class="content">
              <p class="greeting">Hey ${userName},</p>
              <p>Your class booking has been confirmed! We're looking forward to seeing you.</p>
              
              <div class="class-details">
                <h3 style="margin-top: 0; color: #e63946;">Class Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Class:</span>
                  <span class="detail-value">${classData.name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Trainer:</span>
                  <span class="detail-value">${classData.trainer}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Day:</span>
                  <span class="detail-value">${classData.day}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${classData.time}</span>
                </div>
                <div class="detail-row" style="border-bottom: none;">
                  <span class="detail-label">Duration:</span>
                  <span class="detail-value">${classData.duration} minutes</span>
                </div>
              </div>

              <p><strong>What to bring:</strong></p>
              <ul style="color: #b5b5b5; line-height: 1.8;">
                <li>Water bottle</li>
                <li>Towel</li>
                <li>Proper athletic shoes</li>
                <li>Positive mindset!</li>
              </ul>

              <p style="margin-top: 30px;">See you soon!</p>
              <p style="margin-bottom: 0;"><strong>Pulse Strength Club Team</strong></p>
            </div>
            
            <div class="footer">
              <p>Pulse Strength Club | Berlin, Germany | Open 24/7</p>
              <p><a href="mailto:contact@pulsestrength.club" style="color: #e63946; text-decoration: none;">contact@pulsestrength.club</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Email sending failed: ${error.message}`);
    // Don't throw error - booking should still succeed even if email fails
  }
};

export default transporter;
