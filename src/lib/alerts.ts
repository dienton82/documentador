import Swal from "sweetalert2";

export const showSuccessAlert = async (filename: string) => {
  return Swal.fire({
    icon: "success",
    title: "Descarga Exitosa",
    text: `El documento "${filename}" se ha descargado exitosamente.`,
    showConfirmButton: true,
    confirmButtonColor: "#061224",
    customClass: {
      popup: "shadow-2xl",
    },
  });
};

export const showServerError = async (status: number, statusText: string) => {
  return Swal.fire({
    icon: "error",
    title: "No se pudo generar el documento",
    text: `Error del servidor: ${status} ${statusText}`,
    confirmButtonText: "Cerrar",
    confirmButtonColor: "#061224",
    customClass: {
      popup: "shadow-2xl",
    },
  });
};

export const showNetworkError = async () => {
  return Swal.fire({
    icon: "error",
    title: "Error de red",
    text: "Verifica tu conexión o intenta nuevamente.",
    confirmButtonText: "Cerrar",
    confirmButtonColor: "#061224",
    customClass: {
      popup: "shadow-2xl",
    },
  });
};
