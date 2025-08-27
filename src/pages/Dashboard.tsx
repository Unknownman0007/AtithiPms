import React from 'react';
import { useData } from '../contexts/DataContext';
import { Calendar, Users, Building2, DollarSign, TrendingUp, Clock } from 'lucide-react';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { rooms, guests, reservations, getRoomOccupancy } = useData();
  
  const today = new Date();
  const todayOccupancy = getRoomOccupancy(today);
  
  const todayArrivals = reservations.filter(r => {
    const checkIn = new Date(r.checkIn);
    return checkIn.toDateString() === today.toDateString() && r.status !== 'cancelled';
  });

  const todayDepartures = reservations.filter(r => {
    const checkOut = new Date(r.checkOut);
    return checkOut.toDateString() === today.toDateString() && r.status !== 'cancelled';
  });

  const totalRevenue = reservations
    .filter(r => r.status !== 'cancelled')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const occupancyRate = rooms.length > 0 ? Math.round((todayOccupancy.occupied / todayOccupancy.total) * 100) : 0;

  const stats = [
    {
      title: 'Total Rooms',
      value: rooms.length,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Guests',
      value: guests.length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-900">
            {today.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Arrivals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Today's Arrivals</h3>
                <p className="text-sm text-gray-500">{todayArrivals.length} guests checking in</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {todayArrivals.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No arrivals today</p>
            ) : (
              <div className="space-y-3">
                {todayArrivals.slice(0, 5).map((reservation) => {
                  const guest = guests.find(g => g.id === reservation.guestId);
                  const room = rooms.find(r => r.id === reservation.roomId);
                  return (
                    <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest'}
                        </p>
                        <p className="text-sm text-gray-500">Room {room?.number}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reservation.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reservation.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Departures */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Today's Departures</h3>
                <p className="text-sm text-gray-500">{todayDepartures.length} guests checking out</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {todayDepartures.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No departures today</p>
            ) : (
              <div className="space-y-3">
                {todayDepartures.slice(0, 5).map((reservation) => {
                  const guest = guests.find(g => g.id === reservation.guestId);
                  const room = rooms.find(r => r.id === reservation.roomId);
                  return (
                    <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest'}
                        </p>
                        <p className="text-sm text-gray-500">Room {room?.number}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reservation.status === 'checkedOut' 
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {reservation.status === 'checkedOut' ? 'Checked Out' : 'In House'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => onNavigate?.('reservations')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          >
            <div className="text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">New Reservation</p>
            </div>
          </button>
          <button 
            onClick={() => onNavigate?.('guests')}
            className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
          >
            <div className="text-center">
              <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-emerald-900">Add Guest</p>
            </div>
          </button>
          <button 
            onClick={() => onNavigate?.('rooms')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
          >
            <div className="text-center">
              <Building2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900">Room Management</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;