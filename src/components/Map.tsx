"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* =======================
   Types
======================= */
interface Formation {
    rnd: string;
    etab_nom: string;
    etab_gps: { lat: number; lon: number } | null;
    nm: string[];
    fiche: string;
}

/* =======================
   Icône établissement (style image)
======================= */
const schoolIcon = L.divIcon({
    className: "",
    html: `
      <div style="
        background:#6D28D9;
        color:white;
        width:32px;
        height:32px;
        border-radius:9999px;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 4px 10px rgba(0,0,0,0.25);
        font-size:16px;
      ">
        🎓
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

/* =======================
   Logic Map (INCHANGÉE)
======================= */
function MapLogic() {
    const map = useMap();

    const [searchCity, setSearchCity] = useState("");
    const [schools, setSchools] = useState<Formation[]>([]);
    const [loadingGeo, setLoadingGeo] = useState(false);
    const [loadingSchools, setLoadingSchools] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    /* =======================
       Géocodage ville
    ======================= */
    const geocodeCity = async (city: string) => {
        setLoadingGeo(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    city
                )}&limit=1`
            );
            const data = await res.json();

            if (data.length > 0) {
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [
                    number,
                    number
                ];
            }
        } catch {
            setErrorMsg("Erreur lors du géocodage");
        } finally {
            setLoadingGeo(false);
        }
        return null;
    };

    /* =======================
       Fetch écoles
    ======================= */
    const fetchSchools = async (city: string) => {
        setLoadingSchools(true);
        try {
            const res = await fetch(
                `/api/map/school?city=${encodeURIComponent(city)}`
            );
            const data: Formation[] = await res.json();
            setSchools(data);
        } catch {
            setErrorMsg("Impossible de récupérer les écoles");
        } finally {
            setLoadingSchools(false);
        }
    };

    /* =======================
       Recherche ville
    ======================= */
    const searchCityHandler = async () => {
        if (!searchCity.trim()) return;

        const coords = await geocodeCity(searchCity);
        if (!coords) {
            setErrorMsg("Ville introuvable");
            return;
        }

        map.flyTo(coords, 13);
        setErrorMsg("");
        fetchSchools(searchCity);
    };

    /* =======================
       Géolocalisation
    ======================= */
    const locateUser = () => {
        if (!navigator.geolocation) {
            setErrorMsg("Géolocalisation non supportée");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                map.flyTo(
                    [pos.coords.latitude, pos.coords.longitude],
                    14
                );
            },
            () => setErrorMsg("Impossible de récupérer votre position")
        );
    };

    /* =======================
       Regroupement par coordonnées
    ======================= */
    const groupedByCoords = useMemo(() => {
        const groups: Record<string, Formation[]> = {};

        schools.forEach((s) => {
            if (!s.etab_gps) return;
            const key = `${s.etab_gps.lat}-${s.etab_gps.lon}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(s);
        });

        return Object.values(groups);
    }, [schools]);

    /* =======================
       UI (STYLE MODIFIÉ)
    ======================= */
    return (
        <>
            {/* Barre haute */}
            <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center gap-2">
                <button className="bg-violet-600 text-white rounded-full w-10 h-10 shadow flex items-center justify-center">
                    ←
                </button>

                <div className="flex gap-2 flex-1">
                    <div className="bg-violet-600 text-white px-4 py-2 rounded-full shadow text-sm">
                        Metro ▼
                    </div>
                    <div className="bg-violet-600 text-white px-4 py-2 rounded-full shadow text-sm">
                        Formation en alternance ▼
                    </div>

                    {/* Recherche ville (fonctionnelle) */}
                    <div className="bg-violet-600 text-white px-4 py-2 rounded-full shadow text-sm flex items-center gap-2">
                        📍
                        <input
                            type="text"
                            value={searchCity}
                            onChange={(e) => setSearchCity(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && searchCityHandler()
                            }
                            placeholder="Ville"
                            className="bg-transparent outline-none placeholder-white w-28"
                        />
                        {loadingGeo && (
                            <span className="animate-spin">⏳</span>
                        )}
                    </div>
                </div>

                <button className="bg-violet-600 text-white rounded-full w-10 h-10 shadow flex items-center justify-center">
                    ✕
                </button>
            </div>

            {/* Markers */}
            {!loadingSchools &&
                groupedByCoords.map((group) => {
                    const first = group[0];
                    return (
                        <Marker
                            key={`${first.etab_gps!.lat}-${first.etab_gps!.lon}`}
                            position={[
                                first.etab_gps!.lat,
                                first.etab_gps!.lon,
                            ]}
                            icon={schoolIcon}
                        >
                            <Popup className="rounded-xl">
                                <div className="w-64">
                                    <div className="flex justify-between items-center mb-2">
                                        <strong className="text-sm">
                                            {first.etab_nom}
                                        </strong>
                                        <button className="bg-violet-600 text-white rounded-full w-6 h-6 text-xs">
                                            +
                                        </button>
                                    </div>

                                    {group.map((f) => (
                                        <div
                                            key={f.rnd}
                                            className="text-xs text-gray-600 mb-2"
                                        >
                                            {f.nm.join(", ")}
                                            <br />
                                            <a
                                                href={f.fiche}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-violet-600 font-medium"
                                            >
                                                Voir la formation
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

            {/* Zoom */}
            <div className="absolute bottom-6 left-4 z-[1000] flex flex-col gap-2">
                <button
                    onClick={() => map.zoomIn()}
                    className="bg-violet-600 text-white rounded-full w-10 h-10 shadow text-lg"
                >
                    +
                </button>
                <button
                    onClick={() => map.zoomOut()}
                    className="bg-violet-600 text-white rounded-full w-10 h-10 shadow text-lg"
                >
                    −
                </button>
            </div>

            {/* Compteur */}
            <div className="absolute bottom-6 right-4 bg-white rounded-full shadow px-4 py-2 text-xs z-[1000]">
                🎓 {groupedByCoords.length} établissements · {schools.length} formations
            </div>

            {/* Erreurs */}
            {errorMsg && (
                <div className="absolute bottom-16 right-4 bg-white text-red-500 shadow rounded px-3 py-2 text-sm z-[1000]">
                    {errorMsg}
                </div>
            )}
        </>
    );
}

/* =======================
   Map Container
======================= */
export default function Map() {
    return (
        <MapContainer
            center={[48.8566, 2.3522]}
            zoom={6}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapLogic />
        </MapContainer>
    );
}
