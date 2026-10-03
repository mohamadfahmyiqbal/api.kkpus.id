// services/notificationService.js
import { logger } from '../utils/logger.js';

/**
 * Notification service for sending OTP via email and SMS
 */
class NotificationService {
  constructor() {
    this.emailProvider = process.env.EMAIL_PROVIDER || 'console'; // 'console', 'sendgrid', 'ses', 'smtp'
    this.smsProvider = process.env.SMS_PROVIDER || 'console'; // 'console', 'twilio', 'wa'
  }

  /**
   * Send OTP via email
   */
  async sendEmailOTP(email, otpCode, expiryMinutes = 10) {
    try {
      const subject = 'Kode OTP Reset Password - Koperasi PUS';
      const htmlContent = this.generateEmailTemplate(otpCode, expiryMinutes);
      
      switch (this.emailProvider) {
        case 'sendgrid':
          return await this.sendSendGridEmail(email, subject, htmlContent);
        case 'ses':
          return await this.sendSESEmail(email, subject, htmlContent);
        case 'smtp':
          return await this.sendSMTPEmail(email, subject, htmlContent);
        case 'console':
        default:
          return this.logEmail(email, subject, otpCode, expiryMinutes);
      }
    } catch (error) {
      logger.error('Error sending email OTP:', error);
      throw new Error('Failed to send email OTP');
    }
  }

  /**
   * Send email using standard SMTP via nodemailer
   */
  async sendSMTPEmail(email, subject, htmlContent) {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Koperasi PUS" <noreply@kkpus.id>',
      to: email,
      subject: subject,
      html: htmlContent,
    });
    logger.info(`SMTP email sent successfully to ${email}`);
    return true;
  }

  /**
   * Send OTP via SMS
   */
  async sendSMSOTP(phoneNumber, otpCode, expiryMinutes = 10) {
    try {
      const message = this.generateSMSMessage(otpCode, expiryMinutes);
      
      switch (this.smsProvider) {
        case 'twilio':
          return await this.sendTwilioSMS(phoneNumber, message);
        case 'wa':
          return await this.sendWhatsAppMessage(phoneNumber, message);
        case 'console':
        default:
          return this.logSMS(phoneNumber, message, otpCode);
      }
    } catch (error) {
      logger.error('Error sending SMS OTP:', error);
      throw new Error('Failed to send SMS OTP');
    }
  }

  /**
   * Send OTP notification (determine channel automatically)
   */
  async sendOTPNotification(emailHp, otpCode, expiryMinutes = 10) {
    try {
      const isEmail = emailHp.includes('@');
      
      if (isEmail) {
        await this.sendEmailOTP(emailHp, otpCode, expiryMinutes);
      } else {
        await this.sendSMSOTP(emailHp, otpCode, expiryMinutes);
      }
      
      logger.info(`OTP sent successfully to ${emailHp}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send OTP to ${emailHp}:`, error);
      throw error;
    }
  }

  /**
   * Generate email HTML template
   */
  generateEmailTemplate(otpCode, expiryMinutes) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kode OTP Reset Password</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { max-width: 150px; margin-bottom: 20px; }
            .otp-box { 
                background: #f8f9fa; 
                border: 2px dashed #007bff; 
                padding: 20px; 
                text-align: center; 
                margin: 20px 0; 
                border-radius: 8px;
            }
            .otp-code { 
                font-size: 32px; 
                font-weight: bold; 
                color: #007bff; 
                letter-spacing: 5px;
                margin: 10px 0;
            }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://your-domain.com/assets/icons/PUSlogo.png" alt="Koperasi PUS Logo" class="logo">
                <h2>Reset Password Anda</h2>
            </div>
            
            <p>Halo,</p>
            <p>Anda telah meminta untuk mereset password akun Koperasi PUS Anda. Gunakan kode OTP berikut untuk melanjutkan:</p>
            
            <div class="otp-box">
                <p><strong>Kode OTP Anda:</strong></p>
                <div class="otp-code">${otpCode}</div>
                <p><small>Berlaku selama ${expiryMinutes} menit</small></p>
            </div>
            
            <div class="warning">
                <strong>⚠️ Penting:</strong>
                <ul>
                    <li>Jangan bagikan kode ini kepada siapa pun</li>
                    <li>Kode ini akan kedaluwarsa dalam ${expiryMinutes} menit</li>
                    <li>Abaikan email ini jika Anda tidak meminta reset password</li>
                </ul>
            </div>
            
            <p>Jika Anda mengalami kesulitan, silakan hubungi layanan pelanggan kami.</p>
            
            <div class="footer">
                <p>&copy; 2024 Koperasi PUS. All rights reserved.</p>
                <p>Ini adalah email otomatis, jangan balas email ini.</p>
            </div>
        </div>
    </body>
    </html>`;
  }

  /**
   * Generate SMS message
   */
  generateSMSMessage(otpCode, expiryMinutes) {
    return `Koperasi PUS: Kode OTP reset password Anda adalah ${otpCode}. Berlaku ${expiryMinutes} menit. Jangan bagikan kode ini. Jika tidak meminta, abaikan pesan ini.`;
  }

  /**
   * Send email using SendGrid
   */
  async sendSendGridEmail(email, subject, htmlContent) {
    // Implementation for SendGrid
    // This would require @sendgrid/mail package and API key
    logger.info(`SendGrid email would be sent to ${email}: ${subject}`);
    return true;
  }

  /**
   * Send email using AWS SES
   */
  async sendSESEmail(email, subject, htmlContent) {
    // Implementation for AWS SES
    // This would require aws-sdk package and credentials
    logger.info(`SES email would be sent to ${email}: ${subject}`);
    return true;
  }

  /**
   * Send SMS using Twilio
   */
  async sendTwilioSMS(phoneNumber, message) {
    // Implementation for Twilio
    // This would require twilio package and credentials
    logger.info(`Twilio SMS would be sent to ${phoneNumber}: ${message}`);
    return true;
  }

  /**
   * Send WhatsApp message
   */
  async sendWhatsAppMessage(phoneNumber, message) {
    // Implementation for WhatsApp Business API
    // This would require WhatsApp Business API setup
    logger.info(`WhatsApp message would be sent to ${phoneNumber}: ${message}`);
    return true;
  }

  /**
   * Log email (for development/testing)
   */
  logEmail(email, subject, otpCode, expiryMinutes) {
    logger.info(`📧 EMAIL OTP - To: ${email}, Subject: ${subject}, OTP: ${otpCode}, Expires: ${expiryMinutes}min`);
    return true;
  }

  /**
   * Log SMS (for development/testing)
   */
  logSMS(phoneNumber, message, otpCode) {
    logger.info(`📱 SMS OTP - To: ${phoneNumber}, Message: ${message}, OTP: ${otpCode}`);
    return true;
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  validatePhone(phone) {
    // Remove non-digits and check length
    const cleanPhone = phone.replace(/\D/g, '');
    return /^\d{10,13}$/.test(cleanPhone);
  }

  /**
   * Format phone number for SMS
   */
  formatPhoneNumber(phone) {
    // Remove non-digits and add country code if needed
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      return `+62${cleanPhone.substring(1)}`; // Indonesia country code
    }
    return cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;
  }
}

export default new NotificationService();
