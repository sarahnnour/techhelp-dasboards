import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Clock, CheckCircle2, AlertCircle, Activity, Moon, Sun } from 'lucide-react';

interface DashboardData {
  total_abertos: number;
  total_encerrados: number;
  tempo_medio_resolucao_horas: number;
  tecnico_mais_produtivo: { Tecnico: string; Chamados_Encerrados: number };
  categorias_recorrentes: Array<{ Categoria: string; Contagem: number }>;
  satisfacao_media: number;
  satisfacao_distribuicao: Array<{ Satisfacao: string; Contagem: number }>;
}

interface ResolutionRate {
  Semana: string;
  Taxa: number;
}

interface AvgTimeByCategory {
  Categoria: string;
  Tempo_Medio: number;
  Total_Resolvidos: number;
}

const SATISFACTION_COLORS = { 'Ruim': '#ef4444', 'Regular': '#f59e0b', 'Médio': '#eab308', 'Bom': '#10b981', 'Excelente': '#06b6d4' };

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [resolutionRate, setResolutionRate] = useState<ResolutionRate[]>([]);
  const [avgTimeByCategory, setAvgTimeByCategory] = useState<AvgTimeByCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, resolutionRes, avgTimeRes] = await Promise.all([
          fetch('/dashboard-data.json'),
          fetch('/resolution-rate.json'),
          fetch('/avg-time-by-category.json')
        ]);
        
        const dashboardData = await dashboardRes.json();
        const resolutionData = await resolutionRes.json();
        const avgTimeData = await avgTimeRes.json();
        
        if (dashboardData.status === 'success') {
          setData(dashboardData.data);
        }
        
        if (Array.isArray(resolutionData)) {
          setResolutionRate(resolutionData.slice(-12));
        }

        if (Array.isArray(avgTimeData)) {
          setAvgTimeByCategory(avgTimeData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const bgClass = isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const cardBgClass = isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white border-slate-200';
  const cardTextClass = isDark ? 'text-slate-300' : 'text-slate-600';
  const headerBgClass = isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white border-slate-200';

  if (loading) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className={`mt-4 ${cardTextClass}`}>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        <Card className={`w-full max-w-md ${cardBgClass}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              Erro ao carregar dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cardTextClass}>Não foi possível carregar os dados do dashboard. Tente recarregar a página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Header */}
      <div className={`relative overflow-hidden border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200'} ${headerBgClass} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-5xl font-bold ${textClass} tracking-tight`}>TechHelp Dashboard</h1>
              <p className={`${cardTextClass} mt-2 text-lg`}>Indicadores de Desempenho da Equipe de Suporte Técnico</p>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-3 rounded-full transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total de Chamados Abertos */}
          <div className={`group relative ${cardBgClass} rounded-2xl p-7 backdrop-blur-sm hover:border-blue-500/60 transition-all duration-300 hover:shadow-xl ${isDark ? 'hover:shadow-blue-500/20' : 'hover:shadow-blue-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-sm font-semibold ${cardTextClass}`}>Chamados Abertos</h3>
              <AlertCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div className={`text-4xl font-bold ${textClass} mb-2`}>{data.total_abertos}</div>
            <p className={`text-xs ${cardTextClass}`}>Em processamento</p>
          </div>

          {/* Total de Chamados Encerrados */}
          <div className={`group relative ${cardBgClass} rounded-2xl p-7 backdrop-blur-sm hover:border-green-500/60 transition-all duration-300 hover:shadow-xl ${isDark ? 'hover:shadow-green-500/20' : 'hover:shadow-green-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-sm font-semibold ${cardTextClass}`}>Chamados Encerrados</h3>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className={`text-4xl font-bold ${textClass} mb-2`}>{data.total_encerrados}</div>
            <p className={`text-xs ${cardTextClass}`}>{((data.total_encerrados / data.total_abertos) * 100).toFixed(1)}% de resolução</p>
          </div>

          {/* Tempo Médio de Resolução */}
          <div className={`group relative ${cardBgClass} rounded-2xl p-7 backdrop-blur-sm hover:border-amber-500/60 transition-all duration-300 hover:shadow-xl ${isDark ? 'hover:shadow-amber-500/20' : 'hover:shadow-amber-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-sm font-semibold ${cardTextClass}`}>Tempo Médio</h3>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className={`text-4xl font-bold ${textClass} mb-2`}>{data.tempo_medio_resolucao_horas.toFixed(1)}h</div>
            <p className={`text-xs ${cardTextClass}`}>Até resolução</p>
          </div>

          {/* Satisfação Média */}
          <div className={`group relative ${cardBgClass} rounded-2xl p-7 backdrop-blur-sm hover:border-purple-500/60 transition-all duration-300 hover:shadow-xl ${isDark ? 'hover:shadow-purple-500/20' : 'hover:shadow-purple-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-sm font-semibold ${cardTextClass}`}>Satisfação</h3>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className={`text-4xl font-bold ${textClass} mb-2`}>{data.satisfacao_media.toFixed(1)}/5</div>
            <p className={`text-xs ${cardTextClass}`}>Avaliação média</p>
          </div>
        </div>

        {/* Técnico Mais Produtivo - Card Premium */}
        <div className={`mb-12 ${cardBgClass} rounded-2xl p-8 backdrop-blur-sm border-2 border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 hover:shadow-xl ${isDark ? 'hover:shadow-blue-500/20' : 'hover:shadow-blue-200'}`}>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-500" />
            <h2 className={`text-2xl font-bold ${textClass}`}>Técnico Mais Produtivo</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-5xl font-bold ${textClass} mb-2`}>{data.tecnico_mais_produtivo.Tecnico}</p>
              <p className={cardTextClass}>{data.tecnico_mais_produtivo.Chamados_Encerrados} chamados encerrados</p>
            </div>
            <div className={`text-7xl font-bold ${isDark ? 'text-blue-500/20' : 'text-blue-500/10'}`}>{data.tecnico_mais_produtivo.Chamados_Encerrados}</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Categorias Mais Recorrentes */}
          <div className={`${cardBgClass} rounded-2xl p-7 backdrop-blur-sm hover:border-blue-500/60 transition-all duration-300 hover:shadow-xl`}>
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className={`text-xl font-bold ${textClass}`}>Categorias Mais Recorrentes</h3>
            </div>
            <p className={`text-xs ${cardTextClass} mb-4`}>Top 5 motivos de chamados</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.categorias_recorrentes}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="Categoria" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} />
                <YAxis tick={{ fill: isDark ? '#94a3b8' : '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9', border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`, borderRadius: '8px', color: isDark ? '#fff' : '#000' }} />
                <Bar dataKey="Contagem" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Distribuição de Satisfação */}
          <div className={`${cardBgClass} rounded-2xl p-7 backdrop-blur-sm hover:border-pink-500/60 transition-all duration-300 hover:shadow-xl`}>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-pink-500" />
              <h3 className={`text-xl font-bold ${textClass}`}>Distribuição de Satisfação</h3>
            </div>
            <p className={`text-xs ${cardTextClass} mb-4`}>Avaliação dos clientes</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.satisfacao_distribuicao}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ Satisfacao, Contagem }) => `${Satisfacao}: ${Contagem}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="Contagem"
                >
                  {data.satisfacao_distribuicao.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SATISFACTION_COLORS[entry.Satisfacao as keyof typeof SATISFACTION_COLORS] || '#8b5cf6'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9', border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`, borderRadius: '8px', color: isDark ? '#fff' : '#000' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Taxa de Resolução por Período */}
        <div className={`${cardBgClass} rounded-2xl p-7 backdrop-blur-sm hover:border-green-500/60 transition-all duration-300 hover:shadow-xl mb-8`}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className={`text-xl font-bold ${textClass}`}>Taxa de Resolução por Período</h3>
          </div>
          <p className={`text-xs ${cardTextClass} mb-4`}>Últimas 12 semanas - Percentual de chamados resolvidos</p>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={resolutionRate}>
              <defs>
                <linearGradient id="colorTaxa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="Semana" tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} />
              <YAxis tick={{ fill: isDark ? '#94a3b8' : '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9', border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`, borderRadius: '8px', color: isDark ? '#fff' : '#000' }} />
              <Area type="monotone" dataKey="Taxa" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorTaxa)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tempo Médio de Resolução por Categoria - Novo Gráfico */}
        <div className={`${cardBgClass} rounded-2xl p-7 backdrop-blur-sm hover:border-cyan-500/60 transition-all duration-300 hover:shadow-xl`}>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-cyan-500" />
            <h3 className={`text-xl font-bold ${textClass}`}>Tempo Médio de Resolução por Categoria</h3>
          </div>
          <p className={`text-xs ${cardTextClass} mb-4`}>Análise de eficiência por tipo de problema</p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={avgTimeByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
              <XAxis type="number" tick={{ fill: isDark ? '#94a3b8' : '#64748b' }} />
              <YAxis dataKey="Categoria" type="category" width={150} tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9', border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`, borderRadius: '8px', color: isDark ? '#fff' : '#000' }} formatter={(value) => `${value}h`} />
              <Bar dataKey="Tempo_Medio" fill="#06b6d4" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
