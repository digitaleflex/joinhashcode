export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";
import { NextResponse } from "next/server";

/**
 * Database Backup Cron (via Email)
 * 
 * Logic:
 * 1. Secure access with Bearer token.
 * 2. Fetch critical data from database.
 * 3. Serialize to JSON.
 * 4. Send as attachment via Resend.
 * 
 * Target: Admin Email
 */
export async function POST(req: Request) {
  try {
    // 1. Authentication
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ message: "Accès non autorisé." }, { status: 401 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@joinhashcode.com";

    // 2. Fetch Critical Data (Snapshot)
    // We fetch key tables that represent the core state
    const [users, orgs, members, messages] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, name: true, email: true, pseudo: true, level: true, experience: true, role: true, createdAt: true }
      }),
      prisma.organization.findMany(),
      prisma.member.findMany(),
      (prisma as any).squadMessage.findMany({ take: 1000, orderBy: { createdAt: 'desc' } })
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      stats: {
        usersCount: users.length,
        squadsCount: orgs.length,
        messagesCount: messages.length
      },
      data: {
        users,
        organizations: orgs,
        members,
        squadMessages: messages
      }
    };

    const jsonBackup = JSON.stringify(backupData, null, 2);
    const filename = `hashcode_backup_${new Date().toISOString().split('T')[0]}.json`;

    // 3. Send via Resend
    // We use the generic sendEmail but since we need attachments, we'll access resend directly if available 
    // or add a method to emailService. Let's assume we can add it to emailService for better abstraction.
    
    const { success, error } = await (emailService as any)._send({
      to: adminEmail,
      subject: `🛡️ Backup HASHCODE : ${new Date().toLocaleDateString('fr-FR')}`,
      html: `
        <h1>Sauvegarde Système HASHCODE</h1>
        <p>Tu trouveras en pièce jointe l'état critique de ta base de données à ce jour.</p>
        <ul>
          <li><strong>Utilisateurs :</strong> ${users.length}</li>
          <li><strong>Escouades :</strong> ${orgs.length}</li>
          <li><strong>Messages :</strong> ${messages.length}</li>
        </ul>
        <hr>
        <p style="font-size: 12px; color: #666;">Ce backup est généré automatiquement par le serveur VPS.</p>
      `,
      attachments: [
        {
          filename: filename,
          content: Buffer.from(jsonBackup).toString('base64'),
        }
      ]
    });

    if (!success) {
      throw new Error(typeof error === 'string' ? error : JSON.stringify(error));
    }

    return NextResponse.json({
      success: true,
      message: "Backup envoyé avec succès.",
      filename
    });

  } catch (error: unknown) {
    console.error("[CRON_BACKUP_ERROR]", error);
    return NextResponse.json({ message: "Erreur lors de la génération du backup." }, { status: 500 });
  }
}
