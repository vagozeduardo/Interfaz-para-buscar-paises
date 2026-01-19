import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { type Country } from "../types/country";

/**
 * Componente de Página de Detalle optimizado con React Query.
 */
export const CountryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- 1. CONSULTA PRINCIPAL: Datos del país ---
  const {
    data: country,
    isLoading: isCountryLoading,
    isError: isCountryError,
  } = useQuery<Country>({
    queryKey: ["country", id],
    queryFn: async () => {
      const res = await fetch(`https://restcountries.com/v3.1/alpha/${id}`);
      if (!res.ok) throw new Error("País no encontrado");
      const data = await res.json();
      return data[0];
    },
    staleTime: 1000 * 60 * 10, // Cache de 10 minutos
  });

  // --- 2. CONSULTA DEPENDIENTE: Países fronterizos ---
  // Solo se ejecuta si el país principal tiene fronteras
  const { data: borderCountries = [], isLoading: isBordersLoading } = useQuery<Country[]>({
    queryKey: ["borders", country?.borders],
    queryFn: async () => {
      if (!country?.borders || country.borders.length === 0) return [];
      const codes = country.borders.join(",");
      const res = await fetch(
        `https://restcountries.com/v3.1/alpha?codes=${codes}&fields=name,flags,cca3`,
      );
      return await res.json();
    },
    enabled: !!country?.borders && country.borders.length > 0, // Solo dispara si hay fronteras
  });

  // --- 3. MANEJO DE ESTADOS DE CARGA Y ERROR ---
  if (isCountryLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <h5 className="mt-3 skeleton-pulse">Cargando detalles del país...</h5>
      </div>
    );
  }

  if (isCountryError || !country) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">Error: No se pudo cargar la información.</div>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    );
  }

  const { name, flags, capital, region, subregion, population, currencies } = country;

  return (
    <main className="container mt-5 pb-5">
      <button className="btn btn-outline-primary mb-4 shadow-sm" onClick={() => navigate("/")}>
        &larr; Volver a la lista
      </button>

      <section className="row mb-5 align-items-center">
        <div className="col-md-6">
          <img
            src={flags.svg}
            alt={`Bandera de ${name.common}`}
            className="img-fluid shadow-lg rounded"
            style={{ maxHeight: "400px", width: "100%", objectFit: "contain" }}
          />
        </div>

        <div className="col-md-6">
          <h1 className="fw-bold display-5">{name.common}</h1>
          <p className="text-muted mb-4">{name.official}</p>
          <hr />

          <div className="row">
            <div className="col-sm-6">
              <p>
                <strong>Capital:</strong> {capital?.[0] || "N/A"}
              </p>
              <p>
                <strong>Región:</strong> {region}
              </p>
              <p>
                <strong>Subregión:</strong> {subregion}
              </p>
            </div>
            <div className="col-sm-6">
              <p>
                <strong>Población:</strong> {population.toLocaleString()}
              </p>
              <p>
                <strong>Monedas:</strong>{" "}
                {Object.values(currencies || {})
                  .map((c: any) => `${c.name} (${c.symbol})`)
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE FRONTERAS CON SKELETON PROPIO */}
      <section className="mt-5 border-top pt-4">
        <h3 className="mb-4 fw-bold">Países Fronterizos</h3>

        {isBordersLoading ? (
          <div className="text-center py-4 skeleton-pulse">Cargando países vecinos...</div>
        ) : borderCountries.length > 0 ? (
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
            {borderCountries.map((border) => (
              <BorderCard
                key={border.cca3}
                border={border}
                onClick={() => navigate(`/country/${border.cca3}`)}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted fst-italic">Este país no tiene fronteras terrestres.</p>
        )}
      </section>
    </main>
  );
};

const BorderCard = ({ border, onClick }: { border: Country; onClick: () => void }) => (
  <div className="col">
    <div
      className="card h-100 shadow-sm border-0 text-center p-2 border-hover-effect"
      style={{ cursor: "pointer", transition: "all 0.3s ease" }}
      onClick={onClick}
    >
      <img
        src={border.flags.svg}
        alt={border.name.common}
        style={{ height: "50px", objectFit: "cover", borderRadius: "4px" }}
      />
      <div className="card-body p-2">
        <p className="small fw-bold mb-0 text-truncate">{border.name.common}</p>
      </div>
    </div>
  </div>
);
