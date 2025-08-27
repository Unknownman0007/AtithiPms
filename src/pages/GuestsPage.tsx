import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Search, User, Phone, Mail, MapPin, Globe, Calendar, Edit, Trash2 } from 'lucide-react';
import GuestForm from '../components/Guests/GuestForm';

const GuestsPage: React.FC = () => {
  const { guests, reservations, deleteGuest } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuests = guests.filter(guest => {
    const searchLower = searchTerm.toLowerCase();
    return (
      guest.firstName.toLowerCase().includes(searchLower) ||
      guest.lastName.toLowerCase().includes(searchLower) ||
      guest.email.toLowerCase().includes(searchLower) ||
      guest.phone.includes(searchTerm) ||
      guest.nationality.toLowerCase().includes(searchLower)
    );
  });

  const getGuestReservations = (guestId: string) => {
    return reservations.filter(r => r.guestId === guestId);
  };

  const getGuestStats = (guestId: string) => {
    const guestReservations = getGuestReservations(guestId);
    const totalBookings = guestReservations.length;
    const totalSpent = guestReservations.reduce((sum, r) => sum + r.totalAmount, 0);
    const lastVisit = guestReservations.length > 0 
      ? Math.max(...guestReservations.map(r => new Date(r.checkOut).getTime()))
      : null;
    
    return {
      totalBookings,
      totalSpent,
      lastVisit: lastVisit ? new Date(lastVisit) : null
    };
  };

  const handleDeleteGuest = (guestId: string, guestName: string) => {
    if (window.confirm(`Are you sure you want to delete ${guestName}? This action cannot be undone.`)) {
      try {
        deleteGuest(guestId);
      } catch (error) {
        alert(error.message || 'Failed to delete guest');
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guest Management</h1>
          <p className="text-gray-600">Manage guest profiles and booking history</p>
        </div>
        <button
          onClick={() => {
            setEditingGuest(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Guest</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">{guests.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-2xl font-bold text-emerald-600">
                {reservations.filter(r => r.status === 'checkedIn').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Repeat Guests</p>
              <p className="text-2xl font-bold text-purple-600">
                {guests.filter(g => getGuestStats(g.id).totalBookings > 1).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search guests by name, email, phone, or nationality..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Guests List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredGuests.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Guests Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No guests match your search criteria.' : 'Start by adding your first guest.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {filteredGuests.map((guest) => {
              const stats = getGuestStats(guest.id);
              return (
                <div key={guest.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {guest.firstName} {guest.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{guest.nationality}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingGuest(guest);
                          setShowForm(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Guest"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteGuest(guest.id, `${guest.firstName} ${guest.lastName}`);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Guest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{guest.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{guest.phone}</span>
                    </div>
                    {guest.address && (
                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span className="line-clamp-2">{guest.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{stats.totalBookings}</p>
                        <p className="text-xs text-gray-600">Bookings</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">₹{stats.totalSpent.toFixed(0)}</p>
                        <p className="text-xs text-gray-600">Total Spent</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {stats.lastVisit 
                            ? stats.lastVisit.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : 'Never'
                          }
                        </p>
                        <p className="text-xs text-gray-600">Last Visit</p>
                      </div>
                    </div>
                  </div>

                  {guest.preferences && (
                    <div className="mt-4 p-2 bg-white rounded text-xs text-gray-600">
                      <strong>Preferences:</strong> {guest.preferences}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Guest Form Modal */}
      {showForm && (
        <GuestForm
          guest={editingGuest}
          onClose={() => {
            setShowForm(false);
            setEditingGuest(null);
          }}
        />
      )}
    </div>
  );
};

export default GuestsPage;