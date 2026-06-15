import { ImageResponse } from 'next/og';
import { prisma } from "@/lib/prisma";

/**
 * OG Image Generator for Public Profiles
 * 
 * Generates a stylized cyberpunk card for users to share on LinkedIn/X.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pseudo = searchParams.get('pseudo');

    if (!pseudo) {
      return new Response("Pseudo manquant", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { pseudo },
      select: {
        name: true,
        pseudo: true,
        class: true,
        level: true,
        psychometrics: {
          select: {
            builderScore: true,
            creatorScore: true,
            strategistScore: true,
            catalystScore: true,
          }
        }
      }
    });

    if (!user) {
      return new Response("Utilisateur introuvable", { status: 404 });
    }

    const profileLabel = (user.class || "Bâtisseur").toUpperCase();
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050505',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 100%)',
            position: 'relative',
          }}
        >
          {/* Background Grid */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage: 'radial-gradient(#C5F441 0.5px, transparent 0.5px)',
            backgroundSize: '24px 24px',
            opacity: 0.05,
          }} />

          {/* Main Card */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '800px',
            height: '450px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(197, 244, 65, 0.2)',
            borderRadius: '40px',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ color: '#C5F441', fontSize: '12px', fontWeight: 'bold', letterSpacing: '4px', fontVariantCaps: 'all-small-caps' }}>
                HASHCODE // DOSSIER_AGENT
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'monospace' }}>
                ID_{Math.random().toString(36).substring(7).toUpperCase()}
              </div>
            </div>

            {/* Profile Info */}
            <div style={{ display: 'flex', flex: 1, gap: '40px' }}>
              {/* Identity Section */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '4px', opacity: 0.6 }}>AGENT_</div>
                <div style={{ color: 'white', fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', lineHeight: 1, marginBottom: '20px' }}>
                  {user.name.toUpperCase()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ backgroundColor: '#C5F441', padding: '6px 12px', borderRadius: '8px', color: 'black', fontSize: '14px', fontWeight: '900' }}>
                        LVL_{user.level}
                    </div>
                    <div style={{ color: '#C5F441', fontSize: '20px', fontWeight: 'bold', fontStyle: 'italic' }}>
                        {profileLabel}
                    </div>
                </div>
              </div>

              {/* Stats Section */}
              <div style={{ display: 'flex', flexDirection: 'column', width: '220px', gap: '15px', justifyContent: 'center' }}>
                <StatRow label="BUILDER" value={user.psychometrics?.builderScore ?? 0} />
                <StatRow label="CREATOR" value={user.psychometrics?.creatorScore ?? 0} />
                <StatRow label="STRATEGIST" value={user.psychometrics?.strategistScore ?? 0} />
                <StatRow label="CATALYST" value={user.psychometrics?.catalystScore ?? 0} />
              </div>
            </div>

            {/* Bottom Accent */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', backgroundColor: '#C5F441', opacity: 0.6 }} />
          </div>

          {/* Logo Brand */}
          <div style={{ display: 'flex', position: 'absolute', bottom: '40px', right: '40px', alignItems: 'center', gap: '10px' }}>
             <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>JOINHASHCODE.COM</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: any) {
    console.error(error);
    return new Response(`Erreur OG: ${error.message}`, { status: 500 });
  }
}

function StatRow({ label, value }: { label: string, value: number }) {
    const progress = Math.min(100, Math.max(0, value));
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
                <span>{label}</span>
                <span>{progress}%</span>
            </div>
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#C5F441' }} />
            </div>
        </div>
    );
}
