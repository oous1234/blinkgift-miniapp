import { useState, useCallback } from 'react';
import { Gift } from '../types/domain';
import { InventoryService } from '../services/inventory.service';
import { useUIStore } from '../store/useUIStore';

export const useGiftDetail = () => {
  const [gift, setGift] = useState<Gift | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { openDetail } = useUIStore();

  const loadDetail = useCallback(async (slug: string) => {
    if (!slug) return;

    setIsLoading(true);
    setGift(null);
    openDetail();

    try {
      // Только ОДИН запрос за данными
      const data = await InventoryService.getGiftDetail(slug);
      setGift(data);
    } catch (e) {
      console.error("Failed to load gift detail:", e);
      setGift(null);
    } finally {
      setIsLoading(false);
    }
  }, [openDetail]);

  const reset = useCallback(() => {
    setGift(null);
  }, []);

  return { gift, isLoading, loadDetail, reset };
};