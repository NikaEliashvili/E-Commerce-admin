import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // const categories = await prismadb.category.findMany();
    const groupedCategories = await prismadb.category.groupBy({
      by: ["storeId"], // Group by storeId
    });

    // Fetch detailed categories for each storeId
    const categoriesWithStores = await Promise.all(
      groupedCategories.map(async (group) => {
        const categories = await prismadb.category.findMany({
          where: { storeId: group.storeId },
          include: { store: true }, // Include store details
        });
        return {
          storeId: group.storeId,
          categories,
        };
      })
    );

    return NextResponse.json(groupedCategories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
