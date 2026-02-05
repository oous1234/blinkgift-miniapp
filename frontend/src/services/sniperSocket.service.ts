import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useSniperStore } from '../store/useSniperStore';
import { SniperEvent } from '../types/sniper';
import { ASSETS } from '../config/constants';

class SniperSocketService {
  private client: Client | null = null;
  private readonly baseUrl = 'https://blinkback.ru.tuna.am/ws-deals';

  public connect(userId: string) {
    if (this.client?.active) return;

    const socket = new SockJS(this.baseUrl);
    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      // debug: (str) => console.log(str),
    });

    this.client.onConnect = () => {
      useSniperStore.getState().setStatus('CONNECTED');
      this.client?.subscribe(`/user/${userId}/queue/sniper`, (message) => {
        this.handleIncomingEvent(JSON.parse(message.body));
      });
    };

    this.client.onDisconnect = () => useSniperStore.getState().setStatus('DISCONNECTED');
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
      receivedAt: Date.now(),
      imageUrl: ASSETS.FRAGMENT_GIFT((data.name || data.giftName || '').toLowerCase().replace(/#/g, "-").replace(/\s+/g, "")),
      dealScore: data.dealScore || 0
    };

    useSniperStore.getState().addEvent(event);

    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred(
        event.dealScore && event.dealScore > 15 ? 'success' : 'warning'
      );
    }
  }

  public disconnect() {
    this.client?.deactivate();
  }
}

export const sniperSocketService = new SniperSocketService();