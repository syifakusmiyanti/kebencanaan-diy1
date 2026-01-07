import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, AlertTriangle, School, Building2, Users, Radio, Download, X,
  ChevronDown, ChevronUp, Mountain, Waves, Activity, CloudRain, Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  earthquake: { color: '#eab308', label: 'Gempa Bumi', icon: '📳' },
  flood: { color: '#3b82f6', label: 'Banjir', icon: '💧' },
  landslide: { color: '#84cc16', label: 'Longsor', icon: '⛰️' },
  volcano: { color: '#ef4444', label: 'Gunung Meletus', icon: '🌋' },
};

// Vulnerability levels and colors
const vulnerabilityLevels = {
  tinggi: { color: '#ef4444', label: 'Tinggi', opacity: 0.6 },
  sedang: { color: '#f59e0b', label: 'Sedang', opacity: 0.5 },
  rendah: { color: '#22c55e', label: 'Rendah', opacity: 0.4 },
};

// COVID levels and colors (assuming GeoServer colors, adjust if needed)
const covidLevels = {
  tinggi: { color: '#ef4444', label: 'Tinggi (3)' },
  sedang: { color: '#f59e0b', label: 'Sedang (2)' },
  rendah: { color: '#22c55e', label: 'Rendah (1)' },
};

// Sample EWS data with different types
const ewsPoints = [
  { id: 1, name: 'EWS Merapi - Kaliadem', lat: -7.583, lng: 110.446, type: 'volcano' as const, status: 'active' },
  { id: 2, name: 'EWS Banjir - Sungai Code', lat: -7.797, lng: 110.366, type: 'flood' as const, status: 'active' },
  { id: 3, name: 'EWS Longsor - Kulon Progo', lat: -7.750, lng: 110.150, type: 'landslide' as const, status: 'warning' },
  { id: 4, name: 'EWS Gempa - Bantul', lat: -7.889, lng: 110.333, type: 'earthquake' as const, status: 'active' },
  { id: 5, name: 'EWS Tsunami - Gunung Kidul', lat: -8.150, lng: 110.600, type: 'tsunami' as const, status: 'active' },
  { id: 6, name: 'EWS Banjir - Sleman', lat: -7.716, lng: 110.355, type: 'flood' as const, status: 'active' },
  { id: 7, name: 'EWS Gempa - Kota Yogya', lat: -7.795, lng: 110.365, type: 'earthquake' as const, status: 'active' },
  { id: 8, name: 'EWS Longsor - Imogiri', lat: -7.920, lng: 110.380, type: 'landslide' as const, status: 'active' },
];

const sekolahTangguh = [
  { id: 1, name: 'SDN 1 Merapi', lat: -7.600, lng: 110.430, level: 'Utama' },
  { id: 2, name: 'SMPN 2 Sleman', lat: -7.716, lng: 110.355, level: 'Madya' },
  { id: 3, name: 'SMAN 1 Bantul', lat: -7.880, lng: 110.320, level: 'Utama' },
  { id: 4, name: 'SDN Gunungkidul 5', lat: -7.950, lng: 110.600, level: 'Pratama' },
  { id: 5, name: 'SMPN 1 Kulon Progo', lat: -7.820, lng: 110.160, level: 'Madya' },
];

const pentahelix = [
  { id: 1, name: 'Relawan Merapi', lat: -7.590, lng: 110.450, type: 'community', members: 150 },
  { id: 2, name: 'Tim SAR DIY', lat: -7.780, lng: 110.360, type: 'government', members: 80 },
  { id: 3, name: 'BPBD DIY', lat: -7.795, lng: 110.365, type: 'government', members: 200 },
  { id: 4, name: 'PMI Yogyakarta', lat: -7.790, lng: 110.370, type: 'ngo', members: 300 },
  { id: 5, name: 'Universitas Gadjah Mada', lat: -7.770, lng: 110.378, type: 'academia', members: 50 },
];

// Kecamatan DIY Polygon Data (simplified coordinates)
const kecamatanPolygons = [
  {
    id: 1,
    name: 'Kec. Sleman',
    kabupaten: 'Sleman',
    coordinates: [
      [-7.68, 110.30], [-7.68, 110.45], [-7.75, 110.45], [-7.75, 110.30], [-7.68, 110.30]
    ]
  },
  {
    id: 2,
    name: 'Kec. Bantul',
    kabupaten: 'Bantul',
    coordinates: [
      [-7.85, 110.28], [-7.85, 110.42], [-7.95, 110.42], [-7.95, 110.28], [-7.85, 110.28]
    ]
  },
  {
    id: 3,
    name: 'Kec. Gunungkidul',
    kabupaten: 'Gunungkidul',
    coordinates: [
      [-7.90, 110.50], [-7.90, 110.70], [-8.10, 110.70], [-8.10, 110.50], [-7.90, 110.50]
    ]
  },
  {
    id: 4,
    name: 'Kec. Kulon Progo',
    kabupaten: 'Kulon Progo',
    coordinates: [
      [-7.75, 110.05], [-7.75, 110.20], [-7.90, 110.20], [-7.90, 110.05], [-7.75, 110.05]
    ]
  },
  {
    id: 5,
    name: 'Kec. Kota Yogyakarta',
    kabupaten: 'Kota Yogyakarta',
    coordinates: [
      [-7.77, 110.35], [-7.77, 110.40], [-7.82, 110.40], [-7.82, 110.35], [-7.77, 110.35]
    ]
  },
];

// Vulnerability Polygon Data
const vulnerabilityPolygons = {
  gempa: [
    { id: 1, name: 'Zona Rawan Gempa Bantul', level: 'tinggi' as const, coordinates: [[-7.87, 110.30], [-7.87, 110.40], [-7.95, 110.40], [-7.95, 110.30], [-7.87, 110.30]] },
    { id: 2, name: 'Zona Rawan Gempa Kota', level: 'sedang' as const, coordinates: [[-7.78, 110.36], [-7.78, 110.39], [-7.81, 110.39], [-7.81, 110.36], [-7.78, 110.36]] },
    { id: 3, name: 'Zona Rawan Gempa Sleman', level: 'rendah' as const, coordinates: [[-7.70, 110.32], [-7.70, 110.42], [-7.76, 110.42], [-7.76, 110.32], [-7.70, 110.32]] },
  ],
  longsor: [
    { id: 1, name: 'Zona Rawan Longsor Kulon Progo', level: 'tinggi' as const, coordinates: [[-7.76, 110.08], [-7.76, 110.18], [-7.85, 110.18], [-7.85, 110.08], [-7.76, 110.08]] },
    { id: 2, name: 'Zona Rawan Longsor Gunungkidul', level: 'tinggi' as const, coordinates: [[-7.92, 110.55], [-7.92, 110.65], [-8.02, 110.65], [-8.02, 110.55], [-7.92, 110.55]] },
    { id: 3, name: 'Zona Rawan Longsor Sleman', level: 'sedang' as const, coordinates: [[-7.60, 110.40], [-7.60, 110.48], [-7.68, 110.48], [-7.68, 110.40], [-7.60, 110.40]] },
  ],
  banjir: [
    { id: 1, name: 'Zona Rawan Banjir Sungai Code', level: 'tinggi' as const, coordinates: [[-7.78, 110.36], [-7.78, 110.38], [-7.82, 110.38], [-7.82, 110.36], [-7.78, 110.36]] },
    { id: 2, name: 'Zona Rawan Banjir Bantul', level: 'sedang' as const, coordinates: [[-7.88, 110.32], [-7.88, 110.38], [-7.93, 110.38], [-7.93, 110.32], [-7.88, 110.32]] },
    { id: 3, name: 'Zona Rawan Banjir Sleman', level: 'rendah' as const, coordinates: [[-7.72, 110.35], [-7.72, 110.40], [-7.77, 110.40], [-7.77, 110.35], [-7.72, 110.35]] },
  ],
  gunungMeletus: [
    { id: 1, name: 'Zona Bahaya Merapi KRB III', level: 'tinggi' as const, coordinates: [[-7.55, 110.42], [-7.55, 110.48], [-7.62, 110.48], [-7.62, 110.42], [-7.55, 110.42]] },
    { id: 2, name: 'Zona Bahaya Merapi KRB II', level: 'sedang' as const, coordinates: [[-7.58, 110.40], [-7.58, 110.50], [-7.68, 110.50], [-7.68, 110.40], [-7.58, 110.40]] },
    { id: 3, name: 'Zona Bahaya Merapi KRB I', level: 'rendah' as const, coordinates: [[-7.62, 110.38], [-7.62, 110.52], [-7.75, 110.52], [-7.75, 110.38], [-7.62, 110.38]] },
  ],
  tsunami: [
    { id: 1, name: 'Zona Rawan Tsunami Pantai Selatan', level: 'tinggi' as const, coordinates: [[-8.05, 110.30], [-8.05, 110.70], [-8.15, 110.70], [-8.15, 110.30], [-8.05, 110.30]] },
    { id: 2, name: 'Zona Rawan Tsunami Gunungkidul', level: 'sedang' as const, coordinates: [[-7.98, 110.50], [-7.98, 110.68], [-8.08, 110.68], [-8.08, 110.50], [-7.98, 110.50]] },
  ],
};

interface LayerConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  active: boolean;
  type: 'point' | 'polygon';
}

const DisasterMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layersRef = useRef<{ [key: string]: L.LayerGroup }>({});
  const [showSidebar, setShowSidebar] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['vulnerability', 'ews', 'covid']);

  const [layers, setLayers] = useState<LayerConfig[]>([
    { id: 'spab', name: 'SPAB', icon: <School className="w-4 h-4" />, color: '#22c55e', active: true, type: 'point' },
    { id: 'kaltana', name: 'Kaltana', icon: <Building2 className="w-4 h-4" />, color: '#6366f1', active: true, type: 'polygon' },
    { id: 'pentahelix', name: 'Aksi Pentahelix', icon: <Users className="w-4 h-4" />, color: '#a855f7', active: false, type: 'point' },
    { id: 'ews', name: 'EWS', icon: <Radio className="w-4 h-4" />, color: '#f97316', active: true, type: 'point' },
    { id: 'kerawanan', name: 'Kerawanan Kebencanaan', icon: <AlertTriangle className="w-4 h-4" />, color: '#eab308', active: true, type: 'polygon' },
    { id: 'covid', name: 'COVID-19 DIY', icon: <Activity className="w-4 h-4" />, color: '#ef4444', active: false, type: 'polygon' },
  ]);

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

  const createSchoolIcon = () => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="w-8 h-8 rounded-lg bg-green-500 border-2 border-white shadow-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m4 6 8-4 8 4"/>
            <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/>
            <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/>
            <path d="M18 5v17"/>
            <path d="M6 5v17"/>
            <circle cx="12" cy="9" r="2"/>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const createPentahelixIcon = (type: string) => {
    const colors: Record<string, string> = {
      government: '#8b5cf6',
      community: '#f97316',
      ngo: '#ec4899',
      academia: '#06b6d4',
      business: '#84cc16',
    };
    const color = colors[type] || '#a855f7';
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center" style="background-color: ${color}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map centered on DIY
    const map = L.map(mapRef.current, {
      center: [-7.797, 110.370],
      zoom: 10,
      zoomControl: false,
    });

    // Add light tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Create layer groups
    layersRef.current = {
      spab: L.layerGroup(),
      kaltana: L.layerGroup(),
      pentahelix: L.layerGroup(),
      ews: L.layerGroup(),
      kerawanan: L.layerGroup(),
      kecamatan: L.layerGroup(),
      covid: L.layerGroup(),
    };

    // Add Kecamatan polygons
    kecamatanPolygons.forEach((kec) => {
      const polygon = L.polygon(kec.coordinates as L.LatLngExpression[], {
        color: '#6366f1',
        fillColor: '#6366f1',
        fillOpacity: 0.2,
        weight: 2,
      });
      polygon.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-indigo-400">${kec.name}</h3>
          <p class="text-sm">Kabupaten: ${kec.kabupaten}</p>
        </div>
      `);
      polygon.addTo(layersRef.current.kecamatan);
    });

    // Add Kerawanan polygons (all vulnerability types combined)
    Object.entries(vulnerabilityPolygons).forEach(([type, zones]) => {
      zones.forEach((zone) => {
        const levelConfig = vulnerabilityLevels[zone.level];
        const polygon = L.polygon(zone.coordinates as L.LatLngExpression[], {
          color: levelConfig.color,
          fillColor: levelConfig.color,
          fillOpacity: levelConfig.opacity,
          weight: 2,
        });
        polygon.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold" style="color: ${levelConfig.color}">${zone.name}</h3>
            <p class="text-sm">Level Kerawanan: <strong>${levelConfig.label}</strong></p>
          </div>
        `);
        polygon.addTo(layersRef.current.kerawanan);
      });
    });

    // Add EWS markers with different colors per type
    ewsPoints.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], {
        icon: createEWSIcon(point.type, point.status),
      });

      // Add animated circle for radar effect
      const config = ewsTypeConfig[point.type];
      const circle = L.circle([point.lat, point.lng], {
        radius: 2000,
        color: config.color,
        fillColor: config.color,
        fillOpacity: 0.1,
        weight: 1,
        className: 'animate-pulse',
      });

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold" style="color: ${config.color}">${point.name}</h3>
          <p class="text-sm">Tipe: ${config.label}</p>
          <p class="text-sm">Status: <span class="${point.status === 'warning' ? 'text-yellow-500' : 'text-green-500'}">${point.status}</span></p>
        </div>
      `);

      marker.addTo(layersRef.current.ews);
      circle.addTo(layersRef.current.ews);
    });

    // Add SPAB markers (Sekolah Tangguh)
    sekolahTangguh.forEach((school) => {
      const marker = L.marker([school.lat, school.lng], {
        icon: createSchoolIcon(),
      });
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-green-500">${school.name}</h3>
          <p class="text-sm">Level: ${school.level}</p>
        </div>
      `);
      marker.addTo(layersRef.current.spab);
    });

    // Add Pentahelix markers
    pentahelix.forEach((org) => {
      const marker = L.marker([org.lat, org.lng], {
        icon: createPentahelixIcon(org.type),
      });
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-purple-500">${org.name}</h3>
          <p class="text-sm">Tipe: ${org.type}</p>
          <p class="text-sm">Anggota: ${org.members}</p>
        </div>
      `);
      marker.addTo(layersRef.current.pentahelix);
    });

    // Add COVID-19 WMS layer
    const covidLayer = L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
      layers: 'MAGANG:covid_diy_poly_dissolve2',
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      attribution: 'GeoServer',
    });
    covidLayer.addTo(layersRef.current.covid);

    // Add active layers to map
    layers.forEach((layer) => {
      if (layer.active && layersRef.current[layer.id]) {
        layersRef.current[layer.id].addTo(map);
      }
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Handle layer toggle
  useEffect(() => {
    if (!mapInstance.current) return;

    layers.forEach((layer) => {
      if (layersRef.current[layer.id]) {
        if (layer.active) {
          layersRef.current[layer.id].addTo(mapInstance.current!);
        } else {
          layersRef.current[layer.id].remove();
        }
      }
    });
  }, [layers]);

  const toggleLayer = (id: string) => {
    setLayers(prev => prev.map(layer =>
      layer.id === id ? { ...layer, active: !layer.active } : layer
    ));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const polygonLayers = layers.filter(l => l.type === 'polygon');
  const pointLayers = layers.filter(l => l.type === 'point');



  const handleDownload = (dataType: string, format: 'shp' | 'kml' | 'geojson') => {
    // Generate GeoJSON data based on type
    let geojsonData: any = { type: 'FeatureCollection', features: [] };

    if (dataType === 'ews') {
      geojsonData.features = ewsPoints.map(point => ({
        type: 'Feature',
        properties: { name: point.name, type: point.type, status: point.status },
        geometry: { type: 'Point', coordinates: [point.lng, point.lat] }
      }));
    } else if (dataType === 'sekolah') {
      geojsonData.features = sekolahTangguh.map(school => ({
        type: 'Feature',
        properties: { name: school.name, level: school.level },
        geometry: { type: 'Point', coordinates: [school.lng, school.lat] }
      }));
    } else if (dataType === 'kerawanan') {
      Object.entries(vulnerabilityPolygons).forEach(([type, zones]) => {
        zones.forEach(zone => {
          geojsonData.features.push({
            type: 'Feature',
            properties: { name: zone.name, type, level: zone.level },
            geometry: { type: 'Polygon', coordinates: [zone.coordinates.map(c => [c[1], c[0]])] }
          });
        });
      });
    } else if (dataType === 'kecamatan') {
      geojsonData.features = kecamatanPolygons.map(kec => ({
        type: 'Feature',
        properties: { name: kec.name, kabupaten: kec.kabupaten },
        geometry: { type: 'Polygon', coordinates: [kec.coordinates.map(c => [c[1], c[0]])] }
      }));
    }

    if (format === 'geojson') {
      const blob = new Blob([JSON.stringify(geojsonData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}_diy.geojson`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Data ${dataType} berhasil diunduh dalam format GeoJSON`);
    } else if (format === 'kml') {
      // Generate KML
      let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${dataType} DIY</name>`;

      geojsonData.features.forEach((feature: any) => {
        if (feature.geometry.type === 'Point') {
          kml += `
    <Placemark>
      <name>${feature.properties.name}</name>
      <Point>
        <coordinates>${feature.geometry.coordinates[0]},${feature.geometry.coordinates[1]}</coordinates>
      </Point>
    </Placemark>`;
        } else if (feature.geometry.type === 'Polygon') {
          const coords = feature.geometry.coordinates[0].map((c: number[]) => `${c[0]},${c[1]}`).join(' ');
          kml += `
    <Placemark>
      <name>${feature.properties.name}</name>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coords}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>`;
        }
      });

      kml += `
  </Document>
</kml>`;

      const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}_diy.kml`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Data ${dataType} berhasil diunduh dalam format KML`);
    } else {
      // For SHP, we'll provide the GeoJSON and inform user
      const blob = new Blob([JSON.stringify(geojsonData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}_diy.geojson`;
      a.click();
      URL.revokeObjectURL(url);
      toast.info(`Data ${dataType} diunduh sebagai GeoJSON. Gunakan QGIS untuk konversi ke Shapefile.`);
    }
  };



  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            className="absolute top-4 left-4 bottom-4 z-10 w-80"
          >
            <div className="glass-card h-full overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-display text-lg">
                    <Layers className="w-5 h-5" />
                    LAYER KONTROL
                  </div>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-1 hover:bg-secondary rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Layer Controls */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Vulnerability Section */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleSection('vulnerability')}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-sm">Kerawanan</span>
                    </div>
                    {expandedSections.includes('vulnerability') ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedSections.includes('vulnerability') && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-6 space-y-1 overflow-hidden"
                      >
                        {polygonLayers.map((layer) => (
                          <button
                            key={layer.id}
                            onClick={() => toggleLayer(layer.id)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-sm ${layer.active
                              ? 'bg-primary/20 border border-primary/50'
                              : 'bg-secondary/30 hover:bg-secondary/50'
                              }`}
                          >
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: layer.color }}
                            />
                            <span className="flex-1 text-left font-medium">{layer.name}</span>
                            {layer.icon}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* EWS Section */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleSection('ews')}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-orange-500" />
                      <span className="font-medium text-sm">EWS</span>
                    </div>
                    {expandedSections.includes('ews') ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedSections.includes('ews') && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-6 space-y-1 overflow-hidden"
                      >
                        {pointLayers.map((layer) => (
                          <button
                            key={layer.id}
                            onClick={() => toggleLayer(layer.id)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-sm ${layer.active
                              ? 'bg-primary/20 border border-primary/50'
                              : 'bg-secondary/30 hover:bg-secondary/50'
                              }`}
                          >
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: layer.color }}
                            />
                            <span className="flex-1 text-left font-medium">{layer.name}</span>
                            {layer.icon}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* COVID Section */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleSection('covid')}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-red-500" />
                      <span className="font-medium text-sm">Bahaya COVID</span>
                    </div>
                    {expandedSections.includes('covid') ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedSections.includes('covid') && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-6 space-y-1 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleLayer('covid')}
                          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-sm ${layers.find(l => l.id === 'covid')?.active
                            ? 'bg-primary/20 border border-primary/50'
                            : 'bg-secondary/30 hover:bg-secondary/50'
                            }`}
                        >
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: '#ef4444' }}
                          />
                          <span className="flex-1 text-left font-medium">COVID-19 DIY</span>
                          <Activity className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleSection('legend')}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-sm">Legend</span>
                    </div>
                    {expandedSections.includes('legend') ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedSections.includes('legend') && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-6 space-y-2 overflow-hidden"
                      >
                        {/* Vulnerability Levels */}
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Level Kerawanan:</p>
                          <div className="space-y-1">
                            {Object.entries(vulnerabilityLevels).map(([key, level]) => (
                              <div key={key} className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded"
                                  style={{ backgroundColor: level.color }}
                                />
                                <span className="text-xs">{level.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* EWS Types */}
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Tipe EWS:</p>
                          <div className="space-y-1">
                            {Object.entries(ewsTypeConfig).map(([key, config]) => (
                              <div key={key} className="flex items-center gap-2">
                                <span className="text-xs">{config.icon}</span>
                                <span className="text-xs">{config.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* COVID Levels */}
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Level COVID-19:</p>
                          <div className="space-y-1">
                            {Object.entries(covidLevels).map(([key, level]) => (
                              <div key={key} className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded"
                                  style={{ backgroundColor: level.color }}
                                />
                                <span className="text-xs">{level.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Sidebar Button */}
      {!showSidebar && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowSidebar(true)}
          className="absolute top-4 left-4 z-10 glass-card p-3 hover:bg-primary/20 transition-colors"
        >
          <Layers className="w-5 h-5" />
        </motion.button>
      )}

      {/* Download Panel */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 right-4 z-10"
      >
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 text-primary font-display text-sm mb-2">
            <Download className="w-4 h-4" />
            UNDUH DATA
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <Button variant="glass" size="sm" onClick={() => handleDownload('kerawanan', 'shp')} className="text-xs px-2 py-1 h-7">
              Kerawanan (SHP)
            </Button>
            <Button variant="glass" size="sm" onClick={() => handleDownload('kerawanan', 'kml')} className="text-xs px-2 py-1 h-7">
              Kerawanan (KML)
            </Button>
            <Button variant="glass" size="sm" onClick={() => handleDownload('ews', 'shp')} className="text-xs px-2 py-1 h-7">
              EWS (SHP)
            </Button>
            <Button variant="glass" size="sm" onClick={() => handleDownload('ews', 'kml')} className="text-xs px-2 py-1 h-7">
              EWS (KML)
            </Button>
            <Button variant="glass" size="sm" onClick={() => handleDownload('kecamatan', 'geojson')} className="text-xs px-2 py-1 h-7">
              Kecamatan (GeoJSON)
            </Button>
            <Button variant="glass" size="sm" onClick={() => handleDownload('sekolah', 'geojson')} className="text-xs px-2 py-1 h-7">
              Sekolah (GeoJSON)
            </Button>
          </div>
        </div>
      </motion.div>

      {/* EWS Status Panel */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute top-4 right-4 z-10"
      >
        <div className="glass-card p-4 min-w-[260px]">
          <div className="flex items-center gap-2 text-primary font-display text-sm mb-3">
            <AlertTriangle className="w-4 h-4" />
            STATUS EWS TERKINI
          </div>
          <div className="space-y-2">
            {ewsPoints.filter(e => e.status === 'warning').length > 0 ? (
              ewsPoints.filter(e => e.status === 'warning').map((ews) => {
                const config = ewsTypeConfig[ews.type];
                return (
                  <div
                    key={ews.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-warning/10 border border-warning/30"
                  >
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-warning animate-pulse" />
                      <div className="absolute inset-0 w-3 h-3 rounded-full bg-warning animate-ping" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{ews.name}</p>
                      <p className="text-[10px] text-muted-foreground">{config.label}</p>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/20 text-warning">
                      PERINGATAN
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-success/10 border border-success/30">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-xs text-success">Semua sensor normal</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DisasterMap;
