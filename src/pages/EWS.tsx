import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  ArrowLeft,
  Radio,
  AlertTriangle,
  Mountain,
  Waves,
  CloudRain,
  Activity,
  MapPin,
  Clock,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            <Link to="/ews" className="text-primary font-medium">Early Warning</Link>
            <Link to="/analisis" className="text-foreground/80 hover:text-primary transition-colors">Analisis</Link>
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

const ewsData = [
  {
    id: 1,
    name: 'EWS Merapi - Kaliadem',
    location: 'Kec. Cangkringan, Sleman',
    type: 'Gunung Api',
    icon: <Mountain className="w-6 h-6" />,
    status: 'active',
    lastUpdate: '2 menit lalu',
    level: 'WASPADA',
    levelColor: 'warning',
    description: 'Aktivitas vulkanik normal, pemantauan rutin aktif'
  },
  {
    id: 2,
    name: 'EWS Banjir - Sungai Code',
    location: 'Kota Yogyakarta',
    type: 'Banjir',
    icon: <Waves className="w-6 h-6" />,
    status: 'active',
    lastUpdate: '5 menit lalu',
    level: 'SIAGA',
    levelColor: 'primary',
    description: 'Debit air normal, cuaca cerah'
  },
  {
    id: 3,
    name: 'EWS Longsor - Kulon Progo',
    location: 'Kec. Samigaluh',
    type: 'Tanah Longsor',
    icon: <CloudRain className="w-6 h-6" />,
    status: 'warning',
    lastUpdate: '1 menit lalu',
    level: 'AWAS',
    levelColor: 'danger',
    description: 'Curah hujan tinggi terdeteksi, potensi longsor'
  },
  {
    id: 4,
    name: 'EWS Gempa - Bantul',
    location: 'Kec. Imogiri',
    type: 'Gempa Bumi',
    icon: <Activity className="w-6 h-6" />,
    status: 'active',
    lastUpdate: '10 menit lalu',
    level: 'NORMAL',
    levelColor: 'success',
    description: 'Tidak ada aktivitas seismik signifikan'
  },
  {
    id: 5,
    name: 'EWS Tsunami - Pantai Selatan',
    location: 'Kab. Gunungkidul',
    type: 'Tsunami',
    icon: <Waves className="w-6 h-6" />,
    status: 'active',
    lastUpdate: '3 menit lalu',
    level: 'NORMAL',
    levelColor: 'success',
    description: 'Kondisi laut tenang, tidak ada peringatan'
  },
];

const RadarAnimation = () => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Radar circles */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border border-primary/30"
          style={{
            transform: `scale(${i * 0.25})`,
          }}
        />
      ))}

      {/* Radar sweep */}
      <div className="absolute inset-0 animate-radar">
        <div
          className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--primary)), transparent)',
          }}
        />
      </div>

      {/* Center point */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
        <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/50 animate-ping" />
      </div>

      {/* Blips */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-warning animate-pulse" />
      <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-success animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-danger animate-pulse" />
    </div>
  );
};

const EWS = () => {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary">Pemantauan Real-time</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl mb-4">
              <span className="gradient-text">EARLY WARNING</span>
              <br />
              <span className="text-foreground">SYSTEM</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sistem peringatan dini terintegrasi untuk pemantauan potensi bencana di wilayah DIY
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Radar Display */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="glass-card p-8">
                <h2 className="font-display text-xl text-center mb-6 text-primary">RADAR PEMANTAUAN</h2>
                <RadarAnimation />
                <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="w-3 h-3 rounded-full bg-success mx-auto mb-1" />
                    <span className="text-muted-foreground">Normal</span>
                  </div>
                  <div>
                    <div className="w-3 h-3 rounded-full bg-warning mx-auto mb-1" />
                    <span className="text-muted-foreground">Waspada</span>
                  </div>
                  <div>
                    <div className="w-3 h-3 rounded-full bg-danger mx-auto mb-1" />
                    <span className="text-muted-foreground">Bahaya</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glass-card p-6 mt-6">
                <h3 className="font-display text-lg mb-4">STATISTIK</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Sensor</span>
                    <span className="font-display text-2xl text-primary">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Aktif</span>
                    <span className="font-display text-2xl text-success">22</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Peringatan</span>
                    <span className="font-display text-2xl text-warning">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Offline</span>
                    <span className="font-display text-2xl text-muted-foreground">1</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* EWS List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="space-y-4">
                {ewsData.map((ews, index) => (
                  <motion.div
                    key={ews.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="glass-card-hover p-6"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${ews.levelColor === 'danger' ? 'bg-danger/20 text-danger' :
                          ews.levelColor === 'warning' ? 'bg-warning/20 text-warning' :
                            ews.levelColor === 'primary' ? 'bg-primary/20 text-primary' :
                              'bg-success/20 text-success'
                        }`}>
                        {ews.icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{ews.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {ews.location}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${ews.levelColor === 'danger' ? 'bg-danger/20 text-danger' :
                              ews.levelColor === 'warning' ? 'bg-warning/20 text-warning' :
                                ews.levelColor === 'primary' ? 'bg-primary/20 text-primary' :
                                  'bg-success/20 text-success'
                            }`}>
                            {ews.level}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{ews.description}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {ews.lastUpdate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Radio className="w-3 h-3" />
                            {ews.type}
                          </div>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="relative">
                        <div className={`w-3 h-3 rounded-full ${ews.status === 'warning' ? 'bg-warning' : 'bg-success'
                          }`} />
                        {ews.status === 'warning' && (
                          <div className="absolute inset-0 w-3 h-3 rounded-full bg-warning animate-ping" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Alert Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <div className="glass-card p-6 border-l-4 border-warning">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-warning" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-warning">Peringatan Aktif</h3>
                  <p className="text-sm text-muted-foreground">
                    1 sensor mendeteksi kondisi waspada di wilayah Kulon Progo. Pantau terus perkembangan cuaca.
                  </p>
                </div>
                <Link to="/peta">
                  <Button variant="warning">Lihat di Peta</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default EWS;
