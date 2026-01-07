import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield, ArrowLeft, FileText, Download, Book, AlertTriangle,
  Users, Building2, CheckCircle, Clock, ExternalLink
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
            <Link to="/analisis" className="text-foreground/80 hover:text-primary transition-colors">Analisis</Link>
            <Link to="/data" className="text-foreground/80 hover:text-primary transition-colors">Data</Link>
            <Link to="/dokumen" className="text-primary font-medium">Dokumen</Link>
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

const documents = [
  {
    id: 1,
    title: 'Rencana Penanggulangan Bencana (RPB) DIY 2024-2029',
    category: 'Perencanaan',
    description: 'Dokumen perencanaan strategis penanggulangan bencana Daerah Istimewa Yogyakarta periode 2024-2029',
    size: '5.2 MB',
    format: 'PDF',
    date: '2024-01-15',
    status: 'published',
  },
  {
    id: 2,
    title: 'Rencana Kontingensi Bencana Gempa Bumi',
    category: 'Kontingensi',
    description: 'Pedoman penanganan darurat bencana gempa bumi di wilayah DIY',
    size: '3.8 MB',
    format: 'PDF',
    date: '2024-02-20',
    status: 'published',
  },
  {
    id: 3,
    title: 'Rencana Kontingensi Erupsi Gunung Merapi',
    category: 'Kontingensi',
    description: 'Protokol evakuasi dan penanganan darurat erupsi Gunung Merapi',
    size: '4.5 MB',
    format: 'PDF',
    date: '2024-03-10',
    status: 'published',
  },
  {
    id: 4,
    title: 'Rencana Kontingensi Banjir dan Tanah Longsor',
    category: 'Kontingensi',
    description: 'Prosedur penanganan bencana banjir dan tanah longsor',
    size: '3.2 MB',
    format: 'PDF',
    date: '2024-01-25',
    status: 'published',
  },
  {
    id: 5,
    title: 'Rencana Kontingensi Tsunami',
    category: 'Kontingensi',
    description: 'Panduan evakuasi dan mitigasi bencana tsunami pantai selatan DIY',
    size: '4.1 MB',
    format: 'PDF',
    date: '2024-04-05',
    status: 'published',
  },
  {
    id: 6,
    title: 'SOP Aktivasi Posko Tanggap Darurat',
    category: 'SOP',
    description: 'Standar operasional prosedur aktivasi dan pengelolaan posko tanggap darurat',
    size: '1.8 MB',
    format: 'PDF',
    date: '2024-02-15',
    status: 'published',
  },
  {
    id: 7,
    title: 'Pedoman Sekolah Tangguh Bencana',
    category: 'Pedoman',
    description: 'Panduan pembentukan dan pengelolaan sekolah tangguh bencana',
    size: '2.5 MB',
    format: 'PDF',
    date: '2024-03-20',
    status: 'published',
  },
  {
    id: 8,
    title: 'Pedoman Desa/Kelurahan Tangguh Bencana',
    category: 'Pedoman',
    description: 'Panduan pembentukan dan pengelolaan desa/kelurahan tangguh bencana',
    size: '2.8 MB',
    format: 'PDF',
    date: '2024-03-25',
    status: 'published',
  },
  {
    id: 9,
    title: 'Kajian Risiko Bencana DIY 2024',
    category: 'Kajian',
    description: 'Hasil kajian risiko bencana terkini untuk wilayah Daerah Istimewa Yogyakarta',
    size: '8.5 MB',
    format: 'PDF',
    date: '2024-05-10',
    status: 'published',
  },
  {
    id: 10,
    title: 'Peta Evakuasi Bencana DIY',
    category: 'Peta',
    description: 'Kumpulan peta jalur evakuasi untuk berbagai jenis bencana',
    size: '15.2 MB',
    format: 'PDF',
    date: '2024-04-15',
    status: 'published',
  },
];

const categories = [
  { id: 'all', label: 'Semua', icon: FileText },
  { id: 'Perencanaan', label: 'Perencanaan', icon: Book },
  { id: 'Kontingensi', label: 'Kontingensi', icon: AlertTriangle },
  { id: 'SOP', label: 'SOP', icon: CheckCircle },
  { id: 'Pedoman', label: 'Pedoman', icon: Users },
  { id: 'Kajian', label: 'Kajian', icon: Building2 },
];

const Dokumen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (doc: typeof documents[0]) => {
    toast.success(`Mengunduh ${doc.title}...`);
  };

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
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Dokumen Kesiapsiagaan</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl mb-4">
              <span className="gradient-text">DOKUMEN</span> KESIAPSIAGAAN
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Akses dokumen perencanaan, rencana kontingensi, dan pedoman kesiapsiagaan
              bencana untuk wilayah Daerah Istimewa Yogyakarta
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="glass-card p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari dokumen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${selectedCategory === cat.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/50 hover:bg-secondary text-foreground'
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="glass-card p-4 text-center">
              <p className="font-display text-2xl text-primary">{documents.length}</p>
              <p className="text-xs text-muted-foreground">Total Dokumen</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="font-display text-2xl text-warning">5</p>
              <p className="text-xs text-muted-foreground">Rencana Kontingensi</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="font-display text-2xl text-success">2</p>
              <p className="text-xs text-muted-foreground">Pedoman</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="font-display text-2xl text-accent">2024</p>
              <p className="text-xs text-muted-foreground">Update Terakhir</p>
            </div>
          </motion.div>

          {/* Document List */}
          <div className="space-y-4">
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="glass-card-hover p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-lg mb-1">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <span className="px-2 py-1 rounded-full bg-primary/20 text-primary">
                            {doc.category}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <FileText className="w-3 h-3" />
                            {doc.format}
                          </span>
                          <span className="text-muted-foreground">{doc.size}</span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(doc.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="glass"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="w-4 h-4" />
                          Unduh
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredDocuments.length === 0 && (
            <div className="glass-card p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Tidak ada dokumen yang ditemukan</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Need to add useState import
import { useState } from 'react';

export default Dokumen;
