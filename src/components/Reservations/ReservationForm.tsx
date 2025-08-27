import React, { useState, useEffect } from 'react';
import { useData, Reservation, Guest, Room } from '../../contexts/DataContext';
import { X, Calendar, User, Building2, DollarSign, Users, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ReservationFormProps {
  reservation?: Reservation | null;
  onClose: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ reservation, onClose }) => {
  const { rooms, guests, addReservation, updateReservation, getAvailableRooms, addGuest, rateTypes } = useData();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isNewGuest, setIsNewGuest] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomType, setRoomType] = useState('');
  const [rateType, setRateType] = useState('rack');
  const [customRate, setCustomRate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [depositPaid, setDepositPaid] = useState(0);
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'confirmed' | 'tentative'>('confirmed');
  
  // New guest form
  const [newGuest, setNewGuest] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    nationality: '',
    preferences: '',
  });

  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with existing reservation data
  useEffect(() => {
    if (reservation) {
      const guest = guests.find(g => g.id === reservation.guestId);
      const room = rooms.find(r => r.id === reservation.roomId);
      
      setSelectedGuest(guest || null);
      setCheckIn(reservation.checkIn.toISOString().split('T')[0]);
      setCheckOut(reservation.checkOut.toISOString().split('T')[0]);
      setSelectedRoom(room || null);
      setRoomType(room?.type || '');
      setRateType(reservation.rateType);
      setTotalAmount(reservation.totalAmount);
      setDepositPaid(reservation.depositPaid);
      setIsGroup(reservation.isGroup);
      setGroupName(reservation.groupName || '');
      setNotes(reservation.notes || '');
      setStatus(reservation.status as 'confirmed' | 'tentative');
    }
  }, [reservation, guests, rooms]);

  // Update available rooms when dates or room type change
  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const available = getAvailableRooms(checkInDate, checkOutDate, roomType || undefined);
      setAvailableRooms(available);
    }
  }, [checkIn, checkOut, roomType, getAvailableRooms]);

  // Calculate total amount
  useEffect(() => {
    if (checkIn && checkOut && selectedRoom) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let rate = selectedRoom.rate;
      if (customRate) {
        rate = parseFloat(customRate);
      }
      
      setTotalAmount(nights * rate);
    }
  }, [checkIn, checkOut, selectedRoom, customRate]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!selectedGuest && !isNewGuest) {
        newErrors.guest = 'Please select a guest or create a new one';
      }
      if (isNewGuest) {
        if (!newGuest.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!newGuest.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!newGuest.email.trim()) newErrors.email = 'Email is required';
        if (!newGuest.phone.trim()) newErrors.phone = 'Phone is required';
      }
    }

    if (step === 2) {
      if (!checkIn) newErrors.checkIn = 'Check-in date is required';
      if (!checkOut) newErrors.checkOut = 'Check-out date is required';
      if (checkIn && checkOut && new Date(checkIn) >= new Date(checkOut)) {
        newErrors.checkOut = 'Check-out must be after check-in date';
      }
      if (!roomType) newErrors.roomType = 'Room type is required';
    }

    if (step === 3) {
      if (!selectedRoom && availableRooms.length > 0) {
        newErrors.room = 'Please select a room';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      let guestId = selectedGuest?.id;

      // Create new guest if needed
      if (isNewGuest) {
        addGuest(newGuest);
        // Get the newly created guest (this is a simplified approach)
        guestId = Date.now().toString();
      }

      if (!guestId || !selectedRoom) return;

      const reservationData = {
        guestId,
        roomId: selectedRoom.id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        status,
        rateType: rateType as any,
        totalAmount,
        depositPaid,
        notes,
        isGroup,
        groupName: isGroup ? groupName : undefined,
      };

      if (reservation) {
        updateReservation(reservation.id, reservationData);
      } else {
        addReservation(reservationData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving reservation:', error);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`w-12 h-0.5 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Guest Information</h3>
        <p className="text-gray-600">Select existing guest or create new profile</p>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={() => {
            setIsNewGuest(false);
            setNewGuest({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              address: '',
              nationality: '',
              preferences: '',
            });
          }}
          className={`px-4 py-2 rounded-lg font-medium ${
            !isNewGuest 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Existing Guest
        </button>
        <button
          onClick={() => {
            setIsNewGuest(true);
            setSelectedGuest(null);
          }}
          className={`px-4 py-2 rounded-lg font-medium ${
            isNewGuest 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          New Guest
        </button>
      </div>

      {!isNewGuest ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Guest
          </label>
          {guests.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <p className="text-sm text-yellow-800">
                No guests found in the system. Please create a new guest profile.
              </p>
              <button
                type="button"
                onClick={() => setIsNewGuest(true)}
                className="mt-2 text-sm text-yellow-700 hover:text-yellow-900 font-medium underline"
              >
                Create New Guest
              </button>
            </div>
          ) : (
          <select
            value={selectedGuest?.id || ''}
            onChange={(e) => {
              const guest = guests.find(g => g.id === e.target.value);
              setSelectedGuest(guest || null);
            }}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.guest ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Choose existing guest...</option>
            {guests.map((guest) => (
              <option key={guest.id} value={guest.id}>
                {guest.firstName} {guest.lastName} - {guest.email}
              </option>
            ))}
          </select>
          )}
          {errors.guest && <p className="text-red-600 text-sm mt-1">{errors.guest}</p>}

          {selectedGuest && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Guest Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{selectedGuest.firstName} {selectedGuest.lastName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2">{selectedGuest.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2">{selectedGuest.phone}</span>
                </div>
                <div>
                  <span className="text-gray-600">Nationality:</span>
                  <span className="ml-2">{selectedGuest.nationality}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={newGuest.firstName}
                  onChange={(e) => setNewGuest({...newGuest, firstName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter first name"
                />
              </div>
              {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={newGuest.lastName}
                onChange={(e) => setNewGuest({...newGuest, lastName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter last name"
              />
              {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                value={newGuest.address}
                onChange={(e) => setNewGuest({...newGuest, address: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full address"
                rows={2}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={newGuest.nationality}
                  onChange={(e) => setNewGuest({...newGuest, nationality: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter nationality"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferences
              </label>
              <input
                type="text"
                value={newGuest.preferences}
                onChange={(e) => setNewGuest({...newGuest, preferences: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Special requests or preferences"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Details</h3>
        <p className="text-gray-600">Select dates and room type</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {errors.checkIn && <p className="text-red-600 text-sm mt-1">{errors.checkIn}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {errors.checkOut && <p className="text-red-600 text-sm mt-1">{errors.checkOut}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Room Type *
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select room type...</option>
            <option value="single">Single Room</option>
            <option value="double">Double Room</option>
            <option value="suite">Suite</option>
            <option value="dormitory">Dormitory</option>
          </select>
        </div>
        {errors.roomType && <p className="text-red-600 text-sm mt-1">{errors.roomType}</p>}
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="isGroup"
          checked={isGroup}
          onChange={(e) => setIsGroup(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isGroup" className="text-sm font-medium text-gray-700">
          This is a group reservation
        </label>
      </div>

      {isGroup && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Name
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter group name"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Room Selection</h3>
        <p className="text-gray-600">Choose from available rooms</p>
      </div>

      {availableRooms.length === 0 ? (
        <div className="text-center py-8">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Rooms Available</h4>
          <p className="text-gray-600 mb-4">
            No {roomType} rooms are available for the selected dates.
          </p>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              Would you like to add this guest to the waitlist or try different dates?
            </p>
            <button className="mt-2 text-sm text-yellow-700 hover:text-yellow-900 font-medium">
              Add to Waitlist
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            {availableRooms.length} room(s) available for {roomType} rooms
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {availableRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedRoom?.id === room.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Room {room.number}</h4>
                  <span className="text-lg font-bold text-gray-900">₹{room.rate}/night</span>
                </div>
                <p className="text-sm text-gray-600 mb-2 capitalize">{room.type} Room</p>
                <div className="flex flex-wrap gap-1">
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {errors.room && <p className="text-red-600 text-sm mt-2">{errors.room}</p>}
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Rates & Confirmation</h3>
        <p className="text-gray-600">Review booking details and set payment</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Booking Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Guest:</span>
            <span className="font-medium">
              {selectedGuest ? `${selectedGuest.firstName} ${selectedGuest.lastName}` : 
               `${newGuest.firstName} ${newGuest.lastName}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Room:</span>
            <span className="font-medium">{selectedRoom?.number} ({selectedRoom?.type})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Check-in:</span>
            <span className="font-medium">{new Date(checkIn).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Check-out:</span>
            <span className="font-medium">{new Date(checkOut).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nights:</span>
            <span className="font-medium">
              {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}
            </span>
          </div>
          {isGroup && (
            <div className="flex justify-between">
              <span className="text-gray-600">Group:</span>
              <span className="font-medium">{groupName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rate Type
          </label>
          <select
            value={rateType}
            onChange={(e) => setRateType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {rateTypes.map((rate) => (
              <option key={rate.id} value={rate.id}>
                {rate.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Rate (Optional)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Override rate"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Amount
          </label>
          <div className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deposit Paid
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={depositPaid}
              onChange={(e) => setDepositPaid(parseFloat(e.target.value) || 0)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Booking Status
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="confirmed"
              checked={status === 'confirmed'}
              onChange={(e) => setStatus(e.target.value as 'confirmed')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Confirmed</span>
              <p className="text-sm text-gray-600">Booking is guaranteed</p>
            </div>
          </label>
          <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="tentative"
              checked={status === 'tentative'}
              onChange={(e) => setStatus(e.target.value as 'tentative')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Tentative</span>
              <p className="text-sm text-gray-600">Awaiting confirmation</p>
            </div>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Additional notes or special requests..."
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {reservation ? 'Edit Reservation' : 'New Reservation'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {renderStepIndicator()}
          
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Step {currentStep} of 4
          </div>
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={availableRooms.length === 0 && currentStep === 3}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {reservation ? 'Update Reservation' : 'Create Reservation'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;