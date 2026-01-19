interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="custom-pagination">
      <button
        className="btn btn-primary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </button>

      <div className="page-indicator">
        Página {currentPage} de {totalPages}
      </div>

      <button
        className="btn btn-primary"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente
      </button>
    </div>
  );
};
