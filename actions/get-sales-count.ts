import prismadb from "@/lib/prismadb";

const getSalesCount = async (storeId: string) => {
  const paidOrders = await prismadb.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return paidOrders;
};

export default getSalesCount;
