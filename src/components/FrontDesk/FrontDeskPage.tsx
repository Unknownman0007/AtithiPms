import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Clock, UserCheck, UserX, Key, AlertCircle, CheckCircle, Users, Calendar } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

const FrontDeskPage: React.FC = () => {
  const { reservations, guests, rooms, updateReservation } = useData();
  const [selectedTab, setSelectedTab] = useState('arrivals');
  const [checkoutReservation, setCheckoutReservation] = useState(null);

  const today = new Date();
  const todayString = today.toDateString();

  const todayArrivals = reservations.filter(r => {
    const checkIn = new Date(r.checkIn);
    return checkIn.toDateString() === todayString && r.status === 'confirmed';
  });

  const todayDepartures = reservations.filter(r => {
    const checkOut = new Date(r.checkOut);
    return checkOut.toDateString() === todayString && r.status === 'checkedIn';
  });

  const inHouseGuests = reservations.filter(r => r.status === 'checkedIn');

  const handleCheckIn = (reservationId: string) => {
    updateReservation(reservationId, { status: 'checkedIn' });
  };

  const handleCheckOut = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      setCheckoutReservation(reservation);
    }
  };

  const tabs = [
    { id: 'arrivals', label: 'Arrivals', count: todayArrivals.length, icon: UserCheck },
    { id: 'departures', label: 'Departures', count: todayDepartures.length, icon: UserX },
    { id: 'inhouse', label: 'In-House', count: inHouseGuests.length, icon: Users },
  ];

  const renderReservationCard = (reservation: any, actionType: 'checkin' | 'checkout') => {
    const guest = guests.find(g => g.id === reservation.guestId);
    const room = rooms.find(r => r.id === reservation.roomId);

    return (
      <div key={reservation.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest'}
              </h3>
              <p className="text-sm text-gray-600">{guest?.email}</p>
              <p className="text-sm text-gray-600">{guest?.phone}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">Room {room?.number}</p>
            <p className="text-sm text-gray-600 capitalize">{room?.type}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Check-in</p>
            <p className="font-medium">{new Date(reservation.checkIn).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Check-out</p>
            <p className="font-medium">{new Date(reservation.checkOut).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="font-medium">₹{reservation.totalAmount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Deposit Paid</p>
            <p className="font-medium">₹{reservation.depositPaid}</p>
          </div>
        </div>

        {reservation.notes && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Notes:</strong> {reservation.notes}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {actionType === 'checkin' ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Clock className="w-3 h-3 mr-1" />
                Ready for Check-in
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Key className="w-3 h-3 mr-1" />
                In-House
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {actionType === 'checkin' ? (
              <button
                onClick={() => handleCheckIn(reservation.id)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span>Check In</span>
              </button>
            ) : (
              <button
                onClick={() => handleCheckOut(reservation.id)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserX className="w-4 h-4" />
                <span>Check Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Front Desk Operations</h1>
          <p className="text-gray-600">Manage check-ins, check-outs, and in-house guests</p>
        </div>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expected Arrivals</p>
              <p className="text-2xl font-bold text-green-600">{todayArrivals.length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expected Departures</p>
              <p className="text-2xl font-bold text-blue-600">{todayDepartures.length}</p>
            </div>
            <UserX className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In-House Guests</p>
              <p className="text-2xl font-bold text-purple-600">{inHouseGuests.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-amber-600">
                {rooms.length > 0 ? Math.round((inHouseGuests.length / rooms.length) * 100) : 0}%
              </p>
            </div>
            <Calendar className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                    selectedTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'arrivals' && (
            <div>
              {todayArrivals.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Arrivals Today</h3>
                  <p className="text-gray-600">All expected guests have already checked in.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {todayArrivals.map((reservation) => 
                    renderReservationCard(reservation, 'checkin')
                  )}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'departures' && (
            <div>
              {todayDepartures.length === 0 ? (
                <div className="text-center py-12">
                  <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Departures Today</h3>
                  <p className="text-gray-600">No guests are scheduled to check out today.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {todayDepartures.map((reservation) => 
                    renderReservationCard(reservation, 'checkout')
                  )}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'inhouse' && (
            <div>
              {inHouseGuests.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No In-House Guests</h3>
                  <p className="text-gray-600">No guests are currently checked in.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {inHouseGuests.map((reservation) => {
                    const guest = guests.find(g => g.id === reservation.guestId);
                    const room = rooms.find(r => r.id === reservation.roomId);
                    
                    return (
                      <div key={reservation.id} className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest'}
                              </h3>
                              <p className="text-sm text-gray-600">{guest?.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">Room {room?.number}</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              In-House
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Checked In</p>
                            <p className="font-medium">{new Date(reservation.checkIn).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Check-out</p>
                            <p className="font-medium">{new Date(reservation.checkOut).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutReservation && (
        <CheckoutModal
          reservation={checkoutReservation}
          onClose={() => setCheckoutReservation(null)}
          onComplete={() => {
            // Refresh the page data or show success message
            setCheckoutReservation(null);
          }}
        />
      )}
    </div>
  );
};

export default FrontDeskPage;