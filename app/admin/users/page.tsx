import { UserManagementTable } from "@/components/admin/UserManagementTable"

export const metadata = {
  title: "Gestion des Membres | Admin",
  description: "Gérer les membres de la communauté HASHCODE",
}

export default function AdminUsersPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-white">Utilisateurs</h1>
        <p className="text-sm text-muted-foreground font-mono">
          Recherche, modération et administration des comptes de la communauté.
        </p>
      </div>
      <UserManagementTable />
    </div>
  )
}
