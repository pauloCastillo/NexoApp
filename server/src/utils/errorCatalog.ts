// ponytail: central catalog — add codes as needed, keep messages user-friendly ES
export const errorCatalog: Record<string, { statusCode: number; message: string }> = {
  VALIDATION_ERROR: { statusCode: 400, message: 'Revisa los datos ingresados.' },
  INVALID_ID: { statusCode: 400, message: 'El identificador no es válido.' },
  BAD_REQUEST: { statusCode: 400, message: 'Solicitud no válida. Verifica los datos e intenta de nuevo.' },
  UNAUTHORIZED: { statusCode: 401, message: 'Tu sesión expiró. Inicia sesión de nuevo.' },
  FORBIDDEN: { statusCode: 403, message: 'No tienes permisos para realizar esta acción.' },
  NOT_FOUND: { statusCode: 404, message: 'No encontramos lo que buscas.' },
  DUPLICATE: { statusCode: 409, message: 'Ya existe un registro con esos datos.' },
  CONFLICT: { statusCode: 409, message: 'Conflicto: ya existe un registro con esos datos.' },
  INVITATION_INVALID: { statusCode: 404, message: 'Código de invitación inválido.' },
  INVITATION_EXPIRED: { statusCode: 410, message: 'Código de invitación expirado.' },
  INVITATION_EXHAUSTED: { statusCode: 410, message: 'Código de invitación agotado.' },
  WORKORDER_TRANSITION: { statusCode: 400, message: 'Esa acción no está permitida en este estado.' },
  WORKORDER_NOT_FOUND: { statusCode: 404, message: 'Orden de trabajo no encontrada.' },
  DB_UNAVAILABLE: { statusCode: 503, message: 'Servicio temporalmente no disponible. Intenta de nuevo.' },
  INTERNAL: { statusCode: 500, message: 'Ocurrió un inconveniente. Intenta de nuevo en unos segundos.' },
};

export function catalogEntry(code: string) {
  return errorCatalog[code] ?? errorCatalog.INTERNAL;
}
