import { UserManagementTable } from "@/components/admin/UserManagementTable"

export const metadata = {
  title: "Gestion des Membres | Admin",
  description: "Gérer les membres de la communauté HASHCODE",
}

export default function AdminUsersPage() {
  return (
    <div className="pb-12">
      <UserManagementTable />
    </div>
  )
}
