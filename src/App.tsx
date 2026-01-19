// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CountryList } from "./components/CountryList";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CountryList />} />
        <Route path="/country/:id" element={<div>Página de Detalle (Próximamente)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
