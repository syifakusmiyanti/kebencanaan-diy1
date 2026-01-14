import { useState } from 'react';
import { X, Download, MapPin, Layers, FileText, FileSpreadsheet, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    ewsData: any[];
}

const DownloadModal = ({ isOpen, onClose, ewsData }: DownloadModalProps) => {
    const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
    const [selectedFormat, setSelectedFormat] = useState<string>('geojson');
    const [openInGoogleMaps, setOpenInGoogleMaps] = useState<boolean>(false);

    if (!isOpen) return null;

    const dataSections = [
        {
            title: '1. EWS (Data Titik)',
            description: 'Data titik hasil EWS dari database',
            items: [
                { id: 'ews-tsunami', label: 'EWS Tsunami', type: 'point' },
                { id: 'ews-banjir-lahar', label: 'EWS Banjir Lahar', type: 'point' },
                { id: 'ews-longsor', label: 'EWS Longsor', type: 'point' }
            ]
        },
        {
            title: '2. Bencana Lainnya',
            description: 'Layer visual &/atau titik dari sistem',
            items: [
                { id: 'gempa-bumi', label: 'Gempa Bumi', type: 'layer' },
                { id: 'banjir', label: 'Banjir', type: 'layer' },
                { id: 'longsor', label: 'Longsor', type: 'layer' }
            ]
        },
        {
            title: '3. Titik Penting',
            description: 'Titik fasilitas / pemangku kepentingan',
            items: [
                { id: 'spab', label: 'SPAB', type: 'point' },
                { id: 'kaltana', label: 'KALTANA', type: 'point' },
                { id: 'pentahelix', label: 'Pentahelix', type: 'point' }
            ]
        }
    ];

    const formats = [
        {
            id: 'geojson',
            label: 'GeoJSON',
            description: 'Format JSON untuk GIS',
            icon: FileText,
            available: true
        },
        {
            id: 'shp',
            label: 'Shapefile',
            description: 'Format ESRI Shapefile',
            icon: File,
            available: true
        },
        {
            id: 'xlsx',
            label: 'Excel',
            description: 'Format spreadsheet (khusus data titik)',
            icon: FileSpreadsheet,
            available: selectedDataTypes.some(id => {
                const item = dataSections.flatMap(section => section.items).find(item => item.id === id);
                return item?.type === 'point';
            })
        }
    ];

    const handleDataTypeChange = (dataTypeId: string, checked: boolean) => {
        if (checked) {
            setSelectedDataTypes([...selectedDataTypes, dataTypeId]);
        } else {
            setSelectedDataTypes(selectedDataTypes.filter(id => id !== dataTypeId));
            // Reset format if Excel was selected but no points are selected
            const hasPoints = selectedDataTypes.some(id => {
                const item = dataSections.flatMap(section => section.items).find(item => item.id === id);
                return item?.type === 'point' && id !== dataTypeId;
            });
            if (selectedFormat === 'xlsx' && !hasPoints) {
                setSelectedFormat('geojson');
            }
        }
    };

    const handleDownload = async () => {
        if (selectedDataTypes.length === 0) return;

        try {
            // Handle different data types and formats
            for (const dataType of selectedDataTypes) {
                const item = dataSections.flatMap(section => section.items).find(item => item.id === dataType);
                if (item?.type === 'point') {
                    await downloadPointsData(selectedFormat);
                } else if (item?.type === 'layer') {
                    await downloadGeoServerData(selectedFormat);
                }
            }

            // Open in Google Maps if checkbox is checked
            if (openInGoogleMaps) {
                handleOpenInGoogleMaps();
            }
        } catch (error) {
            console.error('Download error:', error);
            // You could add toast notification here
        }

        onClose();
    };

    const downloadPointsData = async (format: string) => {
        const endpoint = `http://localhost:3001/api/download/points?format=${format}`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `data-titik-ews.${format === 'xlsx' ? 'xlsx' : format}`;
        link.click();

        URL.revokeObjectURL(url);
    };

    const downloadGeoServerData = async (format: string) => {
        // GeoServer WFS endpoint example
        const wfsUrl = `http://localhost:8080/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=workspace:layer_name&outputFormat=${format === 'geojson' ? 'application/json' : 'shape-zip'}`;

        const response = await fetch(wfsUrl);
        if (!response.ok) throw new Error('GeoServer download failed');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `layer-geoserver.${format === 'geojson' ? 'geojson' : 'zip'}`;
        link.click();

        URL.revokeObjectURL(url);
    };

    const openInGoogleMaps = () => {
        if (selectedDataTypes.includes('points') && ewsData.length > 0) {
            // Create Google Maps URL with markers
            const baseUrl = 'https://www.google.com/maps/d/u/0/edit?mid=';
            const markers = ewsData.map((point: any) =>
                `${point.lat},${point.lon}`
            ).join('|');

            // For now, just open Google Maps - you might want to create a custom map
            window.open('https://maps.google.com', '_blank');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Unduh Data
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Data Sections */}
                    {dataSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-sm font-medium text-foreground mb-2">{section.title}</h3>
                            <p className="text-xs text-muted-foreground mb-3">{section.description}</p>
                            <div className="space-y-2 ml-4">
                                {section.items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3">
                                        <Checkbox
                                            id={item.id}
                                            checked={selectedDataTypes.includes(item.id)}
                                            onCheckedChange={(checked) =>
                                                handleDataTypeChange(item.id, checked as boolean)
                                            }
                                        />
                                        <Label
                                            htmlFor={item.id}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {item.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {section !== dataSections[dataSections.length - 1] && <Separator className="mt-4" />}
                        </div>
                    ))}

                    {/* Format Selection - Only show if data is selected */}
                    {selectedDataTypes.length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="text-sm font-medium text-foreground mb-3">Format Unduhan</h3>
                                <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat}>
                                    <div className="space-y-3">
                                        {formats.map((format) => {
                                            const Icon = format.icon;
                                            return (
                                                <div key={format.id} className="flex items-center space-x-3">
                                                    <RadioGroupItem
                                                        value={format.id}
                                                        id={format.id}
                                                        disabled={!format.available}
                                                    />
                                                    <div className="grid gap-1.5 leading-none">
                                                        <Label
                                                            htmlFor={format.id}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                                                        >
                                                            <Icon className="w-4 h-4" />
                                                            {format.label}
                                                        </Label>
                                                        <p className="text-xs text-muted-foreground">
                                                            {format.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </RadioGroup>
                            </div>
                        </>
                    )}

                    <Separator />

                    {/* Additional Options */}
                    <div>
                        <h3 className="text-sm font-medium text-foreground mb-3">Opsi Tambahan</h3>
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="google-maps"
                                checked={openInGoogleMaps}
                                onCheckedChange={(checked) => setOpenInGoogleMaps(checked as boolean)}
                                disabled={selectedDataTypes.length === 0}
                            />
                            <Label
                                htmlFor="google-maps"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                            >
                                <MapPin className="w-4 h-4" />
                                Lihat di Google Maps
                            </Label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button
                        onClick={handleDownload}
                        disabled={selectedDataTypes.length === 0}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {openInGoogleMaps ? 'Unduh & Buka di Google Maps' : 'Unduh'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DownloadModal;
