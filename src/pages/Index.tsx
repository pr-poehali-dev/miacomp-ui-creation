import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';

/* ─── Курсы валют ─── */
const CNY_RUB = 12.84;
const USD_RUB = 92.17;

const stats = [
  { icon: 'Server',        label: 'Активные запросы', value: '147', sub: '+12 за неделю', color: '#00D4FF' },
  { icon: 'FileText',      label: 'Сформировано КП',  value: '89',  sub: '+5 сегодня',    color: '#8B5CF6' },
  { icon: 'CheckCircle2',  label: 'Выполнено',        value: '312', sub: '94% успешных',  color: '#22D88F' },
  { icon: 'Clock',         label: 'В ожидании',       value: '23',  sub: 'ср. 2.4 дня',   color: '#FFB020' },
];

const currencies = [
  { pair: 'CNY / RUB', value: CNY_RUB.toFixed(2), change: '+0.42%', up: true },
  { pair: 'USD / RUB', value: USD_RUB.toFixed(2), change: '-0.18%', up: false },
];

const statusFilters  = ['Новый', 'В работе', 'Выполнен'];
const urgencyFilters = ['Стандарт', 'Срочно'];

const statusMeta: Record<string, { color: string; bg: string; label: string }> = {
  'Новый':    { color: '#00D4FF', bg: 'rgba(0,212,255,0.18)',   label: 'НОВЫЙ'    },
  'В работе': { color: '#FFB020', bg: 'rgba(255,176,32,0.18)',  label: 'В РАБОТЕ' },
  'Выполнен': { color: '#22D88F', bg: 'rgba(34,216,143,0.18)',  label: 'ВЫПОЛНЕН' },
};

const condColors: Record<string, string> = {
  NEW:  '#22D88F',
  USED: '#FFB020',
  REF:  '#8B5CF6',
};

type Currency = 'CNY' | 'USD';

type Offer = {
  supplier: string;
  price: number;
  currency: Currency;
  cond: 'NEW' | 'USED' | 'REF';
  days: string;
  comment?: string;
  file?: string;
};

type Product = {
  pn: string;
  desc: string;
  qty: number;
  managerComment?: string;
  offers: Offer[];
};

/* ─── Расчёт доставки ─── */
function calcDelivery(price: number, cur: Currency) {
  const rub = cur === 'CNY' ? price * CNY_RUB : price * USD_RUB;
  const truck = Math.round(rub * 1.30);
  const plane = Math.round(rub * 1.20);
  return { truck, plane };
}

function fmtRub(n: number) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

function fmtPrice(price: number, cur: Currency) {
  if (cur === 'CNY') return '¥ ' + price.toLocaleString('ru-RU');
  return '$ ' + price.toLocaleString('ru-RU');
}

const CUR_COLOR: Record<Currency, string> = {
  CNY: '#F59E42',   // золотисто-оранжевый → юань
  USD: '#22D88F',   // зелёный → доллар
};

const products: Product[] = [
  {
    pn: 'DL380-G11',
    desc: 'HPE ProLiant DL380 Gen11 Server',
    qty: 4,
    managerComment: 'Нужны с лицензией iLO Advanced',
    offers: [
      { supplier: 'Jeanne',      price: 1560, currency: 'USD', cond: 'NEW',  days: '14 дн' },
      { supplier: 'Power Star',  price: 9800, currency: 'CNY', cond: 'REF',  days: '21 дн', comment: 'Восстановленные, гарантия 12 мес. Возможна частичная отгрузка двумя партиями.', file: 'spec_DL380.pdf' },
      { supplier: 'Tony',        price: 1590, currency: 'USD', cond: 'NEW',  days: '7 дн'  },
      { supplier: 'Katherine',   price: 9500, currency: 'CNY', cond: 'NEW',  days: '10 дн', file: 'invoice_kat.pdf' },
      { supplier: 'Jack',        price: 1480, currency: 'USD', cond: 'USED', days: '5 дн', comment: 'Протестировано, полный комплект.' },
      { supplier: 'Morry',       price: 9200, currency: 'CNY', cond: 'REF',  days: '18 дн' },
    ],
  },
  {
    pn: 'MX-9300-48',
    desc: 'Cisco Nexus 9300 Switch 48-port',
    qty: 2,
    offers: [
      { supplier: 'Katherine', price: 960,  currency: 'USD', cond: 'NEW',  days: '10 дн' },
      { supplier: 'Jack',      price: 6200, currency: 'CNY', cond: 'USED', days: '5 дн', comment: 'Б/у, протестированы на стенде.', file: 'report_MX9300.xlsx' },
      { supplier: 'Tony',      price: 1010, currency: 'USD', cond: 'NEW',  days: '8 дн'  },
    ],
  },
  {
    pn: 'SSD-3840-NV',
    desc: 'Samsung PM9A3 NVMe 3.84TB U.2',
    qty: 16,
    managerComment: 'Принимаем только U.2 форм-фактор, не M.2',
    offers: [
      { supplier: 'Morry',      price: 1880, currency: 'CNY', cond: 'NEW', days: '12 дн' },
      { supplier: 'Maggi',      price: 1760, currency: 'CNY', cond: 'REF', days: '18 дн' },
      { supplier: 'Power Star', price: 248,  currency: 'USD', cond: 'NEW', days: '9 дн',  file: 'ssd_spec.pdf' },
    ],
  },
];

/* ─── Компонент карточки предложения ─── */
function OfferCard({
  offer, isHovered, onHover, onLeave, onClick,
}: {
  offer: Offer;
  isHovered: boolean;
  onHover: () => void; onLeave: () => void; onClick: () => void;
}) {
  const [selected, setSelected] = useState(false);
  const { truck, plane } = calcDelivery(offer.price, offer.currency);
  const hasMeta = offer.comment || offer.file;
  const curColor = CUR_COLOR[offer.currency];

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected((s) => !s);
  };

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="glass glass-hover relative flex flex-col rounded-xl cursor-pointer shrink-0 w-[190px] overflow-hidden"
    >
      {/* Строка 1: Поставщик — Состояние */}
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
        <span className="flex items-center gap-1.5 min-w-0">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon-purple/20 text-[9px] font-bold text-neon-purple">
            {offer.supplier[0]}
          </span>
          <span className="truncate text-xs font-semibold text-foreground/90">{offer.supplier}</span>
        </span>
        <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: `${condColors[offer.cond]}22`, color: condColors[offer.cond] }}>
          {offer.cond}
        </span>
      </div>

      {/* Тело: две колонки */}
      <div className="flex flex-1 px-3 pb-3 gap-2">
        {/* Левая: цена + доставки */}
        <div className="flex flex-col justify-start flex-1 min-w-0">
          <p className="font-mono text-lg font-extrabold leading-tight" style={{ color: curColor }}>
            {fmtPrice(offer.price, offer.currency)}
          </p>
          <div className="mt-1.5 space-y-1">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Icon name="Truck" size={12} className="text-neon-cyan shrink-0" />
              <span className="font-mono">{fmtRub(truck)}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Icon name="Plane" size={12} className="text-neon-purple shrink-0" />
              <span className="font-mono">{fmtRub(plane)}</span>
            </div>
          </div>
        </div>

        {/* Правая: срок + метки */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground whitespace-nowrap">
            <Icon name="Clock" size={10} />{offer.days}
          </span>
          {hasMeta && (
            <div className="flex items-center gap-1.5">
              {offer.comment && <Icon name="MessageSquareText" size={15} className="text-neon-cyan" />}
              {offer.file    && <Icon name="Paperclip" size={15} className="text-neon-purple" />}
            </div>
          )}
        </div>
      </div>

      {/* Галочка в правом нижнем углу */}
      <button
        onClick={handleCheck}
        className="absolute bottom-2 right-2 transition-all duration-200"
        style={{ opacity: isHovered || selected ? 1 : 0, pointerEvents: isHovered || selected ? 'auto' : 'none' }}
      >
        <div className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 ${
          selected
            ? 'bg-neon-cyan shadow-[0_0_10px_rgba(0,212,255,0.6)]'
            : 'bg-white/10 border border-white/25'
        }`}>
          <Icon name="Check" size={13} className={selected ? 'text-background' : 'text-white/60'} />
        </div>
      </button>
    </div>
  );
}

/* ─── Скроллируемый ряд предложений ─── */
function OffersRow({ product, onOfferClick }: {
  product: Product;
  onOfferClick: (o: Offer & { pn: string; desc: string }) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(product.offers.length > 5);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const scroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 360, behavior: 'smooth' });
      setTimeout(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          setCanScroll(scrollLeft + clientWidth < scrollWidth - 10);
        }
      }, 400);
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1 scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
        onScroll={() => {
          if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScroll(scrollLeft + clientWidth < scrollWidth - 10);
          }
        }}
      >
        {product.offers.map((offer, si) => (
          <OfferCard
            key={si}
            offer={offer}
            isHovered={hoveredIdx === si}
            onHover={() => setHoveredIdx(si)}
            onLeave={() => setHoveredIdx(null)}
            onClick={() => onOfferClick({ ...offer, pn: product.pn, desc: product.desc })}
          />
        ))}
      </div>

      {/* Кнопка прокрутки */}
      {canScroll && (
        <button
          onClick={scroll}
          className="absolute right-0 top-0 h-full w-14 flex items-center justify-end pr-2 rounded-r-xl"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(11,18,40,0.92) 60%)',
          }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full glass border border-white/15 text-neon-cyan shadow-[0_0_12px_rgba(0,212,255,0.3)]">
            <Icon name="ChevronRight" size={16} />
          </div>
        </button>
      )}
    </div>
  );
}

/* ─── Главный компонент ─── */
const Index = () => {
  const [activeStatuses, setActiveStatuses] = useState<string[]>(['Новый']);
  const [activeUrgency,  setActiveUrgency]  = useState<string[]>([]);
  const [darkMode,       setDarkMode]       = useState(true);
  const [modalOffer, setModalOffer] = useState<(Offer & { pn: string; desc: string }) | null>(null);

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const currentStatus  = 'Новый';
  const currentUrgency = 'Срочно';
  const sm = statusMeta[currentStatus];

  const toggleTheme = () => {
    setDarkMode((d) => {
      document.documentElement.classList.toggle('dark', !d);
      return !d;
    });
  };

  /* Расчёт для модала */
  const modalDelivery = modalOffer ? calcDelivery(modalOffer.price, modalOffer.currency) : null;

  return (
    <div className="min-h-screen bg-background grid-bg text-foreground font-sans relative overflow-x-hidden">
      <div className="pointer-events-none absolute top-[-20%] left-[10%] h-[500px] w-[500px] rounded-full bg-neon-cyan/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-[20%] right-[5%] h-[400px] w-[400px] rounded-full bg-neon-purple/10 blur-[140px]" />

      {/* ═══ HEADER ═══ */}
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

          <div className="flex items-center gap-2">
            {/* Чат */}
            <button className="relative flex h-10 w-10 items-center justify-center rounded-lg glass glass-hover" title="Сообщения">
              <Icon name="MessageSquare" size={18} className="text-muted-foreground" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">3</span>
            </button>
            {/* Список КП */}
            <button className="flex h-10 w-10 items-center justify-center rounded-lg glass glass-hover" title="Коммерческие предложения">
              <Icon name="ClipboardList" size={18} className="text-muted-foreground" />
            </button>
            {/* Переключение темы */}
            <button onClick={toggleTheme} className="flex h-10 w-10 items-center justify-center rounded-lg glass glass-hover" title="Сменить тему">
              <Icon name={darkMode ? 'Sun' : 'Moon'} size={18} className="text-muted-foreground" />
            </button>
            {/* Настройки */}
            <button className="flex h-10 w-10 items-center justify-center rounded-lg glass glass-hover" title="Настройки">
              <Icon name="Settings" size={18} className="text-muted-foreground" />
            </button>
            {/* Администратор */}
            <button className="flex h-10 w-10 items-center justify-center rounded-lg glass glass-hover" title="Администрирование пользователей">
              <Icon name="ShieldCheck" size={18} className="text-muted-foreground" />
            </button>

            <div className="ml-2 flex items-center gap-3 rounded-lg glass px-3 py-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple text-sm font-bold text-background">АМ</div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Алексей М.</p>
                <p className="text-[11px] text-neon-cyan">Менеджер</p>
              </div>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/15 text-destructive transition-colors hover:bg-destructive/25" title="Выход">
              <Icon name="LogOut" size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-8 py-8 relative z-10">
        {/* ═══ STATS ═══ */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-5 mb-8">
          {stats.map((s, i) => (
            <div key={s.label} className="glass glass-hover rounded-2xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
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
                <div key={c.pair} className="flex items-center justify-between gap-1">
                  <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">{c.pair}</span>
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

        {/* ═══ FILTERS ═══ */}
        <section className="glass rounded-2xl p-4 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-neon-cyan px-4 py-2.5 text-sm font-semibold text-background animate-pulse-glow transition-transform hover:scale-105">
              <Icon name="Plus" size={18} />Добавить запрос
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-neon-purple px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]">
              <Icon name="FileSpreadsheet" size={18} />Создать КП
            </button>

            <div className="flex rounded-xl glass p-1">
              {statusFilters.map((st) => (
                <button
                  key={st}
                  onClick={() => toggle(activeStatuses, setActiveStatuses, st)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${activeStatuses.includes(st) ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-muted-foreground hover:text-foreground'}`}
                >{st}</button>
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
                  {u === 'Срочно' && <Icon name="Zap" size={13} />}{u}
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
              <input placeholder="Поиск по запросам, партномерам..." className="w-72 rounded-xl glass py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-neon-cyan" />
            </div>
          </div>
        </section>

        {/* ═══ REQUEST MATRIX ═══ */}
        <section className="glass rounded-2xl overflow-hidden mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '500ms' }}>

          {/* ── Шапка запроса ── */}
          {/* Urgency bar: full-width strip behind everything */}
          <div
            className="relative flex items-stretch overflow-hidden rounded-t-2xl"
            style={{
              background: currentUrgency === 'Срочно'
                ? 'rgba(255,77,109,0.18)'
                : 'rgba(0,212,255,0.07)',
              minHeight: '52px',
            }}
          >
            {/* Левая часть: данные запроса */}
            <div className="flex flex-1 items-center gap-5 px-6 py-3 min-w-0">
              <span className="font-mono text-base font-bold text-neon-cyan whitespace-nowrap">REQ-2048</span>
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">ООО «ТехноПром»</span>
              <span className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                <Icon name="User" size={12} />Алексей М.
              </span>
              <span className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                <Icon name="Calendar" size={12} />23.06.2026
              </span>
              <span className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                <Icon name="Package" size={12} />3 позиции
              </span>
            </div>

            {/* Статусная секция — скошена с левой стороны через skew */}
            <div
              className="relative flex items-center shrink-0"
              style={{ marginLeft: '-20px' }}
            >
              {/* Скошенный фон */}
              <div
                className="absolute inset-0"
                style={{
                  background: sm.bg,
                  transform: 'skewX(-12deg)',
                  transformOrigin: 'bottom left',
                  borderLeft: '2px solid rgba(255,255,255,0.28)',
                }}
              />
              {/* Контент (не скошен — только фон) */}
              <div className="relative flex items-center gap-3 pl-8 pr-5 py-3">
                <span className="font-mono text-lg font-extrabold tracking-widest whitespace-nowrap" style={{ color: sm.color }}>
                  {sm.label}
                </span>

                {/* Иконки менеджера */}
                <div className="flex items-center gap-0.5 pl-2 border-l border-white/15">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 transition-colors" title="Чат по запросу">
                    <Icon name="MessageSquare" size={15} className="text-neon-cyan" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 transition-colors" title="Файлы к запросу">
                    <Icon name="Download" size={15} className="text-foreground/60" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 transition-colors" title="Создать сделку в Битрикс">
                    <Icon name="Handshake" size={15} className="text-neon-purple" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 transition-colors" title="Создать задачу на закупку в Битрикс">
                    <Icon name="ListChecks" size={15} className="text-[#FFB020]" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Товары и предложения ── */}
          <div className="p-5 space-y-5">
            {products.map((p) => (
              <div key={p.pn} className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 items-start">

                {/* Карточка товара */}
                <div className="glass rounded-xl p-3 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono text-base font-extrabold text-neon-cyan leading-tight">{p.pn}</p>
                    <span className="shrink-0 rounded bg-secondary px-2 py-0.5 font-mono text-xs font-bold text-foreground">
                      ×{p.qty}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-foreground/80 leading-snug">{p.desc}</p>
                  {p.managerComment && (
                    <p className="mt-2 border-t border-white/6 pt-2 text-[11px] text-neon-cyan/80 leading-snug">
                      <Icon name="MessageSquare" size={11} className="inline mr-1 -mt-0.5" />{p.managerComment}
                    </p>
                  )}
                </div>

                {/* Ряд предложений */}
                <OffersRow product={p} onOfferClick={setModalOffer} />
              </div>
            ))}
          </div>
        </section>

        {/* ═══ PAGINATION ═══ */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Показывать по</span>
            <select className="rounded-lg glass px-2 py-1 text-foreground focus:outline-none">
              <option>10</option><option>20</option><option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg glass glass-hover text-muted-foreground">
              <Icon name="ChevronLeft" size={16} />
            </button>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={`flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm transition-all ${n === 1 ? 'bg-neon-cyan text-background font-bold' : 'glass glass-hover text-muted-foreground'}`}>
                {n}
              </button>
            ))}
            <button className="flex h-9 w-9 items-center justify-center rounded-lg glass glass-hover text-muted-foreground">
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      </main>

      {/* ═══ OFFER MODAL ═══ */}
      {modalOffer && modalDelivery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setModalOffer(null)}>
          <div className="glass glitch-border w-full max-w-md rounded-2xl p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>

            {/* Заголовок */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon-purple/20 font-mono text-lg font-bold text-neon-purple">
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

            {/* Товар */}
            <div className="rounded-xl bg-secondary/40 p-3 mb-4">
              <p className="font-mono text-sm font-bold text-neon-cyan">{modalOffer.pn}</p>
              <p className="text-xs text-foreground/80">{modalOffer.desc}</p>
            </div>

            {/* Цена + доставка */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="glass rounded-xl p-3 text-center col-span-1">
                <p className="text-[10px] text-muted-foreground">Цена</p>
                <p className="font-mono text-lg font-bold" style={{ color: CUR_COLOR[modalOffer.currency] }}>
                  {fmtPrice(modalOffer.price, modalOffer.currency)}
                </p>
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

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="glass rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1 text-[10px] text-muted-foreground">
                  <Icon name="Truck" size={12} className="text-neon-cyan" />Наземная (+30%)
                </div>
                <p className="font-mono text-sm font-bold text-foreground">{fmtRub(modalDelivery.truck)}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1 text-[10px] text-muted-foreground">
                  <Icon name="Plane" size={12} className="text-neon-purple" />Авиа (+20%)
                </div>
                <p className="font-mono text-sm font-bold text-foreground">{fmtRub(modalDelivery.plane)}</p>
              </div>
            </div>

            {/* Комментарий */}
            {modalOffer.comment && (
              <div className="mb-4">
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-neon-cyan">
                  <Icon name="MessageSquareText" size={14} />Комментарий поставщика
                </p>
                <p className="rounded-xl bg-secondary/40 p-3 text-sm leading-relaxed text-foreground/90">{modalOffer.comment}</p>
              </div>
            )}

            {/* Файл */}
            {modalOffer.file && (
              <a className="flex items-center justify-between rounded-xl glass glass-hover p-3 cursor-pointer mb-4">
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <Icon name="FileText" size={18} className="text-neon-purple" />{modalOffer.file}
                </span>
                <Icon name="Download" size={16} className="text-neon-cyan" />
              </a>
            )}

            {/* Кнопки */}
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