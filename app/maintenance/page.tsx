import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { UserTopBar } from "@/components/dashboard/user-topbar";
import { BottomNav } from "@/components/dashboard/bottom-nav";

export default function MaintenancePage() {
  return (
    <SidebarProvider>
      <AppSidebar user={null} hasSquad={false} />
      <SidebarInset className="bg-background">
        <UserTopBar user={null} />
        <main className="flex-1 p-4 md:p-8 pb-32 md:pb-8 overflow-y-auto scrollbar-none">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Service en maintenance</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Nous effectuons actuellement des mises à jour pour améliorer votre expérience. Le service sera de retour bientôt.
              </p>
              <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto">
                <h2 className="font-semibold text-foreground mb-3">Ce qui se passe :</h2>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Mise à jour des fonctionnalités</li>
                  <li>• Optimisation des performances</li>
                  <li>• Corrections de bugs</li>
                  <li>• Améliorations de sécurité</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground mt-8">
                Merci pour votre patience. Reviens dans quelques minutes !
              </p>
            </div>
          </div>
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
