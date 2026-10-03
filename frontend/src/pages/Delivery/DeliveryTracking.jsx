import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { realtimeService } from '../../services/realtimeService';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Compass, 
  ExternalLink, 
  Truck, 
  Radio, 
  Share2, 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Zap, 
  AlertTriangle, 
  Copy, 
  Check, 
  Battery, 
  Signal, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Camera, 
  KeyRound, 
  ShoppingBag, 
  X, 
  ShieldAlert,
  AlertOctagon, 
  CornerUpRight, 
  ArrowUp,
  Sparkles,
  CloudSun,
  Flame,
  MessageCircle,
  Star,
  DollarSign,
  PenTool,
  Upload,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
  Sliders,
  AlertCircle,
  LocateFixed,
  Ruler,
  Globe
} from 'lucide-react';

// Tile Providers for Leaflet Real Map
const TILE_LAYERS = {
  dark: {
    name: 'CartoDB Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
  },
  street: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    name: 'Esri Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
  },
  terrain: {
    name: 'OpenTopoMap',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap'
  }
};

// Distance calculation helper (Haversine formula in KM)
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

export const DeliveryTracking = ({ orders = [], selectedOrder, setSelectedOrder, onUpdateStatus, showToast }) => {
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Failed');
  const currentOrder = (selectedOrder && orders.find(o => o.id === selectedOrder.id))
    ? selectedOrder
    : activeOrders[0] || orders[0];

  // Map Engine & Display Mode
  const [mapEngine, setMapEngine] = useState('real'); // 'real' (Leaflet) | 'vector' (SVG Radar)
  const [mapMode, setMapMode] = useState('dark'); // 'dark' | 'satellite' | 'street' | 'terrain'
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x, 5x
  const [progress, setProgress] = useState(35); // 0 to 100% position on route
  const [showTraffic, setShowTraffic] = useState(true);
  const [showAltRoute, setShowAltRoute] = useState(false);
  const [addingHazard, setAddingHazard] = useState(false);
  const [measureMode, setMeasureMode] = useState(false);
  const [measuredDistance, setMeasuredDistance] = useState(null);
  
  // Real GPS Location
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Hazards & Waypoints
  const [hazards, setHazards] = useState([
    { lat: 13.2080, lng: 78.8800, x: 230, y: 160, label: 'Road Construction' }
  ]);
  const [selectedStepIndex, setSelectedStepIndex] = useState(null);

  // SVG Camera Control States
  const [cameraMode, setCameraMode] = useState('follow'); // 'follow' | 'fit' | 'manual'
  const [zoom, setZoom] = useState(1.4);
  const [manualFocusPoint, setManualFocusPoint] = useState({ x: 300, y: 160 });

  // Telemetry & Hardware States
  const [batteryLevel, setBatteryLevel] = useState(78);
  const [odometerKm, setOdometerKm] = useState(14.8);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [dismissedTrafficAlert, setDismissedTrafficAlert] = useState(false);

  // Rider Action & Form States
  const [hasArrived, setHasArrived] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [showCallScript, setShowCallScript] = useState(false);
  const [proofPhotoUrl, setProofPhotoUrl] = useState(null);
  const [codConfirmed, setCodConfirmed] = useState(false);

  // Post-Delivery Flows
  const [showTipModal, setShowTipModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [dropoffRating, setDropoffRating] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');

  // Modals
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(3);
  const [otpError, setOtpError] = useState('');
  const [otpPhotoUrl, setOtpPhotoUrl] = useState(null);
  const [hasSignature, setHasSignature] = useState(false);

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueReason, setIssueReason] = useState('Customer Phone Unreachable');
  const [issueNotes, setIssueNotes] = useState('');

  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Real OSRM Road Geometry Coordinates
  const [osrmRouteCoords, setOsrmRouteCoords] = useState([]);
  const [osrmDistanceKm, setOsrmDistanceKm] = useState(null);
  const [osrmDurationMins, setOsrmDurationMins] = useState(null);

  // Live Real-Time Telemetry Subscription
  useEffect(() => {
    if (!currentOrder?.orderId && !currentOrder?.id) return;
    const activeId = currentOrder.orderId || currentOrder.id;
    const unsub = realtimeService.subscribeToOrder(
      activeId,
      (beacon) => {
        if (beacon.lat && beacon.lng && riderMarkerRef.current) {
          riderMarkerRef.current.setLatLng([beacon.lat, beacon.lng]);
        }
      },
      (statusData) => {
        if (showToast && statusData.status) {
          showToast(`Order Status Live: ${statusData.status}`, `Order is now ${statusData.status}`);
        }
      }
    );
    return unsub;
  }, [currentOrder?.id, currentOrder?.orderId, showToast]);

  // Refs
  const leafletMapRef = useRef(null);
  const leafletContainerRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const altPolylineRef = useRef(null);
  const deviceMarkerRef = useRef(null);
  const geofenceCircleRef = useRef(null);
  const tileLayerRef = useRef(null);

  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const signatureCanvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const fileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);

  const isChittoorDistrict = currentOrder?.district?.includes('Chittoor') || 
    currentOrder?.customerAddress?.includes('Chittoor') || 
    currentOrder?.customerAddress?.includes('Andhra Pradesh') || 
    currentOrder?.id?.startsWith('DEL-CTR');

  // Real-world Origin & Destination Lat/Lng Coordinates
  const routeLocations = useMemo(() => {
    if (isChittoorDistrict) {
      if (currentOrder?.id === 'DEL-CTR-102') {
        return {
          farm: { lat: 13.5500, lng: 78.5000, name: 'Madanapalle Market Yard', type: 'farm' },
          checkpoints: [
            { lat: 13.5900, lng: 78.7200, name: 'Horsley Foothills Crossing', type: 'checkpoint' },
            { lat: 13.6200, lng: 79.1000, name: 'Bakarapeta Forest Pass', type: 'checkpoint' },
            { lat: 13.6250, lng: 79.3200, name: 'Chandragiri Fort Viewpoint', type: 'checkpoint' }
          ],
          customer: { lat: 13.6288, lng: 79.4192, name: 'Alipiri Gate, Tirupati', type: 'customer' }
        };
      } else {
        // DEL-CTR-101 (Palamaner to Chittoor)
        return {
          farm: { lat: 13.2000, lng: 78.7500, name: 'Palamaner Organic Mango Farm', type: 'farm' },
          checkpoints: [
            { lat: 13.2050, lng: 78.8500, name: 'Bangarupalyam Bypass Toll', type: 'checkpoint' },
            { lat: 13.2600, lng: 78.9800, name: 'Kanipakam Temple Cross Road', type: 'checkpoint' },
            { lat: 13.2200, lng: 79.0800, name: 'Chittoor West Interchange', type: 'checkpoint' }
          ],
          customer: { lat: 13.2172, lng: 79.1003, name: 'MSR Circle, Chittoor Town', type: 'customer' }
        };
      }
    } else {
      // Pune route (Baner to Kothrud)
      return {
        farm: { lat: 18.5590, lng: 73.7868, name: 'Baner Farm Hub / Depot', type: 'farm' },
        checkpoints: [
          { lat: 18.5700, lng: 73.7740, name: 'Balewadi High Street Link', type: 'checkpoint' },
          { lat: 18.5380, lng: 73.8290, name: 'University Circle Flyover', type: 'checkpoint' },
          { lat: 18.5074, lng: 73.8077, name: 'Kothrud Highway Junction', type: 'checkpoint' }
        ],
        customer: { lat: 18.5020, lng: 73.8150, name: 'Ideal Colony, Kothrud', type: 'customer' }
      };
    }
  }, [isChittoorDistrict, currentOrder?.id]);

  // Fetch Real Road Geometry via OSRM Public API
  useEffect(() => {
    let isMounted = true;
    const fetchRealRoute = async () => {
      try {
        const origin = `${routeLocations.farm.lng},${routeLocations.farm.lat}`;
        const dest = `${routeLocations.customer.lng},${routeLocations.customer.lat}`;
        const url = `https://router.project-osrm.org/route/v1/driving/${origin};${dest}?overview=full&geometries=geojson`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.code === 'Ok' && data.routes?.[0] && isMounted) {
          const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setOsrmRouteCoords(coords);
          setOsrmDistanceKm((data.routes[0].distance / 1000).toFixed(1));
          setOsrmDurationMins(Math.round(data.routes[0].duration / 60));
        } else if (isMounted) {
          // Fallback straight interpolated line if OSRM is unreachable
          const fallback = [
            [routeLocations.farm.lat, routeLocations.farm.lng],
            ...routeLocations.checkpoints.map(c => [c.lat, c.lng]),
            [routeLocations.customer.lat, routeLocations.customer.lng]
          ];
          setOsrmRouteCoords(fallback);
        }
      } catch (err) {
        if (isMounted) {
          const fallback = [
            [routeLocations.farm.lat, routeLocations.farm.lng],
            ...routeLocations.checkpoints.map(c => [c.lat, c.lng]),
            [routeLocations.customer.lat, routeLocations.customer.lng]
          ];
          setOsrmRouteCoords(fallback);
        }
      }
    };

    fetchRealRoute();
    return () => { isMounted = false; };
  }, [routeLocations]);

  // Telemetry Position & Heading along Real Road (OSRM or Coordinates)
  const riderTelemetry = useMemo(() => {
    const coords = osrmRouteCoords.length > 1 
      ? osrmRouteCoords 
      : [[routeLocations.farm.lat, routeLocations.farm.lng], [routeLocations.customer.lat, routeLocations.customer.lng]];
    
    if (progress <= 0) {
      const p1 = coords[0];
      const p2 = coords[1] || p1;
      const dLat = p2[0] - p1[0];
      const dLng = p2[1] - p1[1];
      const bearing = (Math.atan2(dLng, dLat) * 180 / Math.PI + 360) % 360;
      return { lat: p1[0], lng: p1[1], bearing, activeSegment: 0, x: 80, y: 240 };
    }
    
    if (progress >= 100) {
      const pLast = coords[coords.length - 1];
      const pPrev = coords[coords.length - 2] || pLast;
      const dLat = pLast[0] - pPrev[0];
      const dLng = pLast[1] - pPrev[1];
      const bearing = (Math.atan2(dLng, dLat) * 180 / Math.PI + 360) % 360;
      return { lat: pLast[0], lng: pLast[1], bearing, activeSegment: coords.length - 2, x: 520, y: 220 };
    }

    const totalPoints = coords.length;
    const exactIndex = (progress / 100) * (totalPoints - 1);
    const segIdx = Math.min(Math.floor(exactIndex), totalPoints - 2);
    const segProgress = exactIndex - segIdx;

    const p1 = coords[segIdx];
    const p2 = coords[segIdx + 1];

    const lat = p1[0] + (p2[0] - p1[0]) * segProgress;
    const lng = p1[1] + (p2[1] - p1[1]) * segProgress;

    const dLat = p2[0] - p1[0];
    const dLng = p2[1] - p1[1];
    const bearing = (Math.atan2(dLng, dLat) * 180 / Math.PI + 360) % 360;

    // SVG coordinate projection estimate
    const x = 80 + (progress / 100) * (520 - 80);
    const y = 240 + Math.sin(progress * 0.08) * 40;

    return { lat, lng, bearing, activeSegment: segIdx, x, y };
  }, [osrmRouteCoords, progress, routeLocations]);

  // Leaflet Real Map Lifecycle Management
  useEffect(() => {
    if (mapEngine !== 'real' || !leafletContainerRef.current) return;

    if (!leafletMapRef.current) {
      // Initialize map
      const initialCenter = [routeLocations.farm.lat, routeLocations.farm.lng];
      const map = L.map(leafletContainerRef.current, {
        center: initialCenter,
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // Add Tile Layer
      const currentTile = TILE_LAYERS[mapMode] || TILE_LAYERS.dark;
      tileLayerRef.current = L.tileLayer(currentTile.url, {
        maxZoom: 19,
        attribution: currentTile.attribution
      }).addTo(map);

      // Farm Marker Icon
      const farmIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background:#10b981;width:32px;height:32px;border-radius:10px;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,0.4)">🌱</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      L.marker([routeLocations.farm.lat, routeLocations.farm.lng], { icon: farmIcon })
        .addTo(map)
        .bindPopup(`<b>Farm Hub Origin</b><br/>${routeLocations.farm.name}`);

      // Customer Marker Icon
      const custIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background:#3b82f6;width:32px;height:32px;border-radius:10px;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,0.4)">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      L.marker([routeLocations.customer.lat, routeLocations.customer.lng], { icon: custIcon })
        .addTo(map)
        .bindPopup(`<b>Destination Customer</b><br/>${routeLocations.customer.name}`);

      // Geofence 50m Arrival Perimeter Circle
      geofenceCircleRef.current = L.circle([routeLocations.customer.lat, routeLocations.customer.lng], {
        radius: 120, // 120m visual zone
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.15,
        dashArray: '6, 6'
      }).addTo(map);

      // Checkpoint Markers
      routeLocations.checkpoints.forEach((cp) => {
        const cpIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background:#f59e0b;width:24px;height:24px;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;color:#000">⚡</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        L.marker([cp.lat, cp.lng], { icon: cpIcon })
          .addTo(map)
          .bindPopup(`<b>Checkpoint:</b> ${cp.name}`);
      });

      // Rider Marker
      const riderIcon = L.divIcon({
        className: 'custom-rider-icon',
        html: `<div id="rider-marker-el" style="background:#f59e0b;width:36px;height:36px;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 16px rgba(245,158,11,0.8);transform:rotate(${riderTelemetry.bearing}deg);transition:transform 0.3s">🛵</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });
      riderMarkerRef.current = L.marker([riderTelemetry.lat, riderTelemetry.lng], { icon: riderIcon }).addTo(map);

      // Map Click for Measure or Hazard
      map.on('click', (e) => {
        if (measureMode) {
          const dist = calculateDistanceKm(riderTelemetry.lat, riderTelemetry.lng, e.latlng.lat, e.latlng.lng);
          setMeasuredDistance(dist);
          L.popup()
            .setLatLng(e.latlng)
            .setContent(`<b>Ruler Distance:</b> ${dist} km from Rider`)
            .openOn(map);
        } else if (addingHazard) {
          setHazards(prev => [...prev, { lat: e.latlng.lat, lng: e.latlng.lng, label: 'Road Obstacle' }]);
          setAddingHazard(false);
          L.popup()
            .setLatLng(e.latlng)
            .setContent(`<b>⚠️ Hazard Reported</b>`)
            .openOn(map);
          if (showToast) showToast('Hazard Marked on Real Map ⚠️', 'Obstacle recorded at geographic coordinates.');
        }
      });

      leafletMapRef.current = map;
    } else {
      // Update Tile Layer if changed
      if (tileLayerRef.current) {
        tileLayerRef.current.remove();
        const currentTile = TILE_LAYERS[mapMode] || TILE_LAYERS.dark;
        tileLayerRef.current = L.tileLayer(currentTile.url, {
          maxZoom: 19,
          attribution: currentTile.attribution
        }).addTo(leafletMapRef.current);
      }
    }

    return () => {
      // Clean up tileLayer if dependencies change
    };
  }, [mapEngine, mapMode, routeLocations, measureMode, addingHazard]);

  // Clean up Leaflet map instance on component unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update Polyline & Rider on Map during Playback
  useEffect(() => {
    if (mapEngine !== 'real' || !leafletMapRef.current) return;
    const map = leafletMapRef.current;

    // Draw / Update Route Polyline
    if (osrmRouteCoords.length > 0) {
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
      }
      routePolylineRef.current = L.polyline(osrmRouteCoords, {
        color: mapMode === 'satellite' ? '#38bdf8' : '#10b981',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round'
      }).addTo(map);

      // Fit bounds once on first load
      if (!routePolylineRef.current._fitted) {
        map.fitBounds(routePolylineRef.current.getBounds(), { padding: [40, 40] });
        routePolylineRef.current._fitted = true;
      }
    }

    // Update Rider Marker position and rotation
    if (riderMarkerRef.current) {
      riderMarkerRef.current.setLatLng([riderTelemetry.lat, riderTelemetry.lng]);
      const el = document.getElementById('rider-marker-el');
      if (el) {
        el.style.transform = `rotate(${riderTelemetry.bearing}deg)`;
      }

      if (cameraMode === 'follow') {
        map.panTo([riderTelemetry.lat, riderTelemetry.lng], { animate: true, duration: 0.4 });
      }
    }
  }, [osrmRouteCoords, riderTelemetry, cameraMode, mapEngine, mapMode]);

  // Handle Real Device Geolocation ("Locate Me")
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      if (showToast) showToast('GPS Error', 'Geolocation is not supported by your browser.', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDeviceLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);

        if (leafletMapRef.current) {
          if (deviceMarkerRef.current) deviceMarkerRef.current.remove();

          const myIcon = L.divIcon({
            className: 'device-gps-icon',
            html: `<div style="background:#3b82f6;width:20px;height:20px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 12px #3b82f6" class="animate-ping-slow"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          deviceMarkerRef.current = L.marker([latitude, longitude], { icon: myIcon })
            .addTo(leafletMapRef.current)
            .bindPopup('<b>Your Live Device GPS Position</b>')
            .openPopup();

          leafletMapRef.current.setView([latitude, longitude], 15, { animate: true });
        }

        if (showToast) showToast('GPS Locked 📍', `Device positioned at ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`);
      },
      (err) => {
        setIsLocating(false);
        if (showToast) showToast('Location Notice', 'Using simulated route coords. Please allow browser GPS permissions for live physical device lock.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Animated Route Progress Interval
  useEffect(() => {
    let interval;
    if (isPlaying && currentOrder && currentOrder.status === 'Out for Delivery') {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 98) return 98;
          return prev + 0.5 * simSpeed;
        });

        // Slow battery drain & odometer tick
        setBatteryLevel(b => Math.max(12, +(b - 0.03 * simSpeed).toFixed(1)));
        setOdometerKm(k => +(k + 0.01 * simSpeed).toFixed(2));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, simSpeed, currentOrder]);

  // Geofence Trigger when nearing customer
  useEffect(() => {
    if (progress >= 90 && !hasArrived && currentOrder?.status === 'Out for Delivery') {
      setHasArrived(true);
      if (showToast) {
        showToast('📍 Geofence Triggered', 'Rider entered 50m delivery perimeter! Customer notified.');
      }
    }
  }, [progress, hasArrived, currentOrder?.status, showToast]);

  // Reset arrival & checklist on order change
  useEffect(() => {
    setHasArrived(false);
    setCheckedItems({});
    setOtpDigits(['', '', '', '']);
    setOtpError('');
    setOtpAttemptsLeft(3);
    setProofPhotoUrl(null);
    setOtpPhotoUrl(null);
    setCodConfirmed(false);
    setDismissedTrafficAlert(false);
    setProgress(currentOrder?.status === 'Out for Delivery' ? 45 : currentOrder?.status === 'Picked Up' ? 10 : 0);
  }, [currentOrder?.id]);

  const handleOpenGoogleMaps = () => {
    if (!currentOrder) return;
    const destination = encodeURIComponent(currentOrder.customerAddress || '');
    const origin = encodeURIComponent(currentOrder.farmAddress || '');
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=bicycling`;
    window.open(mapsUrl, '_blank');
  };

  const handleCopyAddress = () => {
    if (!currentOrder) return;
    navigator.clipboard.writeText(currentOrder.customerAddress || '');
    setCopiedAddress(true);
    if (showToast) showToast('Address Copied! 📋', 'Customer delivery address copied to clipboard.');
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleMarkArrived = () => {
    setHasArrived(true);
    if (showToast) {
      showToast('Arrival Notification Sent! 🔔', `Customer ${currentOrder?.customerName} alerted of rider arrival.`);
    }
  };

  const handleToggleItemCheck = (idx) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // OTP 4-Box Handlers
  const handleOtpDigitChange = (index, value) => {
    const val = value.replace(/[^0-9]/g, '');
    if (!val && value !== '') return;
    
    const newDigits = [...otpDigits];
    newDigits[index] = val ? val.slice(-1) : '';
    setOtpDigits(newDigits);
    setOtpError('');

    // Auto-focus next input
    if (val && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleOpenOtpModal = () => {
    setOtpDigits(['', '', '', '']);
    setOtpError('');
    setShowOtpModal(true);
    setTimeout(() => {
      otpInputRefs[0].current?.focus();
      initSignatureCanvas();
    }, 150);
  };

  // Signature Canvas Helpers
  const initSignatureCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#0f766e';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  };

  const startDrawing = (e) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawingRef.current = true;
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleVerifyOtpAndComplete = (e) => {
    e.preventDefault();
    const enteredPin = otpDigits.join('');
    
    if (enteredPin.length !== 4) {
      setOtpError('Please enter all 4 digits of the OTP.');
      return;
    }

    if (currentOrder?.paymentType?.includes('Cash') && !codConfirmed) {
      setOtpError('Please confirm cash collection before completing COD order.');
      return;
    }

    // Demo pin validation
    if (enteredPin !== '4920' && enteredPin !== '1234' && enteredPin !== '0000') {
      const remaining = otpAttemptsLeft - 1;
      setOtpAttemptsLeft(remaining);
      if (remaining <= 0) {
        setOtpError('❌ Maximum OTP attempts reached. Contact dispatch manager.');
      } else {
        setOtpError(`Incorrect OTP PIN. ${remaining} attempt(s) remaining.`);
      }
      return;
    }

    onUpdateStatus(currentOrder.id, 'Delivered');
    setShowOtpModal(false);
    if (showToast) {
      showToast('Delivery Completed! 🎉', `Order ${currentOrder.id} successfully handed over.`);
    }

    setTimeout(() => {
      setShowTipModal(true);
    }, 600);
  };

  const handleReportIssueSubmit = (e) => {
    e.preventDefault();
    const finalReason = issueNotes ? `${issueReason}: ${issueNotes}` : issueReason;
    onUpdateStatus(currentOrder.id, 'Failed', finalReason);
    setShowIssueModal(false);
    setIssueNotes('');
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`https://localfarm.in/track/${currentOrder?.id || 'DEL-991'}`);
    setCopiedShareLink(true);
    if (showToast) showToast('Live Link Copied! 📋', 'Live tracking URL copied to clipboard.');
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  const handleFileUpload = (e, target) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      if (target === 'panel') setProofPhotoUrl(fakeUrl);
      if (target === 'otp') setOtpPhotoUrl(fakeUrl);
      if (showToast) showToast('Proof Attached! 📷', 'Photo successfully recorded for delivery audit.');
    }
  };

  const currentSpeed = (isPlaying && currentOrder?.status === 'Out for Delivery') ? (28 * (simSpeed === 5 ? 1.5 : 1)) : 0;

  // Turn-by-Turn step directions
  const routeSteps = useMemo(() => {
    if (isChittoorDistrict) {
      if (currentOrder?.id === 'DEL-CTR-102') {
        return [
          { step: 1, instruction: 'Depart from Madanapalle Market Yard', detail: 'Head towards Horsley Foothills Crossing (3.5 km)', distance: '3.5 km', icon: ArrowUp },
          { step: 2, instruction: 'Pass through Bakarapeta Forest Road Pass', detail: 'Slow down at the forest checkpoint (4.2 km)', distance: '4.2 km', icon: CornerUpRight },
          { step: 3, instruction: 'Continue past Chandragiri Fort Viewpoint', detail: 'Merge onto Tirupati Bypass highway line (3.8 km)', distance: '3.8 km', icon: CornerUpRight },
          { step: 4, instruction: 'Arrive at Tirumala Heights (Tirupati Bypass)', detail: 'Destination is on the left next to Alipiri Gate (1.0 km)', distance: '1.0 km', icon: MapPin }
        ];
      } else {
        return [
          { step: 1, instruction: 'Depart from Palamaner Organic Mango Farm', detail: 'Head East on NH-140 Palamaner - Chittoor Express Corridor (1.8 km)', distance: '1.8 km', icon: ArrowUp },
          { step: 2, instruction: 'Pass through Bangarupalyam Bypass Toll', detail: 'Maintain lane alignment on the highway bypass (2.2 km)', distance: '2.2 km', icon: CornerUpRight },
          { step: 3, instruction: 'Merge at Kanipakam Temple Cross Road', detail: 'Watch for vehicles merging from temple town route (1.5 km)', distance: '1.5 km', icon: CornerUpRight },
          { step: 4, instruction: 'Arrive at MSR Circle, Chittoor Town', detail: 'Turn into destination lane near Town Railway Station (0.9 km)', distance: '0.9 km', icon: MapPin }
        ];
      }
    } else {
      return [
        { step: 1, instruction: 'Depart from Baner Organic Farm Hub', detail: 'Head South on Baner Main Road (1.2 km)', distance: '1.2 km', icon: ArrowUp },
        { step: 2, instruction: 'Turn onto Balewadi High Street Link', detail: 'Merge smoothly and watch for traffic (1.4 km)', distance: '1.4 km', icon: CornerUpRight },
        { step: 3, instruction: 'Cross University Circle Flyover', detail: 'Keep middle lane on the flyover bridge (1.1 km)', distance: '1.1 km', icon: CornerUpRight },
        { step: 4, instruction: 'Arrive at Ideal Colony, Kothrud', detail: 'Turn right at the park gate into building lane (0.5 km)', distance: '0.5 km', icon: MapPin }
      ];
    }
  }, [isChittoorDistrict, currentOrder?.id]);

  const totalDistanceKm = osrmDistanceKm || parseFloat(currentOrder?.distance || '4.2');
  const remainingDistanceKm = Math.max(0, (totalDistanceKm * (1 - progress / 100))).toFixed(1);
  const remainingEtaMins = osrmDurationMins 
    ? Math.max(1, Math.round(osrmDurationMins * (1 - progress / 100))) 
    : Math.max(1, Math.round((parseFloat(currentOrder?.eta || '18')) * (1 - progress / 100)));

  return (
    <div className="space-y-6 pb-16 font-display animate-fadeIn max-w-5xl mx-auto">
      
      {/* ── 1. Hero Header ── */}
      <div className="bg-gradient-to-r from-[#071a0b] via-[#0d2516] to-[#16381d] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 shadow-lg relative">
              <Navigation className="w-7 h-7 text-amber-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  REAL GPS DISPATCH • OSRM REAL ROAD
                </span>
                {isChittoorDistrict && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs">
                    📍 {isChittoorDistrict ? 'Chittoor AP Region' : 'Maharashtra Metro'}
                  </span>
                )}
              </div>
              <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">
                Live GPS Delivery Navigation
              </h1>
              <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                {routeLocations.farm.name} ➔ {routeLocations.customer.name} (Real Road Route)
              </p>
            </div>
          </div>

          {/* Active Order Selector & Quick Action Bar */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {orders.length > 0 && (
              <div className="min-w-[220px]">
                <label className="text-[10px] font-black text-emerald-300 uppercase block mb-1">Select Active Task</label>
                <select
                  value={currentOrder?.id || ''}
                  onChange={(e) => {
                    const found = orders.find(o => o.id === e.target.value);
                    if (found && setSelectedOrder) setSelectedOrder(found);
                  }}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-white rounded-xl px-3.5 py-2 outline-none cursor-pointer shadow-xs"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id} className="text-slate-950 font-bold">
                      {o.id} — {o.customerName} ({o.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1 sm:pt-4">
              <button
                onClick={() => setShowShareModal(true)}
                title="Share Live Tracking"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-xs"
              >
                <Share2 className="w-4 h-4 text-emerald-300" />
              </button>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                title={voiceEnabled ? 'Mute Voice Guide' : 'Enable Voice Guide'}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  voiceEnabled ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/40' : 'bg-white/10 text-white/50 border-white/20'
                }`}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  if (showToast) showToast('Emergency SOS Alert Sent 🚨', 'Dispatch control & hub manager notified.');
                }}
                title="Emergency SOS Alert"
                className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/40 transition-all cursor-pointer shadow-xs"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Route Progress Strip ── */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-farmGreen-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Transit Progress ({Math.round(progress)}%)</span>
          </div>
          <span className="text-emerald-800 font-mono">
            {remainingEtaMins}m / {remainingDistanceKm}km remaining
          </span>
        </div>

        <div className="relative pt-3 pb-2">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center relative -mt-3.5">
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full border-2 border-white bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                🌱
              </div>
              <span className="text-[9px] font-extrabold text-farmMuted mt-1 truncate max-w-[90px]">
                {routeLocations.farm.name.split(' ')[0]}
              </span>
            </div>

            {routeLocations.checkpoints.map((cp, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black ${
                  progress >= ((idx + 1) * 25) ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {idx + 1}
                </div>
                <span className="text-[9px] font-extrabold text-farmMuted mt-1 hidden sm:block truncate max-w-[80px]">
                  {cp.name.split(' ')[0]}
                </span>
              </div>
            ))}

            <div className="flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] ${
                progress >= 95 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                📍
              </div>
              <span className="text-[9px] font-extrabold text-farmMuted mt-1 truncate max-w-[90px]">
                {routeLocations.customer.name.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Low Battery Alert ── */}
      {batteryLevel < 20 && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center justify-between gap-3 text-rose-800 animate-pulse">
          <div className="flex items-center gap-3 font-black text-xs">
            <Battery className="w-5 h-5 text-rose-600" />
            <span>CRITICAL: EV Battery Low ({batteryLevel}%) — Route to nearest charging hub after this dropoff.</span>
          </div>
          <span className="px-3 py-1 bg-rose-600 text-white text-[10px] font-black rounded-xl">HUB 1.2 KM</span>
        </div>
      )}

      {/* ── 4. MAP CONTAINER (Real Leaflet vs Vector Radar) ── */}
      <div className="rounded-3xl overflow-hidden border border-emerald-900/60 shadow-xl relative min-h-[520px] flex flex-col justify-between bg-slate-950">

        {/* Top Floating Controls Bar */}
        <div className="relative z-[1000] flex flex-wrap items-center justify-between gap-3 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-t-3xl border-b border-white/10 text-white shadow-md w-full">
          
          {/* Map Engine Toggle */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10 text-xs font-black">
            <button
              onClick={() => setMapEngine('real')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                mapEngine === 'real' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Original Real Map</span>
            </button>
            <button
              onClick={() => setMapEngine('vector')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                mapEngine === 'vector' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Vector Radar</span>
            </button>
          </div>

          {/* Real Map Tile Layers (Dark, Street, Satellite, Terrain) */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10 text-xs font-black">
            <button
              onClick={() => setMapMode('dark')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                mapMode === 'dark' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setMapMode('street')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                mapMode === 'street' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Street
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                mapMode === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapMode('terrain')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                mapMode === 'terrain' ? 'bg-emerald-800 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Terrain
            </button>
          </div>

          {/* Simulation & Map Tool Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                isPlaying ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => setSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 5 : 1)}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 text-amber-300 border border-white/15 text-[10px] font-mono font-black rounded-xl cursor-pointer"
            >
              {simSpeed}x
            </button>

            {/* Locate Me GPS button */}
            <button
              onClick={handleLocateMe}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                isLocating ? 'bg-blue-400 text-slate-950 animate-pulse' : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
              title="Locate device with real GPS"
            >
              <LocateFixed className="w-3.5 h-3.5" />
              <span>Locate Me</span>
            </button>

            {/* Measure Tool */}
            <button
              onClick={() => {
                setMeasureMode(!measureMode);
                if (!measureMode && showToast) showToast('Ruler Measure Active 📏', 'Click anywhere on map to measure distance from rider.');
              }}
              className={`p-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                measureMode ? 'bg-amber-400 text-slate-950 border-amber-500' : 'bg-white/10 text-slate-400 border-white/15'
              }`}
              title="Measure distance on map"
            >
              <Ruler className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real Leaflet Map Viewport */}
        {mapEngine === 'real' && (
          <div className="relative w-full h-[400px]">
            <div 
              ref={leafletContainerRef} 
              className="w-full h-full z-10"
              style={{ background: '#09150d' }}
            />

            {/* Floating Live Telemetry HUD Overlay */}
            <div className="absolute top-4 left-4 z-[999] bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-white shadow-xl max-w-[210px] space-y-2 pointer-events-none select-none">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">
                    OSRM REAL ROAD
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 bg-white/10 px-1.5 py-0.5 rounded font-black">
                  4G LTE ●●●●
                </span>
              </div>
              
              <div className="space-y-1 font-mono">
                <div className="text-[9px] text-slate-400 font-sans font-black">GEO COORDINATES</div>
                <div className="text-[11px] font-black text-white flex justify-between gap-4">
                  <span className="text-slate-400 font-sans font-medium">Latitude:</span>
                  <span className="text-emerald-300">{riderTelemetry.lat.toFixed(4)}° N</span>
                </div>
                <div className="text-[11px] font-black text-white flex justify-between gap-4">
                  <span className="text-slate-400 font-sans font-medium">Longitude:</span>
                  <span className="text-emerald-300">{riderTelemetry.lng.toFixed(4)}° E</span>
                </div>
                <div className="text-[11px] font-black text-white flex justify-between gap-4">
                  <span className="text-slate-400 font-sans font-medium">Heading:</span>
                  <span className="text-amber-400">{Math.round(riderTelemetry.bearing)}°</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-1.5 grid grid-cols-2 gap-1.5 text-[9px] font-mono text-slate-300">
                <div>
                  <span className="text-slate-500 font-sans block font-bold">SPEED</span>
                  <span className="text-white font-black">{currentSpeed} km/h</span>
                </div>
                <div>
                  <span className="text-slate-500 font-sans block font-bold">BATTERY</span>
                  <span className="text-emerald-400 font-black">{batteryLevel}%</span>
                </div>
              </div>
            </div>

            {/* Recenter button */}
            <div className="absolute bottom-4 right-4 z-[999]">
              <button
                onClick={() => {
                  if (leafletMapRef.current && routePolylineRef.current) {
                    leafletMapRef.current.fitBounds(routePolylineRef.current.getBounds(), { padding: [40, 40] });
                  }
                }}
                className="px-3 py-1.5 bg-slate-950/80 hover:bg-slate-900 text-emerald-300 text-xs font-black rounded-xl border border-white/20 shadow-md cursor-pointer"
              >
                Fit Route 🔍
              </button>
            </div>
          </div>
        )}

        {/* Fallback Vector Radar Map View */}
        {mapEngine === 'vector' && (
          <div className="relative w-full h-[400px] overflow-hidden bg-[#041208]">
            <svg viewBox="0 0 600 320" className="w-full h-full select-none">
              <defs>
                <pattern id="vGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#10b981" opacity="0.15" />
                </pattern>
              </defs>
              <rect width="600" height="320" fill="url(#vGrid)" />
              
              {/* Polyline */}
              <path
                d="M 80,240 Q 240,160 300,100 T 520,220"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d="M 80,240 Q 240,160 300,100 T 520,220"
                fill="none"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeDasharray="8, 16"
                className="animate-map-dash"
              />

              {/* Farm Pin */}
              <g transform="translate(80, 240)">
                <circle r="12" fill="#10b981" fillOpacity="0.2" className="animate-ping-slow" />
                <circle r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
                <text x="0" y="-12" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">Farm Origin</text>
              </g>

              {/* Customer Pin */}
              <g transform="translate(520, 220)">
                <circle r="16" fill="#3b82f6" fillOpacity="0.2" className="animate-ping-slow" />
                <circle r="7" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                <text x="0" y="-12" fill="#93c5fd" fontSize="8" fontWeight="bold" textAnchor="middle">Customer</text>
              </g>

              {/* Rider Marker */}
              <g transform={`translate(${riderTelemetry.x}, ${riderTelemetry.y})`}>
                <circle r="14" fill="#f59e0b" fillOpacity="0.3" className="animate-ping-slow" />
                <circle r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="20" fill="#fde047" fontSize="8" fontWeight="bold" textAnchor="middle">Rider 🛵</text>
              </g>
            </svg>
          </div>
        )}

        {/* Bottom Destination Address Bar */}
        <div className="relative z-[1000] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-b-3xl border-t border-white/10">
          <div className="text-white text-xs space-y-0.5 flex-1 pr-2 font-bold">
            <div className="text-emerald-300 text-[10px] uppercase font-black tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Real Road Destination</span>
            </div>
            <div className="font-black text-white text-sm truncate">{currentOrder?.customerAddress}</div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyAddress}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black border border-white/15 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleOpenGoogleMaps}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Maps 🗺️</span>
            </button>
          </div>
        </div>

      </div>

      {/* ── 5. Alternate Route Card (Conditional) ── */}
      {showAltRoute && (
        <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-blue-900 animate-fadeIn">
          <div>
            <div className="font-black text-xs uppercase flex items-center gap-1.5 text-blue-700">
              <Zap className="w-4 h-4" /> Alternate Highway Bypass Route
            </div>
            <div className="text-xs font-medium mt-0.5">
              Avoids city center traffic. <strong>ETA 14 mins (-4 mins saved)</strong> • Distance 5.1 km (+0.9 km)
            </div>
          </div>
          <button
            onClick={() => {
              if (showToast) showToast('Rerouted! 🔄', 'Active path switched to alternate highway bypass.');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            Apply Alternate Route
          </button>
        </div>
      )}

      {/* ── 6. EV Telemetry Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path
                className="text-gray-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={currentSpeed > 35 ? 'text-amber-500' : 'text-emerald-600'}
                strokeDasharray={`${Math.min(100, (currentSpeed / 50) * 100)}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-mono font-black text-xs text-farmGreen-950">{currentSpeed}</span>
          </div>
          <div>
            <div className="text-farmMuted text-[9px] font-black uppercase">Speedometer</div>
            <div className="font-bold text-xs text-farmGreen-950">{currentSpeed} km/h</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
          <div className="text-farmMuted text-[9px] font-black uppercase flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Time Left</span>
          </div>
          <div className="font-mono font-black text-base text-farmGreen-950">
            {remainingEtaMins} mins
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
          <div className="text-farmMuted text-[9px] font-black uppercase flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span>Distance Left</span>
          </div>
          <div className="font-mono font-black text-base text-farmGreen-950">
            {remainingDistanceKm} km
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
          <div className="text-farmMuted text-[9px] font-black uppercase flex items-center gap-1">
            <Battery className="w-3.5 h-3.5 text-emerald-600" />
            <span>EV Battery</span>
          </div>
          <div className={`font-mono font-black text-base ${batteryLevel < 20 ? 'text-rose-600' : 'text-emerald-800'}`}>
            {batteryLevel}%
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="text-farmMuted text-[9px] font-black uppercase flex items-center gap-1">
            <CloudSun className="w-3.5 h-3.5 text-amber-500" />
            <span>Shift Odometer</span>
          </div>
          <div className="font-mono font-black text-base text-farmGreen-950 truncate">
            {odometerKm} km
          </div>
        </div>
      </div>

      {/* ── 7. Turn-by-Turn GPS Navigation Guidance ── */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-black text-base text-farmGreen-950 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <span>Turn-by-Turn GPS Navigation Steps</span>
          </h3>
          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
            OSRM Live Directions
          </span>
        </div>

        <div className="space-y-2.5">
          {routeSteps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = selectedStepIndex === idx;

            return (
              <div
                key={s.step}
                onClick={() => setSelectedStepIndex(isSelected ? null : idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                    : 'bg-gray-50/80 hover:bg-emerald-50/40 border-gray-200'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                  idx === 0 ? 'bg-emerald-100 text-emerald-900' :
                  idx === 1 ? 'bg-amber-100 text-amber-900' :
                  'bg-emerald-800 text-white'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <div className="font-extrabold text-farmGreen-950 text-xs flex items-center justify-between">
                    <span>{s.instruction}</span>
                    <span className="text-farmMuted text-[11px] font-mono font-black">{s.distance}</span>
                  </div>
                  <div className="text-farmMuted text-[11px] font-medium mt-0.5">{s.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 8. Produce Package Item Checklist ── */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-black text-base text-farmGreen-950 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <span>Produce Package Item Verification</span>
          </h3>
          <span className="text-xs text-farmMuted font-bold">
            {Object.keys(checkedItems).filter(k => checkedItems[k]).length} / {Array.isArray(currentOrder?.items) ? currentOrder.items.length : 1} Checked
          </span>
        </div>

        <div className="space-y-2">
          {Array.isArray(currentOrder?.items) ? (
            currentOrder.items.map((item, idx) => {
              const isChecked = !!checkedItems[idx];

              return (
                <label
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                    isChecked ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50/80 border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleItemCheck(idx)}
                      className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
                    />
                    <span className={`text-xs font-extrabold ${isChecked ? 'line-through text-emerald-800' : 'text-farmGreen-950'}`}>
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-farmMuted font-mono font-bold">{item.qty}</span>
                    <span className="font-black text-emerald-800 font-mono">₹{item.price}</span>
                  </div>
                </label>
              );
            })
          ) : (
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 font-extrabold text-xs text-farmGreen-950">
              {currentOrder?.items || 'Fresh Produce Package'}
            </div>
          )}
        </div>
      </div>

      {/* ── 9. Rider Action Panel & Handover Controls ── */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-black text-base text-farmGreen-950">
              Rider Handover Controls
            </h3>
            <p className="text-xs text-farmMuted font-medium">Verify handover, collect OTP & record proof photo</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-800 text-white font-black text-xs">
            ● {currentOrder?.status}
          </span>
        </div>

        {/* Arrival Alert Button */}
        {!hasArrived ? (
          <button
            onClick={handleMarkArrived}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <Radio className="w-4 h-4 animate-pulse text-slate-950" />
            <span>Mark as Arrived at Customer Doorstep 📍</span>
          </button>
        ) : (
          <div className="p-3.5 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-black text-center border border-emerald-200 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Arrival Alert Sent • Waiting for Customer Doorstep Handover</span>
          </div>
        )}

        {/* COD Cash Collection Card (if applicable) */}
        {currentOrder?.paymentType?.includes('Cash') && (
          <div className={`p-4 rounded-2xl border transition-all ${
            codConfirmed ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'
          }`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={codConfirmed}
                onChange={(e) => setCodConfirmed(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-emerald-600 rounded cursor-pointer"
              />
              <div className="text-xs">
                <div className="font-black text-farmGreen-950">
                  Cash on Delivery (COD) Collection: ₹{currentOrder.amount || 240}
                </div>
                <div className="text-farmMuted font-medium mt-0.5">
                  Check this box once you have physically collected cash payment from the customer.
                </div>
              </div>
            </label>
          </div>
        )}

        {/* Photo Proof of Delivery Attachment */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-farmGreen-950">Photo Proof of Delivery</div>
              <div className="text-[11px] text-farmMuted">Optional doorstep drop-off / packet photo</div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleFileUpload(e, 'panel')} 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-slate-800 text-xs font-black rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5 w-full sm:w-auto justify-center"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{proofPhotoUrl ? 'Replace Photo' : 'Upload Proof'}</span>
            </button>
          </div>
        </div>

        {proofPhotoUrl && (
          <div className="relative rounded-2xl overflow-hidden border border-emerald-300 max-h-48">
            <img src={proofPhotoUrl} alt="Delivery proof" className="w-full h-48 object-cover" />
            <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
              ✓ Doorstep Proof Attached
            </span>
          </div>
        )}

        {/* Status Transitions */}
        <div className="space-y-3 pt-2">
          {currentOrder?.status === 'Assigned' && (
            <button
              onClick={() => onUpdateStatus(currentOrder.id, 'Accepted')}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              Accept Delivery Task 🟢
            </button>
          )}

          {currentOrder?.status === 'Accepted' && (
            <button
              onClick={() => onUpdateStatus(currentOrder.id, 'Picked Up')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl text-xs font-black cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              Confirm Pickup From Farm 🧺
            </button>
          )}

          {currentOrder?.status === 'Picked Up' && (
            <button
              onClick={() => onUpdateStatus(currentOrder.id, 'Out for Delivery')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              Start Delivery 🛵
            </button>
          )}

          {currentOrder?.status === 'Out for Delivery' && (
            <button
              onClick={handleOpenOtpModal}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-black cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <ShieldCheck className="w-5 h-5 text-amber-300" />
              <span>Verify Customer OTP PIN & Complete 🔑</span>
            </button>
          )}

          {currentOrder?.status === 'Delivered' && (
            <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-black border border-emerald-200 text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Order Successfully Completed & Delivered!</span>
            </div>
          )}

          {currentOrder?.status !== 'Delivered' && (
            <button
              onClick={() => setShowIssueModal(true)}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-black cursor-pointer transition-all mt-2 flex items-center justify-center gap-1.5"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Report Delivery Issue / Customer Unavailable</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 10. Customer Details & Pre-Call Script Card ── */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-black text-sm text-farmGreen-950">
            Customer Information & Pre-Call Assistance
          </h3>
          <button
            onClick={() => setShowCallScript(!showCallScript)}
            className="text-xs font-black text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{showCallScript ? 'Hide Call Script' : 'View Calling Script'}</span>
            {showCallScript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showCallScript && (
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1.5 animate-fadeIn">
            <div className="font-black text-[10px] uppercase text-emerald-800">Suggested Calling Script:</div>
            <p className="font-medium italic">
              "Hello {currentOrder?.customerName || 'Sir/Madam'}, this is your Local Farm delivery partner. I am currently on the road towards your address ({currentOrder?.customerAddress}) and will be at your doorstep in {remainingEtaMins} minutes. Please keep your 4-digit OTP ready."
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold pt-1">
          <div>
            <div className="text-farmMuted text-[10px] font-black uppercase">Customer Name</div>
            <div className="font-extrabold text-sm text-farmGreen-950 mt-0.5">{currentOrder?.customerName}</div>
          </div>

          <div>
            <div className="text-farmMuted text-[10px] font-black uppercase">Direct Call</div>
            <a
              href={`tel:${currentOrder?.customerPhone || '9876543210'}`}
              className="mt-1 inline-flex items-center gap-2 text-emerald-800 font-extrabold bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-all shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call {currentOrder?.customerPhone || '9876543210'}</span>
            </a>
          </div>

          <div>
            <div className="text-farmMuted text-[10px] font-black uppercase">Payment Mode</div>
            <div className="p-2 rounded-xl border mt-1 font-extrabold bg-emerald-50 border-emerald-200 text-emerald-950 text-center">
              {currentOrder?.paymentType || 'UPI Direct (Paid)'}
            </div>
          </div>
        </div>
      </div>

      {/* ── 11. Post-Delivery Rider Self Rating Summary (if completed) ── */}
      {currentOrder?.status === 'Delivered' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-black text-sm text-farmGreen-950 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Drop-off Experience Rating</span>
            </h3>
            <button
              onClick={() => setShowRatingModal(true)}
              className="text-xs font-black text-emerald-800 hover:underline cursor-pointer"
            >
              Rate Drop-off ⭐
            </button>
          </div>
          <div className="text-xs font-medium text-farmMuted">
            You rated this drop-off location {dropoffRating}/5 stars. Thanks for keeping our route dispatch data accurate!
          </div>
        </div>
      )}

      {/* ── OTP Verification Modal ── */}
      {showOtpModal && currentOrder && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-farmGreen-950">
                    Verify Customer OTP PIN
                  </h3>
                  <p className="text-xs text-farmMuted font-bold">{currentOrder.id} • {currentOrder.customerName}</p>
                </div>
              </div>
              <button onClick={() => setShowOtpModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyOtpAndComplete} className="space-y-4">
              
              <div className="space-y-2 text-center">
                <label className="text-xs font-black text-farmGreen-950 block">Enter 4-Digit Customer PIN</label>
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      ref={otpInputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otpDigits[idx]}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-12 h-14 text-center text-2xl font-mono font-black bg-gray-50 border-2 border-gray-200 focus:border-emerald-500 rounded-2xl focus:ring-2 focus:ring-emerald-200 outline-none transition-all shadow-xs"
                    />
                  ))}
                </div>
                <div className="text-[10px] text-farmMuted font-medium">Demo PINs: 4920 or 1234</div>
              </div>

              {otpError && (
                <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs text-center font-bold">
                  {otpError}
                </div>
              )}

              {currentOrder.paymentType?.includes('Cash') && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-amber-950">
                    <input
                      type="checkbox"
                      checked={codConfirmed}
                      onChange={(e) => setCodConfirmed(e.target.checked)}
                      className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                    />
                    <span>I confirm collection of ₹{currentOrder.amount || 240} in cash</span>
                  </label>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black text-farmGreen-950">
                  <span>Attach Doorstep Proof</span>
                  <input
                    ref={modalFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'otp')}
                  />
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer text-[11px]"
                  >
                    {otpPhotoUrl ? 'Change Photo' : '+ Take Photo / Gallery'}
                  </button>
                </div>
                {otpPhotoUrl && (
                  <img src={otpPhotoUrl} alt="Proof" className="w-full h-24 object-cover rounded-xl border border-emerald-200" />
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black text-farmGreen-950">
                  <span>Customer Digital Signature (Optional)</span>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-gray-400 hover:text-gray-700 font-bold text-[10px] cursor-pointer"
                  >
                    Clear Signature
                  </button>
                </div>
                <canvas
                  ref={signatureCanvasRef}
                  width={380}
                  height={90}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full bg-gray-50 border border-gray-300 rounded-2xl cursor-crosshair touch-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-extrabold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otpAttemptsLeft <= 0}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Verify & Deliver 🎉</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── Post-Delivery Tip Prompt Modal ── */}
      {showTipModal && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-emerald-100 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-lg text-farmGreen-950">Tip Request Sent!</h3>
              <p className="text-xs text-farmMuted font-medium mt-1">
                Share your direct UPI tipping link with {currentOrder?.customerName || 'customer'} via WhatsApp.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs font-mono text-farmGreen-950 font-bold">
              UPI: farmdelivery@okhdfcbank
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowTipModal(false);
                  setShowRatingModal(true);
                }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-black text-xs rounded-xl cursor-pointer"
              >
                Skip
              </button>
              <a
                href={`https://api.whatsapp.com/send?phone=91${currentOrder?.customerPhone || '9876543210'}&text=${encodeURIComponent(`Hi ${currentOrder?.customerName || 'Customer'}, thank you for receiving your Local Farm delivery! If you appreciated the prompt service, tips are welcome via UPI: farmdelivery@okhdfcbank. Have a great day!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setShowTipModal(false);
                  setShowRatingModal(true);
                }}
                className="flex-1 py-2.5 bg-emerald-700 text-white font-black text-xs rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Post-Delivery Rider Self-Rating Modal ── */}
      {showRatingModal && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-emerald-100 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Star className="w-7 h-7 fill-emerald-700 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-black text-lg text-farmGreen-950">Rate Drop-off Experience</h3>
              <p className="text-xs text-farmMuted font-medium mt-1">
                How easy was parking, customer response & access at {currentOrder?.customerAddress}?
              </p>
            </div>

            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setDropoffRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-125"
                >
                  <Star className={`w-7 h-7 ${star <= dropoffRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>

            <textarea
              value={ratingFeedback}
              onChange={(e) => setRatingFeedback(e.target.value)}
              placeholder="e.g. Lift under repair, guard requires visitor pass..."
              rows={2}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
            />

            <button
              onClick={() => {
                setShowRatingModal(false);
                if (showToast) showToast('Rating Saved ⭐', 'Thank you for updating route intelligence.');
              }}
              className="w-full py-2.5 bg-emerald-800 text-white font-black text-xs rounded-xl cursor-pointer shadow-md"
            >
              Submit Drop-off Rating
            </button>
          </div>
        </div>
      )}

      {/* ── Delivery Issue / Failure Modal ── */}
      {showIssueModal && currentOrder && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-rose-200 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-600 pb-3 border-b border-gray-100">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-black text-base text-farmGreen-950">
                  Report Delivery Issue ({currentOrder.id})
                </h3>
                <p className="text-xs text-farmMuted font-bold">Specify cause for unfulfilled delivery</p>
              </div>
            </div>

            <form onSubmit={handleReportIssueSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-farmGreen-950 block">Select Reason</label>
                <select
                  value={issueReason}
                  onChange={(e) => setIssueReason(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-xs font-extrabold rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  <option value="Customer Phone Unreachable">Customer Phone Unreachable</option>
                  <option value="Premises / Door Locked">Premises / Door Locked</option>
                  <option value="Incorrect Customer Address">Incorrect Customer Address</option>
                  <option value="Customer Refused Order">Customer Refused Order</option>
                  <option value="Traffic / Severe Road Obstacle">Traffic / Severe Road Obstacle</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-farmGreen-950 block">Notes & Details</label>
                <textarea
                  rows={3}
                  value={issueNotes}
                  onChange={(e) => setIssueNotes(e.target.value)}
                  placeholder="e.g. Ringing bell multiple times, customer not answering phone..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-extrabold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 text-white font-black text-xs rounded-xl hover:bg-rose-700 shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  Submit Issue Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Share Modal ── */}
      {showShareModal && currentOrder && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-emerald-100 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-farmGreen-950">
                    Share Live Tracking Link
                  </h3>
                  <p className="text-xs text-farmMuted font-bold">Send live GPS tracking link to customer</p>
                </div>
              </div>
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs font-mono break-all text-farmGreen-950 font-bold">
                https://localfarm.in/track/{currentOrder.id}
              </div>

              <button
                onClick={handleCopyShareLink}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                {copiedShareLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedShareLink ? 'Link Copied!' : 'Copy Live Tracking Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DeliveryTracking;
