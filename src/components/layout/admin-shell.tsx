import Link from "next/link";
import type { ReactNode } from "react";

type AdminShellProps = {
  children: ReactNode;
  title: string;
  breadcrumbs?: string[];
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/roles", label: "Roles" },
  { href: "/admin/activity-logs", label: "Activity Logs" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ children, title, breadcrumbs = [] }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white p-4 lg:w-64 lg:border-b-0 lg:border-r">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Admin
            </p>
            <h2 className="text-xl font-semibold">DBS CMS</h2>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Administration</p>
                <h1 className="text-2xl font-semibold">{title}</h1>
              </div>
              <div className="text-sm text-slate-500">Placeholder shell</div>
            </div>
            {breadcrumbs.length > 0 ? (
              <div className="mt-3 text-sm text-slate-500">
                {breadcrumbs.join(" / ")}
              </div>
            ) : null}
          </header>

          <main className="flex-1 p-6">{children}</main>

          <footer className="border-t border-slate-200 bg-white px-6 py-4 text-sm text-slate-500">
            Admin area placeholder layout
          </footer>
        </div>
      </div>
    </div>
  );
}
