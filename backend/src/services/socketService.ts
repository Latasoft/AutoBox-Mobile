import { getSocketIO } from '../index';

export class SocketService {
  // Emitir cuando se crea un nuevo vehículo
  static emitNewVehicle(vehicle: any) {
    const io = getSocketIO();
    io.emit('new_vehicle', vehicle);
    console.log('📢 WebSocket: Nuevo vehículo emitido', vehicle.id);
  }

  // Emitir cuando se actualiza un vehículo
  static emitUpdateVehicle(vehicle: any) {
    const io = getSocketIO();
    io.emit('update_vehicle', vehicle);
    console.log('📢 WebSocket: Vehículo actualizado emitido', vehicle.id);
  }

  // Emitir cuando se elimina un vehículo
  static emitDeleteVehicle(vehicleId: number) {
    const io = getSocketIO();
    io.emit('delete_vehicle', { id: vehicleId });
    console.log('📢 WebSocket: Vehículo eliminado emitido', vehicleId);
  }

  // Emitir cuando hay una nueva oferta en subasta
  static emitNewBid(auctionId: number, bid: any) {
    const io = getSocketIO();
    io.emit('new_bid', { auctionId, bid });
    console.log('📢 WebSocket: Nueva oferta emitida para subasta', auctionId);
  }

  // Emitir actualización de estado de vehículo
  static emitVehicleStatusChange(vehicleId: number, status: string) {
    const io = getSocketIO();
    io.emit('vehicle_status_change', { vehicleId, status });
    console.log('📢 WebSocket: Cambio de estado emitido', vehicleId, status);
  }
}
