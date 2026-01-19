import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type Country } from "../types/country";

export const CountryDetail = () => {
  const { id } = useParams(); // Captura el :id de la URL (ej: /country/MEX)
  const navigate = useNavigate();
  const [country, setCountry] = useState<any>(null); // Usamos any o extendemos la interfaz

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        // Consultamos por el código alpha (cca3)
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${id}`);
        const data = await response.json();
        setCountry(data[0]);
      } catch (error) {
        console.error("Error cargando el detalle:", error);
      }
    };
    fetchCountryData();
  }, [id]);

  if (!country) return <p className="text-center mt-5">Cargando información...</p>;

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-primary mb-4" onClick={() => navigate("/")}>
        ← Volver a la lista
      </button>

      <div className="row">
        <div className="col-md-6">
          <img src={country.flags.svg} alt={country.name.common} className="img-fluid shadow" />
        </div>
        <div className="col-md-6">
          <h1>{country.name.common}</h1>
          <p>
            <strong>Nombre Oficial:</strong> {country.name.official}
          </p>
          <p>
            <strong>Capital:</strong> {country.capital?.[0]}
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
              .map((c: any) => c.name)
              .join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};
