import { useMemo, useState } from 'react';
import {
  Activity, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Bell, BrainCircuit,
  Building2, CalendarDays, Check, ChevronDown, CircleHelp, FileBarChart,
  FileText, Filter, LayoutDashboard, Menu, Plus, Search, Settings, Sparkles,
  Wallet, X, Clock3, CircleAlert, TrendingUp, Users, Landmark
} from 'lucide-react';
import { isSupabaseConfigured } from './lib/supabase';

const initialEntries = [
  { id: 1, description: 'Honorários contábeis', company: 'Ponto de Encontro Bar e Restaurante', category: 'Serviços', due: '2026-11-10', amount: 1850, type: 'receivable', status: 'pending' },
  { id: 2, description: 'DAS — Simples Nacional', company: 'Borcard Comércio', category: 'Impostos', due: '2026-11-12', amount: 742.36, type: 'payable', status: 'pending' },
  { id: 3, description: 'Honorários contábeis', company: 'Mercado Central Ltda.', category: 'Serviços', due: '2026-11-08', amount: 980, type: 'receivable', status: 'paid' },
  { id: 4, description: 'Energia elétrica', company: 'Ponto de Encontro Bar e Restaurante', category: 'Despesas fixas', due: '2026-11-15', amount: 463.2, type: 'payable', status: 'pending' },
  { id: 5, description: 'Consultoria administrativa', company: 'Borcard Comércio', category: 'Serviços', due: '2026-11-18', amount: 650, type: 'receivable', status: 'pending' },
];

const companies = [
  { name: 'Ponto de Encontro Bar e Restaurante', document: '36.379.732/0001-81', status: 'Ativa', plan: 'Mensal' },
  { name: 'Borcard Comércio', document: 'Cadastro em atualização', status: 'Ativa', plan: 'Mensal' },
  { name: 'Mercado Central Ltda.', document: 'Empresa demonstrativa', status: 'Ativa', plan: 'Mensal' },
];

const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const date = (value) => new Intl.DateTimeFormat('pt-BR').format(new Date(value + 'T12:00:00'));

function App() {
  const [page, setPage] = useState('Visão geral');
  const [entries, setEntries] = useState(initialEntries);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setForm] = useState({ description: '', company: '', category: 'Despesas fixas', due: '2026-11-30', amount: '', type: 'payable' });

  const totals = useMemo(() => {
    const pending = entries.filter((e) => e.status === 'pending');
    return {
      receivable: pending.filter((e) => e.type === 'receivable').reduce((s, e) => s + e.amount, 0),
      payable: pending.filter((e) => e.type === 'payable').reduce((s, e) => s + e.amount, 0),
      paid: entries.filter((e) => e.status === 'paid').reduce((s, e) => s + e.amount, 0),
      overdue: pending.filter((e) => e.due < '2026-11-09').length,
    };
  }, [entries]);

  const visibleEntries = useMemo(() => entries.filter((e) => {
    const matchesQuery = [e.description, e.company, e.category].join(' ').toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' || e.type === filter || e.status === filter;
    return matchesQuery && matchesFilter;
  }), [entries, query, filter]);

  function addEntry(event) {
    event.preventDefault();
    const amount = Number(String(form.amount).replace(',', '.'));
    if (!form.description.trim() || !form.company.trim() || !amount || amount <= 0) return;
    setEntries((current) => [{ ...form, id: Date.now(), amount, status: 'pending' }, ...current]);
    setShowForm(false);
    setForm({ description: '', company: '', category: 'Despesas fixas', due: '2026-11-30', amount: '', type: 'payable' });
    setPage('Lançamentos');
  }

  function markPaid(id) {
    setEntries((current) => current.map((e) => e.id === id ? { ...e, status: 'paid' } : e));
  }

  const navItems = [
    { label: 'Visão geral', icon: LayoutDashboard },
    { label: 'Lançamentos', icon: ArrowLeftRight },
    { label: 'Empresas', icon: Building2 },
    { label: 'Fluxo de caixa', icon: Activity },
    { label: 'Conciliação', icon: Landmark },
    { label: 'Relatórios', icon: FileBarChart },
    { label: 'Assistente IA', icon: BrainCircuit },
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Wallet size={21} /></div>
          <div><strong>FinControl <span>AI</span></strong><small>GESTÃO INTELIGENTE</small></div>
          <button className="icon-button mobile-close" onClick={() => setMobileMenu(false)} aria-label="Fechar menu"><X size={19} /></button>
        </div>
        <div className="workspace-label">ÁREA ADMINISTRATIVA</div>
        <nav className="main-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${page === label ? 'active' : ''}`} onClick={() => { setPage(label); setMobileMenu(false); }}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === 'Assistente IA' && <span className="nav-new">IA</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><CircleHelp size={18} /><div><strong>Precisa de ajuda?</strong><small>Central de orientação</small></div></div>
          <button className="nav-item"><Settings size={18} /><span>Configurações</span></button>
          <div className="profile"><div className="avatar">J</div><div><strong>Administradora</strong><small>FinControl AI</small></div><ChevronDown size={16} /></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button menu-toggle" onClick={() => setMobileMenu(true)} aria-label="Abrir menu"><Menu size={21} /></button>
            <div className="breadcrumb">FinControl AI <span>/</span> <strong>{page}</strong></div>
          </div>
          <div className="topbar-actions">
            <div className="period-chip"><CalendarDays size={15} /> Novembro 2026 <ChevronDown size={14} /></div>
            <button className="icon-button notification" aria-label="Notificações"><Bell size={19} /><i /></button>
            <div className="avatar top-avatar">J</div>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div><div className="eyebrow">CONTROLE FINANCEIRO • MULTIEMPRESAS</div><h1>{page === 'Visão geral' ? 'Visão geral' : page}</h1><p>Acompanhe a saúde financeira das empresas em um só lugar.</p></div>
            <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={17} /> Novo lançamento</button>
          </div>

          {!isSupabaseConfigured && <div className="demo-banner"><span className="demo-dot" /><div><strong>Ambiente de demonstração</strong><span>Os dados exibidos são exemplos e ficam apenas nesta sessão. Conecte o Supabase para iniciar a persistência real.</span></div></div>}

          {page === 'Visão geral' && <>
            <section className="metrics-grid">
              <Metric title="A receber" value={money(totals.receivable)} note="Lançamentos pendentes" icon={ArrowDownLeft} tone="green" />
              <Metric title="A pagar" value={money(totals.payable)} note="Compromissos em aberto" icon={ArrowUpRight} tone="orange" />
              <Metric title="Total realizado" value={money(totals.paid)} note="Valores marcados como pagos" icon={Check} tone="blue" />
              <Metric title="Vencimentos em atraso" value={String(totals.overdue).padStart(2, '0')} note="Precisam de atenção" icon={Clock3} tone="red" />
            </section>
            <section className="dashboard-grid">
              <div className="panel cash-panel">
                <div className="panel-heading"><div><h2>Resumo financeiro</h2><p>Posição dos lançamentos cadastrados</p></div><span className="subtle-tag">NOV/2026</span></div>
                <div className="balance-row"><div><span>Saldo projetado dos lançamentos</span><strong>{money(totals.receivable - totals.payable)}</strong></div><div className="balance-icon"><TrendingUp size={21} /></div></div>
                <div className="bar-legend"><span><i className="legend-green" /> A receber</span><span><i className="legend-orange" /> A pagar</span></div>
                <div className="comparison-bars"><div className="bar-track"><div className="bar-fill green-fill" style={{ width: `${Math.max(8, totals.receivable / Math.max(totals.receivable, totals.payable, 1) * 100)}%` }} /></div><div className="bar-track"><div className="bar-fill orange-fill" style={{ width: `${Math.max(8, totals.payable / Math.max(totals.receivable, totals.payable, 1) * 100)}%` }} /></div></div>
                <div className="cash-foot"><span>Valores em reais (R$)</span><span>Atualizado nesta sessão</span></div>
              </div>
              <div className="panel attention-panel">
                <div className="panel-heading"><div><h2>Pontos de atenção</h2><p>O que merece acompanhamento</p></div><CircleAlert size={19} className="attention-icon" /></div>
                <div className="attention-item"><div className="attention-symbol red-symbol"><Clock3 size={17} /></div><div><strong>{totals.overdue} vencimento(s) em atraso</strong><span>Confira os lançamentos com data anterior a hoje.</span></div></div>
                <div className="attention-item"><div className="attention-symbol purple-symbol"><BrainCircuit size={17} /></div><div><strong>Assistente financeiro</strong><span>Em breve: análises e alertas automáticos com IA.</span></div></div>
              </div>
            </section>
            <EntriesPanel entries={visibleEntries.slice(0, 5)} onMarkPaid={markPaid} compact onSeeAll={() => setPage('Lançamentos')} />
            <section className="panel companies-preview"><div className="panel-heading"><div><h2>Empresas acompanhadas</h2><p>Visão consolidada da carteira</p></div><button className="text-button" onClick={() => setPage('Empresas')}>Ver empresas <ArrowUpRight size={15} /></button></div><div className="company-mini-grid">{companies.slice(0, 3).map((c) => <div className="company-mini" key={c.name}><div className="company-icon"><Building2 size={17} /></div><div><strong>{c.name}</strong><span>{c.plan} · {c.status}</span></div><span className="status-pill">Ativa</span></div>)}</div></section>
          </>}

          {page === 'Lançamentos' && <EntriesPanel entries={visibleEntries} onMarkPaid={markPaid} query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} />}
          {page === 'Empresas' && <section className="panel"><div className="panel-heading"><div><h2>Carteira de empresas</h2><p>Empresas vinculadas ao controle administrativo</p></div><button className="secondary-button" onClick={() => alert('O cadastro de empresas será conectado ao banco de dados na próxima etapa.')}><Plus size={16} /> Nova empresa</button></div><div className="table-wrap"><table><thead><tr><th>EMPRESA</th><th>CNPJ / IDENTIFICAÇÃO</th><th>PLANO</th><th>STATUS</th></tr></thead><tbody>{companies.map((c) => <tr key={c.name}><td className="company-cell"><div className="company-icon"><Building2 size={16} /></div><strong>{c.name}</strong></td><td>{c.document}</td><td>{c.plan}</td><td><span className="status-pill">{c.status}</span></td></tr>)}</tbody></table></div></section>}
          {page === 'Fluxo de caixa' && <section className="panel empty-state"><div className="empty-icon"><Activity size={26} /></div><h2>Fluxo de caixa</h2><p>Esta área reunirá entradas, saídas e saldo por período, com visão prevista e realizada. O painel inicial já calcula a posição dos lançamentos de demonstração.</p><button className="secondary-button" onClick={() => setPage('Lançamentos')}>Consultar lançamentos</button></section>}
          {page === 'Conciliação' && <section className="panel empty-state"><div className="empty-icon"><Landmark size={26} /></div><h2>Conciliação bancária</h2><p>Área reservada para importar extratos, comparar movimentações e vincular transações aos lançamentos financeiros.</p><span className="coming-soon">PRÓXIMA ETAPA DO PROJETO</span></section>}
          {page === 'Relatórios' && <section className="panel empty-state"><div className="empty-icon"><FileBarChart size={26} /></div><h2>Relatórios gerenciais</h2><p>Relatórios por empresa, período, categoria, contas pagas, recebidas e pendentes serão organizados nesta área.</p><button className="secondary-button" onClick={() => setPage('Lançamentos')}>Ver base de lançamentos</button></section>}
          {page === 'Assistente IA' && <section className="panel ai-panel"><div className="ai-orb"><Sparkles size={27} /></div><div className="eyebrow">INTELIGÊNCIA FINANCEIRA</div><h2>Seu apoio para decidir melhor.</h2><p>O assistente poderá resumir movimentações, apontar possíveis atrasos, explicar variações e preparar análises por empresa. Nesta versão, a integração de IA ainda não está ativada.</p><div className="ai-capabilities"><span><Check size={15} /> Resumo financeiro</span><span><Check size={15} /> Alertas de vencimento</span><span><Check size={15} /> Análise por empresa</span></div><span className="coming-soon">INTEGRAÇÃO DE IA EM DESENVOLVIMENTO</span></section>}
        </div>
        <footer className="footer"><span>FinControl AI <b>•</b> Gestão financeira administrativa</span><span>Versão inicial 0.1.0</span></footer>
      </main>

      {showForm && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}><form className="entry-modal" onSubmit={addEntry}><div className="modal-heading"><div><span className="eyebrow">CADASTRO FINANCEIRO</span><h2>Novo lançamento</h2></div><button type="button" className="icon-button" onClick={() => setShowForm(false)} aria-label="Fechar"><X size={19} /></button></div><label>Descrição<input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex.: Honorários contábeis" /></label><label>Empresa<input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Nome da empresa" /></label><div className="form-two"><label>Tipo<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="payable">Conta a pagar</option><option value="receivable">Conta a receber</option></select></label><label>Categoria<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Despesas fixas</option><option>Serviços</option><option>Impostos</option><option>Fornecedores</option><option>Outros</option></select></label></div><div className="form-two"><label>Vencimento<input type="date" required value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} /></label><label>Valor (R$)<input required type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0,00" /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancelar</button><button className="primary-button" type="submit"><Plus size={16} /> Salvar lançamento</button></div></form></div>}
    </div>
  );
}

function Metric({ title, value, note, icon: Icon, tone }) {
  return <article className="metric-card"><div className="metric-top"><span>{title}</span><div className={`metric-icon ${tone}`}><Icon size={18} /></div></div><strong className="metric-value">{value}</strong><span className="metric-note">{note}</span></article>;
}

function EntriesPanel({ entries, onMarkPaid, compact = false, onSeeAll, query, setQuery, filter, setFilter }) {
  return <section className="panel entries-panel"><div className="panel-heading"><div><h2>{compact ? 'Lançamentos recentes' : 'Lançamentos financeiros'}</h2><p>{compact ? 'Últimas movimentações cadastradas' : 'Consulte e acompanhe contas a pagar e receber'}</p></div>{compact ? <button className="text-button" onClick={onSeeAll}>Ver todos <ArrowUpRight size={15} /></button> : <span className="subtle-tag">{entries.length} REGISTRO(S)</span>}</div>
    {!compact && <div className="table-toolbar"><div className="search-box"><Search size={16} /><input placeholder="Buscar por descrição, empresa ou categoria..." value={query} onChange={(e) => setQuery(e.target.value)} /></div><div className="filter-box"><Filter size={15} /><select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">Todos</option><option value="payable">A pagar</option><option value="receivable">A receber</option><option value="pending">Pendentes</option><option value="paid">Pagos</option></select></div></div>}
    <div className="table-wrap"><table><thead><tr><th>DESCRIÇÃO</th><th>EMPRESA</th><th>VENCIMENTO</th><th>VALOR</th><th>TIPO</th><th>STATUS</th>{!compact && <th>AÇÃO</th>}</tr></thead><tbody>{entries.length ? entries.map((e) => <tr key={e.id}><td><strong>{e.description}</strong><small className="cell-subtitle">{e.category}</small></td><td>{e.company}</td><td>{date(e.due)}</td><td className="amount-cell">{money(e.amount)}</td><td><span className={`type-pill ${e.type}`}>{e.type === 'payable' ? 'A pagar' : 'A receber'}</span></td><td><span className={`status-pill ${e.status}`}>{e.status === 'paid' ? 'Pago' : 'Pendente'}</span></td>{!compact && <td>{e.status === 'pending' ? <button className="mark-paid" onClick={() => onMarkPaid(e.id)}>Marcar pago</button> : <span className="muted-check"><Check size={15} /> Concluído</span>}</td>}</tr>) : <tr><td colSpan="7" className="no-results">Nenhum lançamento encontrado com esses filtros.</td></tr>}</tbody></table></div>
  </section>;
}

export default App;