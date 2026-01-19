// src/components/CountryList.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Country } from "../types/country";

export const CountryList = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [endpoint, setEndpoint] = useState("all?fields=name,flags,cca3,region,name");
  const navigate = useNavigate();

  // --- NUEVOS ESTADOS PARA PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);
  const countriesPerPage = 12; // Número de países por página

  useEffect(() => {
    const handleRegionClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const option = target.closest("option");

      if (option) {
        const newEndpoint = option.getAttribute("data-endpoint");
        if (newEndpoint) {
          setEndpoint(newEndpoint);
          const selectedText = document.querySelector("selectedcontent");
          if (selectedText) selectedText.textContent = option.textContent;
        }
      }
    };

    const handleSearchClick = (e: Event) => {
      e.preventDefault(); // Evita recargas accidentales
      const input = document.getElementById("inputBuscar") as HTMLInputElement;
      const query = input?.value.trim();

      if (query) {
        setEndpoint(`translation/${query}?fields=name,flags,cca3,region`);
      }
    };

    const selectContainer = document.querySelector(".OpcionesBusqueda select");
    const searchBtn = document.getElementById("BtnBuscar");

    selectContainer?.addEventListener("click", handleRegionClick);
    searchBtn?.addEventListener("click", handleSearchClick);

    return () => {
      selectContainer?.removeEventListener("click", handleRegionClick);
      searchBtn?.removeEventListener("click", handleSearchClick);
    };
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/${endpoint}`);
        if (!response.ok) throw new Error("País no encontrado");

        const data = await response.json();
        const sorted = data.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common),
        );

        setCountries(sorted);
        setCurrentPage(1); // Importante: volver a la página 1 en cada nueva búsqueda/filtro
      } catch (error) {
        console.error("Error:", error);
        setCountries([]);
      }
    };

    fetchCountries();
  }, [endpoint]);

  // --- LÓGICA DE PAGINACIÓN ---
  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = countries.slice(indexOfFirstCountry, indexOfLastCountry);
  const totalPages = Math.ceil(countries.length / countriesPerPage);

  return (
    <div className="container-fluid px-4 mt-4">
      {/* row-cols permite definir cuántos elementos hay por fila fácilmente */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {currentCountries.length > 0 ? (
          currentCountries.map((country) => (
            <div key={country.cca3} className="col d-flex">
              {/* d-flex y h-100 aseguran que todas las tarjetas midan lo mismo en la misma fila */}
              <div
                className="card h-100 shadow-sm border-0 country-card-hover w-100"
                style={{ cursor: "pointer", borderRadius: "10px", overflow: "hidden" }}
                onClick={() => navigate(`/country/${country.cca3}`)}
              >
                {/* Contenedor de imagen con altura fija para efecto mosaico */}
                <div style={{ height: "160px", overflow: "hidden" }}>
                  <img
                    src={country.flags.svg}
                    className="card-img-top w-100 h-100"
                    alt={country.name.common}
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <div className="card-body d-flex flex-column justify-content-center bg-light">
                  <h6 className="fw-bold mb-1 text-dark text-center">{country.name.common}</h6>
                  <p className="text-muted small mb-0 text-center">
                    <i className="bi bi-geo-alt"></i> {country.region}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center py-5">No se encontraron países.</p>
          </div>
        )}
      </div>

      {/* --- CONTROLES DE PAGINACIÓN --- */}
      {countries.length > countriesPerPage && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-5 mb-5">
          <button
            className="btn btn-primary px-4 shadow-sm"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => prev - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Anterior
          </button>

          <span className="badge bg-white text-dark border px-3 py-2 shadow-sm">
            Página {currentPage} de {totalPages}
          </span>

          <button
            className="btn btn-primary px-4 shadow-sm"
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};
