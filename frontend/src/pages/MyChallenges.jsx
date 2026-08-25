import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Medal, CircleNotch, Target, ShieldWarning, ChartLineUp, ChartLineDown,
  Hourglass, Atom, Crown, SketchLogo, Trophy, ArrowRight, SealCheck, XCircle, Pulse,
} from '@phosphor-icons/react';
import { API_BASE as API } from '../lib/apiBase';
import { isLoggedIn } from '../lib/auth';
import TerminalShell from '../components/TerminalShell';

const TABS = [['running', 'Running'], ['complete', 'Complete'], ['failed', 'Failed']];

const PLAN = {
  basic: { icon: Atom, accent: '#38BDF8' },
  standard: { icon: Crown, accent: '#A78BFA' },
  premium: { icon: SketchLogo, accent: '#B266FF' },
};

const STATE = {
  running: { label: 'Running', icon: Pulse, color: '#14B877' },
  complete: { label: 'Passed', icon: SealCheck, color: '#14B877' },
  failed: { label: 'Failed', icon: XCircle, color: '#FF5C5C' },
};

const money = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Metric = ({ icon: Icon, label, value, limit, amount, tone, testid }) => {
  const pct = Number(value || 0);
  const filled = limit ? Math.min(100, Math.max(0, (pct / limit) * 100)) : 0;
  const up = tone === 'profit';
  const accent = up ? '#14B877' : '#FF5C5C';
  return (
    <div data-testid={testid} className="py-4 first:pt-0 md:py-0">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 min-w-0">
          <Icon size={16} weight="duotone" color={accent} className="shrink-0" />
          <span className="truncate text-[12.5px] font-semibold text-white/60">{label}</span>
        </span>
        <span className="shrink-0 tabular-nums text-[13px] font-extrabold" style={{ color: accent }}>
          {pct.toFixed(2)}%
          <span className="ml-1 text-[11.5px] font-semibold text-white/30">/ {limit ? `${limit}%` : '∞'}</span>
        </span>
      </div>
      <div className="mt-2.5 h-2 w-full rounded-full bg-white/[0.07] overflow-hidden ring-1 ring-inset ring-white/[0.04]">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${filled}%`,
            background: up ? 'linear-gradient(90deg,#0d8f5c,#1ad48b)' : 'linear-gradient(90deg,#b3352f,#ff6b6b)',
            boxShadow: filled > 0 ? `0 0 12px ${accent}66` : 'none',
          }}
        />
      </div>
      <div className="mt-1.5 text-[11.5px] tabular-nums text-white/40">{money(amount)}</div>
    </div>
  );
};

const ChallengeBlock = ({ c }) => {
  const plan = PLAN[c.plan] || PLAN.basic;
  const state = STATE[c.state] || STATE.running;
  const PlanIcon = plan.icon;
  const StateIcon = state.icon;
  const gain = c.pnl >= 0;
  const timePct = c.duration_days ? Math.min(100, Math.max(0, ((c.duration_days - c.days_left) / c.duration_days) * 100)) : 0;

  return (
    <section
      data-testid={`my-challenge-${c.plan}`}
      className="relative rounded-2xl border border-white/[0.08]
                 bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.012))]
                 shadow-[0_28px_80px_-60px_rgba(0,0,0,0.95)] overflow-hidden"
    >
      <span className="block absolute inset-x-0 top-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, ${plan.accent}, ${plan.accent}00 65%)` }} />

      <div className="p-5 md:p-6 lg:p-7">
        {/* Header — identity + state (badge can never collide: title truncates, badge is shrink-0) */}
        <div className="flex items-start gap-3">
          <span className="grid place-items-center h-11 w-11 shrink-0 rounded-2xl border"
                style={{ borderColor: `${plan.accent}40`, background: `${plan.accent}14` }}>
            <PlanIcon size={22} weight="fill" color={plan.accent} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[16.5px] font-bold leading-tight">{c.label} Challenge</h3>
            <div className="truncate text-[11.5px] text-white/40">{money(c.account_size)} funded account</div>
          </div>
          <span data-testid={`state-${c.plan}`}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em]"
                style={{ color: state.color, background: `${state.color}18`, border: `1px solid ${state.color}33` }}>
            <StateIcon size={12} weight="fill" /> {state.label}
          </span>
        </div>

        {/* Body */}
        <div className="mt-5 md:mt-6 md:grid md:grid-cols-[290px_1fr] md:gap-8">
          {/* Balance + time */}
          <div className="md:border-r md:border-white/[0.07] md:pr-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Live balance</div>
            <div className="mt-1.5 flex flex-wrap items-end gap-x-3 gap-y-1">
              <span className="text-[30px] md:text-[34px] font-extrabold leading-none tabular-nums"
                    style={{ fontFamily: 'Manrope, sans-serif' }} data-testid={`balance-${c.plan}`}>
                {money(c.balance)}
              </span>
              <span className={`text-[13px] font-bold tabular-nums ${gain ? 'text-[#14B877]' : 'text-[#FF5C5C]'}`}>
                {gain ? '+' : '−'}{money(Math.abs(c.pnl))}
                <span className="ml-1 font-semibold text-white/30">overall</span>
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[12px] text-white/50">
                  <Hourglass size={15} weight="duotone" color="#F4D67A" /> Time remaining
                </span>
                <span className="text-[12.5px] font-bold tabular-nums" data-testid={`days-left-${c.plan}`}>
                  {c.days_left}<span className="font-semibold text-white/35"> / {c.duration_days} days</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-[#F4D67A]/70 transition-[width] duration-700"
                     style={{ width: `${timePct}%` }} />
              </div>
            </div>
          </div>

          {/* Rule meters */}
          <div className="mt-4 md:mt-0 divide-y divide-white/[0.06] md:divide-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-6">
            <Metric testid={`profit-target-${c.plan}`} icon={Target} label="Profit Target" tone="profit"
                    value={c.profit.pct} limit={c.profit.target_pct} amount={c.profit.amount} />
            <Metric testid={`max-loss-${c.plan}`} icon={ShieldWarning} label="Maximum Loss" tone="loss"
                    value={c.loss.pct} limit={c.loss.limit_pct} amount={c.loss.amount} />
            <Metric testid={`today-profit-${c.plan}`} icon={ChartLineUp} label="Daily Profit" tone="profit"
                    value={c.today_profit.pct} limit={c.today_profit.target_pct} amount={c.today_profit.amount} />
            <Metric testid={`today-loss-${c.plan}`} icon={ChartLineDown} label="Daily Loss" tone="loss"
                    value={c.today_loss.pct} limit={c.today_loss.limit_pct} amount={c.today_loss.amount} />
          </div>
        </div>
      </div>
    </section>
  );
};

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
      <div className="min-h-full" data-testid="my-challenges-page"
           style={{ backgroundImage: 'radial-gradient(760px 420px at 8% -12%, rgba(20,184,119,0.10), transparent 62%)' }}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
          {/* Page heading */}
          <div className="pt-6 md:pt-9">
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#14B877]">Funded progress</div>
            <h1 className="mt-1.5 text-[26px] md:text-[34px] font-extrabold leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              My challenges
            </h1>
          </div>

          {/* Segmented tabs */}
          <div className="mt-5 sticky top-0 z-10 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 pb-3 pt-1 bg-[#040D09]/92 backdrop-blur-sm">
            <div className="flex items-center gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-1">
              {TABS.map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)} data-testid={`tab-${key}`}
                        className={`flex-1 py-2 rounded-xl text-[12.5px] font-bold tracking-tight transition-colors ${
                          tab === key ? 'bg-[#14B877] text-[#03150d] shadow-[0_6px_18px_-8px_rgba(20,184,119,0.9)]'
                                      : 'text-white/50 hover:text-white'}`}>
                  {label}
                  <span className={`ml-1.5 text-[11px] font-extrabold ${tab === key ? 'text-[#03150d]/65' : 'text-white/30'}`}>
                    {counts[key] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {busy && (
            <div className="py-20 flex justify-center text-white/40" data-testid="my-challenges-loading">
              <CircleNotch size={26} className="animate-spin" />
            </div>
          )}

          {!busy && shown.length === 0 && (
            <div className="py-16 text-center" data-testid="my-challenges-empty">
              <Trophy size={36} weight="duotone" className="mx-auto text-white/25" />
              <div className="mt-4 text-[15.5px] font-bold">No {tab} challenges</div>
              <p className="mt-1.5 text-[13px] text-white/40">Buy a funded challenge to start tracking your progress here.</p>
              <button onClick={() => navigate('/challenges')} data-testid="browse-challenges-btn"
                      className="mt-6 lux-btn-primary px-5 py-2.5 rounded-xl inline-flex items-center gap-2 text-[13.5px]">
                Browse challenges <ArrowRight size={15} weight="bold" />
              </button>
            </div>
          )}

          {!busy && shown.length > 0 && (
            <div className="pt-3 pb-10 space-y-7 md:space-y-8">
              {shown.map((c) => <ChallengeBlock key={c.id} c={c} />)}
            </div>
          )}
        </div>
      </div>
    </TerminalShell>
  );
}
