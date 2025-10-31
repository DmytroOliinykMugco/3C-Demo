import { Link, useLocation } from 'react-router-dom';
import {
  User,
  Users,
  Shield,
  Info,
  CreditCard,
  Wallet,
  FileText,
  Flower,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      title: 'My Account',
      icon: User,
      items: [
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Family', path: '/family', icon: Users },
        { name: 'Security', path: '/security', icon: Shield },
        { name: 'Information and...', path: '/information', icon: Info },
      ]
    },
    {
      title: 'My Services',
      icon: CreditCard,
      items: [
        { name: 'Balance', path: '/balance', icon: CreditCard },
        { name: 'Wallet', path: '/wallet', icon: Wallet },
      ]
    },
    {
      title: 'My Services',
      icon: FileText,
      items: [
        { name: 'Cemetery', path: '/cemetery', icon: Flower },
        { name: 'Funeral', path: '/funeral', icon: FileText },
      ]
    },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">CUSTOMER</h1>
            <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">CARE CENTER</h2>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <div className="px-4 mb-2 flex items-center gap-2">
              <section.icon className="w-5 h-5" />
              <span className="font-semibold text-base">{section.title}</span>
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "block px-4 py-2 pl-11 text-base hover:bg-gray-50 transition-colors",
                    isActive(item.path) ? "bg-gray-100 font-medium" : "text-gray-700"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Links */}
      <div className="border-t border-gray-200 py-4">
        <a
          href="#"
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-gray-50 transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          <span className="text-base">Family website</span>
        </a>
        <button
          className="flex items-center gap-2 px-4 py-2 w-full text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => console.log('Sign out')}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-base">Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
