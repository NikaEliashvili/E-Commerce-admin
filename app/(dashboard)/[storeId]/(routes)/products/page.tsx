import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

interface ProductsPageProps {
  params: {
    storeId: string;
  };
}

const ProductsPage: React.FC<ProductsPageProps> = async ({
  params,
}) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map(
    ({
      id,
      name,
      createdAt,
      isFeatured,
      isArchived,
      price,
      category,
      size,
      color,
    }) => ({
      id,
      name,
      isFeatured,
      isArchived,
      price: formatter.format(price.toNumber()),
      category: category.name,
      size: size.name,
      color: color.value,
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
