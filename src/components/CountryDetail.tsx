import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type Country } from "../types/country";

export const CountryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState<any>(null);
  // Estado para guardar la información completa de las fronteras
  const [borderCountries, setBorderCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${id}`);
        const data = await response.json();
        const mainCountry = data[0];
        setCountry(mainCountry);

        // Si el país tiene fronteras, buscamos sus detalles (nombre y bandera)
        if (mainCountry.borders && mainCountry.borders.length > 0) {
          const codes = mainCountry.borders.join(",");
          const bordersRes = await fetch(
            `https://restcountries.com/v3.1/alpha?codes=${codes}&fields=name,flags,cca3`,
          );
          const bordersData = await bordersRes.json();
          setBorderCountries(bordersData);
        } else {
          setBorderCountries([]);
        }
      } catch (error) {
        console.error("Error cargando el detalle:", error);
      }
    };
    fetchCountryData();
  }, [id]);

  if (!country) return <p className="text-center mt-5">Cargando información...</p>;

  return (
    <div className="container mt-5 pb-5">
      <button className="btn btn-outline-primary mb-4" onClick={() => navigate("/")}>
        ← Volver a la lista
      </button>

      <div className="row mb-5">
        <div className="col-md-6">
          <img
            src={country.flags.svg}
            alt={country.name.common}
            className="img-fluid shadow rounded"
          />
        </div>
        <div className="col-md-6">
          <h1 className="fw-bold">{country.name.common}</h1>
          <hr />
          <p>
            <strong>Nombre Oficial:</strong> {country.name.official}
          </p>
          <p>
            <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
          </p>
          <p>
            <strong>Región:</strong> {country.region}
          </p>
          <p>
            <strong>Subregión:</strong> {country.subregion}
          </p>
          <p>
            <strong>Población:</strong> {country.population.toLocaleString()}
          </p>
          <p>
            <strong>Monedas:</strong>{" "}
            {Object.values(country.currencies || {})
              .map((c: any) => `${c.name} (${c.symbol})`)
              .join(", ")}
          </p>
        </div>
      </div>

      {/* SECCIÓN DE PAÍSES FRONTERIZOS */}
      <div className="mt-5">
        <h3 className="mb-4">Países Fronterizos</h3>
        {borderCountries.length > 0 ? (
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
            {borderCountries.map((border) => (
              <div key={border.cca3} className="col">
                <div
                  className="card h-100 shadow-sm border-0 text-center p-2"
                  style={{ cursor: "pointer", transition: "0.3s" }}
                  onClick={() => navigate(`/country/${border.cca3}`)}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
            ))}
          </div>
        ) : (
          <p className="text-muted italic">
            Este país no comparte fronteras terrestres (es una isla o territorio aislado).
          </p>
        )}
      </div>
    </div>
  );
};
