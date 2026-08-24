import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  ChartLineUp, Trophy, User as UserIcon, Question, GearSix, SignOut, Download,
  CaretDown, ArrowLeft, Flask, Atom, Crown, SketchLogo,
} from '@phosphor-icons/react';
import BrandLogo from './BrandLogo';
import AccountSwitcher from './trade/AccountSwitcher';
import { API_BASE as API } from '../lib/apiBase';
import { useToast } from '../hooks/use-toast';

const SIDE_ITEMS = [
  [ChartLineUp, 'Trade', '/demo-trade'],
  [Trophy, 'Challenges', '/challenges'],
  [UserIcon, 'Profile', '/profile'],
  [Question, 'Help', null],
  [GearSix, 'Settings', null],
];

const BADGES = {
  demo: { label: 'DEMO', icon: Flask, ring: 'border-amber-400/25 hover:border-amber-400/50', text: 'text-amber-300/90' },
  basic: { label: 'BASIC', icon: Atom, ring: 'border-sky-400/25 hover:border-sky-400/50', text: 'text-sky-300/90' },
  standard: { label: 'STANDARD', icon: Crown, ring: 'border-violet-400/25 hover:border-violet-400/50', text: 'text-violet-300/90' },
  premium: { label: 'PREMIUM', icon: SketchLogo, ring: 'border-[#D4AF37]/30 hover:border-[#D4AF37]/60', text: 'text-[#F4D67A]/90' },
};

/** Terminal-style chrome (logo · title · balance · left rail) for inner pages. */
export const TerminalShell = ({ title, icon: TitleIcon = Trophy, children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [accountKey, setAccountKey] = useState('demo');
  const [accountsOpen, setAccountsOpen] = useState(false);

  const loadAccount = () => {
    const authH = { headers: { Authorization: `Bearer ${localStorage.getItem('bfg_token')}` } };
    axios.get(`${API}/api/auth/me`, authH).then(({ data }) => {
      setUser(data);
      setAccountKey(data.active_account || 'demo');
    }).catch(() => {});
    axios.get(`${API}/api/wallet`, authH).then(({ data }) => {
      setBalance(data.balance);
      if (data.type) setAccountKey(data.type);
    }).catch(() => {});
  };
  useEffect(loadAccount, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = () => {
    localStorage.removeItem('bfg_token');
    localStorage.removeItem('bfg_user');
    navigate('/');
  };

  const badge = BADGES[accountKey] || BADGES.demo;
  const initial = (user?.nickname || user?.full_name || user?.email || 'B')[0]?.toUpperCase() || 'B';

  return (
    <div className="h-[100dvh] flex flex-col text-white bg-[#040D09] overflow-hidden" data-testid="terminal-shell">
      {/* Header — same structure as the trade terminal */}
      <header className="shrink-0 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 h-[52px] border-b border-white/[0.05] md:border-white/[0.07] bg-transparent md:bg-[#050f0a]/95 md:backdrop-blur-xl">
        <Link to="/" className="hidden md:flex shrink-0 items-center gap-2" data-testid="shell-logo-link">
          <BrandLogo className="h-7 w-auto object-contain" />
        </Link>

        {/* Mobile — back to terminal */}
        <button onClick={() => navigate('/demo-trade')} data-testid="shell-back-btn"
                className="md:hidden shrink-0 flex items-center gap-2 rounded-xl border border-white/[0.09] bg-gradient-to-b from-white/[0.05] to-transparent px-2.5 py-1.5 active:bg-white/[0.06] transition-colors">
          <ArrowLeft size={15} weight="bold" />
          <span className="text-[13px] font-bold whitespace-nowrap">{title}</span>
        </button>

        <div className="hidden md:block h-6 w-px bg-white/[0.08] shrink-0" />

        {/* Page name — sits exactly where the market tabs are on the trade page */}
        <div className="hidden md:flex flex-1 items-center gap-1.5 min-w-0 py-1">
          <div data-testid="shell-title"
               className="shrink-0 flex items-center gap-2 rounded-xl border border-[#14b877]/40 bg-gradient-to-b from-[#14b877]/[0.14] to-[#14b877]/[0.03] pl-2.5 pr-3 py-1.5 shadow-[0_0_18px_rgba(20,184,119,0.1)]">
            <TitleIcon size={18} weight="duotone" className="text-[#14b877]" />
            <span className="text-[13px] font-bold whitespace-nowrap">{title}</span>
          </div>
        </div>
        <div className="flex-1 md:hidden" />

        {/* Right cluster — balance · deposit · avatar (identical to trade page) */}
        <div className="shrink-0 flex items-center gap-2 sm:gap-2.5">
          <button onClick={() => setAccountsOpen(true)} data-testid="shell-balance"
                  className={`group rounded-xl border ${badge.ring} bg-gradient-to-b from-white/[0.06] to-white/[0.015] pl-1 pr-1.5 sm:pl-1.5 sm:pr-2 py-[3px] sm:py-1 flex items-center gap-1.5 sm:gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] active:scale-[0.97] transition-[transform,border-color] duration-150`}>
            <span className={`grid place-items-center ${badge.text}`}>
              <badge.icon className="h-[16px] w-[16px] sm:h-5 sm:w-5" weight="fill" />
            </span>
            <span className="flex flex-col items-start leading-none gap-[2px] sm:gap-[3px]">
              <span className={`text-[7px] sm:text-[8px] font-extrabold tracking-[0.16em] ${badge.text}`} data-testid="shell-account-badge">{badge.label}</span>
              <span className="text-[12px] sm:text-[14px] font-extrabold tabular-nums" data-testid="shell-balance-value">
                ${balance !== null ? balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '—'}
              </span>
            </span>
            <CaretDown size={10} weight="bold" className="text-white/35 group-hover:text-white/70 transition-colors" />
          </button>
          <button onClick={() => toast({ title: 'Deposit coming soon' })} data-testid="shell-deposit-btn"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-[#1ad48b] to-[#0fa066] text-[#03150d] font-bold text-[13px] px-4 py-2 shadow-[0_4px_18px_rgba(20,184,119,0.25)] hover:brightness-110 active:scale-[0.97] transition-[transform,box-shadow,filter] duration-150">
            <Download size={15} weight="bold" /> Deposit
          </button>
          {user?.picture
            ? <img src={user.picture} alt={user.name} referrerPolicy="no-referrer" onClick={() => navigate('/profile')} data-testid="shell-avatar"
                   className="hidden md:block h-8 w-8 rounded-full object-cover ring-1 ring-white/15 hover:ring-[#14b877]/60 transition-shadow cursor-pointer" />
            : <div onClick={() => navigate('/profile')} data-testid="shell-avatar"
                   className="hidden md:flex h-8 w-8 rounded-full items-center justify-center font-bold text-[13px] bg-gradient-to-br from-[#1ad48b] to-[#0c8a56] text-[#03150d] ring-1 ring-white/10 hover:ring-[#14b877]/60 transition-shadow cursor-pointer">{initial}</div>}
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex min-h-0">
        <aside data-testid="shell-side-rail"
               className="hidden md:flex w-[64px] shrink-0 flex-col items-center gap-1 border-r border-white/[0.07] bg-[#050f0a]/95 backdrop-blur-xl py-3">
          {SIDE_ITEMS.map(([Icon, label, path]) => {
            const on = path === pathname;
            return (
              <button key={label} onClick={() => path && navigate(path)} title={label}
                      data-testid={`side-${label.toLowerCase()}`}
                      className={`relative w-14 py-2 flex flex-col items-center gap-1 rounded-xl transition-colors ${
                        on ? 'text-[#14b877] bg-[#14b877]/10' : 'text-white/40 hover:text-white hover:bg-white/[0.05]'}`}>
                {on && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-[#14b877]" />}
                <Icon size={20} weight="duotone" />
                <span className="text-[9px] font-semibold whitespace-nowrap">{label}</span>
              </button>
            );
          })}
          <div className="flex-1" />
          <button onClick={logout} data-testid="shell-logout-btn"
                  className="w-14 py-2 flex flex-col items-center gap-1 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/[0.06] transition-colors">
            <SignOut size={20} weight="duotone" />
            <span className="text-[9px] font-semibold whitespace-nowrap">Logout</span>
          </button>
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto" data-testid="shell-main">
          {children}
        </main>
      </div>

      <AccountSwitcher open={accountsOpen} onClose={() => setAccountsOpen(false)} onSwitched={loadAccount} />
    </div>
  );
};

export default TerminalShell;
