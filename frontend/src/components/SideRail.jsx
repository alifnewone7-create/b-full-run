import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChartLineUp, ChartPieSlice, Trophy, User as UserIcon, SignOut } from '@phosphor-icons/react';

const ITEMS = [
  [ChartLineUp, 'Terminal', '/demo-trade'],
  [ChartPieSlice, 'Portfolio', '/dashboard'],
  [Trophy, 'Challenges', '/challenges'],
  [UserIcon, 'Profile', '/profile'],
];

export const SideRail = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const logout = () => {
    localStorage.removeItem('bfg_token');
    localStorage.removeItem('bfg_user');
    navigate('/');
  };

  return (
    <aside data-testid="side-rail"
           className="hidden md:flex sticky top-0 h-screen w-[68px] shrink-0 flex-col items-center gap-1 border-r border-white/[0.07] bg-[#050f0a]/95 backdrop-blur-xl py-3">
      {ITEMS.map(([Icon, label, path]) => {
        const on = pathname === path;
        return (
          <button key={label} onClick={() => navigate(path)} title={label}
                  data-testid={`rail-${label.toLowerCase()}`}
                  className={`relative w-14 py-2 flex flex-col items-center gap-1 rounded-xl transition-colors ${
                    on ? 'text-[#14b877] bg-[#14b877]/10' : 'text-white/40 hover:text-white hover:bg-white/[0.05]'}`}>
            {on && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-[#14b877]" />}
            <Icon size={20} weight="duotone" />
            <span className="text-[9px] font-semibold whitespace-nowrap">{label}</span>
          </button>
        );
      })}
      <div className="flex-1" />
      <button onClick={logout} title="Logout" data-testid="rail-logout"
              className="w-14 py-2 flex flex-col items-center gap-1 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/[0.06] transition-colors">
        <SignOut size={20} weight="duotone" />
        <span className="text-[9px] font-semibold whitespace-nowrap">Logout</span>
      </button>
    </aside>
  );
};

export default SideRail;
