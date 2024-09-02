import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import SizeClient from "./components/client";
import { SizeColumn } from "./components/columns";

interface SizesPageProps {
  params: {
    storeId: string;
  };
}

const SizesPage: React.FC<SizesPageProps> = async ({ params }) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map(
    ({ id, name, value, createdAt }) => ({
      id,
      name,
      value,
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
