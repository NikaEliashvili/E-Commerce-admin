"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  loading,
  onConfirm,
  title = "Are you sure?",
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description="This action is permanent!"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button
          disabled={loading}
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="destructive"
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
