import React from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  Building2, 
  UserCheck,
  Home as HouseIcon,
  BarChart3,
  Settings,
  Hotel
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'reservations', label: 'Reservations', icon: Calendar },
  { id: 'frontdesk', label: 'Front Desk', icon: UserCheck },
  { id: 'guests', label: 'Guests', icon: Users },
  { id: 'rooms', label: 'Rooms', icon: Building2 },
  { id: 'housekeeping', label: 'Housekeeping', icon: HouseIcon },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Hotel className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Atithi PMS</h1>
            <p className="text-sm text-gray-500">Property Management</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-sm font-medium text-blue-900">Atithi PMS v1.0</p>
          <p className="text-xs text-blue-600">Open Source Hotel Management</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;