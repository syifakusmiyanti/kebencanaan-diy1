import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Switch } from '@/components/ui/switch';
import { Shield, Activity, Layers, Info, ChevronDown } from 'lucide-react';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// EWS Types and Colors
const ewsTypeConfig = {
  tsunami: { color: '#0ea5e9', label: 'Tsunami', icon: '🌊' },
  gempabumi: { color: '#eab308', label: 'Gempa Bumi', icon: '📳' },
  banjir: { color: '#3b82f6', label: 'Banjir', icon: '💧' },
  longsor: { color: '#84cc16', label: 'Longsor', icon: '⛰️' },
  awan_panas: { color: '#dc2626', label: 'Awan Panas', icon: '🌋' },
};

interface DisasterMapProps {
  onDataUpdate?: (data: any[]) => void;
}

const DisasterMap = ({ onDataUpdate }: DisasterMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [ewsData, setEwsData] = useState<any[]>([]);

  // Layer groups for each EWS type based on tipe_ews
  const layerEwsTsunami = useRef<L.LayerGroup>(L.layerGroup());
  const layerEwsBanjirLahar = useRef<L.LayerGroup>(L.layerGroup());
  const layerEwsAwanPanas = useRef<L.LayerGroup>(L.layerGroup());

  // Layer for Longsor from GeoServer
  const layerLongsor = useRef<L.TileLayer.WMS | null>(null);

  // State for layer visibility toggles
  const [layerVisibility, setLayerVisibility] = useState({
    tsunami: true,
    banjirLahar: true,
    awanPanas: true,
    longsor: false,
  });

  // State for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch EWS data from API
  useEffect(() => {
    const fetchEwsData = async () => {
      try {
        // The backend server.js provides data at this endpoint
        const response = await fetch('http://localhost:3001/api/ews');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data API berhasil diambil:', data);

        // Map API data to the format expected by the component
        // Display ALL points from database, filter based on tipe_ews later
        const mappedData = data.map((item: any) => {
          console.log('Data API mentah:', item); // Debug: log each item to see available fields
          console.log('tipe_ews:', item.tipe_ews); // Log tipe_ews for debugging

          // Include all items with valid lat/lng coordinates
          if (!isNaN(Number(item.lat)) && !isNaN(Number(item.lon))) {
            return {
              fid: item.fid,
              nama_ews: item.nama_ews,
              lat: Number(item.lat),
              lng: Number(item.lon), // lng HARUS dibuat manual dari lon
              tipe_ews: item.tipe_ews,
              jenis_ews: item.jenis_ews,
              kondisi: item.kondisi,
              alamat: item.alamat,
              pengelola: item.pengelola,
              lon: Number(item.lon),
            };
          }
          console.warn('Skipping invalid EWS data item (missing coordinates):', item);
          return null;
        }).filter((item: any): item is any => item !== null); // Filter out null items

        console.log('Data yang dipetakan untuk ditampilkan:', mappedData);
        setEwsData(mappedData);

        // Pass data to parent component for download functionality
        if (onDataUpdate) {
          onDataUpdate(mappedData);
        }

      } catch (error) {
        console.error('Error fetching EWS data:', error);
      }
    };

    fetchEwsData();
  }, []);

  const createEWSIcon = (type: keyof typeof ewsTypeConfig, status: string) => {
    const config = ewsTypeConfig[type];
    const pulseClass = status === 'warning' ? 'animate-pulse' : '';
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full animate-ping opacity-30" style="background-color: ${config.color}"></div>
          <div class="absolute w-6 h-6 rounded-full animate-pulse opacity-50" style="background-color: ${config.color}"></div>
          <div class="w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs ${pulseClass}" style="background-color: ${config.color}">
            <span style="font-size: 10px">${config.icon}</span>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const map = L.map(mapRef.current).setView([-7.797, 110.370], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add layers to map immediately (controlled by left dashboard checkboxes)
      map.addLayer(layerEwsTsunami.current);
      map.addLayer(layerEwsBanjirLahar.current);
      map.addLayer(layerEwsAwanPanas.current);

      mapInstance.current = map;
      console.log('🗺️ Peta diinisialisasi tanpa layer control Leaflet');
      console.log('✅ mapInstance.current:', mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Handle layer visibility changes
  useEffect(() => {
    if (!mapInstance.current) return;

    if (layerVisibility.tsunami) {
      mapInstance.current.addLayer(layerEwsTsunami.current);
    } else {
      mapInstance.current.removeLayer(layerEwsTsunami.current);
    }

    if (layerVisibility.banjirLahar) {
      mapInstance.current.addLayer(layerEwsBanjirLahar.current);
    } else {
      mapInstance.current.removeLayer(layerEwsBanjirLahar.current);
    }

    if (layerVisibility.awanPanas) {
      mapInstance.current.addLayer(layerEwsAwanPanas.current);
    } else {
      mapInstance.current.removeLayer(layerEwsAwanPanas.current);
    }

    // Handle Longsor WMS layer from GeoServer
    if (layerVisibility.longsor) {
      // Create WMS layer if it doesn't exist
      if (!layerLongsor.current) {
        layerLongsor.current = L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
          layers: 'MAGANG:longsor4',
          format: 'image/png',
          transparent: true,
          version: '1.1.1',
          attribution: 'GeoServer Longsor Layer'
        });
        console.log('🗺️ Layer Longsor WMS dibuat dari GeoServer');
      }
      // Add to map if not already added
      if (!mapInstance.current.hasLayer(layerLongsor.current)) {
        mapInstance.current.addLayer(layerLongsor.current);
        console.log('✅ Layer Longsor ditambahkan ke peta');
      }
    } else {
      // Remove layer if it exists
      if (layerLongsor.current && mapInstance.current.hasLayer(layerLongsor.current)) {
        mapInstance.current.removeLayer(layerLongsor.current);
        console.log('❌ Layer Longsor dihapus dari peta');
      }
    }
  }, [layerVisibility]);

  // Add EWS markers to respective layer groups when data is fetched
  useEffect(() => {
    if (ewsData.length === 0) return;

    // Clear existing markers before adding new ones
    layerEwsTsunami.current.clearLayers();
    layerEwsBanjirLahar.current.clearLayers();
    layerEwsAwanPanas.current.clearLayers();

    const markersCount = { tsunami: 0, banjirLahar: 0, awanPanas: 0 };

    ewsData.forEach((point) => {
      // Validasi koordinat WAJIB pakai aturan ini
      if (!isNaN(Number(point.lat)) && !isNaN(Number(point.lon))) {
        console.log(`✅ Koordinat valid untuk: ${point.nama_ews} (FID: ${point.fid})`);
      } else {
        console.warn(`❌ Koordinat tidak valid untuk: ${point.nama_ews} (FID: ${point.fid})`, point);
        return;
      }

      console.log(`fid: ${point.fid}, lat: ${point.lat}, lon: ${point.lon}, tipe_ews: ${point.tipe_ews}`);
      console.log(`Proses pembuatan marker untuk: ${point.nama_ews} (Tipe: ${point.tipe_ews})`);

      // Determine marker color and icon based on tipe_ews using includes (not ===)
      let markerColor = '#3b82f6'; // default blue
      let markerIcon = '⚠️'; // default warning
      const tipeLower = (point.tipe_ews || '').toLowerCase();
      if (tipeLower.includes('tsunami')) {
        markerColor = '#0ea5e9'; // biru muda
        markerIcon = '🌊';
      } else if (tipeLower.includes('banjir')) {
        markerColor = '#f97316'; // orange
        markerIcon = '💧';
      } else if (tipeLower.includes('awan')) {
        markerColor = '#dc2626'; // merah
        markerIcon = '🌋';
      }

      const marker = L.marker([point.lat, point.lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-8 h-8 rounded-full animate-ping opacity-30" style="background-color: ${markerColor}"></div>
              <div class="absolute w-6 h-6 rounded-full animate-pulse opacity-50" style="background-color: ${markerColor}"></div>
              <div class="w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs" style="background-color: ${markerColor}">
                <span style="font-size: 10px">${markerIcon}</span>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
      });

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold" style="color: ${markerColor}">${point.nama_ews || 'Unknown'}</h3>
          <p class="text-sm">Tipe EWS: ${point.tipe_ews || '-'}</p>
          <p class="text-sm">Jenis EWS: ${point.jenis_ews || '-'}</p>
          <p class="text-sm">Kondisi: ${point.kondisi || '-'}</p>
          <p class="text-sm">Alamat: ${point.alamat || '-'}</p>
          <p class="text-sm">Pengelola: ${point.pengelola || '-'}</p>
          <p class="text-sm">Koordinat: ${point.lat}, ${point.lon}</p>
        </div>
      `);

      // LOGIKA FILTER YANG BENAR (WAJIB):
      // - Jangan gunakan === untuk tipe_ews
      // - Gunakan toLowerCase() + includes()
      // - Filtering HARUS tahan perbedaan huruf & spasi
      console.log('tipe_ews:', point.tipe_ews);

      const tipeLowerFilter = (point.tipe_ews || '').toLowerCase();

      // Jika tipe_ews mengandung kata "tsunami" → layer tsunami
      if (tipeLowerFilter.includes('tsunami')) {
        layerEwsTsunami.current.addLayer(marker);
        markersCount.tsunami++;
        console.log(`✅ Marker ditambahkan ke layer Tsunami: ${point.nama_ews}`);
      }
      // Jika tipe_ews mengandung kata "banjir" → layer banjir lahar
      else if (tipeLowerFilter.includes('banjir')) {
        layerEwsBanjirLahar.current.addLayer(marker);
        markersCount.banjirLahar++;
        console.log(`✅ Marker ditambahkan ke layer Banjir Lahar: ${point.nama_ews}`);
      }
      // Jika tipe_ews mengandung kata "awan" → layer awan panas
      else if (tipeLowerFilter.includes('awan')) {
        layerEwsAwanPanas.current.addLayer(marker);
        markersCount.awanPanas++;
        console.log(`✅ Marker ditambahkan ke layer Awan Panas: ${point.nama_ews}`);
      }
      else {
        console.log(`❌ Tidak ada layer yang cocok untuk tipe_ews: "${point.tipe_ews}"`);
      }
    });

    console.log('Jumlah marker per jenis EWS:', markersCount);

  }, [ewsData]);



  return (
    <div className="relative w-full h-full overflow-hidden" style={{ height: '100%', width: '100%' }}>
      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0 z-0" style={{ height: '100%', width: '100%' }} />

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-200"
      >
        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isSidebarOpen ? 'rotate-90' : '-rotate-90'}`} />
      </button>

      {/* Left Dashboard Sidebar */}
      <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-background/80 backdrop-blur-md border-r border-border/50 z-10 p-6 overflow-y-auto shadow-xl rounded-r-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Header Dashboard */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Dashboard EWS</h2>
              <p className="text-xs text-muted-foreground">Early Warning System Monitoring</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
        </div>

        {/* Section: Layer EWS */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Layer EWS</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                <span className="text-sm font-medium text-foreground">EWS Tsunami</span>
              </div>
              <Switch
                checked={layerVisibility.tsunami}
                onCheckedChange={(checked) => setLayerVisibility(prev => ({ ...prev, tsunami: checked }))}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-foreground">EWS Banjir Lahar</span>
              </div>
              <Switch
                checked={layerVisibility.banjirLahar}
                onCheckedChange={(checked) => setLayerVisibility(prev => ({ ...prev, banjirLahar: checked }))}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-foreground">EWS Awan Panas</span>
              </div>
              <Switch
                checked={layerVisibility.awanPanas}
                onCheckedChange={(checked) => setLayerVisibility(prev => ({ ...prev, awanPanas: checked }))}
              />
            </div>
          </div>
        </div>

        {/* Section: Bencana Lainnya */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Bencana Lainnya</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-accent/5 bg-card/50 border-border/50">
              <span className="text-sm font-medium text-foreground">Gempa Bumi</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-accent/5 bg-card/50 border-border/50">
              <span className="text-sm font-medium text-foreground">Banjir</span>
            </div>
            <div
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-accent/5 ${layerVisibility.longsor
                ? 'bg-accent/10 border-primary ring-1 ring-primary/20'
                : 'bg-card/50 border-border/50'
                }`}
              onClick={() => setLayerVisibility(prev => ({ ...prev, longsor: !prev.longsor }))}
            >
              <span className="text-sm font-medium text-foreground">Longsor</span>
            </div>
          </div>
        </div>

        {/* Section: Titik Penting */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Titik Penting</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
              <span className="text-sm font-medium text-foreground">SPAB</span>
              <span className="px-2 py-1 rounded text-xs bg-green-500 text-green-50">Aktif</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
              <span className="text-sm font-medium text-foreground">Kaltana</span>
              <span className="px-2 py-1 rounded text-xs bg-blue-500 text-blue-50">Aktif</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
              <span className="text-sm font-medium text-foreground">Pentahelix</span>
              <span className="px-2 py-1 rounded text-xs bg-green-500 text-green-50">Aktif</span>
            </div>
          </div>
        </div>
      </div>



      {/* Top Right EWS Warning */}
      <div className="absolute top-24 right-4 bg-danger text-danger-foreground p-3 rounded-lg shadow-lg z-10 max-w-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-danger-foreground rounded-full animate-pulse"></div>
          <span className="font-semibold text-sm">PERINGATAN EWS</span>
        </div>
        <p className="text-xs mt-1">Sistem Early Warning aktif. Pantau kondisi terkini.</p>
      </div>

      {/* CSS fix for Leaflet control overlap */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .leaflet-top {
            margin-top: 80px !important;
          }
        `
      }} />
    </div>
  );
};

export default DisasterMap;