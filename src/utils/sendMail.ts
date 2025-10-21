import nodemailer from "nodemailer";
import config from "config";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: config.get<string>("senderEmail"),
        pass: config.get<string>("appPassword")
    }
});

export function verifyEmailTemplate(link: string):string {
    return `
    <div style="font-family:Arial; color:#333;">
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <button>
      <a href="${link}" 
         style="display:inline-block;background:#4CAF50;color:#fff;padding:10px 20px;
                border-radius:5px;text-decoration:none;">
         Verify Email
      </a>
      </button>
      <p>This link expires in 15 minutes.</p>
    </div>
  `;
}

export function notifyAddMemberToProject(member:any, project:any){
    return `<div style="font-family:Arial, sans-serif; padding:20px; background:#f9f9f9; color:#333;">
  <p style="font-size:16px;">
    Hi ${member}, you've been added to the project <strong>${project}</strong>.
  </p>
</div>
`
}
export function notifyAddMemberToTask(member:any, task:any){
    return `<div style="font-family:Arial, sans-serif; padding:20px; background:#f9f9f9; color:#333;">
  <p style="font-size:16px;">
    Hi ${member}, you've been assigind to the task <strong>${task}</strong>.
  </p>
</div>
`
}