"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import { PaintBucket, Trash } from "lucide-react";
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
import { invertColor } from "@/lib/invert-color";

const formSchema = z.object({
  name: z.string().min(1),
  value: z
    .string()
    .min(4)
    .regex(/^#/, { message: "Value must be a valid hex code" }),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
  initialData: Color | null;
}

const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const title = initialData ? `${initialData.name}` : "Create color";
  const description = initialData
    ? "Edit a color"
    : "Add a new color";
  const toastMessage = initialData
    ? `Color updated.`
    : "Color created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "#000000",
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`);
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
        `/api/${params.storeId}/colors/${params.colorId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/colors/`);
      toast.success("Color deleted!", { position: "top-right" });
    } catch (err) {
      toast.error(
        "Make sure you removed all products using this Color first!",
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
                      placeholder="Color name"
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
                <FormItem className="space-y-1 relative ">
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      disabled={loading}
                      placeholder="Color value"
                      {...field}
                    />
                  </FormControl>
                  <div
                    className="absolute right-1 size-8 border-2 bottom-1 p-0 overflow-hidden cursor-pointer  bg-transparent ring-offset-0 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: field.value,
                    }}
                  >
                    <PaintBucket
                      className="size-4 saturate-0 "
                      style={{
                        color: field.value
                          ? invertColor(
                              field.value.replace("#", ""),
                              true
                            )
                          : "#ffffff",
                      }}
                    />
                  </div>
                  <input
                    onChange={field.onChange}
                    disabled={loading}
                    type="color"
                    className="absolute right-0 h-10 bottom-0 p-0 overflow-hidden cursor-pointer w-10 bg-transparent border-0 ring-offset-0 rounded-full opacity-0"
                  />
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

export default ColorForm;
