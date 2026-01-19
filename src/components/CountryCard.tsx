// src/components/CountryCard.tsx
import { useNavigate } from "react-router-dom";
import { type Country } from "../types/country";

export const CountryCard = ({ country }: { country: Country }) => {
  const navigate = useNavigate();

  return (
    <div className="mosaic-item" onClick={() => navigate(`/country/${country.cca3}`)}>
      <div className="flag-wrapper">
        <img src={country.flags.svg} alt={country.name.common} />
      </div>
      <div className="info-card">
        <h6>{country.name.common}</h6>
        <p>{country.region}</p>
      </div>
    </div>
  );
};
