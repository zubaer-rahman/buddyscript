import { useRef, useState, useCallback } from "react";

export function useCreatePostBox() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalFile, setModalFile] = useState<File | null>(null);

  const openModal = useCallback((text = "", file: File | null = null) => {
    setModalText(text);
    setModalFile(file);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handlePhotoClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) openModal("", file);
      e.target.value = "";
    },
    [openModal],
  );

  const handleTextareaClick = useCallback(() => {
    openModal();
  }, [openModal]);

  return {
    fileInputRef,
    modalOpen,
    modalText,
    modalFile,
    openModal,
    closeModal,
    handlePhotoClick,
    handleFileChange,
    handleTextareaClick,
  };
}
