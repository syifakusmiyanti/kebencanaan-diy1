import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  ArrowLeft,
  Mountain,
  Waves,
  CloudRain,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src="/bpbd-logo.png" alt="BPBD DIY Logo" className="w-8 h-8 rounded-full" />
            </div>
            <div>
              <h1 className="font-display text-xl tracking-wider">BPBD DIY</h1>
              <p className="text-xs text-muted-foreground">WebGIS Kebencanaan</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">Beranda</Link>
            <Link to="/peta" className="text-foreground/80 hover:text-primary transition-colors">Peta</Link>
            <Link to="/ews" className="text-foreground/80 hover:text-primary transition-colors">Early Warning</Link>
            <Link to="/analisis" className="text-primary font-medium">Analisis</Link>
            <Link to="/data" className="text-foreground/80 hover:text-primary transition-colors">Data</Link>
          </div>

          <Link to="/">
            <Button variant="glass" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

// Sample data
const monthlyData = [
  { name: 'Jan', gempa: 12, banjir: 5, longsor: 3, erupsi: 0 },
  { name: 'Feb', gempa: 8, banjir: 15, longsor: 7, erupsi: 1 },
  { name: 'Mar', gempa: 15, banjir: 20, longsor: 12, erupsi: 0 },
  { name: 'Apr', gempa: 10, banjir: 8, longsor: 5, erupsi: 0 },
  { name: 'Mei', gempa: 7, banjir: 3, longsor: 2, erupsi: 0 },
  { name: 'Jun', gempa: 5, banjir: 2, longsor: 1, erupsi: 0 },
  { name: 'Jul', gempa: 9, banjir: 1, longsor: 1, erupsi: 0 },
  { name: 'Agu', gempa: 6, banjir: 0, longsor: 0, erupsi: 0 },
  { name: 'Sep', gempa: 11, banjir: 2, longsor: 3, erupsi: 1 },
  { name: 'Okt', gempa: 14, banjir: 8, longsor: 6, erupsi: 0 },
  { name: 'Nov', gempa: 18, banjir: 25, longsor: 15, erupsi: 0 },
  { name: 'Des', gempa: 10, banjir: 18, longsor: 10, erupsi: 0 },
];

const disasterByRegion = [
  { name: 'Sleman', value: 45 },
  { name: 'Bantul', value: 30 },
  { name: 'Gunungkidul', value: 25 },
  { name: 'Kulon Progo', value: 20 },
  { name: 'Kota Yogya', value: 15 },
];

const COLORS = ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];

const riskAnalysis = [
  {
    type: 'Gempa Bumi',
    icon: <Activity className="w-6 h-6" />,
    risk: 'Sedang',
    trend: 'stable',
    incidents: 125,
    prevention: [
      'Penguatan struktur bangunan',
      'Simulasi evakuasi berkala',
      'Pemasangan sensor seismik',
      'Edukasi masyarakat'
    ]
  },
  {
    type: 'Banjir',
    icon: <Waves className="w-6 h-6" />,
    risk: 'Tinggi',
    trend: 'up',
    incidents: 107,
    prevention: [
      'Normalisasi sungai',
      'Pembuatan drainase',
      'Pemantauan curah hujan',
      'Relokasi pemukiman bantaran'
    ]
  },
  {
    type: 'Tanah Longsor',
    icon: <CloudRain className="w-6 h-6" />,
    risk: 'Tinggi',
    trend: 'up',
    incidents: 65,
    prevention: [
      'Terasering lereng',
      'Penanaman vegetasi',
      'Pembuatan talud',
      'Pemasangan EWS'
    ]
  },
  {
    type: 'Gunung Meletus',
    icon: <Mountain className="w-6 h-6" />,
    risk: 'Waspada',
    trend: 'stable',
    incidents: 2,
    prevention: [
      'Pemantauan aktivitas vulkanik',
      'Pemetaan zona bahaya',
      'Jalur evakuasi',
      'Posko pengungsian'
    ]
  },
];

const Analisis = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-6xl mb-4">
              <span className="gradient-text">ANALISIS</span>
              <br />
              <span className="text-foreground">KEBENCANAAN</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Data statistik dan analisis pencegahan bencana di Daerah Istimewa Yogyakarta
            </p>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Total Kejadian', value: '299', icon: <AlertTriangle className="w-5 h-5" />, color: 'primary' },
              { label: 'Area Rawan', value: '87', icon: <Mountain className="w-5 h-5" />, color: 'warning' },
              { label: 'Desa Tangguh', value: '156', icon: <CheckCircle className="w-5 h-5" />, color: 'success' },
              { label: 'Relawan Aktif', value: '2.4K', icon: <Shield className="w-5 h-5" />, color: 'accent' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-4">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}/20 flex items-center justify-center mb-3 text-${stat.color}`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-display">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trend */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="font-display text-xl mb-4">TREN BULANAN 2024</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorGempa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBanjir" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorLongsor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area type="monotone" dataKey="gempa" stroke="#eab308" fill="url(#colorGempa)" strokeWidth={2} />
                    <Area type="monotone" dataKey="banjir" stroke="#3b82f6" fill="url(#colorBanjir)" strokeWidth={2} />
                    <Area type="monotone" dataKey="longsor" stroke="#22c55e" fill="url(#colorLongsor)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-6 mt-4 justify-center text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500" /> Gempa</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /> Banjir</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /> Longsor</div>
              </div>
            </motion.div>

            {/* By Region */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="font-display text-xl mb-4">KEJADIAN PER KABUPATEN</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={disasterByRegion} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {disasterByRegion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Risk Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-display text-2xl mb-6">ANALISIS RISIKO & PENCEGAHAN</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {riskAnalysis.map((item, index) => (
                <motion.div
                  key={item.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="glass-card-hover p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.risk === 'Tinggi' ? 'bg-danger/20 text-danger' :
                        item.risk === 'Waspada' ? 'bg-warning/20 text-warning' :
                          'bg-primary/20 text-primary'
                      }`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.type}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${item.risk === 'Tinggi' ? 'bg-danger/20 text-danger' :
                            item.risk === 'Waspada' ? 'bg-warning/20 text-warning' :
                              'bg-primary/20 text-primary'
                          }`}>
                          Risiko: {item.risk}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {item.trend === 'up' ? <TrendingUp className="w-3 h-3 text-danger" /> :
                            item.trend === 'down' ? <TrendingDown className="w-3 h-3 text-success" /> :
                              <Activity className="w-3 h-3 text-muted-foreground" />}
                          {item.incidents} kejadian
                        </span>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm font-medium mb-2 text-primary">Langkah Pencegahan:</h4>
                  <ul className="space-y-1">
                    {item.prevention.map((step, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Analisis;
