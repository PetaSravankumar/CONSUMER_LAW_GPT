import { Menu, Scale } from 'lucide-react';
import ProfileMenu from './ProfileMenu';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar = ({ onLogout }: NavbarProps) => {
  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Menu className="h-6 w-6 text-gray-600" />
          <Scale className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800">Consumer Law GPT</h1>
        </div>
        <ProfileMenu onLogout={onLogout} />
      </div>
    </nav>
  );
};

export default Navbar;
