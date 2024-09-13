"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Check,
  ChevronsUpDown,
  MenuIcon,
  Navigation,
  Navigation2,
  Navigation2Icon,
} from "lucide-react";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

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
      href: `/${params.storeId}/sizes`,
      label: "sizes",
      active: pathname.includes(`/${params.storeId}/sizes`),
    },
    {
      href: `/${params.storeId}/colors`,
      label: "colors",
      active: pathname.includes(`/${params.storeId}/colors`),
    },
    {
      href: `/${params.storeId}/products`,
      label: "products",
      active: pathname.includes(`/${params.storeId}/products`),
    },
    {
      href: `/${params.storeId}/orders`,
      label: "orders",
      active: pathname.includes(`/${params.storeId}/orders`),
    },
    {
      href: `/${params.storeId}/settings`,
      label: "settings",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  const formattedItems = routes.map((item) => ({
    label: item.label,
    src: item.href,
    active: item.active,
  }));

  const currentStore = formattedItems.find((item) => item.active);

  return (
    <>
      <nav
        className={cn(
          "hidden md:flex items-center space-x-2 lg:space-x-6 ",
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
      <div className="flex items-center justify-center md:hidden ml-auto shrink w-40 sm:w-auto">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-label="Select a Store"
              className={cn(
                "w-[200px] justify-between capitalize",
                className
              )}
            >
              <MenuIcon className="mr-2 h-4 w-4" />
              {currentStore?.label}
              <ChevronsUpDown className="ml-auto shrink-0 opacity-50 size-4 " />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {formattedItems.map((route) => (
                    <CommandItem
                      key={route.src}
                      onSelect={() => {
                        router.push(route.src);
                        setOpen(false);
                      }}
                      className="text-sm cursor-pointer capitalize"
                    >
                      <Navigation className="mr-2 size-4" />
                      {route.label}
                      <Check
                        className={cn(
                          "ml-auto size-4",
                          currentStore?.active === route.active
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              <CommandSeparator />
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default MainNav;
