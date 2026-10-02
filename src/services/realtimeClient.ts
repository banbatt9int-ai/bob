/**
 * Firebase Realtime & Live Sync Client
 */
export interface RealtimeEvent {
  type:
    | 'MEMBERS_CHANGED'
    | 'DEPOSIT_CREATED'
    | 'DEPOSIT_APPROVED'
    | 'DEPOSIT_REJECTED'
    | 'SETTINGS_UPDATED'
    | 'DIRECTORS_UPDATED'
    | 'LANDS_UPDATED'
    | 'NOTIFICATION_CREATED'
    | 'DATABASE_MUTATION'
    | 'SYNC_PING'
    | 'PING'
    | 'PONG';
  payload?: any;
  timestamp: string;
  sender?: string;
}

type EventListener = (event: RealtimeEvent) => void;

class FirebaseRealtimeClient {
  private listeners: Set<EventListener> = new Set();
  private statusListeners: Set<(connected: boolean) => void> = new Set();
  private isConnected = true;
  private lastEventTime = 0;

  constructor() {
    this.isConnected = true;
  }

  public connect() {
    return;
  }

  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onStatusChange(listener: (connected: boolean) => void): () => void {
    this.statusListeners.add(listener);
    listener(true);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  public getConnected(): boolean {
    return this.isConnected;
  }

  public broadcast(event: Omit<RealtimeEvent, 'timestamp'>) {
    const now = Date.now();
    if (now - this.lastEventTime < 3000) return;
    this.lastEventTime = now;

    const fullEvent: RealtimeEvent = { ...event, timestamp: new Date().toISOString() };

    if (fullEvent.type === 'PING' || fullEvent.type === 'PONG' || fullEvent.type === 'SYNC_PING') return;

    this.listeners.forEach((l) => {
      try {
        l(fullEvent);
      } catch (e) {}
    });
  }
}

export const realtimeClient = new FirebaseRealtimeClient();

export function useFirebaseRealtime(onUpdate: (event: RealtimeEvent) => void) {
  let lastCall = 0;
  const debounced = (event: RealtimeEvent) => {
    const now = Date.now();
    if (now - lastCall < 2000) return;
    if (event.type === 'PING' || event.type === 'PONG' || event.type === 'SYNC_PING') return;
    lastCall = now;
    onUpdate(event);
  };
  return realtimeClient.subscribe(debounced);
}


