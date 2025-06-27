import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

// ✅ Set the exact origin that should access this route
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400", // Optional: cache preflight response for 1 day
};

// ✅ Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// ✅ Main POST handler
export async function POST(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) {
  try {
    const { productIds, redirectUrl } = await req.json();

    if (!productIds || productIds.length === 0) {
      return new NextResponse("Product Ids are required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!redirectUrl) {
      return new NextResponse("Redirect URL is required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      products.map((product) => ({
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price.toNumber() * 100,
        },
      }));

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: { enabled: false },
      success_url: `${redirectUrl}?success=1`,
      cancel_url: `${redirectUrl}?canceled=1`,
      metadata: {
        orderId: order.id,
      },
    });

    return new NextResponse(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[CHECKOUT_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
}
