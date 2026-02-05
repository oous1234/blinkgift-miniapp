import { useState, useEffect, useMemo, useCallback } from "react";
import { ChangesService } from "../services/changes.service";
import { InventoryService } from "../services/inventory.service";

export type NftSearchView = "FORM" | "PICK_GIFT" | "PICK_MODEL" | "PICK_PATTERN" | "PICK_BACKDROP";

export const useNftSearchLogic = (onGiftClick: (slug: string, num: number) => void) => {
  const [view, setView] = useState<NftSearchView>("FORM");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [allGifts, setAllGifts] = useState<string[]>([]);
  const [attributes, setAttributes] = useState({
    models: [] as string[],
    patterns: [] as string[],
    backdrops: [] as any[],
    loading: false
  });

  const [form, setForm] = useState({
    gift: "Все подарки",
    model: "Любая модель",
    pattern: "Любой узор",
    backdropObj: null as any,
    number: "",
    sortBy: "newest",
  });

  const isGiftSelected = form.gift !== "Все подарки";

  // Первоначальная загрузка списка подарков
  useEffect(() => {
    ChangesService.getGifts().then(data => {
      if (Array.isArray(data)) setAllGifts(data);
    });
  }, []);

  // Загрузка атрибутов (модели, паттерны) при смене подарка
  const loadAttributes = useCallback(async (giftName: string) => {
    if (!giftName || giftName === "Все подарки") return;

    setAttributes(prev => ({ ...prev, loading: true }));
    try {
      const [models, patterns, backdrops] = await Promise.all([
        ChangesService.getModels(giftName),
        ChangesService.getPatterns(giftName),
        ChangesService.getBackdrops(giftName),
      ]);
      setAttributes({ models, patterns, backdrops, loading: false });
    } catch (e) {
      console.error("Failed to load attributes", e);
      setAttributes(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (isGiftSelected) {
      loadAttributes(form.gift);
    }
  }, [form.gift, isGiftSelected, loadAttributes]);

  const previewData = useMemo(() => {
    if (!isGiftSelected) return null;
    return {
      modelUrl: ChangesService.getModelUrl(form.gift, form.model, "json"),
      patternUrl: form.pattern !== "Любой узор" ? ChangesService.getPatternImage(form.gift, form.pattern) : null,
      bg: form.backdropObj ? {
        center: form.backdropObj.hex.centerColor,
        edge: form.backdropObj.hex.edgeColor,
        pattern: form.backdropObj.hex.patternColor,
      } : null,
    };
  }, [form, isGiftSelected]);

  const handleSearch = useCallback(async (targetPage: number = 1) => {
    setIsSearching(true);
    setHasSearched(true);
    setPage(targetPage);

    const request: any = {
      limit: 20,
      offset: (targetPage - 1) * 20,
      sortBy: form.sortBy,
    };

    if (form.number.trim()) {
      if (/^\d+$/.test(form.number)) request.giftId = parseInt(form.number);
      else request.query = form.number;
    }

    if (isGiftSelected) {
      request.query = request.query ? `${form.gift} ${request.query}` : form.gift;
    }

    if (form.model !== "Любая модель") request.models = [form.model];
    if (form.pattern !== "Любой узор") request.symbols = [form.pattern];
    if (form.backdropObj) request.backdrops = [form.backdropObj.name];

    try {
      const data = await InventoryService.searchGifts(request);
      setResults(data.items);
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  }, [form, isGiftSelected]);

  const handleReset = () => {
    setForm({ gift: "Все подарки", model: "Любая модель", pattern: "Любой узор", backdropObj: null, number: "", sortBy: "newest" });
    setResults([]);
    setHasSearched(false);
    setPage(1);
  };

  return {
    view, setView,
    form, setForm,
    results, total, page,
    isSearching, hasSearched,
    allGifts, attributes,
    isGiftSelected, previewData,
    handleSearch, handleReset
  };
};