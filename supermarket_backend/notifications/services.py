import logging
from .models import SMSLog

logger = logging.getLogger(__name__)


class SMSService:
    """Mock SMS Service - logs to console instead of sending real SMS"""
    
    @staticmethod
    def send_sms(phone_number, message, sms_type='GENERAL', user=None):
        """
        Send SMS (Mock version - just logs to console)
        
        Args:
            phone_number: Recipient phone number
            message: SMS message content
            sms_type: Type of SMS (OTP, ORDER_CONFIRMATION, etc.)
            user: User object (optional)
        
        Returns:
            tuple: (success: bool, response: str)
        """
        try:
            # Log the SMS to database
            sms_log = SMSLog.objects.create(
                phone_number=phone_number,
                message=message,
                sms_type=sms_type,
                user=user,
                status='SENT',
                response='Mock SMS - Logged to console'
            )
            
            # Print to console (Mock SMS)
            print("\n" + "="*60)
            print("📱 MOCK SMS SENT")
            print("="*60)
            print(f"To: {phone_number}")
            print(f"Type: {sms_type}")
            print(f"Message:\n{message}")
            print("="*60 + "\n")
            
            # Also log using Django logger
            logger.info(f"SMS sent to {phone_number}: {message}")
            
            return True, "SMS sent successfully (Mock)"
            
        except Exception as e:
            logger.error(f"Failed to send SMS to {phone_number}: {str(e)}")
            
            # Log failed SMS
            SMSLog.objects.create(
                phone_number=phone_number,
                message=message,
                sms_type=sms_type,
                user=user,
                status='FAILED',
                response=str(e)
            )
            
            return False, f"Failed to send SMS: {str(e)}"
    
    @staticmethod
    def send_otp(phone_number, otp_code, user=None):
        """Send OTP SMS"""
        message = f"Your RUKARA SUPERMARKET verification code is: {otp_code}\n\nValid for 10 minutes.\nDo not share this code."
        return SMSService.send_sms(phone_number, message, sms_type='OTP', user=user)
    
    @staticmethod
    def send_order_confirmation(phone_number, order_number, total, user=None):
        """Send order confirmation SMS"""
        message = f"Order confirmed! \n\nOrder #: {order_number}\nTotal: RWF {total:,.0f}\n\nThank you for shopping with RUKARA SUPERMARKET!"
        return SMSService.send_sms(phone_number, message, sms_type='ORDER_CONFIRMATION', user=user)
    
    @staticmethod
    def send_payment_confirmation(phone_number, order_number, amount, user=None):
        """Send payment confirmation SMS"""
        message = f"Payment received! ✅\n\nOrder #: {order_number}\nAmount: RWF {amount:,.0f}\n\nYour order is being processed."
        return SMSService.send_sms(phone_number, message, sms_type='PAYMENT_CONFIRMATION', user=user)