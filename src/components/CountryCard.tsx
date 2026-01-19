import { memo } from "react"; //
import { useNavigate } from "react-router-dom";
import { type Country } from "../types/country";

interface CountryCardProps {
  country: Country;
}

/**
 * Componente memorizado para evitar rerenderizados innecesarios en listas largas.
 */
export const CountryCard = memo(({ country }: CountryCardProps) => {
  const navigate = useNavigate();
  const { name, flags, cca3, region } = country;

  const handleNavigation = () => {
    navigate(`/country/${cca3}`);
  };

  return (
    <article
      className="mosaic-item"
      onClick={handleNavigation}
      title={`Ver detalles de ${name.common}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleNavigation()}
    >
      <div className="flag-wrapper">
        <img
          src={flags.svg}
          alt={`Bandera de ${name.common}`}
          loading="lazy" //
          style={{ transition: "opacity 0.3s" }}
        />
      </div>

      <div className="info-card">
        <h6 className="mb-1 text-truncate fw-bold">{name.common}</h6>
        <p className="mb-0 text-muted small">{region}</p>
      </div>
    </article>
  );
});

// Nombre para facilitar el debugging en React DevTools
CountryCard.displayName = "CountryCard";
