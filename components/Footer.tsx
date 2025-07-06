import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-navy-900 border-t border-gray-200 dark:border-navy-800">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
             <NavLink to="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
              I-CAN
            </NavLink>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Your integrated network for career and academic success.
            </p>
            <div className="flex space-x-6">
                {/* Social media icons can be added here */}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wider uppercase">Explore</h3>
                <ul className="mt-4 space-y-4">
                  <li><NavLink to="/jobs" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Job Portal</NavLink></li>
                  <li><NavLink to="/certifications" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Certifications</NavLink></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wider uppercase">Resources</h3>
                <ul className="mt-4 space-y-4">
                  <li><NavLink to="/career-guide" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Career Guide</NavLink></li>
                  <li><NavLink to="/forum" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Forum</NavLink></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><NavLink to="/newsletter" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Newsletter</NavLink></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-navy-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">&copy; {new Date().getFullYear()} I-CAN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
