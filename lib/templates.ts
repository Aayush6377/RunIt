export const getOtpTemplate = (code: string, type: "REGISTER" | "PASSWORD_RESET") => {
  const title = type === "REGISTER" ? "Verify your Account" : "Reset Password";
  const actionText = type === "REGISTER" ? "verify your account" : "reset your RunIt password";
  
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const logoUrl = `${baseUrl}/logo.png`;

  return `
    <div style="background-color: #050505; padding: 40px 20px; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; text-align: center;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #0f0d15; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 48px 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
        
        <!-- Logo & Brand -->
        <div style="margin-bottom: 32px;">
          <img src="${logoUrl}" alt="RunIt Logo" style="width: 56px; height: 56px; margin-bottom: 16px; border-radius: 12px;" />
          <h1 style="font-size: 24px; font-weight: 700; color: #ffffff; margin: 0; letter-spacing: -0.02em;">RunIt</h1>
        </div>

        <!-- Content -->
        <h2 style="font-size: 20px; font-weight: 600; color: #d0bcff; margin-bottom: 12px; letter-spacing: -0.01em;">${title}</h2>
        <p style="font-size: 15px; line-height: 24px; color: #938f99; margin-bottom: 32px;">
          Use the 6-digit code below to ${actionText}. This code is strictly for your use and will expire shortly.
        </p>

        <!-- OTP Box -->
        <div style="background: linear-gradient(135deg, rgba(208, 188, 255, 0.1) 0%, rgba(208, 188, 255, 0.05) 100%); border: 1px border-style: solid; border-color: rgba(208, 188, 255, 0.2); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
          <span style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #d0bcff; display: block; margin-left: 12px;">${code}</span>
        </div>

        <!-- Expiry Warning -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 32px;">
           <p style="font-size: 13px; color: #625b71; margin: 0;">Code valid for <span style="color: #f2b8b5;">5 minutes</span></p>
        </div>

        <p style="font-size: 12px; line-height: 20px; color: #625b71; margin-bottom: 0;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="margin-top: 32px; text-align: center;">
        <p style="font-size: 12px; color: #49454f; margin: 0;">
          &copy; ${new Date().getFullYear()} RunIt. All rights reserved. <br />
          Built with precision for modern developers.
        </p>
      </div>
    </div>
  `;
};