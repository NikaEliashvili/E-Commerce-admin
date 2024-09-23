import prismadb from "@/lib/prismadb";

import { NextResponse } from "next/server";
import { Category } from "@prisma/client"; // Adjust if necessary

export async function GET(req: Request) {
  try {
    // Fetch categories along with their related store
    const categories: (Category & { store: { id: string; name: string } })[] =
      await prismadb.category.findMany({
        include: {
          store: true, // Assuming there's a 'store' relation in your Category model
        },
      });

    // Group categories by store
    const groupedCategories: Record<
      string,
      { store: { id: string; name: string }; categories: Category[] }
    > = categories.reduce((acc, category) => {
      const storeId = category.storeId; // Adjust this based on your model's fields
      if (!acc[storeId]) {
        acc[storeId] = {
          store: category.store,
          categories: [],
        };
      }
      acc[storeId].categories.push(category);
      return acc;
    }, {} as Record<string, { store: { id: string; name: string }; categories: Category[] }>);

    return NextResponse.json(groupedCategories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
