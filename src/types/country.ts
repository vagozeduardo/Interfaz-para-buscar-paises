// src/types/country.ts

/**
 * Interfaz que define la estructura de un objeto País
 * según la respuesta de la API restcountries.com
 */
export interface Country {
  name: {
    common: string;
    official: string;
    // Opcional: podrías agregar 'nativeName' si lo necesitas después
  };
  flags: {
    svg: string;
    png: string;
    alt?: string; // Algunas banderas traen texto alternativo descriptivo
  };
  cca3: string; // Código de 3 letras (ej: 'MEX')
  region: string; // Continente
  subregion?: string; // Sub-continente (ej: 'Central America')
  capital?: string[]; // La capital viene como un Array de strings
  population: number;

  // Estructura para las fronteras (códigos cca3)
  borders?: string[];

  // Estructura dinámica para monedas (ej: { "MXN": { "name": "Mexican peso", "symbol": "$" } })
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };

  // Estructura para lenguajes (ej: { "spa": "Spanish" })
  languages?: {
    [key: string]: string;
  };
}
