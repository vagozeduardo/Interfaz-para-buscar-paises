import { memo } from "react";

/**
 * Interfaz para las propiedades del componente.
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Componente de navegación memorizado.
 * Evita que la barra de paginación se procese de nuevo si los datos no han cambiado.
 */
export const Pagination = memo(({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // Retorno temprano: si no hay más de una página, no ocupamos espacio en el DOM
  if (totalPages <= 1) return null;

  // Variables booleanas para simplificar el JSX
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav
      className="custom-pagination fixed-bottom bg-white border-top p-3 d-flex justify-content-center align-items-center"
      aria-label="Navegación de resultados"
    >
      {/* Botón Anterior */}
      <button
        className="btn btn-primary shadow-sm px-4"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
        aria-disabled={isFirstPage}
      >
        &larr; Anterior
      </button>

      {/* Indicador de posición actual con énfasis visual */}
      <div className="page-indicator mx-4 fw-bold shadow-sm border rounded-pill px-3 py-1 bg-light">
        <span className="text-muted small">Pág.</span> {currentPage}
        <span className="text-muted small"> / </span> {totalPages}
      </div>

      {/* Botón Siguiente */}
      <button
        className="btn btn-primary shadow-sm px-4"
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
        aria-disabled={isLastPage}
      >
        Siguiente &rarr;
      </button>
    </nav>
  );
});

// Nombre descriptivo para herramientas de desarrollo
Pagination.displayName = "Pagination";
