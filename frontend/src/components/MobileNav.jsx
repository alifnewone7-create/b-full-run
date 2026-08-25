import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChartLineUp, Trophy, User as UserIcon, ClockCounterClockwise, SignOut } from '@phosphor-icons/react';

const ITEMS = [
  [ChartLineUp, 'Chart', '/demo-trade'],
  [Trophy, 'Challenges', '/challenges'],
  [UserIcon, 'Profile', '/profile'],
  [ClockCounterClockwise, 'History', null],
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
    } else if (path) navigate(path);
  };

  return (
    <nav data-testid="mobile-bottom-nav"
         className="md:hidden shrink-0 flex items-stretch border-t border-white/[0.07] bg-[#040D09] pb-[env(safe-area-inset-bottom)]">
      {ITEMS.map(([Icon, label, path]) => {
        const on = path === pathname;
        return (
          <button key={label} onClick={() => go(path)} aria-label={label}
                  data-testid={`mobile-nav-${label.toLowerCase()}`}
                  className={`flex-1 py-2 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                    on ? 'text-[#14b877]' : 'text-white/40 active:text-white'}`}>
            <Icon size={20} weight={on ? 'fill' : 'duotone'} />
            <span className="text-[9px] font-semibold leading-none">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
