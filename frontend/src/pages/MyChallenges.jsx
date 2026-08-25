import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Medal, CircleNotch, TrendUp, TrendDown, CalendarBlank, Trophy, ArrowRight,
} from '@phosphor-icons/react';
import { API_BASE as API } from '../lib/apiBase';
import { isLoggedIn } from '../lib/auth';
import TerminalShell from '../components/TerminalShell';

const TABS = [
  ['running', 'Running'],
  ['complete', 'Complete'],
  ['failed', 'Failed'],
];

const money = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Meter = ({ label, value, limit, amount, tone, testid }) => {
  const pct = limit ? Math.min(100, Math.max(0, (value / limit) * 100)) : 0;
  const green = tone === 'profit';
  return (
    <div data-testid={testid}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[12px] text-white/50">
          {green ? <TrendUp size={14} weight="bold" className="text-[#14B877]" />
                 : <TrendDown size={14} weight="bold" className="text-[#FF5C5C]" />}
          {label}
        </span>
        <span className="text-[12.5px] font-bold tabular-nums">
          <span className={green ? 'text-[#14B877]' : 'text-[#FF5C5C]'}>{value.toFixed(2)}%</span>
          {limit ? <span className="text-white/35"> / {limit}%</span> : <span className="text-white/35"> / no limit</span>}
        </span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-white/[0.07] overflow-hidden">
        <div className="h-full rounded-full transition-[width] duration-500"
             style={{
               width: `${pct}%`,
               background: green
                 ? 'linear-gradient(90deg, #0f9a63, #1ad48b)'
                 : 'linear-gradient(90deg, #b23b3b, #ff6b6b)',
             }} />
      </div>
      <div className="mt-1 text-[11px] text-white/35 tabular-nums">{money(amount)}</div>
    </div>
  );
};

const ChallengeCard = ({ c }) => (
  <div data-testid={`my-challenge-${c.plan}`} className="lux-card p-5 sm:p-6 flex flex-col">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="lux-icon-orb h-9 w-9 rounded-xl"><Medal size={18} weight="duotone" color="#14B877" /></span>
          <div>
            <div className="text-[16px] font-bold leading-tight">{c.label} Challenge</div>
            <div className="text-[11.5px] lux-muted">{money(c.account_size)} funded account</div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[10px] uppercase tracking-[0.14em] lux-muted font-bold">Live balance</div>
        <div className="text-[19px] font-extrabold tabular-nums" data-testid={`balance-${c.plan}`}>{money(c.balance)}</div>
        <div className={`text-[11.5px] font-bold tabular-nums ${c.pnl >= 0 ? 'text-[#14B877]' : 'text-[#FF5C5C]'}`}>
          {c.pnl >= 0 ? '+' : '−'}{money(Math.abs(c.pnl))}
        </div>
      </div>
    </div>

    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Meter testid={`profit-target-${c.plan}`} label="Profit Target" tone="profit"
             value={c.profit.pct} limit={c.profit.target_pct} amount={c.profit.amount} />
      <Meter testid={`max-loss-${c.plan}`} label="Maximum Loss" tone="loss"
             value={c.loss.pct} limit={c.loss.limit_pct} amount={c.loss.amount} />
      <Meter testid={`today-profit-${c.plan}`} label="Today Profit" tone="profit"
             value={c.today_profit.pct} limit={c.today_profit.target_pct} amount={c.today_profit.amount} />
      <Meter testid={`today-loss-${c.plan}`} label="Today Loss" tone="loss"
             value={c.today_loss.pct} limit={c.today_loss.limit_pct} amount={c.today_loss.amount} />
    </div>

    <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5">
      <span className="flex items-center gap-2 text-[12px] lux-muted">
        <CalendarBlank size={15} weight="duotone" /> Challenge duration
      </span>
      <span className="text-[13px] font-bold" data-testid={`days-left-${c.plan}`}>
        {c.days_left} <span className="lux-muted font-semibold">of {c.duration_days} days left</span>
      </span>
    </div>
  </div>
);

export default function MyChallenges() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('running');
  const [busy, setBusy] = useState(true);
  const [items, setItems] = useState([]);

  const load = useCallback(() => {
    axios.get(`${API}/api/challenges/mine`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('bfg_token')}` },
    }).then(({ data }) => setItems(data.challenges || []))
      .catch(() => setItems([]))
      .finally(() => setBusy(false));
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login', { replace: true }); return; }
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load, navigate]);

  const counts = TABS.reduce((a, [k]) => ({ ...a, [k]: items.filter((c) => c.state === k).length }), {});
  const shown = items.filter((c) => c.state === tab);

  return (
    <TerminalShell title="My Challenges" icon={Medal}>
      <div className="min-h-full"
           style={{ backgroundImage: 'radial-gradient(900px 480px at 12% -10%, rgba(20,184,119,0.14), transparent 60%)' }}
           data-testid="my-challenges-page">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-7 sm:py-10">
          <h1 className="text-[24px] sm:text-[32px] font-extrabold leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
            My <span className="text-[#14B877]">challenges</span>
          </h1>

          <div className="mt-5 flex items-center gap-1.5 p-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] w-full sm:w-auto sm:inline-flex">
            {TABS.map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} data-testid={`tab-${key}`}
                      className={`flex-1 sm:flex-none px-3.5 sm:px-5 py-2 rounded-xl text-[13px] font-bold transition-colors ${
                        tab === key ? 'bg-[#14B877] text-[#03150d]' : 'text-white/55 hover:text-white hover:bg-white/[0.05]'}`}>
                {label}
                <span className={`ml-1.5 text-[11px] ${tab === key ? 'text-[#03150d]/70' : 'text-white/35'}`}>{counts[key] || 0}</span>
              </button>
            ))}
          </div>

          {busy && (
            <div className="mt-16 flex justify-center text-white/45" data-testid="my-challenges-loading">
              <CircleNotch size={28} className="animate-spin" />
            </div>
          )}

          {!busy && shown.length === 0 && (
            <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center" data-testid="my-challenges-empty">
              <Trophy size={34} weight="duotone" className="mx-auto text-white/30" />
              <div className="mt-3 text-[15px] font-bold">No {tab} challenges</div>
              <p className="mt-1.5 text-[13px] text-white/45">Buy a funded challenge and track your progress here.</p>
              <button onClick={() => navigate('/challenges')} data-testid="browse-challenges-btn"
                      className="mt-5 lux-btn-primary px-5 py-2.5 rounded-xl inline-flex items-center gap-2 text-[13.5px]">
                Browse challenges <ArrowRight size={15} weight="bold" />
              </button>
            </div>
          )}

          {!busy && shown.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-5">
              {shown.map((c) => <ChallengeCard key={c.id} c={c} />)}
            </div>
          )}
        </div>
      </div>
    </TerminalShell>
  );
}
