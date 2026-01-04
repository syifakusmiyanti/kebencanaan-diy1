import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Map, 
  Shield, 
  Users, 
  Radio, 
  TrendingUp,
  ChevronRight,
  Mountain,
  Waves,
  CloudRain,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
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
            <Link to="/analisis" className="text-foreground/80 hover:text-primary transition-colors">Analisis</Link>
            <Link to="/data" className="text-foreground/80 hover:text-primary transition-colors">Data</Link>
            <Link to="/dokumen" className="text-foreground/80 hover:text-primary transition-colors">Dokumen</Link>
          </div>

          <Link to="/peta">
            <Button variant="hero" size="lg">
              <Map className="w-4 h-4" />
              Buka Peta
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary">Sistem Aktif 24/7</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl leading-tight">
              <span className="gradient-text">WEBGIS</span>
              <br />
              <span className="text-foreground">KEBENCANAAN</span>
              <br />
              <span className="text-primary">DIY</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Platform Geographic Information System terintegrasi untuk pemantauan, 
              peringatan dini, dan analisis kebencanaan di Daerah Istimewa Yogyakarta.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/peta">
                <Button variant="hero" size="xl">
                  <Map className="w-5 h-5" />
                  Eksplorasi Peta
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/ews">
                <Button variant="glass" size="xl">
                  <Radio className="w-5 h-5" />
                  Early Warning System
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Floating Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] hidden lg:block"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 glass-card-hover p-6 w-64"
            >
              <Radio className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-display text-3xl text-primary">24</h3>
              <p className="text-muted-foreground">Titik EWS Aktif</p>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/3 left-0 glass-card-hover p-6 w-64"
            >
              <Shield className="w-8 h-8 text-success mb-3" />
              <h3 className="font-display text-3xl text-success">156</h3>
              <p className="text-muted-foreground">Sekolah Tangguh</p>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-10 glass-card-hover p-6 w-64"
            >
              <Users className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-display text-3xl text-accent">5</h3>
              <p className="text-muted-foreground">Stakeholder Pentahelix</p>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-10 glass-card-hover p-6 w-64"
            >
              <AlertTriangle className="w-8 h-8 text-warning mb-3" />
              <h3 className="font-display text-3xl text-warning">4</h3>
              <p className="text-muted-foreground">Jenis Bencana Terpantau</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const DisasterTypesSection = () => {
  const disasters = [
    { icon: <Mountain className="w-8 h-8" />, name: 'Gunung Meletus', description: 'Pemantauan aktivitas vulkanik Gunung Merapi', color: 'from-red-500 to-orange-500' },
    { icon: <Activity className="w-8 h-8" />, name: 'Gempa Bumi', description: 'Deteksi dan analisis gempa tektonik', color: 'from-amber-500 to-yellow-500' },
    { icon: <Waves className="w-8 h-8" />, name: 'Banjir', description: 'Monitoring debit sungai dan curah hujan', color: 'from-blue-500 to-cyan-500' },
    { icon: <CloudRain className="w-8 h-8" />, name: 'Tanah Longsor', description: 'Pemetaan area rawan longsor', color: 'from-emerald-500 to-green-500' },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            <span className="gradient-text">ANALISIS</span> KEBENCANAAN
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sistem terintegrasi untuk pemantauan dan pencegahan berbagai jenis bencana alam di wilayah DIY
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {disasters.map((disaster, index) => (
            <motion.div
              key={disaster.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card-hover p-6 h-full">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${disaster.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                  {disaster.icon}
                </div>
                <h3 className="font-display text-xl mb-2">{disaster.name}</h3>
                <p className="text-muted-foreground text-sm">{disaster.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    { icon: <Map className="w-6 h-6" />, title: 'Peta Interaktif', description: 'Visualisasi data spasial dengan layer kontrol lengkap' },
    { icon: <Radio className="w-6 h-6" />, title: 'Early Warning System', description: 'Sistem peringatan dini real-time dengan notifikasi' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Analisis Data', description: 'Grafik dan statistik kebencanaan terkini' },
    { icon: <Shield className="w-6 h-6" />, title: 'Ketangguhan', description: 'Data sekolah & kecamatan tangguh bencana' },
  ];

  return (
    <section className="py-24 relative bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            FITUR <span className="gradient-text">UNGGULAN</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-hover p-6 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="font-display text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center relative overflow-hidden"
        >
          {/* Glow effects */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/30 rounded-full blur-3xl" />

          <h2 className="font-display text-4xl md:text-5xl mb-4 relative z-10">
            MULAI <span className="gradient-text">EKSPLORASI</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 relative z-10">
            Akses peta interaktif dan data kebencanaan DIY secara real-time
          </p>
          <div className="flex flex-wrap gap-4 justify-center relative z-10">
            <Link to="/peta">
              <Button variant="hero" size="xl">
                <Map className="w-5 h-5" />
                Buka WebGIS
              </Button>
            </Link>
            <Link to="/data">
              <Button variant="glass" size="xl">
                Unduh Data
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-lg">BPBD DIY</h3>
              <p className="text-xs text-muted-foreground">Badan Penanggulangan Bencana Daerah</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 BPBD Daerah Istimewa Yogyakarta. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <DisasterTypesSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
