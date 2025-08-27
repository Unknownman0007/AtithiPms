import React from 'react';
import { useData, Reservation } from '../../contexts/DataContext';
import { Calendar, User, Building2, DollarSign, Edit, Trash2, CheckCircle, XCircle, Clock, Users } from 'lucide-react';

interface ReservationsListProps {
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
}

const ReservationsList: React.FC<ReservationsListProps> = ({ reservations, onEdit }) => {
  const { guests, rooms, updateReservation, cancelReservation } = useData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'tentative':
        return 'bg-yellow-100 text-yellow-800';
      case 'checkedIn':
        return 'bg-blue-100 text-blue-800';
      case 'checkedOut':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'tentative':
        return <Clock className="w-4 h-4" />;
      case 'checkedIn':
        return <User className="w-4 h-4" />;
      case 'checkedOut':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'tentative':
        return 'Tentative';
      case 'checkedIn':
        return 'Checked In';
      case 'checkedOut':
        return 'Checked Out';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const handleStatusChange = (reservationId: string, newStatus: string) => {
    updateReservation(reservationId, { status: newStatus as any });
  };

  const handleCancel = (reservationId: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      cancelReservation(reservationId);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getNights = (checkIn: Date, checkOut: Date) => {
    const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reservations Found</h3>
          <p className="text-gray-600 mb-6">
            There are no reservations matching your current filters.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create First Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest & Booking
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room & Dates
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount & Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.map((reservation) => {
              const guest = guests.find(g => g.id === reservation.guestId);
              const room = rooms.find(r => r.id === reservation.roomId);
              const nights = getNights(reservation.checkIn, reservation.checkOut);

              return (
                <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {reservation.isGroup ? (
                            <Users className="w-4 h-4 text-blue-600" />
                          ) : (
                            <User className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest'}
                          </p>
                          {reservation.isGroup && (
                            <p className="text-sm text-blue-600 font-medium">
                              Group: {reservation.groupName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>ID: {reservation.id.slice(0, 8)}</p>
                        <p>{guest?.email}</p>
                        <p>{guest?.phone}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          Room {room?.number || 'N/A'}
                        </span>
                        <span className="text-sm text-gray-500 capitalize">
                          ({room?.type})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {nights} night{nights !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          ₹{reservation.totalAmount.toFixed(2)}
                        </span>
                      </div>
                      {reservation.depositPaid > 0 && (
                        <p className="text-sm text-green-600">
                          Deposit: ₹{reservation.depositPaid.toFixed(2)}
                        </p>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusIcon(reservation.status)}
                          <span>{getStatusLabel(reservation.status)}</span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 capitalize">
                        {reservation.rateType} rate
                      </p>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {/* Status Change Dropdown */}
                      {reservation.status !== 'cancelled' && (
                        <select
                          value={reservation.status}
                          onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="tentative">Tentative</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="checkedIn">Check In</option>
                          <option value="checkedOut">Check Out</option>
                        </select>
                      )}
                      
                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(reservation)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Reservation"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      {/* Cancel Button */}
                      {reservation.status !== 'cancelled' && reservation.status !== 'checkedOut' && (
                        <button
                          onClick={() => handleCancel(reservation.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Cancel Reservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {reservation.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                        <strong>Notes:</strong> {reservation.notes}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsList;