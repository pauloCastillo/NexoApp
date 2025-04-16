import PropTypes from "prop-types";

export default function verify(data, mode) {
  const error = {};
  const regMail = /[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
  const regPswd = /^.{4,12}$/;
  const regPhone = /[+]?\d{3}-\d{8}/;

  if (mode === "sign-up") {
    if (data.username === undefined || data.username === "") {
      error.usernames =
        "Introduzca en los campos correspondientes su(s) nombres y apellido(s)";
    }

    if (!data.email.match(regMail)) {
      error.email = "Verifique que su correo sea micorreo@dominio.com";
    }

    if (!data.password.match(regPswd)) {
      error.password =
        "Verifique que su password tenga entre 4 y 12 caracteres de longitud";
    }

    if (data.confirmPassword !== data.password || data.confirmPassword === "") {
      error.confirmPassword =
        "Debe colocar lo mismo y de la misma forma que esta en la contraseña";
    }

    if (data.jobTitle === "" || data.jobTitle === undefined) {
      error.jobTitle = "Introduzca su el cargo que ocupa";
    }

    if (!data.phone.match(regPhone)) {
      error.phone = "Verifique que el número sea: +591-77777777";
    }
  } else {
    if (!data.mail.match(regMail)) {
      error.mail = "Verifique que su correo sea micorreo@gmail.com";
    }

    if (data.mail === "") {
      error.mail = "Este campo no puede estar vacio";
    }

    if (!data.password.match(regPswd)) {
      error.password =
        "Verifique que su password tenga entre 4 y 12 caracteres de longitud";
    }

    if (data.password === "") {
      error.password = "Este campo no puede estar vacío";
    }
  }

  return error;
}

verify.propTypes = {
  data: PropTypes.object,
  mode: PropTypes.string,
};
