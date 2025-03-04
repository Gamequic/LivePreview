import React from "react";

import { Typography } from "@mui/material";

const osLogos = {
  windows: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c3c4dc04-2c06-4987-b64d-8d394836c6cf/dgkrji2-dcceb33c-b702-4613-9c87-84295aa358c4.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2MzYzRkYzA0LTJjMDYtNDk4Ny1iNjRkLThkMzk0ODM2YzZjZlwvZGdrcmppMi1kY2NlYjMzYy1iNzAyLTQ2MTMtOWM4Ny04NDI5NWFhMzU4YzQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.B9HaQW42FaHSUkvH4Btu81HKn_fIE5nnJw97VxZPJ8A",
  debian: "https://cdn.worldvectorlogo.com/logos/debian-2.svg",
  ubuntu: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo-ubuntu_cof-orange-hex.svg",
  linux: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg", // Tux logo
};

// Función para buscar un sistema operativo en un string
const findOS = (input) => {
  const osKeys = Object.keys(osLogos); // Nombres de sistemas operativos
  const lowerCaseInput = input.toLowerCase(); // Convertir todo a minúsculas
  return osKeys.find((os) => lowerCaseInput.includes(os)) || "linux"; // Retorna el sistema operativo encontrado o "linux" por defecto
};

const OSLogo = ({ osName }) => {
  const detectedOS = findOS(osName); // Detecta el sistema operativo
  const logoUrl = osLogos[detectedOS]; // Obtiene la URL del logo

  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={logoUrl}
        alt={`${detectedOS} logo`}
        style={{ width: "100px", height: "100px" }}
      />
      <Typography>{osName}</Typography>
    </div>
  );
};

export default OSLogo;
