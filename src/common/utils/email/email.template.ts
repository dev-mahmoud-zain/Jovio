export const confirmEmailTemplate = async ({
  OTP_Code,
}: {
  OTP_Code: string;
}): Promise<string> => {
  return ` 
  <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background-color: #f4f7fb; color: #333; max-width: 600px; margin: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); text-align: center;">
    
    <h2 style="color: #2c3e50; margin-bottom: 10px;">🔐 Verify Your Email</h2>
    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 15px;">
        Welcome to <strong style="color:#4a90e2;">Jovio</strong>!  
    </p>
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        Use the verification code below to confirm your email address and activate your account:
    </p>

    <div style="margin: 20px auto; padding: 18px 35px; background: linear-gradient(135deg,#e0f7fa,#e3f2fd); border: 2px dashed #4a90e2; border-radius: 12px; display: inline-block; font-size: 26px; letter-spacing: 5px; font-weight: bold; color:#2c3e50; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        ${OTP_Code}
    </div>

    <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 20px 0;">
        This code will expire in <strong>10 minutes</strong>.<br>
        If you didn’t request this, you can safely ignore this message.
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

    <p style="font-size: 13px; color: #888; margin: 0;">
        With appreciation,<br>
        <strong style="color:#4a90e2;">Jovio Team</strong>
    </p>
</div>
    `;
};

export const confirmCompanyEmailTemplate = async ({
  OTP_Code,
  companyName,
}: {
  OTP_Code: string;
  companyName: string;
}): Promise<string> => {
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background-color: #f4f7fb; color: #333; max-width: 600px; margin: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); text-align: center;">
    
    <h2 style="color: #2c3e50; margin-bottom: 10px;">🏢 Confirm Your Company Email</h2>
    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 15px;">
        Welcome, <strong style="color:#4a90e2;">${companyName}</strong>!  
    </p>
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        Please use the verification code below to confirm your company email and activate your company account:
    </p>

    <div style="margin: 20px auto; padding: 18px 35px; background: linear-gradient(135deg,#e0f7fa,#e3f2fd); border: 2px dashed #4a90e2; border-radius: 12px; display: inline-block; font-size: 26px; letter-spacing: 5px; font-weight: bold; color:#2c3e50; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        ${OTP_Code}
    </div>

    <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 20px 0;">
        This code will expire in <strong>10 minutes</strong>.<br>
        If you didn’t request this, you can safely ignore this message.
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

    <p style="font-size: 13px; color: #888; margin: 0;">
        With appreciation,<br>
        <strong style="color:#4a90e2;">Jovio Team</strong>
    </p>
  </div>
  `;
};

export const updateEmailTemplate = async ({
  OTP_Code,
}: {
  OTP_Code: string;
}): Promise<string> => {
  return ` 
  <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background-color: #f4f7fb; color: #333; max-width: 600px; margin: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); text-align: center;">
    
    <h2 style="color: #2c3e50; margin-bottom: 10px;">🔄 Verify Your New Email</h2>
    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 15px;">
        You requested to change your email on <strong style="color:#4a90e2;">Jovio</strong>.
    </p>
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        Use the verification code below to confirm your new email address:
    </p>

    <div style="margin: 20px auto; padding: 18px 35px; background: linear-gradient(135deg,#fff3e0,#fbe9e7); border: 2px dashed #ff9800; border-radius: 12px; display: inline-block; font-size: 26px; letter-spacing: 5px; font-weight: bold; color:#e65100; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        ${OTP_Code}
    </div>

    <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 20px 0;">
        This code will remain active for <strong>10 Minutes</strong>.<br>
        If you didn’t request this update, simply ignore this email and keep your account secure.
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

    <p style="font-size: 13px; color: #888; margin: 0;">
        With appreciation,<br>
        <strong style="color:#4a90e2;">Jovio Team</strong>
    </p>
</div>
  `;
};

export const forgetPasswordTemplate = async ({
  OTP_Code,
}: {
  OTP_Code: string;
}): Promise<string> => {
  return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background-color: #f4f7fb; color: #333; max-width: 600px; margin: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); text-align: center;">
    
    <h2 style="color: #e74c3c; margin-bottom: 10px;">🔒 Reset Your Password</h2>
    
    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 15px;">
        A password reset was requested for your <strong style="color:#4a90e2;">Jovio</strong> account.
    </p>
    
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        Use the verification code below to continue with resetting your password:
    </p>

    <div style="margin: 20px auto; padding: 18px 35px; background: linear-gradient(135deg,#fff3f3,#fdecea); border: 2px dashed #e74c3c; border-radius: 12px; display: inline-block; font-size: 26px; letter-spacing: 5px; font-weight: bold; color:#c0392b; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        ${OTP_Code}
    </div>

    <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 20px 0;">
        This code will remain valid for <strong>5 minutes</strong>.<br>
        If you didn’t request a password reset, simply ignore this message.
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

    <p style="font-size: 13px; color: #888; margin: 0;">
        Stay safe,<br>
        <strong style="color:#4a90e2;">Jovio Team</strong>
    </p>
</div>
  `;
};

export const passwordChangedTemplate = async (): Promise<string> => {
  return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background-color: #f9fafc; color: #333; max-width: 600px; margin: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); text-align: center;">
    
    <h2 style="color: #2ecc71; margin-bottom: 10px;">🔐 Password Changed Successfully</h2>
    
    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 15px;">
        Your password for <strong style="color:#4a90e2;">Jovio</strong> has been updated successfully.
    </p>
    
   <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px; color: #555;">
        If you did not perform this action, please reset your password immediately or contact our support team.
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

    <p style="font-size: 13px; color: #888; margin: 0;">
        Stay safe,<br>
        <strong style="color:#4a90e2;">Jovio Team</strong>
    </p>
</div>
  `;
};