import { type Country } from "../types/country";

// Base de la URL centralizada para facilitar cambios futuros
const BASE_URL = "https://restcountries.com/v3.1";

// Campos optimizados para reducir el consumo de datos
const DEFAULT_FIELDS =
  "fields=name,flags,cca3,region,subregion,capital,currencies,population,borders";

/**
 * Función genérica y tipada para realizar peticiones a la API de REST Countries.
 * @param endpoint - Fragmento de la ruta (ej: 'all' o 'alpha/mex')
 * @returns Promesa con los datos tipados o null en caso de error
 */
export const fetchFromCountriesAPI = async <T = Country[]>(endpoint: string): Promise<T | null> => {
  try {
    // Determinamos si concatenar con '?' o '&' basándonos en si el endpoint ya tiene parámetros
    const separator = endpoint.includes("?") ? "&" : "?";
    const url = `${BASE_URL}/${endpoint}${separator}${DEFAULT_FIELDS}`;

    const response = await fetch(url);

    // Manejo de errores de red o respuestas no exitosas (404, 500, etc.)
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // Retornamos la respuesta convertida a JSON con el tipo genérico solicitado
    return await response.json();
  } catch (error) {
    // Registro de error para depuración profesional
    console.error("Fallo en la comunicación con la API de países:", error);
    return null;
  }
};
