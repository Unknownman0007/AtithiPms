import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { BarChart3, TrendingUp, Calendar, DollarSign, Users, Building2, Download, Filter } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { rooms, guests, reservations } = useData();
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Calculate metrics
  const totalRevenue = reservations
    .filter(r => r.status !== 'cancelled')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const occupancyRate = rooms.length > 0 
    ? Math.round((reservations.filter(r => r.status === 'checkedIn').length / rooms.length) * 100)
    : 0;

  const adr = reservations.length > 0 
    ? totalRevenue / reservations.filter(r => r.status !== 'cancelled').length
    : 0;

  const revpar = rooms.length > 0 ? totalRevenue / rooms.length : 0;

  const reports = [
    {
      title: 'Occupancy Report',
      description: 'Room occupancy statistics and trends',
      icon: Building2,
      color: 'blue',
      data: `${occupancyRate}%`
    },
    {
      title: 'Revenue Report',
      description: 'Total revenue and financial performance',
      icon: DollarSign,
      color: 'green',
      data: `₹${totalRevenue.toLocaleString()}`
    },
    {
      title: 'ADR Report',
      description: 'Average Daily Rate analysis',
      icon: TrendingUp,
      color: 'purple',
      data: `₹${adr.toFixed(2)}`
    },
    {
      title: 'RevPAR Report',
      description: 'Revenue Per Available Room',
      icon: BarChart3,
      color: 'amber',
      data: `₹${revpar.toFixed(2)}`
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Hotel performance metrics and business intelligence</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon;
          return (
            <div key={index} className={`p-6 rounded-xl border ${getColorClasses(report.color)}`}>
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8" />
                <span className="text-2xl font-bold">{report.data}</span>
              </div>
              <h3 className="font-semibold mb-1">{report.title}</h3>
              <p className="text-sm opacity-80">{report.description}</p>
            </div>
          );
        })}
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Chart visualization would be implemented here</p>
              <p className="text-sm">Consider integrating Chart.js or Recharts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Type Performance</h3>
          <div className="space-y-4">
            {['single', 'double', 'suite', 'dormitory'].map((type) => {
              const typeRooms = rooms.filter(r => r.type === type);
              const typeReservations = reservations.filter(r => {
                const room = rooms.find(room => room.id === r.roomId);
                return room?.type === type && r.status !== 'cancelled';
              });
              const typeRevenue = typeReservations.reduce((sum, r) => sum + r.totalAmount, 0);
              
              return (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{type} Rooms</p>
                    <p className="text-sm text-gray-600">{typeRooms.length} rooms available</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{typeRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{typeReservations.length} bookings</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Booking Activity</h3>
        <div className="space-y-3">
          {reservations.slice(0, 5).map((reservation) => {
            const guest = guests.find(g => g.id === reservation.guestId);
            const room = rooms.find(r => r.id === reservation.roomId);
            return (
              <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                     {guest ? `${guest.firstName} ${guest.lastName}` : `Guest ${reservation.guestId.slice(-4)}`}
                    </p>
                    <p className="text-sm text-gray-600">Room {room?.number} • {reservation.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{reservation.totalAmount}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(reservation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;