import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ThemeToggle from './ThemeToggle';
import { UserRole } from '../types';

const NavLinks = [
  { name: 'Home', path: '/' },
  { name: 'Newsletter', path: '/newsletter' },
  { name: 'Job Portal', path: '/jobs' },
  { name: 'Certification', path: '/certifications' },
  { name: 'Career Guide', path: '/career-guide' },
  { name: 'Forum', path: '/forum' },
];

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeLinkStyle = {
    background: 'linear-gradient(to right, #577cff, #3b5ef9)',
    color: 'white',
  };
  
  const activeMatchmakingStyle = {
    color: '#ef4444', // red-500
  };

  return (
    <nav className="bg-white/80 dark:bg-navy-950/80 backdrop-blur-sm sticky top-0 z-50 shadow-md dark:shadow-navy-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
              I-CAN
            </NavLink>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {NavLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  style={({ isActive }) => isActive ? activeLinkStyle : {}}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
             {user?.role === UserRole.CLIENT && (
              <NavLink 
                to="/matchmaking" 
                title="Matchmaking" 
                className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                style={({ isActive }) => isActive ? activeMatchmakingStyle : {}}
               >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </NavLink>
            )}
            <div className="relative cursor-pointer" onClick={() => navigate('/checkout')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
                )}
            </div>
            {user ? (
              <div className="relative group">
                <button onClick={() => navigate('/profile')} className="flex items-center space-x-2">
                    <img className="h-10 w-10 rounded-full object-cover" src={user.profilePicture} alt="User" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-navy-800 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <a onClick={() => navigate('/profile')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700 cursor-pointer">Profile</a>
                  <a onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700 cursor-pointer">Sign out</a>
                </div>
              </div>
            ) : (
              <NavLink to="/login" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105">
                Login / Sign Up
              </NavLink>
            )}
          </div>

          <div className="md:hidden flex items-center">
             <ThemeToggle />
             {user?.role === UserRole.CLIENT && (
              <NavLink 
                to="/matchmaking" 
                title="Matchmaking" 
                className="ml-4 text-gray-500 dark:text-gray-400"
                style={({ isActive }) => isActive ? activeMatchmakingStyle : {}}
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </NavLink>
            )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-800 focus:outline-none">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NavLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-800 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                style={({ isActive }) => isActive ? activeLinkStyle : {}}
              >
                {link.name}
              </NavLink>
            ))}
             <div className="border-t border-gray-200 dark:border-navy-700 my-2"></div>
             {user ? (
                 <>
                    <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-800 block px-3 py-2 rounded-md text-base font-medium">Profile</NavLink>
                    <a onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-800 block px-3 py-2 rounded-md text-base font-medium cursor-pointer">Sign out</a>
                 </>
             ) : (
                <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-800 block px-3 py-2 rounded-md text-base font-medium">Login</NavLink>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;