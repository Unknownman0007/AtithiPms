import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Settings, User, Building, CreditCard, Bell, Shield, Database, Download, Upload, Trash2, CheckCircle, XCircle, DollarSign } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { deleteAllData, rooms, guests, reservations } = useData();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'hotel', label: 'Hotel Settings', icon: Building },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data Management', icon: Database },
  ];

  const handleDeleteAllData = () => {
    const confirmMessage = "Are you sure you want to delete ALL data? This will:\n\n" +
      "• Delete all reservations\n" +
      "• Delete all guest profiles\n" +
      "• Reset rooms to default configuration\n" +
      "• Clear all booking history\n\n" +
      "This action CANNOT be undone!\n\n" +
      "Type 'DELETE ALL DATA' to confirm:";
    
    const userInput = prompt(confirmMessage);
    
    if (userInput === 'DELETE ALL DATA') {
      try {
        deleteAllData();
        alert('All data has been successfully deleted and reset to defaults.');
        // Optionally reload the page to ensure clean state
        window.location.reload();
      } catch (error) {
        alert('Error deleting data. Please try again.');
        console.error('Delete all data error:', error);
      }
    } else if (userInput !== null) {
      alert('Deletion cancelled. You must type exactly "DELETE ALL DATA" to confirm.');
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle dates, objects, and strings with commas
          if (value instanceof Date) {
            return `"${value.toISOString()}"`;
          } else if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          } else if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, filename, 'text/csv');
  };

  const exportToJSON = (data: any, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename, 'application/json');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportReservations = () => {
    if (reservations.length === 0) {
      alert('No reservations to export');
      return;
    }

    const exportData = reservations.map(reservation => {
      const guest = guests.find(g => g.id === reservation.guestId);
      const room = rooms.find(r => r.id === reservation.roomId);
      
      return {
        reservationId: reservation.id,
        guestName: guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest',
        guestEmail: guest?.email || '',
        guestPhone: guest?.phone || '',
        roomNumber: room?.number || '',
        roomType: room?.type || '',
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        status: reservation.status,
        rateType: reservation.rateType,
        totalAmount: reservation.totalAmount,
        depositPaid: reservation.depositPaid,
        isGroup: reservation.isGroup,
        groupName: reservation.groupName || '',
        notes: reservation.notes || '',
        createdAt: reservation.createdAt
      };
    });

    const timestamp = new Date().toISOString().split('T')[0];
    exportToCSV(exportData, `atithi-reservations-${timestamp}.csv`);
  };

  const handleExportGuests = () => {
    if (guests.length === 0) {
      alert('No guests to export');
      return;
    }

    const exportData = guests.map(guest => {
      const guestReservations = reservations.filter(r => r.guestId === guest.id);
      const totalBookings = guestReservations.length;
      const totalSpent = guestReservations.reduce((sum, r) => sum + r.totalAmount, 0);
      
      return {
        guestId: guest.id,
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        phone: guest.phone,
        address: guest.address,
        nationality: guest.nationality,
        preferences: guest.preferences || '',
        totalBookings,
        totalSpent,
        lastBooking: guestReservations.length > 0 
          ? Math.max(...guestReservations.map(r => new Date(r.createdAt).getTime()))
          : null
      };
    });

    const timestamp = new Date().toISOString().split('T')[0];
    exportToCSV(exportData, `atithi-guests-${timestamp}.csv`);
  };

  const handleExportFullDatabase = () => {
    const fullData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        systemVersion: '1.0',
        totalRooms: rooms.length,
        totalGuests: guests.length,
        totalReservations: reservations.length
      },
      rooms,
      guests,
      reservations
    };

    const timestamp = new Date().toISOString().split('T')[0];
    exportToJSON(fullData, `atithi-full-backup-${timestamp}.json`);
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
      
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{user?.name}</h4>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
          <div className="ml-auto">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Change Photo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={user?.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Eastern Time (EST)</option>
              <option>Central Time (CST)</option>
              <option>Mountain Time (MST)</option>
              <option>Pacific Time (PST)</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderHotelSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Hotel Settings</h3>
      
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Property Information</h4>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
            <input
              type="text"
              defaultValue="Atithi Grand Hotel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Hotel</option>
              <option>Motel</option>
              <option>Resort</option>
              <option>Hostel</option>
              <option>Bed & Breakfast</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              rows={3}
              defaultValue="123 Hotel Street, Tourism District, City, State 12345"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue="info@atithigrand.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <h4 className="text-md font-semibold text-gray-900 mb-4">Booking Settings</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Check-in Time</label>
            <input
              type="time"
              defaultValue="15:00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Check-out Time</label>
            <input
              type="time"
              defaultValue="11:00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>INR - Indian Rupee</option>
              <option>USD - US Dollar</option>
              <option>EUR - Euro</option>
              <option>GBP - British Pound</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
            <input
              type="number"
              step="0.01"
              defaultValue="10.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderDataManagement = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Download className="w-6 h-6 text-blue-600" />
            <h4 className="text-md font-semibold text-gray-900">Export Data</h4>
          </div>
          <p className="text-gray-600 mb-4">Download your hotel data as backup files</p>
          
          <div className="space-y-3">
            <button 
              onClick={handleExportReservations}
              className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <div className="font-medium">Export Reservations</div>
              <div className="text-sm text-gray-600">Download all reservation data (CSV) - {reservations.length} records</div>
            </button>
            <button 
              onClick={handleExportGuests}
              className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <div className="font-medium">Export Guests</div>
              <div className="text-sm text-gray-600">Download guest profiles (CSV) - {guests.length} records</div>
            </button>
            <button 
              onClick={handleExportFullDatabase}
              className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <div className="font-medium">Export Full Database</div>
              <div className="text-sm text-gray-600">Complete system backup (JSON)</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Upload className="w-6 h-6 text-green-600" />
            <h4 className="text-md font-semibold text-gray-900">Import Data</h4>
          </div>
          <p className="text-gray-600 mb-4">Upload data from external sources</p>
          
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Drag and drop files here or</p>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Browse Files
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Supported formats: CSV, Excel, JSON. Maximum file size: 10MB
            </p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
          <h4 className="text-md font-semibold text-red-900">Danger Zone</h4>
        </div>
        <p className="text-red-700 mb-4">
          Permanently delete all reservations, guests, and reset rooms to defaults. This action cannot be undone.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-red-600 font-medium">
            This will delete:
          </p>
          <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
            <li>All reservations and booking history</li>
            <li>All guest profiles and preferences</li>
            <li>Custom room configurations</li>
            <li>All stored data in browser</li>
          </ul>
        </div>
        <button 
          onClick={handleDeleteAllData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Delete All Data
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'hotel':
        return renderHotelSettings();
      case 'data':
        return renderDataManagement();
      case 'billing':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Billing & Payments</h3>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Payment Methods</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Credit Card Processing</p>
                      <p className="text-sm text-gray-600">Accept Visa, MasterCard, American Express</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">UPI Payments</p>
                      <p className="text-sm text-gray-600">Accept UPI payments from guests</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Cash Payments</p>
                      <p className="text-sm text-gray-600">Accept cash at front desk</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Tax Settings</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue="18.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Charge (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue="10.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className