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

const statusFilters = ['Новый', 'В работе', 'Выполнен'];
const urgencyFilters = ['Стандарт', 'Срочно'];

const condColors: Record<string, string> = {
  NEW: '#22D88F',
  USED: '#FFB020',
  REF: '#8B5CF6',
};

type Offer = {
  supplier: string;
  price: string;
  cur: string;
  cond: 'NEW' | 'USED' | 'REF';
  days: string;
  truck: string;
  plane: string;
  comment?: string;
  file?: string;
};

type Product = {
  pn: string;
  desc: string;
  qty: number;
  offers: Offer[];
};

const products: Product[] = [
  {
    pn: 'DL380-G11',
    desc: 'HPE ProLiant DL380 Gen11 Server',
    qty: 4,
    offers: [
      { supplier: 'Jeanne', price: '142 500', cur: '₽', cond: 'NEW', days: '14 дн', truck: '1.2k', plane: '3.5k' },
      { supplier: 'Power Star', price: '138 900', cur: '₽', cond: 'REF', days: '21 дн', truck: '0.9k', plane: '2.8k', comment: 'Восстановленные, гарантия 12 мес. Возможна частичная отгрузка двумя партиями по согласованию.', file: 'spec_DL380.pdf' },
      { supplier: 'Tony', price: '145 000', cur: '₽', cond: 'NEW', days: '7 дн', truck: '1.5k', plane: '4.1k' },
    ],
  },
  {
    pn: 'MX-9300-48',
    desc: 'Cisco Nexus 9300 Switch 48-port',
    qty: 2,
    offers: [
      { supplier: 'Katherine', price: '89 200', cur: '₽', cond: 'NEW', days: '10 дн', truck: '0.8k', plane: '2.1k' },
      { supplier: 'Jack', price: '85 400', cur: '₽', cond: 'USED', days: '5 дн', truck: '0.6k', plane: '1.9k', comment: 'Б/у, протестированы на стенде. Прилагаю фото и отчёт диагностики.', file: 'report_MX9300.xlsx' },
    ],
  },
  {
    pn: 'SSD-3840-NV',
    desc: 'Samsung PM9A3 NVMe 3.84TB U.2',
    qty: 16,
    offers: [
      { supplier: 'Morry', price: '24 100', cur: '₽', cond: 'NEW', days: '12 дн', truck: '0.4k', plane: '1.2k' },
      { supplier: 'Maggi', price: '22 800', cur: '₽', cond: 'REF', days: '18 дн', truck: '0.3k', plane: '1.0k' },
    ],
  },
];

const Index = () => {
  const [activeStatuses, setActiveStatuses] = useState<string[]>(['Новый']);
  const [activeUrgency, setActiveUrgency] = useState<string[]>([]);
  const [hoveredOffer, setHoveredOffer] = useState<string | null>(null);
  const [modalOffer, setModalOffer] = useState<(Offer & { pn: string; desc: string }) | null>(null);

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) => {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

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
              <div className="flex items-start justify-between">
                <p className="font-mono text-3xl font-bold tracking-tight leading-none" style={{ color: s.color }}>{s.value}</p>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `${s.color}1a` }}>
                  <Icon name={s.icon} size={18} style={{ color: s.color }} />
                </div>
              </div>
              <p className="mt-2 text-sm text-foreground/80">{s.label}</p>
              <p className="text-[11px] text-muted-foreground">{s.sub}</p>
            </div>
          ))}

          <div className="glass glass-hover rounded-2xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: '320ms' }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground/80">Курсы валют</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neon-purple/10">
                <Icon name="TrendingUp" size={18} className="text-neon-purple" />
              </div>
            </div>
            <div className="space-y-1.5">
              {currencies.map((c) => (
                <div key={c.pair} className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{c.pair}</span>
                  <span className="font-mono text-sm font-bold">{c.value}</span>
                  <span className={`flex items-center gap-0.5 font-mono text-xs ${c.up ? 'text-[#22D88F]' : 'text-destructive'}`}>
                    <Icon name={c.up ? 'ArrowUpRight' : 'ArrowDownRight'} size={13} />
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
              {statusFilters.map((st) => (
                <button
                  key={st}
                  onClick={() => toggle(activeStatuses, setActiveStatuses, st)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    activeStatuses.includes(st) ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex rounded-xl glass p-1">
              {urgencyFilters.map((u) => (
                <button
                  key={u}
                  onClick={() => toggle(activeUrgency, setActiveUrgency, u)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    activeUrgency.includes(u)
                      ? u === 'Срочно' ? 'bg-destructive/20 text-destructive' : 'bg-neon-purple/20 text-neon-purple'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {u === 'Срочно' && <Icon name="Zap" size={13} />}
                  {u}
                </button>
              ))}
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

        {/* REQUEST MATRIX with header */}
        <section className="glass rounded-2xl overflow-hidden mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '500ms' }}>
          {/* Request header bar */}
          <div className="relative flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-neon-cyan/10 to-transparent px-6 py-4">
            <div className="absolute left-0 top-0 h-full w-1 bg-[#FF4D6D]" style={{ boxShadow: '0 0 16px #FF4D6D' }} />
            <div className="flex items-center gap-6">
              <div>
                <p className="font-mono text-xl font-bold text-neon-cyan">REQ-2048</p>
                <p className="text-sm font-medium text-foreground/90">ООО «ТехноПром»</p>
              </div>
              <div className="hidden md:flex items-center gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Icon name="User" size={14} />Алексей М.</span>
                <span className="flex items-center gap-1.5"><Icon name="Calendar" size={14} />23.06.2026</span>
                <span className="flex items-center gap-1.5"><Icon name="Package" size={14} />3 позиции</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-destructive/15 px-3 py-1 text-[11px] font-semibold text-destructive flex items-center gap-1"><Icon name="Zap" size={12} />Срочно</span>
              <span className="rounded-full bg-neon-cyan/15 px-3 py-1 text-[11px] font-semibold text-neon-cyan">Новый</span>
            </div>
          </div>

          {/* Products + offers */}
          <div className="p-6">
            <div className="space-y-4">
              {products.map((p, ri) => (
                <div key={p.pn} className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 items-start">
                  <div className="glass rounded-xl p-3">
                    <p className="font-mono text-sm font-bold text-neon-cyan">{p.pn}</p>
                    <p className="mt-0.5 text-xs text-foreground/80 leading-snug">{p.desc}</p>
                    <p className="mt-2 inline-block rounded bg-secondary px-2 py-0.5 font-mono text-[11px]">× {p.qty} шт</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    {p.offers.map((offer, si) => {
                      const key = `${ri}-${si}`;
                      const hasMeta = offer.comment || offer.file;
                      return (
                        <div
                          key={si}
                          onMouseEnter={() => setHoveredOffer(key)}
                          onMouseLeave={() => setHoveredOffer(null)}
                          onClick={() => setModalOffer({ ...offer, pn: p.pn, desc: p.desc })}
                          className="glass glass-hover relative flex flex-col rounded-xl p-3 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/90">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neon-purple/20 text-[9px] text-neon-purple">{offer.supplier[0]}</span>
                              {offer.supplier}
                            </span>
                            <span className="rounded px-1.5 py-0.5 text-[9px] font-bold" style={{ background: `${condColors[offer.cond]}22`, color: condColors[offer.cond] }}>
                              {offer.cond}
                            </span>
                          </div>

                          <div className="mt-2 font-mono text-lg font-bold text-foreground">
                            {offer.price}<span className="ml-0.5 text-xs text-muted-foreground">{offer.cur}</span>
                          </div>

                          <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1"><Icon name="Clock" size={11} />{offer.days}</span>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-0.5"><Icon name="Truck" size={12} className="text-neon-cyan" />{offer.truck}</span>
                              <span className="flex items-center gap-0.5"><Icon name="Plane" size={12} className="text-neon-purple" />{offer.plane}</span>
                            </div>
                          </div>

                          {hasMeta && (
                            <div className="mt-2 flex items-center gap-2 border-t border-white/5 pt-2">
                              {offer.comment && (
                                <span className="flex items-center gap-1 text-[10px] text-neon-cyan">
                                  <Icon name="MessageSquareText" size={11} />коммент
                                </span>
                              )}
                              {offer.file && (
                                <span className="flex items-center gap-1 truncate text-[10px] text-neon-purple">
                                  <Icon name="Paperclip" size={11} />{offer.file}
                                </span>
                              )}
                            </div>
                          )}

                          <div className={`mt-2 flex items-center gap-1.5 transition-all ${hoveredOffer === key ? 'opacity-100 max-h-8' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                            <input type="checkbox" onClick={(e) => e.stopPropagation()} className="h-4 w-4 rounded accent-neon-cyan cursor-pointer" />
                            <span className="text-[10px] text-neon-cyan">Выбрать предложение</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
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

      {/* OFFER MODAL */}
      {modalOffer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setModalOffer(null)}
        >
          <div
            className="glass glitch-border w-full max-w-md rounded-2xl p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon-purple/20 font-mono font-bold text-neon-purple">
                  {modalOffer.supplier[0]}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{modalOffer.supplier}</p>
                  <p className="text-xs text-muted-foreground">Поставщик предложения</p>
                </div>
              </div>
              <button onClick={() => setModalOffer(null)} className="flex h-8 w-8 items-center justify-center rounded-lg glass glass-hover text-muted-foreground">
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="rounded-xl bg-secondary/40 p-3 mb-4">
              <p className="font-mono text-sm font-bold text-neon-cyan">{modalOffer.pn}</p>
              <p className="text-xs text-foreground/80">{modalOffer.desc}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="glass rounded-xl p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Цена</p>
                <p className="font-mono text-base font-bold text-foreground">{modalOffer.price}{modalOffer.cur}</p>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Состояние</p>
                <p className="font-mono text-base font-bold" style={{ color: condColors[modalOffer.cond] }}>{modalOffer.cond}</p>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Срок</p>
                <p className="font-mono text-base font-bold text-foreground">{modalOffer.days}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground"><Icon name="Truck" size={16} className="text-neon-cyan" />Авто: {modalOffer.truck}₽</span>
              <span className="flex items-center gap-1.5 text-muted-foreground"><Icon name="Plane" size={16} className="text-neon-purple" />Авиа: {modalOffer.plane}₽</span>
            </div>

            <div className="mb-4">
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-neon-cyan"><Icon name="MessageSquareText" size={14} />Комментарий поставщика</p>
              <p className="rounded-xl bg-secondary/40 p-3 text-sm leading-relaxed text-foreground/90">
                {modalOffer.comment || 'Комментарий к предложению отсутствует.'}
              </p>
            </div>

            {modalOffer.file && (
              <a className="flex items-center justify-between rounded-xl glass glass-hover p-3 cursor-pointer mb-4">
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <Icon name="FileText" size={18} className="text-neon-purple" />
                  {modalOffer.file}
                </span>
                <Icon name="Download" size={16} className="text-neon-cyan" />
              </a>
            )}

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-neon-cyan py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.02]">
                <Icon name="Check" size={16} />Выбрать предложение
              </button>
              <button onClick={() => setModalOffer(null)} className="rounded-xl glass glass-hover px-4 text-sm text-muted-foreground">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
