import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DisasterMap from '@/components/DisasterMap';
import DownloadModal from '@/components/DownloadModal';



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
            <Link to="/peta" className="text-primary font-medium">Peta</Link>
            <Link to="/ews" className="text-foreground/80 hover:text-primary transition-colors">Early Warning</Link>
            <Link to="/analisis" className="text-foreground/80 hover:text-primary transition-colors">Analisis</Link>
            <Link to="/data" className="text-foreground/80 hover:text-primary transition-colors">Data</Link>
            <Link to="/dokumen" className="text-foreground/80 hover:text-primary transition-colors">Dokumen</Link>
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

const Peta = () => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [ewsData, setEwsData] = useState<any[]>([]);

  // Lock scroll on mount, unlock on unmount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Function to handle download button click
  const handleDownloadClick = () => {
    setIsDownloadModalOpen(true);
  };

  // Function to handle data updates from DisasterMap
  const handleDataUpdate = (data: any[]) => {
    setEwsData(data);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Navbar />
      <DisasterMap onDataUpdate={handleDataUpdate} />
      {/* Floating Controls Container */}
      <div className="absolute bottom-16 right-6 z-50">
        <Button
          onClick={handleDownloadClick}
          className="bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg hover:bg-background hover:shadow-xl transition-all duration-200 rounded-full px-4 py-2 text-sm font-medium"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Unduh Data
        </Button>
      </div>
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        ewsData={ewsData}
      />
    </div>
  );
};

export default Peta;
