"use client";
import { useEffect } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";

const SetupPage = () => {
  const { onOpen, isOpen } = useStoreModal();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};

export default SetupPage;
