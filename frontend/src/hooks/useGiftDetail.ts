import { useCallback } from 'react';
import { InventoryService } from '../services/inventory.service';
import { useUIStore } from '../store/useUIStore';

export const useGiftDetail = () => {
  const {
    setSelectedGift,
    setDetailLoading,
    openDetail,
    selectedGift,
    isDetailLoading
  } = useUIStore();

  const loadDetail = useCallback(async (slug: string) => {
    if (!slug) return;

    // 1. Сначала открываем шторку и ставим загрузку
    setDetailLoading(true);
    setSelectedGift(null);
    openDetail();

    try {
      // 2. Загружаем данные
      const data = await InventoryService.getGiftDetail(slug);

      // 3. Сохраняем в глобальный стор
      setSelectedGift(data);
    } catch (e) {
      console.error("Failed to load gift detail:", e);
      setSelectedGift(null);
    } finally {
      setDetailLoading(false);
    }
  }, [openDetail, setSelectedGift, setDetailLoading]);

  return {
    loadDetail,
    gift: selectedGift,
    isLoading: isDetailLoading
  };
};