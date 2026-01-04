import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft, 
  Download,
  FileJson,
  Map as MapIcon,
  Table,
  Filter,
  Search,
  School,
  Building2,
  Radio,
  Users,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
            <Link to="/data" className="text-primary font-medium">Data</Link>
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

interface DataLayer {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  lastUpdate: string;
  formats: string[];
  color: string;
}

const dataLayers: DataLayer[] = [
  {
    id: 'ews',
    name: 'Early Warning System',
    description: 'Titik lokasi sensor peringatan dini di seluruh DIY',
    icon: <Radio className="w-6 h-6" />,
    count: 24,
    lastUpdate: '2024-01-15',
    formats: ['SHP', 'KML', 'GeoJSON'],
    color: 'danger'
  },
  {
    id: 'sekolah-tangguh',
    name: 'Sekolah Tangguh Bencana',
    description: 'Data sekolah yang telah tersertifikasi tangguh bencana',
    icon: <School className="w-6 h-6" />,
    count: 156,
    lastUpdate: '2024-01-10',
    formats: ['SHP', 'KML', 'GeoJSON', 'CSV'],
    color: 'success'
  },
  {
    id: 'kecamatan-tangguh',
    name: 'Kecamatan Tangguh Bencana',
    description: 'Wilayah kecamatan dengan program ketangguhan bencana',
    icon: <Building2 className="w-6 h-6" />,
    count: 45,
    lastUpdate: '2024-01-12',
    formats: ['SHP', 'KML', 'GeoJSON'],
    color: 'primary'
  },
  {
    id: 'pentahelix',
    name: 'Stakeholder Pentahelix',
    description: 'Lokasi dan data stakeholder pentahelix kebencanaan',
    icon: <Users className="w-6 h-6" />,
    count: 89,
    lastUpdate: '2024-01-14',
    formats: ['SHP', 'KML', 'CSV'],
    color: 'accent'
  },
];

const Data = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  const handleDownload = (layerName: string, format: string) => {
    toast.success(`Mengunduh ${layerName} dalam format ${format}...`, {
      description: 'File akan segera tersedia untuk diunduh.',
    });
  };

  const filteredLayers = dataLayers.filter(layer =>
    layer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    layer.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <span className="gradient-text">UNDUH</span>
              <br />
              <span className="text-foreground">DATA SPASIAL</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Akses dan unduh data vektor kebencanaan DIY dalam berbagai format
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari dataset..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div className="flex gap-2">
                {['SHP', 'KML', 'GeoJSON', 'CSV'].map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(selectedFormat === format ? null : format)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedFormat === format 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Format Info Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { format: 'SHP', desc: 'Shapefile - ESRI Format', icon: <MapIcon className="w-5 h-5" /> },
              { format: 'KML', desc: 'Google Earth Format', icon: <MapIcon className="w-5 h-5" /> },
              { format: 'GeoJSON', desc: 'Web Mapping Format', icon: <FileJson className="w-5 h-5" /> },
              { format: 'CSV', desc: 'Tabular Data', icon: <Table className="w-5 h-5" /> },
            ].map((item) => (
              <div key={item.format} className="glass-card p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-2 text-primary">
                  {item.icon}
                </div>
                <p className="font-semibold">{item.format}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Data Layers */}
          <div className="space-y-4">
            {filteredLayers.map((layer, index) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass-card-hover p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Icon & Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                      layer.color === 'danger' ? 'bg-danger/20 text-danger' :
                      layer.color === 'success' ? 'bg-success/20 text-success' :
                      layer.color === 'primary' ? 'bg-primary/20 text-primary' :
                      'bg-accent/20 text-accent'
                    }`}>
                      {layer.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{layer.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{layer.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-success" />
                          {layer.count} data
                        </span>
                        <span>Update: {layer.lastUpdate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Download Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {layer.formats.map((format) => (
                      <Button
                        key={format}
                        variant={selectedFormat === format ? 'hero' : 'glass'}
                        size="sm"
                        onClick={() => handleDownload(layer.name, format)}
                        className={selectedFormat && selectedFormat !== format ? 'opacity-50' : ''}
                      >
                        <Download className="w-4 h-4" />
                        {format}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Download All */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="glass-card p-8 inline-block">
              <h3 className="font-display text-xl mb-4">UNDUH SEMUA DATA</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Unduh seluruh dataset dalam satu paket arsip
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="hero" size="lg" onClick={() => handleDownload('Semua Data', 'SHP')}>
                  <Download className="w-5 h-5" />
                  Download SHP Package
                </Button>
                <Button variant="glass" size="lg" onClick={() => handleDownload('Semua Data', 'KML')}>
                  <Download className="w-5 h-5" />
                  Download KML Package
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Data;
