export default function verify(data) {
  const error = {};
  const regMail = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-0]+\.[a-zA-Z]{2,4}$/;
  const regPswd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,15}$/;
  const regPhone = /[+]?\d{3}-\d{8}/;

  if (data.username.trim() === "") {
    error.username = "Introduzca su Nombre y Apellido";
  }

  if (!data.mail.match(regMail)) {
    error.mail = "Verifique que su correo sea micorreo@dominio.com";
  }

  if (!data.password.match(regPswd)) {
    error.password =
      "Verifique que su password tenga: 1 mayúscula, 1 número y sea entre 6 y 15 caracteres de longitud";
  }

  if (data.jobTitle.trim() === "") {
    error.jobTitle = "Introduzca su el cargo que ocupa";
  }

  if (!data.phone.match(regPhone)) {
    error.phone = "Verifique que el número sea: +591-77777777";
  }

  return error;
}
