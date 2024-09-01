import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/client";
import { BillboardColumn } from "./components/columns";

interface BillboardsPageProps {
  params: {
    storeId: string;
  };
}

const BillboardsPage: React.FC<BillboardsPageProps> = async ({
  params,
}) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(
    ({ id, label, createdAt }) => ({
      id,
      label,
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
