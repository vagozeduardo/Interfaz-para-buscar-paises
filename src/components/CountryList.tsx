import { useState, useEffect } from "react";
import { type Country } from "../types/country";
import { CountryCard } from "./CountryCard";
import { Pagination } from "./Pagination";

export const CountryList = () => {
  // 1. Recuperamos el endpoint y la página del localStorage al iniciar
  const [endpoint, setEndpoint] = useState<string>(() => {
    return localStorage.getItem("last_endpoint") || "all?fields=name,flags,cca3,region";
  });

  const [currentPage, setCurrentPage] = useState<number>(() => {
    return Number(localStorage.getItem("last_page")) || 1;
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const countriesPerPage = 15;

  // EFECTO 1: Manejo de Eventos del index.html (Solo se ejecuta al montar)
  useEffect(() => {
    const handleRegionClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const option = target.closest("option");
      if (option) {
        const newEndpoint = option.getAttribute("data-endpoint");
        if (newEndpoint) {
          setEndpoint(newEndpoint);
          // Reiniciamos página al cambiar región
          setCurrentPage(1);
          const selectedText = document.querySelector("selectedcontent");
          if (selectedText) selectedText.textContent = option.textContent;
        }
      }
    };

    const handleSearchClick = (e: Event) => {
      e.preventDefault();
      const input = document.getElementById("inputBuscar") as HTMLInputElement;
      if (input?.value.trim()) {
        setEndpoint(`translation/${input.value.trim()}?fields=name,flags,cca3,region`);
        setCurrentPage(1); // Reiniciamos página al buscar
      }
    };

    // SINCRONIZACIÓN VISUAL: Poner el texto correcto en el select al volver
    const savedEndpoint = localStorage.getItem("last_endpoint");
    if (savedEndpoint) {
      const matchingOption = document.querySelector(`option[data-endpoint="${savedEndpoint}"]`);
      const selectedText = document.querySelector("selectedcontent");
      if (matchingOption && selectedText) {
        selectedText.textContent = matchingOption.textContent;
      }
    }

    document
      .querySelector(".OpcionesBusqueda select")
      ?.addEventListener("click", handleRegionClick);
    document.getElementById("BtnBuscar")?.addEventListener("click", handleSearchClick);

    return () => {
      document
        .querySelector(".OpcionesBusqueda select")
        ?.removeEventListener("click", handleRegionClick);
      document.getElementById("BtnBuscar")?.removeEventListener("click", handleSearchClick);
    };
  }, []);

  // EFECTO 2: Petición a la API y persistencia en LocalStorage
  useEffect(() => {
    const fetchCountries = async () => {
      // Guardamos el estado actual en el navegador
      localStorage.setItem("last_endpoint", endpoint);
      localStorage.setItem("last_page", currentPage.toString());

      try {
        const response = await fetch(`https://restcountries.com/v3.1/${endpoint}`);
        const data = await response.json();
        const sorted = data.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common),
        );
        setCountries(sorted);
      } catch {
        setCountries([]);
      }
    };
    fetchCountries();
  }, [endpoint, currentPage]); // Se dispara si cambia el filtro o la página

  // Lógica de rebanado para el mosaico
  const indexOfLast = currentPage * countriesPerPage;
  const indexOfFirst = indexOfLast - countriesPerPage;
  const currentItems = countries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(countries.length / countriesPerPage);

  return (
    <div className="main-content-wrapper">
      <div className="countries-mosaic">
        {currentItems.length > 0 ? (
          currentItems.map((country) => <CountryCard key={country.cca3} country={country} />)
        ) : (
          <div className="text-center w-100 py-5">
            <h4>No se encontraron resultados</h4>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
};
