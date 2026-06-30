// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function verify(data: any, mode: string): Record<string, string> {
  const error: Record<string, string> = {};
  const regMail = /[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
  const regPswd = /^.{4,12}$/;
  const regPhone = /[+]?\d{3}-\d{8}/;

  if (mode === "sign-up") {
    if (!data?.username || data.username === "") {
      error.username = "Introduzca su(s) nombre(s) y apellido(s)";
    }
    if (!data?.companyName || data.companyName === "") {
      error.companyName = "Introduzca el nombre de la empresa";
    }
    if (
      !data?.email ||
      typeof data.email !== "string" ||
      !data.email.match(regMail)
    ) {
      error.email = "Verifique que su correo sea micorreo@dominio.com";
    }
    if (
      !data?.password ||
      typeof data.password !== "string" ||
      !data.password.match(regPswd)
    ) {
      error.password = "La contraseña debe tener entre 4 y 12 caracteres";
    }
    if (!data?.confirmPassword || data.confirmPassword !== data.password) {
      error.confirmPassword = "Las contraseñas no coinciden";
    }
    if (!data?.jobTitle || data.jobTitle === "") {
      error.jobTitle = "Introduzca su cargo";
    }
    if (
      !data?.phone ||
      typeof data.phone !== "string" ||
      !data.phone.match(regPhone)
    ) {
      error.phone = "Verifique el número: +591-77777777";
    }
  } else {
    if (
      !data?.mail ||
      typeof data.mail !== "string" ||
      !data.mail.match(regMail)
    ) {
      error.mail = "Verifique su correo";
    }
    if (
      !data?.password ||
      typeof data.password !== "string" ||
      !data.password.match(regPswd)
    ) {
      error.password = "La contraseña debe tener entre 4 y 12 caracteres";
    }
  }

  return error;
}
