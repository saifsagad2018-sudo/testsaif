// ============================================================
// ADMIN DASHBOARD — Main page (server-side auth check)
// ============================================================

import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { fetchGistData } from "@/lib/gist";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }

  const data = await fetchGistData();

  return <AdminDashboardClient initialData={data} />;
}
