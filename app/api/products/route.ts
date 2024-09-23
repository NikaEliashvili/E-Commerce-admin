import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prismadb.product.findMany();

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
