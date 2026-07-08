import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white p-6">
      <h2 className="mb-8 text-2xl font-bold">Workspace</h2>

      <nav className="space-y-4">
        <Link href="/dashboard" className="block">
          Dashboard
        </Link>

        <Link href="/dashboard/tasks" className="block">
          Tasks
        </Link>

        <Link href="/dashboard/documents" className="block">
          Documents
        </Link>
      </nav>
    </div>
  );
}