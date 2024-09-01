import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import CategoryClient from "./components/client";
import { CategoryColumn } from "./components/columns";

interface CategoriesPageProps {
  params: {
    storeId: string;
  };
}

const CategoriesPage: React.FC<CategoriesPageProps> = async ({
  params,
}) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map(
    ({ id, name, createdAt, billboard }) => ({
      id,
      name,
      billboardLabel: billboard.label,
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
