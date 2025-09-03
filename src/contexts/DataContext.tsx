import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'suite' | 'dormitory';
  status: 'available' | 'occupied' | 'maintenance' | 'dirty';
  rate: number;
  features: string[];
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  preferences?: string;
  bookingHistory: string[];
}

export interface Reservation {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  status: 'confirmed' | 'tentative' | 'cancelled' | 'checkedIn' | 'checkedOut';
  rateType: 'rack' | 'corporate' | 'student' | 'seasonal';
  totalAmount: number;
  depositPaid: number;
  notes?: string;
  isGroup: boolean;
  groupName?: string;
  createdAt: Date;
}

export interface RateType {
  id: string;
  name: string;
  roomType: 'single' | 'double' | 'suite' | 'dormitory';
  rate: number;
  description?: string;
}

interface DataContextType {
  rooms: Room[];
  guests: Guest[];
  reservations: Reservation[];
  rateTypes: RateType[];
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  addGuest: (guest: Omit<Guest, 'id' | 'bookingHistory'>) => void;
  updateGuest: (id: string, guest: Partial<Guest>) => void;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  cancelReservation: (id: string) => void;
  deleteGuest: (id: string) => void;
  getAvailableRooms: (checkIn: Date, checkOut: Date, roomType?: string) => Room[];
  getRoomOccupancy: (date: Date) => { occupied: number; total: number };
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const defaultRooms: Room[] = [
  { id: '101', number: '101', type: 'single', status: 'available', rate: 80, features: ['Wi-Fi', 'AC', 'TV'] },
  { id: '102', number: '102', type: 'single', status: 'available', rate: 80, features: ['Wi-Fi', 'AC', 'TV'] },
  { id: '201', number: '201', type: 'double', status: 'available', rate: 120, features: ['Wi-Fi', 'AC', 'TV', 'Mini Bar'] },
  { id: '202', number: '202', type: 'double', status: 'available', rate: 120, features: ['Wi-Fi', 'AC', 'TV', 'Mini Bar'] },
  { id: '301', number: '301', type: 'suite', status: 'available', rate: 200, features: ['Wi-Fi', 'AC', 'TV', 'Mini Bar', 'Balcony'] },
  { id: '401', number: '401', type: 'dormitory', status: 'available', rate: 40, features: ['Wi-Fi', 'AC', 'Shared Bath'] },
];

const defaultRateTypes: RateType[] = [
  { id: 'rack', name: 'Rack Rate', roomType: 'single', rate: 80 },
  { id: 'corporate', name: 'Corporate Rate', roomType: 'single', rate: 70 },
  { id: 'student', name: 'Student Package', roomType: 'single', rate: 60 },
  { id: 'seasonal', name: 'Seasonal Rate', roomType: 'single', rate: 90 },
];

const defaultGuests: Guest[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    address: '123 Main Street, New York, NY 10001',
    nationality: 'American',
    preferences: 'Non-smoking room, late check-out',
    bookingHistory: []
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0456',
    address: '456 Oak Avenue, Los Angeles, CA 90210',
    nationality: 'American',
    preferences: 'Ground floor room preferred',
    bookingHistory: []
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    phone: '+1-555-0789',
    address: '789 Pine Street, Chicago, IL 60601',
    nationality: 'Canadian',
    preferences: 'Vegetarian meals, quiet room',
    bookingHistory: []
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(defaultRooms);
  const [guests, setGuests] = useState<Guest[]>(defaultGuests);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rateTypes] = useState<RateType[]>(defaultRateTypes);

  useEffect(() => {
    const savedRooms = localStorage.getItem('atithi_rooms');
    const savedGuests = localStorage.getItem('atithi_guests');
    const savedReservations = localStorage.getItem('atithi_reservations');

    if (savedRooms) setRooms(JSON.parse(savedRooms));
    if (savedGuests) setGuests(JSON.parse(savedGuests));
    if (savedReservations) {
      const parsed = JSON.parse(savedReservations);
      setReservations(parsed.map((r: any) => ({
        ...r,
        checkIn: new Date(r.checkIn),
        checkOut: new Date(r.checkOut),
        createdAt: new Date(r.createdAt),
      })));
    }
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom = { ...room, id: Date.now().toString() };
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    saveToStorage('atithi_rooms', updatedRooms);
  };

  const updateRoom = (id: string, roomUpdate: Partial<Room>) => {
    return new Promise<void>((resolve) => {
      const updatedRooms = rooms.map(room => 
        room.id === id ? { ...room, ...roomUpdate } : room
      );
      setRooms(updatedRooms);
      saveToStorage('atithi_rooms', updatedRooms);
      resolve();
    });
  };

  const addGuest = (guest: Omit<Guest, 'id' | 'bookingHistory'>) => {
    const newGuestId = Date.now().toString();
    const newGuest = { ...guest, id: newGuestId, bookingHistory: [] };
    const updatedGuests = [...guests, newGuest];
    setGuests(updatedGuests);
    saveToStorage('atithi_guests', updatedGuests);
    return newGuestId;
  };

  const updateGuest = (id: string, guestUpdate: Partial<Guest>) => {
    const updatedGuests = guests.map(guest => 
      guest.id === id ? { ...guest, ...guestUpdate } : guest
    );
    setGuests(updatedGuests);
    saveToStorage('atithi_guests', updatedGuests);
  };

  const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newReservation = { 
      ...reservation, 
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const updatedReservations = [...reservations, newReservation];
    setReservations(updatedReservations);
    saveToStorage('atithi_reservations', updatedReservations);

    // Update guest booking history
    const updatedGuests = guests.map(guest =>
      guest.id === reservation.guestId
        ? { ...guest, bookingHistory: [...guest.bookingHistory, newReservation.id] }
        : guest
    );
    setGuests(updatedGuests);
    saveToStorage('atithi_guests', updatedGuests);
  };

  const updateReservation = (id: string, reservationUpdate: Partial<Reservation>) => {
    return new Promise<void>((resolve) => {
      const updatedReservations = reservations.map(reservation => 
        reservation.id === id ? { ...reservation, ...reservationUpdate } : reservation
      );
      setReservations(updatedReservations);
      saveToStorage('atithi_reservations', updatedReservations);
      resolve();
    });
  };

  const cancelReservation = (id: string) => {
    updateReservation(id, { status: 'cancelled' });
  };

  const deleteGuest = (id: string) => {
    // Check if guest has any active reservations
    const guestReservations = reservations.filter(r => r.guestId === id && r.status !== 'cancelled');
    if (guestReservations.length > 0) {
      throw new Error('Cannot delete guest with active reservations');
    }
    
    const updatedGuests = guests.filter(guest => guest.id !== id);
    setGuests(updatedGuests);
    saveToStorage('atithi_guests', updatedGuests);
  };

  const getAvailableRooms = (checkIn: Date, checkOut: Date, roomType?: string): Room[] => {
    return rooms.filter(room => {
      if (roomType && room.type !== roomType) return false;
      if (room.status !== 'available') return false;

      const conflictingReservation = reservations.find(reservation => {
        if (reservation.roomId !== room.id) return false;
        if (reservation.status === 'cancelled') return false;
        
        return (
          (checkIn >= reservation.checkIn && checkIn < reservation.checkOut) ||
          (checkOut > reservation.checkIn && checkOut <= reservation.checkOut) ||
          (checkIn <= reservation.checkIn && checkOut >= reservation.checkOut)
        );
      });

      return !conflictingReservation;
    });
  };

  const getRoomOccupancy = (date: Date) => {
    const occupiedRooms = reservations.filter(reservation => {
      if (reservation.status === 'cancelled') return false;
      return date >= reservation.checkIn && date < reservation.checkOut;
    }).length;

    return { occupied: occupiedRooms, total: rooms.length };
  };

  return (
    <DataContext.Provider value={{
      rooms,
      guests,
      reservations,
      rateTypes,
      addRoom,
      updateRoom,
      addGuest,
      updateGuest,
      addReservation,
      updateReservation,
      cancelReservation,
      deleteGuest,
      getAvailableRooms,
      getRoomOccupancy,
    }}>
      {children}
    </DataContext.Provider>
  );
};