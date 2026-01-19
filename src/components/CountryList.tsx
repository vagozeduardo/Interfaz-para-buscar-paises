import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query"; // Importación clave
import { type Country } from "../types/country";
import { CountryCard } from "./CountryCard";
import { Pagination } from "./Pagination";

// Componente visual para el estado de carga (Skeleton)
const SkeletonCard = () => (
  <div className="mosaic-item skeleton-pulse">
    <div className="flag-wrapper" style={{ backgroundColor: "#e0e0e0" }}></div>
    <div className="info-card">
      <div style={{ height: "15px", background: "#eee", marginBottom: "10px" }}></div>
      <div style={{ height: "10px", background: "#eee", width: "60%" }}></div>
    </div>
  </div>
);

export const CountryList = () => {
  // --- 1. ESTADOS DE PERSISTENCIA ---
  const [endpoint, setEndpoint] = useState<string>(
    () =>
      localStorage.getItem("last_endpoint") ||
      "all?fields=name,flags,cca3,region,population,capital",
  );

  const [currentPage, setCurrentPage] = useState<number>(
    () => Number(localStorage.getItem("last_page")) || 1,
  );

  const countriesPerPage = 15;

  // --- 2. MANEJO DE ESTADO CON REACT QUERY ---
  // Reemplaza los useEffect y useState manuales de carga
  const {
    data: countries = [],
    isLoading,
    isError,
  } = useQuery<Country[]>({
    queryKey: ["countries", endpoint], // Cachea los datos basados en el endpoint
    queryFn: async () => {
      const response = await fetch(`https://restcountries.com/v3.1/${endpoint}`);
      if (!response.ok) throw new Error("Error en la API");
      const data = await response.json();
      return data.sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common));
    },
    staleTime: 1000 * 60 * 5, // Los datos se consideran "frescos" por 5 minutos
  });

  // Guardar en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("last_endpoint", endpoint);
    localStorage.setItem("last_page", currentPage.toString());
  }, [endpoint, currentPage]);

  // --- 3. EVENTOS DEL DOM (index.html) ---
  useEffect(() => {
    const handleRegionClick = (e: Event) => {
      const option = (e.target as HTMLElement).closest("option");
      if (option) {
        const newEp = option.getAttribute("data-endpoint");
        if (newEp) {
          setEndpoint(newEp);
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
        setEndpoint(
          `translation/${input.value.trim()}?fields=name,flags,cca3,region,population,capital`,
        );
        setCurrentPage(1);
      }
    };

    const selectEl = document.querySelector(".OpcionesBusqueda select");
    const btnBus = document.getElementById("BtnBuscar");

    selectEl?.addEventListener("click", handleRegionClick);
    btnBus?.addEventListener("click", handleSearchClick);

    return () => {
      selectEl?.removeEventListener("click", handleRegionClick);
      btnBus?.removeEventListener("click", handleSearchClick);
    };
  }, []);

  // --- 4. LÓGICA DE PAGINACIÓN ---
  const indexOfLastItem = currentPage * countriesPerPage;
  const currentItems = countries.slice(indexOfLastItem - countriesPerPage, indexOfLastItem);
  const totalPages = Math.ceil(countries.length / countriesPerPage);

  // --- 5. RENDERIZADO ---
  return (
    <div className="main-content-wrapper">
      <div className="countries-mosaic">
        {isLoading ? (
          // Mostramos 15 skeletons mientras carga
          Array(15)
            .fill(0)
            .map((_, i) => <SkeletonCard key={i} />)
        ) : isError || countries.length === 0 ? (
          <div className="text-center w-100 py-5">
            <h4>No se encontraron resultados</h4>
          </div>
        ) : (
          currentItems.map((country) => <CountryCard key={country.cca3} country={country} />)
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
