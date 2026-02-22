import { useState, useEffect } from "react";
import { InventoryService } from "../services/inventory.service";
import { Gift } from "../types/domain";

export const useSearchDrawerLogic = (isOpen: boolean, onClose: () => void) => {
  const [searchType, setSearchType] = useState<"PROFILE" | "NFT">("PROFILE");
  const [view, setView] = useState<"LIST" | "DETAIL">("LIST");
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [giftHistory, setGiftHistory] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setView("LIST");
        setSelectedGift(null);
        setGiftHistory([]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // handleOpenGift теперь принимает slug (напр. TrappedHeart-6709)
  const handleOpenGift = async (slug: string) => {
    setIsLoadingDetail(true);
    setView("DETAIL");
    try {
      const giftData = await InventoryService.getGiftDetail(slug);
      setSelectedGift(giftData);

      setIsHistoryLoading(true);
      const historyData = await InventoryService.getBlockchainHistory(slug);
      setGiftHistory(historyData.history || []);
    } catch (e) {
      console.error("Error loading gift detail:", e);
    } finally {
      setIsLoadingDetail(false);
      setIsHistoryLoading(false);
    }
  };

  const handleBack = () => {
    if (view === "DETAIL") {
      setView("LIST");
      setSelectedGift(null);
    } else {
      onClose();
    }
  };

  return {
    searchType, setSearchType,
    view, setView,
    selectedGift,
    isLoadingDetail,
    giftHistory,
    isHistoryLoading,
    handleOpenGift,
    handleBack
  };
};