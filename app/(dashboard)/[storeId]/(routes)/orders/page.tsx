import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import OrderClient from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

interface OrdersPageProps {
  params: {
    storeId: string;
  };
}

const OrdersPage: React.FC<OrdersPageProps> = async ({ params }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map(
    ({ id, address, isPaid, orderItems, phone, createdAt }) => ({
      id,
      phone,
      address,
      isPaid,
      products: orderItems
        .map((item) => item.product.name)
        .join(", "),
      totalPrice: formatter.format(
        orderItems.reduce((total, item) => {
          return total + Number(item.product.price);
        }, 0)
      ),
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
