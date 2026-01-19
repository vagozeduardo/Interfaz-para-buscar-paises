// src/components/CountryList.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Country } from "../types/country";

export const CountryList = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [endpoint, setEndpoint] = useState("all?fields=name,flags,cca3,region");
  const navigate = useNavigate();

  useEffect(() => {
    const handleRegionClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const option = target.closest("option"); // Asegúrate que tu HTML tenga esta clase

      if (option) {
        const newEndpoint = option.getAttribute("data-endpoint");
        if (newEndpoint) {
          setEndpoint(newEndpoint);
          const selectedText = document.querySelector("selectedcontent");
          if (selectedText) selectedText.textContent = option.textContent;
        }
      }
    };

    // --- LÓGICA PARA EL INPUT DE BÚSQUEDA ---
    const handleSearchClick = () => {
      const input = document.getElementById("inputBuscar") as HTMLInputElement;
      const query = input?.value.trim();

      if (query) {
        // Usamos el endpoint de translation que pediste
        setEndpoint(`translation/${query}?fields=name,flags,cca3,region`);
      }
    };

    // Seleccionamos los elementos del index.html
    const selectContainer = document.querySelector(".OpcionesBusqueda select");
    const searchBtn = document.getElementById("BtnBuscar");

    // Añadimos los eventos
    selectContainer?.addEventListener("click", handleRegionClick as EventListener);
    searchBtn?.addEventListener("click", handleSearchClick);

    // Limpieza al desmontar
    return () => {
      selectContainer?.removeEventListener("click", handleRegionClick as EventListener);
      searchBtn?.removeEventListener("click", handleSearchClick);
    };
  }, []);

  // --- EFECTO QUE HACE LA PETICIÓN A LA API ---
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/${endpoint}`);

        if (!response.ok) throw new Error("País no encontrado");

        const data = await response.json();

        // Ordenar alfabéticamente
        const sorted = data.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common),
        );

        setCountries(sorted);
      } catch (error) {
        console.error("Error:", error);
        setCountries([]); // Limpiar lista si no hay resultados
      }
    };

    fetchCountries();
  }, [endpoint]);

  return (
    <div className="row">
      {countries.length > 0 ? (
        countries.map((country) => (
          <div key={country.cca3} className="col-md-4 mb-4">
            <div className="card h-100" onClick={() => navigate(`/country/${country.cca3}`)}>
              <img src={country.flags.svg} className="card-img-top" alt={country.name.common} />
              <div className="card-body">
                <h5>{country.name.common}</h5>
                <p className="text-muted small">{country.name.official}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center w-100">No se encontraron países.</p>
      )}
    </div>
  );
};
