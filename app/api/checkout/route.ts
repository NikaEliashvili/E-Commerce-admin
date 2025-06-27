import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // For dev, replace with dynamic origin in prod
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    const { productIds, redirectUrl } = await req.json();

    if (!productIds || !productIds.length) {
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

    // Fetch all product data with storeId
    const products = await prismadb.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    // Group products by storeId
    const storeMap: Record<
      string,
      {
        products: typeof products;
      }
    > = {};

    for (const product of products) {
      if (!storeMap[product.storeId]) {
        storeMap[product.storeId] = { products: [] };
      }
      storeMap[product.storeId].products.push(product);
    }

    const sessions: { storeId: string; url: string }[] = [];

    // Process checkout for each store
    for (const [storeId, { products }] of Object.entries(storeMap)) {
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

      // Create order
      const order = await prismadb.order.create({
        data: {
          storeId,
          isPaid: false,
          orderItems: {
            create: products.map((product) => ({
              product: {
                connect: {
                  id: product.id,
                },
              },
            })),
          },
        },
      });

      // Create Stripe session
      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
          enabled: false,
        },
        success_url: `${redirectUrl}?success=1&storeId=${storeId}`,
        cancel_url: `${redirectUrl}?canceled=1&storeId=${storeId}`,
        metadata: {
          orderId: order.id,
          storeId: storeId,
        },
      });

      sessions.push({ storeId, url: session.url! });
    }

    return new NextResponse(JSON.stringify({ url: sessions[0].url }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[MULTI_STORE_CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
}
