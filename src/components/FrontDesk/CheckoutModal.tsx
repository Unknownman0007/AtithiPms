import React, { useState } from 'react';
import { useData, Reservation } from '../../contexts/DataContext';
import { X, DollarSign, Receipt, AlertTriangle, CheckCircle, CreditCard, Banknote } from 'lucide-react';

interface CheckoutModalProps {
  reservation: Reservation;
  onClose: () => void;
  onComplete: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ reservation, onClose, onComplete }) => {
  const { guests, rooms, updateReservation, updateRoom } = useData();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('card');
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [roomInspection, setRoomInspection] = useState<'clean' | 'dirty' | 'maintenance'>('dirty');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const guest = guests.find(g => g.id === reservation.guestId);
  const room = rooms.find(r => r.id === reservation.roomId);

  const subtotal = reservation.totalAmount + additionalCharges - discount;
  const outstandingBalance = subtotal - reservation.depositPaid;

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // Update reservation status
      await updateReservation(reservation.id, {
        status: 'checkedOut',
        notes: notes ? `${reservation.notes || ''}\nCheckout Notes: ${notes}` : reservation.notes
      });

      // Update room status based on inspection
      await updateRoom(room!.id, { status: roomInspection });

      // Generate receipt (in a real system, this would create a PDF)
      generateReceipt();

      onComplete();
      onClose();
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateReceipt = () => {
    const receiptData = {
      reservationId: reservation.id,
      guestName: guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest',
      roomNumber: room?.number,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      nights: Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
      roomRate: reservation.totalAmount,
      additionalCharges,
      discount,
      subtotal,
      depositPaid: reservation.depositPaid,
      finalAmount: outstandingBalance,
      paymentMethod,
      checkoutTime: new Date()
    };

    // In a real system, this would generate a PDF receipt
    console.log('Receipt generated:', receiptData);
    
    // For demo purposes, show an alert
    alert(`Receipt generated for ${receiptData.guestName}\nFinal Amount: ₹${outstandingBalance.toFixed(2)}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Receipt className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Guest Check-out</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {/* Guest & Booking Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Guest:</span>
                <span className="ml-2 font-medium">
                  {guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Room:</span>
                <span className="ml-2 font-medium">{room?.number} ({room?.type})</span>
              </div>
              <div>
                <span className="text-gray-600">Check-in:</span>
                <span className="ml-2">{new Date(reservation.checkIn).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Check-out:</span>
                <span className="ml-2">{new Date(reservation.checkOut).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Nights:</span>
                <span className="ml-2">
                  {Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Room Rate:</span>
                <span className="ml-2 font-medium">₹{reservation.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Settlement */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Payment Settlement</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Charges
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={additionalCharges}
                    onChange={(e) => setAdditionalCharges(parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Mini bar, laundry, etc.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Promotional discount</p>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Bill Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Room Charges:</span>
                  <span>₹{reservation.totalAmount.toFixed(2)}</span>
                </div>
                {additionalCharges > 0 && (
                  <div className="flex justify-between">
                    <span>Additional Charges:</span>
                    <span>₹{additionalCharges.toFixed(2)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-blue-200 pt-2">
                  <span>Subtotal:</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit Paid:</span>
                  <span>₹{reservation.depositPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-2 font-bold text-lg">
                  <span>Outstanding Balance:</span>
                  <span className={outstandingBalance >= 0 ? 'text-red-600' : 'text-green-600'}>
                    ₹{Math.abs(outstandingBalance).toFixed(2)}
                    {outstandingBalance < 0 && ' (Refund)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            {outstandingBalance > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <Banknote className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Cash</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Card</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'upi')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">UPI</span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Room Inspection */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Room Inspection</h3>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="clean"
                  checked={roomInspection === 'clean'}
                  onChange={(e) => setRoomInspection(e.target.value as 'clean')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <span className="font-medium">Clean</span>
                    <p className="text-xs text-gray-600">Ready for next guest</p>
                  </div>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="dirty"
                  checked={roomInspection === 'dirty'}
                  onChange={(e) => setRoomInspection(e.target.value as 'dirty')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <span className="font-medium">Dirty</span>
                    <p className="text-xs text-gray-600">Needs cleaning</p>
                  </div>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="maintenance"
                  checked={roomInspection === 'maintenance'}
                  onChange={(e) => setRoomInspection(e.target.value as 'maintenance')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <span className="font-medium">Maintenance</span>
                    <p className="text-xs text-gray-600">Needs repair</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Checkout Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Checkout Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any issues, feedback, or special notes..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {outstandingBalance > 0 ? (
              <span className="text-red-600 font-medium">
                Amount Due: ₹{outstandingBalance.toFixed(2)}
              </span>
            ) : outstandingBalance < 0 ? (
              <span className="text-green-600 font-medium">
                Refund Due: ₹{Math.abs(outstandingBalance).toFixed(2)}
              </span>
            ) : (
              <span className="text-green-600 font-medium">
                Fully Paid
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Receipt className="w-4 h-4" />
              <span>{isProcessing ? 'Processing...' : 'Complete Checkout'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;