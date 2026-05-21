"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Formation, MapLogicProps } from "../shard/types.ts";

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

function MapLogic({ city, suggestedJobs: _s }: MapLogicProps) {
  const map = useMap();

    useEffect(() => {
        map.doubleClickZoom.disable();
    }, [map]);

    const [searchCity, setSearchCity] = useState(city || "");
    const [schools, setSchools] = useState<Formation[]>([]);
    const [loadingGeo, setLoadingGeo] = useState(false);
    const [loadingSchools, setLoadingSchools] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [formationType, setFormationType] = useState("");
    const [filterByJobs, setFilterByJobs] = useState(true);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [loadingFav, setLoadingFav] = useState<string | null>(null);

    const fetchSchools = async (city: string, withFilter: boolean = filterByJobs) => {
        setLoadingSchools(true);
        try {
            const { supabase } = await import("../lib/supabase");
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch(
                `/api/map/school?city=${encodeURIComponent(city)}&type=${formationType}&filter=${withFilter}`,
                {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            const data: Formation[] = await res.json();
            setSchools(data);
        } catch {
            setErrorMsg("Impossible de récupérer les écoles");
        } finally {
            setLoadingSchools(false);
        }
    };

    const geocodeCity = async (city: string) => {
        setLoadingGeo(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`
            );
            const data = await res.json();
            if (data.length > 0) {
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number];
            }
        } catch {
            setErrorMsg("Erreur lors du géocodage");
        } finally {
            setLoadingGeo(false);
        }
        return null;
    };

    const handleAddFavorite = async (formation: Formation) => {
        const id = formation.rnd;
        if (favoriteIds.has(id) || loadingFav === id) return;

        setLoadingFav(id);
        try {
            const { supabase } = await import("../lib/supabase");
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch("/api/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    resourceType: "SCHOOL",
                    resourceExternalId: formation.rnd,
                    resourceData: {
                        rnd: formation.rnd,
                        etab_nom: formation.etab_nom,
                        etab_gps: formation.etab_gps,
                        nm: formation.nm,
                        fiche: formation.fiche,
                    },
                }),
            });

            if (res.ok) {
                setFavoriteIds((prev) => new Set([...prev, id]));
            } else {
                setErrorMsg("Impossible d'ajouter en favori");
            }
        } catch {
            setErrorMsg("Erreur lors de l'ajout en favori");
        } finally {
            setLoadingFav(null);
        }
    };

    useEffect(() => {
        if (city) {
            setSearchCity(city);
            fetchSchools(city);
        }
    }, [city]);

    useEffect(() => {
        if (searchCity) {
            fetchSchools(searchCity);
        }
    }, [formationType]);

    const handleToggleFilter = () => {
        const newFilter = !filterByJobs;
        setFilterByJobs(newFilter);
        if (searchCity) {
            fetchSchools(searchCity, newFilter);
        }
    };

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

    const locateUser = () => {
        if (!navigator.geolocation) {
            setErrorMsg("Géolocalisation non supportée");
            return;
        }
      },
      () => {
        setErrorMsg("Impossible de récupérer votre position");
        setLoadingGeo(false);
      },
    );
  };

        setLoadingGeo(true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                map.flyTo([latitude, longitude], 13);

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();

                    const city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.municipality;

                    if (city) {
                        setSearchCity(city);
                        fetchSchools(city);
                    } else {
                        setErrorMsg("Ville non trouvée pour cette position");
                    }
                } catch {
                    setErrorMsg("Erreur lors de la récupération de la ville");
                } finally {
                    setLoadingGeo(false);
                }
            },
            () => {
                setErrorMsg("Impossible de récupérer votre position");
                setLoadingGeo(false);
            }
        );
    };

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

    return (
        <>
            {/* Barre haute */}
            <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center gap-2">
                <button className="bg-violet-600 text-white rounded-full w-10 h-10 shadow flex items-center justify-center">
                    ←
                </button>

                <div className="flex gap-2 flex-1 justify-end flex-wrap">
                    {/* Toggle filtre métiers */}
                    <button
                        onClick={handleToggleFilter}
                        className={`w-10 h-10 rounded-full shadow text-lg transition-colors flex items-center justify-center border border-violet-600 ${
                            filterByJobs
                                ? "bg-violet-600 text-white hover:bg-violet-700"
                                : "bg-white text-violet-600 hover:bg-violet-50"
                        }`}
                        title={filterByJobs ? "Afficher toutes les formations" : "Afficher les formations recommandées (IA)"}
                    >
                        {filterByJobs ? "🎯" : "🌐"}
                    </button>

                    {/* Transport */}
                    <div className="relative">
                        <select className="appearance-none bg-violet-600 text-white px-6 pr-10 h-10 rounded-lg shadow text-sm outline-none cursor-pointer">
                            <option value="">Transport</option>
                            <option value="bus">Bus</option>
                            <option value="metro">Métro</option>
                            <option value="tramway">Tramway</option>
                            <option value="gare">Gare</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>

                    {/* Formation */}
                    <div className="relative">
                        <select
                            value={formationType}
                            onChange={(e) => setFormationType(e.target.value)}
                            className="appearance-none bg-violet-600 text-white px-6 pr-10 h-10 rounded-lg shadow text-sm outline-none cursor-pointer"
                        >
                            <option value="">Toutes les formations</option>
                            <option value="alternance">Formation en alternance</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>

                    {/* Recherche ville + géoloc */}
                    <div className="bg-violet-600 text-white px-4 h-10 rounded-lg shadow text-sm flex items-center gap-2">
                        <button
                            onClick={locateUser}
                            className="w-6 h-6 flex items-center justify-center bg-white text-violet-600 rounded shadow hover:bg-gray-100 transition-colors"
                            title="Géolocaliser"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </button>

                        <input
                            type="text"
                            value={searchCity}
                            onChange={(e) => setSearchCity(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && searchCityHandler()}
                            placeholder="Ville"
                            className="bg-transparent outline-none placeholder-white w-28"
                        />

                        {loadingGeo && <span className="animate-spin">⏳</span>}
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

                <button className="bg-violet-600 text-white rounded-full w-10 h-10 shadow flex items-center justify-center invisible">
                    ✕
                </button>
            </div>

            {/* Markers */}
            {!loadingSchools &&
                groupedByCoords.map((group) => {
                    const first = group[0];
                    const allFaved = group.every((f) => favoriteIds.has(f.rnd));
                    const anyLoading = group.some((f) => loadingFav === f.rnd);

                    return (
                        <Marker
                            key={`${first.etab_gps!.lat}-${first.etab_gps!.lon}`}
                            position={[first.etab_gps!.lat, first.etab_gps!.lon]}
                            icon={schoolIcon}
                        >
                            <Popup className="rounded-xl">
                                <div className="w-64">
                                    <div className="flex justify-between items-center mb-2">
                                        <strong className="text-sm">{first.etab_nom}</strong>
                                        <button
                                            onClick={() => group.forEach((f) => handleAddFavorite(f))}
                                            disabled={allFaved || anyLoading}
                                            title={allFaved ? "Déjà en favoris" : "Ajouter en favoris"}
                                            className={`rounded-full w-6 h-6 text-xs font-bold transition-colors flex items-center justify-center
                                                ${allFaved
                                                ? "bg-green-500 text-white cursor-default"
                                                : "bg-violet-600 text-white hover:bg-violet-700"
                                            }`}
                                        >
                                            {anyLoading ? "⏳" : allFaved ? "✓" : "+"}
                                        </button>
                                    </div>
                                    {group.map((f) => (
                                        <div key={f.rnd} className="text-xs text-gray-600 mb-2">
                                            {f.nm.join(", ")}
                                            <br />
                                            <a href={f.fiche} target="_blank" rel="noopener noreferrer" className="text-violet-600 font-medium">
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
                <button onClick={() => map.zoomIn()} className="bg-violet-600 text-white rounded-full w-10 h-10 shadow text-lg">+</button>
                <button onClick={() => map.zoomOut()} className="bg-violet-600 text-white rounded-full w-10 h-10 shadow text-lg">−</button>
            </div>

            {/* Compteur */}
            <div className="absolute bottom-6 right-4 bg-white rounded-full shadow px-4 py-2 text-xs z-[1000]">
                🎓 {groupedByCoords.length} établissements · {schools.length} formations
                {filterByJobs && <span className="ml-2 text-violet-600 font-medium">· Filtre métiers actif</span>}
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

export interface MapProps {
  city?: string;
  suggestedJobs?: string[];
}

const Map = ({ city, suggestedJobs }: MapProps) => {
    return (
        <MapContainer
            center={[48.8566, 2.3522]}
            zoom={6}
            zoomControl={false}
            doubleClickZoom={false}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapLogic city={city} suggestedJobs={suggestedJobs} />
        </MapContainer>
    );
};

export default Map;