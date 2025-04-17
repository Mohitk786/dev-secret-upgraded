import { sendEmail } from "./nodemailer";

export const sendAcceptanceEmail = async (sender: any, vault: any, inviteLink: any) => {
  await sendEmail(
    sender?.email,
    "Invite Accepted ✅",
    `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Invite Accepted</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
            
            <h2 style="color: #4f46e5;">🎉 Invite Accepted!</h2>

            <p>Hi ${sender?.name || sender?.email},</p>

            <p>Good news! Your invitation to join <strong>${vault.name}</strong> has been accepted.</p>

            <p>Click the button below to view the vault:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                🔓 View Vault
              </a>
            </div>

            <p style="font-size: 14px; color: #666;"><strong>Note:</strong> This link will expire in <strong>24 hours</strong>.</p>

            <p>Best regards,<br/><span style="color: #4f46e5;">Vault Security Team 🔐</span></p>
          </div>
        </body>
      </html>
    `
  );
};


export const sendInviteEmail = async (email: any, sender: any, vault: any, inviteLink: any) => {
  await sendEmail(
    email,
    
    "🔐 Invitation to Join Vault",
    `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Vault Invitation</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
            
            <h2 style="color: #10b981;">🔐 You're Invited!</h2>

            <p>Hi there,</p>

            <p><strong>${sender?.name || sender?.email}</strong> has invited you to join the vault <strong>${vault.name}</strong>.</p>

            <p>Click the button below to accept the invitation:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                ✅ Accept Invitation
              </a>
            </div>

            <p style="font-size: 14px; color: #666;"><strong>Note:</strong> This link will expire in <strong>24 hours</strong>.</p>

            <p>If you weren't expecting this email, feel free to ignore it.</p>

            <p>Cheers,<br/><span style="color: #10b981;">Vault Security Team 🔐</span></p>
          </div>
        </body>
      </html>
    `
  );
};
