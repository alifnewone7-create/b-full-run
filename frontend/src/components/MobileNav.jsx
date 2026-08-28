import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChartLineUp, Trophy, Medal, User as UserIcon, SignOut } from '@phosphor-icons/react';
import { activeTradePath, ROUTE_ACCOUNT } from '../lib/accountRoutes';

const ITEMS = [
  [ChartLineUp, 'Chart', '__trade'],
  [Medal, 'My Chal', '/my-challenges'],
  [UserIcon, 'Profile', '/profile'],
  [Trophy, 'Challenges', '/challenges'],
  [SignOut, 'Logout', 'logout'],
];

/** Bottom tab bar shown on phones across the terminal, challenges and profile pages. */
export const MobileNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const go = (path) => {
    if (path === 'logout') {
      localStorage.removeItem('bfg_token');
      localStorage.removeItem('bfg_user');
      navigate('/');
    } else if (path === '__trade') {
      navigate(activeTradePath());
    } else if (path) navigate(path);
  };

  return (
    <nav data-testid="mobile-bottom-nav"
         className="md:hidden shrink-0 flex items-stretch border-t border-white/[0.07] bg-[#040D09] pb-[env(safe-area-inset-bottom)]">
      {ITEMS.map(([Icon, label, path]) => {
        const on = path === '__trade' ? ROUTE_ACCOUNT[pathname] !== undefined : path === pathname;
        return (
          <button key={label} onClick={() => go(path)} aria-label={label}
                  data-testid={`mobile-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`flex-1 py-3 flex items-center justify-center transition-colors ${
                    on ? 'text-[#14b877]' : 'text-white/40 active:text-white'}`}>
            <Icon size={24} weight="fill" />
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
