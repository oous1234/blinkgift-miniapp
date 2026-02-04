// src/services/sniperSocket.service.ts
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useSniperStore } from '../store/useSniperStore';
import { SniperEvent } from '../types/sniper';

class SniperSocketService {
  private client: Client | null = null;
  private readonly baseUrl = 'https://blinkback.ru.tuna.am/ws-deals';

  public connect(userId: string) {
    if (this.client?.active) return;

    const socket = new SockJS(this.baseUrl);
    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP Debug]:', str),
    });

    this.client.onConnect = () => {
      useSniperStore.getState().setStatus('CONNECTED');

      this.client?.subscribe(`/user/${userId}/queue/sniper`, (message) => {
        const payload = JSON.parse(message.body);
        this.handleIncomingEvent(payload);
      });
    };

    this.client.onDisconnect = () => {
      useSniperStore.getState().setStatus('DISCONNECTED');
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
      useSniperStore.getState().setStatus('DISCONNECTED');
    };

    useSniperStore.getState().setStatus('CONNECTING');
    this.client.activate();
  }

  private handleIncomingEvent(data: any) {
      if (!data) return;

      const event: SniperEvent = {
        id: data.id || `evt-${Date.now()}`,
        name: data.name || data.giftName || 'Unknown',
        model: data.model || 'Standard',
        backdrop: data.backdrop || '',
        symbol: data.symbol || '',
        price: data.price ? parseFloat(data.price) : 0,
        marketplace: data.marketplace || 'FRAGMENT',
        address: data.address || '',
        isOffchain: !!data.isOffchain,
        receivedAt: Date.now(),
        imageUrl: this.formatImageUrl(data.name || data.giftName || ''),
        dealScore: data.dealScore || 0
      };

      useSniperStore.getState().addEvent(event);

    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred(
        event.dealScore && event.dealScore > 15 ? 'success' : 'warning'
      );
    }
  }

  private formatImageUrl(name: string): string {
    const slug = name.toLowerCase().replace(/#/g, "-").replace(/\s+/g, "");
    return `https://nft.fragment.com/gift/${slug}.webp`;
  }

  public disconnect() {
    this.client?.deactivate();
  }
}

export const sniperSocketService = new SniperSocketService();