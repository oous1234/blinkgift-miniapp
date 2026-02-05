import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { SniperEvent } from '../types/sniper';
import { ASSETS } from '../config/constants';

type OnEventCallback = (event: SniperEvent) => void;
type OnStatusChange = (status: 'CONNECTED' | 'DISCONNECTED') => void;

class SniperSocketService {
  private client: Client | null = null;
  private readonly baseUrl = 'https://blinkback.ru.tuna.am/ws-deals';
  private onEventCallback: OnEventCallback | null = null;
  private onStatusCallback: OnStatusChange | null = null;

  public setCallbacks(onEvent: OnEventCallback, onStatus: OnStatusChange) {
    this.onEventCallback = onEvent;
    this.onStatusCallback = onStatus;
  }

  public connect(userId: string) {
    if (this.client?.active) return;

    const socket = new SockJS(this.baseUrl);
    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (msg) => {
        if (import.meta.env.DEV) console.log('[Socket]:', msg);
      }
    });

    this.client.onConnect = () => {
      this.onStatusCallback?.('CONNECTED');
      this.client?.subscribe(`/user/${userId}/queue/sniper`, (message: IMessage) => {
        this.handleIncomingEvent(JSON.parse(message.body));
      });
    };

    this.client.onDisconnect = () => {
      this.onStatusCallback?.('DISCONNECTED');
    };

    this.client.activate();
  }

  private handleIncomingEvent(data: any) {
    if (!data || !this.onEventCallback) return;

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

    this.onEventCallback(event);
  }

  public disconnect() {
    this.client?.deactivate();
  }
}

export const sniperSocketService = new SniperSocketService();