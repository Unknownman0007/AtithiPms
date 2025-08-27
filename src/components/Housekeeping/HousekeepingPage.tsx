import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Home, AlertTriangle, CheckCircle, Clock, Wrench, Filter } from 'lucide-react';

const HousekeepingPage: React.FC = () => {
  const { rooms, updateRoom, reservations } = useData();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRooms = rooms.filter(room => {
    if (statusFilter === 'all') return true;
    return room.status === statusFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'occupied':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'dirty':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'occupied':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'dirty':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'maintenance':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const handleStatusChange = (roomId: string, newStatus: string) => {
    updateRoom(roomId, { status: newStatus as any });
  };

  const roomStats = {
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    dirty: rooms.filter(r => r.status === 'dirty').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Housekeeping Management</h1>
          <p className="text-gray-600">Monitor and manage room cleaning status</p>
        </div>
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Rooms</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="dirty">Dirty</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{roomStats.available}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-blue-600">{roomStats.occupied}</p>
            </div>
            <Home className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Need Cleaning</p>
              <p className="text-2xl font-bold text-red-600">{roomStats.dirty}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-yellow-600">{roomStats.maintenance}</p>
            </div>
            <Wrench className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Room Status Grid</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {filteredRooms.map((room) => {
            const currentReservation = reservations.find(r => 
              r.roomId === room.id && r.status === 'checkedIn'
            );
            
            return (
              <div
                key={room.id}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getStatusColor(room.status)}`}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getStatusIcon(room.status)}
                  </div>
                  <h4 className="font-bold text-lg mb-1">
                    {room.number}
                  </h4>
                  <p className="text-sm capitalize mb-2">
                    {room.type}
                  </p>
                  <p className="text-xs font-medium capitalize mb-3">
                    {room.status}
                  </p>
                  
                  {currentReservation && (
                    <div className="text-xs mb-3 p-2 bg-white bg-opacity-50 rounded">
                      <p className="font-medium">Occupied</p>
                      <p>Until {new Date(currentReservation.checkOut).toLocaleDateString()}</p>
                    </div>
                  )}
                  
                  <select
                    value={room.status}
                    onChange={(e) => handleStatusChange(room.id, e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="dirty">Dirty</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cleaning Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Cleaning Tasks</h3>
        <div className="space-y-4">
          {rooms.filter(r => r.status === 'dirty').map((room) => (
            <div key={room.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">Room {room.number}</p>
                  <p className="text-sm text-gray-600 capitalize">{room.type} room - Needs cleaning</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStatusChange(room.id, 'available')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Mark Clean
                </button>
                <button
                  onClick={() => handleStatusChange(room.id, 'maintenance')}
                  className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                >
                  Maintenance
                </button>
              </div>
            </div>
          ))}
          
          {rooms.filter(r => r.status === 'dirty').length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">All Rooms Clean!</h4>
              <p className="text-gray-600">No rooms require cleaning at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HousekeepingPage;