"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import CustomTooltip from "@/components/ui/custom-tooltip";

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
  initialData: Size | null;
}

const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const title = initialData ? `${initialData.name}` : "Create size";
  const description = initialData ? "Edit a size" : "Add a new size";
  const toastMessage = initialData
    ? `Size updated.`
    : "Size created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success(toastMessage, { position: "top-right" });
    } catch (error) {
      toast.error("Something went wrong", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/sizes/${params.sizeId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/sizes/`);
      toast.success("Size deleted!", { position: "top-right" });
    } catch (err) {
      toast.error(
        "Make sure you removed all products using this Size first!",
        { position: "top-right" }
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        title={`Delete ${initialData?.name}?`}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <CustomTooltip
            content={`Delete '${initialData?.name.toLocaleUpperCase()}'`}
          >
            <Button
              disabled={loading}
              variant="destructive"
              size="icon"
              onClick={() => {
                setOpen(true);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CustomTooltip>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading}
            className="block ml-auto active:scale-95"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SizeForm;
