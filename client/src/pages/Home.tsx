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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover opacity-30"
          style={{ objectPosition: 'center' }}
        >
          <source src="/25023-347958030_large.mp4" type="video/mp4" />
        </video>
        <div className="fixed inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
        <div className="text-center relative z-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-white">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover opacity-30"
          style={{ objectPosition: 'center' }}
        >
          <source src="/25023-347958030_large.mp4" type="video/mp4" />
        </video>
        <div className="fixed inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
        <Card className="w-full max-w-md bg-black/60 backdrop-blur-md border border-white/10 relative z-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              Erro ao carregar dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Não foi possível carregar os dados do dashboard. Tente recarregar a página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Video Background - Full Screen */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-30"
        style={{ objectPosition: 'center' }}
      >
        <source src="/25023-347958030_large.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
      <div className="animated-bg"></div>
      <div className="animated-bg-secondary"></div>
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-transparent backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold text-white tracking-tight">TechHelp Dashboard</h1>
                <p className="text-gray-400 mt-2 text-sm">Indicadores de Desempenho da Equipe de Suporte Técnico</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total de Chamados Abertos */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 fade-in hover:scale-[1.02] hover:border-rose-500/50 transition-all" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-300">Chamados Abertos</h3>
                <AlertCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-1">{data.total_abertos}</div>
              <p className="text-xs text-gray-400">Em processamento</p>
            </div>

            {/* Total de Chamados Encerrados */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 fade-in hover:scale-[1.02] hover:border-orange-500/50 transition-all" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-300">Chamados Encerrados</h3>
                <CheckCircle2 className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-1">{data.total_encerrados}</div>
              <p className="text-xs text-gray-400">{((data.total_encerrados / data.total_abertos) * 100).toFixed(1)}% de resolução</p>
            </div>

            {/* Tempo Médio de Resolução */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 fade-in hover:scale-[1.02] hover:border-amber-500/50 transition-all" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-300">Tempo Médio</h3>
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-1">{data.tempo_medio_resolucao_horas.toFixed(1)}h</div>
              <p className="text-xs text-gray-400">Até resolução</p>
            </div>

            {/* Satisfação Média */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 fade-in hover:scale-[1.02] hover:border-pink-500/50 transition-all" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-300">Satisfação</h3>
                <TrendingUp className="w-5 h-5 text-pink-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-1">{data.satisfacao_media.toFixed(1)}/5</div>
              <p className="text-xs text-gray-400">Avaliação média</p>
            </div>
          </div>

          {/* Técnico Mais Produtivo */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-8 mb-12 fade-in hover:border-red-500/50 transition-all" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Técnico Mais Produtivo</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl font-bold text-white mb-2">{data.tecnico_mais_produtivo.Tecnico}</p>
                <p className="text-xs text-gray-400">{data.tecnico_mais_produtivo.Chamados_Encerrados} chamados encerrados</p>
              </div>
              <div className="text-7xl font-bold text-white/10">{data.tecnico_mais_produtivo.Chamados_Encerrados}</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Categorias Mais Recorrentes */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-7 fade-in hover:border-rose-500/50 transition-all" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-rose-400" />
                <h3 className="text-xl font-bold text-white">Categorias Mais Recorrentes</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4">Top 5 motivos de chamados</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.categorias_recorrentes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="Categoria" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="Contagem" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Distribuição de Satisfação */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-7 fade-in hover:border-pink-500/50 transition-all" style={{animationDelay: '0.7s'}}>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-pink-400" />
                <h3 className="text-xl font-bold text-white">Distribuição de Satisfação</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4">Avaliação dos clientes</p>
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
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Taxa de Resolução por Período */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-7 mb-8 fade-in hover:border-orange-500/50 transition-all" style={{animationDelay: '0.8s'}}>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <h3 className="text-xl font-bold text-white">Taxa de Resolução por Período</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">Últimas 12 semanas - Percentual de chamados resolvidos</p>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={resolutionRate}>
                <defs>
                  <linearGradient id="colorTaxa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="Semana" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="Taxa" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorTaxa)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Tempo Médio de Resolução por Categoria */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-7 fade-in hover:border-amber-500/50 transition-all" style={{animationDelay: '0.9s'}}>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Tempo Médio de Resolução por Categoria</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">Análise de eficiência por tipo de problema</p>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={avgTimeByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis type="number" tick={{ fill: '#9ca3af' }} />
                <YAxis dataKey="Categoria" type="category" width={150} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} formatter={(value) => `${value}h`} />
                <Bar dataKey="Tempo_Medio" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
