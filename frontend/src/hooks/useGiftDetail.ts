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

    // ПОРЯДОК ВАЖЕН: сначала загрузка и сброс, потом открытие
    setGift(null);
    setIsLoading(true);
    openDetail();

    try {
      const data = await InventoryService.getGiftDetail(slug);
      // Если запрос прошел успешно, записываем данные
      if (data) {
        setGift(data);
      }
    } catch (e) {
      console.error("Failed to load gift detail:", e);
      setGift(null);
    } finally {
      setIsLoading(false);
    }
  }, [openDetail]);

  const reset = useCallback(() => {
    setGift(null);
    setIsLoading(false);
  }, []);

  return { gift, isLoading, loadDetail, reset };
};