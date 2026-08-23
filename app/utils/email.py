"""
Email service
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings


class EmailService:
    """Service for sending emails"""
    
    def __init__(self):
        """Initialize email service"""
        self.smtp_server = settings.SMTP_SERVER
        self.smtp_port = settings.SMTP_PORT
        self.sender_email = settings.SENDER_EMAIL
        self.sender_password = settings.SENDER_PASSWORD
    
    def send_email(
        self,
        recipient_email: str,
        subject: str,
        body: str,
        is_html: bool = False
    ) -> bool:
        """
        Send email
        
        Args:
            recipient_email: Recipient email address
            subject: Email subject
            body: Email body
            is_html: Whether body is HTML
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if not self.sender_email or not self.sender_password:
                print("Email service not configured")
                return False
            
            message = MIMEMultipart()
            message["From"] = self.sender_email
            message["To"] = recipient_email
            message["Subject"] = subject
            
            message_type = "html" if is_html else "plain"
            message.attach(MIMEText(body, message_type))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)
            
            return True
        except Exception as e:
            print(f"Email send error: {str(e)}")
            return False
    
    def send_verification_email(self, email: str, verification_link: str) -> bool:
        """Send email verification"""
        subject = "Verify your Smart Form AI account"
        body = f"""
        <h2>Welcome to Smart Form AI!</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="{verification_link}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
        """
        return self.send_email(email, subject, body, is_html=True)
    
    def send_password_reset_email(self, email: str, reset_link: str) -> bool:
        """Send password reset email"""
        subject = "Reset your Smart Form AI password"
        body = f"""
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="{reset_link}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, ignore this email.</p>
        """
        return self.send_email(email, subject, body, is_html=True)


# Create singleton instance
email_service = EmailService()
