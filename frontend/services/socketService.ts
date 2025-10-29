import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private readonly SOCKET_URL = 'http://localhost:3000';

  connect() {
    if (!this.socket) {
      this.socket = io(this.SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('✅ WebSocket conectado:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ WebSocket desconectado');
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Error de conexión WebSocket:', error);
      });
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Escuchar eventos de nuevo vehículo
  onNewVehicle(callback: (vehicle: any) => void) {
    if (this.socket) {
      this.socket.on('new_vehicle', callback);
    }
  }

  // Escuchar eventos de actualización de vehículo
  onUpdateVehicle(callback: (vehicle: any) => void) {
    if (this.socket) {
      this.socket.on('update_vehicle', callback);
    }
  }

  // Escuchar eventos de eliminación de vehículo
  onDeleteVehicle(callback: (data: { id: number }) => void) {
    if (this.socket) {
      this.socket.on('delete_vehicle', callback);
    }
  }

  // Escuchar nuevas ofertas en subasta
  onNewBid(callback: (data: { auctionId: number; bid: any }) => void) {
    if (this.socket) {
      this.socket.on('new_bid', callback);
    }
  }

  // Escuchar cambios de estado
  onVehicleStatusChange(callback: (data: { vehicleId: number; status: string }) => void) {
    if (this.socket) {
      this.socket.on('vehicle_status_change', callback);
    }
  }

  // Limpiar listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
