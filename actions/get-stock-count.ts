import prismadb from "@/lib/prismadb";

const getStockCount = async (storeId: string) => {
  const paidOrders = await prismadb.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return paidOrders;
};

export default getStockCount;
