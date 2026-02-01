export const verifyAccountTemplate = async ({ OTPCode }: { OTPCode: string }): Promise<string> => {

    return ` 
  <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background-color: #f4f7fb; color: #333; max-width: 600px; margin: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); text-align: center;">
    
    <h2 style="color: #2c3e50; margin-bottom: 10px;">✅ Verify Account</h2>
    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 15px;">
        Thank you for registering with <strong style="color:#4a90e2;">Jovio</strong>.
    </p>
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        Please use the following code to confirm your email address:
    </p>

    <div style="margin: 20px auto; padding: 18px 35px; background: linear-gradient(135deg,#e0f7fa,#e3f2fd); border: 2px dashed #4a90e2; border-radius: 12px; display: inline-block; font-size: 26px; letter-spacing: 5px; font-weight: bold; color:#2c3e50; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        ${OTPCode}
    </div>

    <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 20px 0;">
        This code is valid for <strong>10 minutes</strong>.<br>
        If you didn’t create an account, you can safely ignore this email.
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

    <p style="font-size: 13px; color: #888; margin: 0;">
        Stay secure,<br>
        <strong style="color:#4a90e2;">Jovio Team</strong><br>
    </p>
</div>

    `
}

export const forgetPasswordTemplate = async ({ OTPCode }: { OTPCode: string }): Promise<string> => {

    return ` 
  <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background-color: #f4f7fb; color: #333; max-width: 600px; margin: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); text-align: center;">
    
    <h2 style="color: #2c3e50; margin-bottom: 10px;">🔐 Reset Password</h2>
    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 15px;">
        We received a request to reset your password for
        <strong style="color:#4a90e2;">Jovio</strong>.
    </p>
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        Please use the following code to reset your password:
    </p>

    <div style="margin: 20px auto; padding: 18px 35px; background: linear-gradient(135deg,#e0f7fa,#e3f2fd); border: 2px dashed #4a90e2; border-radius: 12px; display: inline-block; font-size: 26px; letter-spacing: 5px; font-weight: bold; color:#2c3e50; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        ${OTPCode}
    </div>

    <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 20px 0;">
        This code is valid for <strong>10 minutes</strong>.<br>
        If you didn’t request a password reset, you can safely ignore this email.
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

    <p style="font-size: 13px; color: #888; margin: 0;">
        Stay secure,<br>
        <strong style="color:#4a90e2;">Jovio Team</strong><br>
    </p>
</div>
  `;
};