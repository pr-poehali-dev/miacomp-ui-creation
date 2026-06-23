import { useState } from 'react';
import Icon from '@/components/ui/icon';

const stats = [
  { icon: 'Server', label: 'Активные запросы', value: '147', sub: '+12 за неделю', color: '#00D4FF' },
  { icon: 'FileText', label: 'Сформировано КП', value: '89', sub: '+5 сегодня', color: '#8B5CF6' },
  { icon: 'CheckCircle2', label: 'Выполнено', value: '312', sub: '94% успешных', color: '#22D88F' },
  { icon: 'Clock', label: 'В ожидании', value: '23', sub: 'ср. 2.4 дня', color: '#FFB020' },
];

const currencies = [
  { pair: 'CNY / RUB', value: '12.84', change: '+0.42%', up: true },
  { pair: 'USD / RUB', value: '92.17', change: '-0.18%', up: false },
];

const statuses = ['Все', 'Новый', 'В работе', 'Выполнен'];

const requests = [
  { id: 'REQ-2048', manager: 'Алексей М.', date: '23.06.2026', client: 'ООО «ТехноПром»', status: 'Новый', statusColor: '#00D4FF', urgency: '#FF4D6D', items: 8 },
  { id: 'REQ-2047', manager: 'Дмитрий К.', date: '22.06.2026', client: 'АО «ДатаЦентр-Р»', status: 'В работе', statusColor: '#FFB020', urgency: '#FFB020', items: 14 },
  { id: 'REQ-2046', manager: 'Ирина С.', date: '22.06.2026', client: 'ООО «Серверные системы»', status: 'Выполнен', statusColor: '#22D88F', urgency: '#22D88F', items: 5 },
];

const suppliers = ['Поставщик А', 'Поставщик B', 'Поставщик C', 'Поставщик D', 'Поставщик E', 'Поставщик F'];

type Offer = { price: string; cur: string; cond: 'NEW' | 'USED' | 'REF'; days: string };

const offers: Record<number, Offer | undefined>[] = [
  { 0: { price: '142 500', cur: '₽', cond: 'NEW', days: '14 дн' }, 2: { price: '138 900', cur: '₽', cond: 'REF', days: '21 дн' }, 4: { price: '145 000', cur: '₽', cond: 'NEW', days: '7 дн' } },
  { 1: { price: '89 200', cur: '₽', cond: 'NEW', days: '10 дн' }, 3: { price: '85 400', cur: '₽', cond: 'USED', days: '5 дн' } },
  { 0: { price: '24 100', cur: '₽', cond: 'NEW', days: '12 дн' }, 5: { price: '22 800', cur: '₽', cond: 'REF', days: '18 дн' } },
];

const products = [
  { pn: 'DL380-G11', desc: 'HPE ProLiant DL380 Gen11 Server', qty: 4 },
  { pn: 'MX-9300-48', desc: 'Cisco Nexus 9300 Switch 48-port', qty: 2 },
  { pn: 'SSD-3840-NV', desc: 'Samsung PM9A3 NVMe 3.84TB U.2', qty: 16 },
];

const condColors: Record<string, string> = {
  NEW: '#22D88F',
  USED: '#FFB020',
  REF: '#8B5CF6',
};

const Index = () => {
  const [activeStatus, setActiveStatus] = useState('Все');
  const [urgency, setUrgency] = useState(50);
  const [hoveredOffer, setHoveredOffer] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background grid-bg text-foreground font-sans relative overflow-x-hidden">
      <div className="pointer-events-none absolute top-[-20%] left-[10%] h-[500px] w-[500px] rounded-full bg-neon-cyan/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-[20%] right-[5%] h-[400px] w-[400px] rounded-full bg-neon-purple/10 blur-[140px]" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="mx-auto max-w-[1600px] px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="glitch-border flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20">
              <span className="font-mono text-lg font-bold text-neon-cyan neon-text">МС</span>
            </div>
            <div>
              <h1 className="font-mono text-xl font-bold tracking-tight">
                MIA<span className="text-neon-cyan neon-text">COMP</span>
                <span className="ml-2 rounded bg-neon-purple/20 px-1.5 py-0.5 text-[10px] font-semibold text-neon-purple align-middle">2.0</span>
              </h1>
              <p className="text-[11px] text-muted-foreground tracking-wider">Система управления закупками IT-оборудования</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-lg glass glass-hover">
              <Icon name="MessageSquare" size={18} className="text-muted-foreground" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">3</span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg glass glass-hover">
              <Icon name="Settings" size={18} className="text-muted-foreground" />
            </button>
            <div className="flex items-center gap-3 rounded-lg glass px-3 py-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple text-sm font-bold text-background">АМ</div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Алексей М.</p>
                <p className="text-[11px] text-neon-cyan">Менеджер</p>
              </div>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/15 text-destructive transition-colors hover:bg-destructive/25">
              <Icon name="LogOut" size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-8 py-8 relative z-10">
        {/* STATS */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-5 mb-8">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="glass glass-hover rounded-2xl p-5 opacity-0 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${s.color}1a` }}>
                <Icon name={s.icon} size={22} style={{ color: s.color }} />
              </div>
              <p className="font-mono text-3xl font-bold tracking-tight" style={{ color: s.color }}>{s.value}</p>
              <p className="mt-1 text-sm text-foreground/80">{s.label}</p>
              <p className="text-[11px] text-muted-foreground">{s.sub}</p>
            </div>
          ))}

          <div className="glass glass-hover rounded-2xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: '320ms' }}>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-neon-purple/10">
              <Icon name="TrendingUp" size={22} className="text-neon-purple" />
            </div>
            <div className="space-y-2 pt-1">
              {currencies.map((c) => (
                <div key={c.pair} className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{c.pair}</span>
                  <span className="font-mono text-base font-bold">{c.value}</span>
                  <span className={`flex items-center gap-0.5 font-mono text-xs ${c.up ? 'text-[#22D88F]' : 'text-destructive'}`}>
                    <Icon name={c.up ? 'ArrowUpRight' : 'ArrowDownRight'} size={14} />
                    {c.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FILTERS */}
        <section className="glass rounded-2xl p-4 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex flex-wrap items-center gap-4">
            <button className="group flex items-center gap-2 rounded-xl bg-neon-cyan px-4 py-2.5 text-sm font-semibold text-background animate-pulse-glow transition-transform hover:scale-105">
              <Icon name="Plus" size={18} />
              Добавить запрос
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-neon-purple px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]">
              <Icon name="FileSpreadsheet" size={18} />
              Создать КП
            </button>

            <div className="flex rounded-xl glass p-1">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveStatus(st)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    activeStatus === st ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Срочность</span>
              <input
                type="range"
                value={urgency}
                onChange={(e) => setUrgency(Number(e.target.value))}
                className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-secondary accent-neon-cyan"
              />
            </div>

            <div className="relative">
              <select className="appearance-none rounded-xl glass px-4 py-2.5 pr-9 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-neon-cyan">
                <option>Все менеджеры</option>
                <option>Алексей М.</option>
                <option>Дмитрий К.</option>
                <option>Ирина С.</option>
              </select>
              <Icon name="ChevronDown" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>

            <div className="relative ml-auto">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Поиск по запросам, партномерам..."
                className="w-72 rounded-xl glass py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-neon-cyan"
              />
            </div>
          </div>
        </section>

        {/* REQUEST CARDS */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
          {requests.map((r, i) => (
            <div
              key={r.id}
              className="glass glass-hover relative overflow-hidden rounded-2xl p-5 opacity-0 animate-slide-up"
              style={{ animationDelay: `${400 + i * 80}ms` }}
            >
              <div className="absolute left-0 top-0 h-full w-1" style={{ background: r.urgency, boxShadow: `0 0 16px ${r.urgency}` }} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-lg font-bold text-neon-cyan">{r.id}</p>
                  <p className="mt-1 text-sm font-medium">{r.client}</p>
                </div>
                <span className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: `${r.statusColor}1a`, color: r.statusColor }}>
                  {r.status}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Icon name="User" size={13} />{r.manager}</span>
                <span className="flex items-center gap-1.5"><Icon name="Calendar" size={13} />{r.date}</span>
                <span className="flex items-center gap-1.5"><Icon name="Package" size={13} />{r.items} поз.</span>
              </div>
            </div>
          ))}
        </section>

        {/* PRODUCTS TABLE */}
        <section className="glass rounded-2xl p-6 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-mono text-lg font-bold">
              <Icon name="Boxes" size={20} className="text-neon-cyan" />
              Матрица предложений · REQ-2048
            </h2>
            <span className="text-xs text-muted-foreground">3 позиции · 6 поставщиков</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1100px]">
              <div className="mb-3 grid grid-cols-[260px_repeat(6,1fr)] gap-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <div>Товар / Партномер</div>
                {suppliers.map((s) => (
                  <div key={s} className="text-center">{s}</div>
                ))}
              </div>

              <div className="space-y-3">
                {products.map((p, ri) => (
                  <div key={p.pn} className="grid grid-cols-[260px_repeat(6,1fr)] gap-3 items-stretch">
                    <div className="glass rounded-xl p-3">
                      <p className="font-mono text-sm font-bold text-neon-cyan">{p.pn}</p>
                      <p className="mt-0.5 text-xs text-foreground/80 leading-snug">{p.desc}</p>
                      <p className="mt-2 inline-block rounded bg-secondary px-2 py-0.5 font-mono text-[11px]">× {p.qty} шт</p>
                    </div>

                    {suppliers.map((_, si) => {
                      const offer = offers[ri][si];
                      const key = `${ri}-${si}`;
                      if (!offer) {
                        return (
                          <div key={si} className="flex items-center justify-center rounded-xl border border-dashed border-white/5 text-muted-foreground/40">
                            <Icon name="Minus" size={16} />
                          </div>
                        );
                      }
                      return (
                        <div
                          key={si}
                          onMouseEnter={() => setHoveredOffer(key)}
                          onMouseLeave={() => setHoveredOffer(null)}
                          className="glass glass-hover relative flex flex-col rounded-xl p-3 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-base font-bold text-foreground">{offer.price}<span className="ml-0.5 text-xs text-muted-foreground">{offer.cur}</span></span>
                            <span className="rounded px-1.5 py-0.5 text-[9px] font-bold" style={{ background: `${condColors[offer.cond]}22`, color: condColors[offer.cond] }}>
                              {offer.cond}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1"><Icon name="Clock" size={11} />{offer.days}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="flex items-center gap-0.5"><Icon name="Truck" size={12} className="text-neon-cyan" />1.2k</span>
                              <span className="flex items-center gap-0.5"><Icon name="Plane" size={12} className="text-neon-purple" />3.5k</span>
                            </div>
                          </div>
                          <div className={`mt-2 flex items-center gap-1.5 transition-all ${hoveredOffer === key ? 'opacity-100 max-h-8' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                            <input type="checkbox" className="h-4 w-4 rounded accent-neon-cyan cursor-pointer" />
                            <span className="text-[10px] text-neon-cyan">Выбрать предложение</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PAGINATION */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Показывать по</span>
            <select className="rounded-lg glass px-2 py-1 text-foreground focus:outline-none">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg glass glass-hover text-muted-foreground">
              <Icon name="ChevronLeft" size={16} />
            </button>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm transition-all ${
                  n === 1 ? 'bg-neon-cyan text-background font-bold' : 'glass glass-hover text-muted-foreground'
                }`}
              >
                {n}
              </button>
            ))}
            <button className="flex h-9 w-9 items-center justify-center rounded-lg glass glass-hover text-muted-foreground">
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
