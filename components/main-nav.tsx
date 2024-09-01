"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();
  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "billboards",
      active: pathname.includes(`/${params.storeId}/billboards`),
    },
    {
      href: `/${params.storeId}/categories`,
      label: "categories",
      active: pathname.includes(`/${params.storeId}/categories`),
    },
    {
      href: `/${params.storeId}/settings`,
      label: "settings",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav
      className={cn(
        "flex items-center space-x-2 lg:space-x-6",
        className
      )}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium mx-1 transition-colors hover:text-primary capitalize",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
