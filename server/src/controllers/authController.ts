import { Request, Response } from 'express';
import { proxyController } from '@/utils/proxyController.js';
import { httpStatusCode } from '@/utils/httpStatus.js';
import authService from '@/services/authService.js';

async function _raw_register(req: Request, res: Response) {
  try {
    const { role } = req.body;
    const result = role === 'business_owner'
      ? await authService.registerOwner(req.body)
      : await authService.registerUser(req.body);
    return res.status(httpStatusCode.CREATED).json(result);
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({
      message: err.message || 'Error interno del servidor',
      ...(err.errors && { errors: err.errors }),
    });
  }
}

async function _raw_login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    return res.status(httpStatusCode.OK).json(result);
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ message: err.message || 'Error interno del servidor' });
  }
}

async function _raw_refreshTokenEndpoint(req: Request, res: Response) {
  try {
    const result = await authService.refreshToken(req.body.refreshToken);
    return res.status(httpStatusCode.OK).json(result);
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ message: err.message || 'Error interno del servidor' });
  }
}

async function _raw_changePassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.userId!, currentPassword, newPassword);
    return res.status(httpStatusCode.OK).json(result);
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ message: err.message || 'Error interno del servidor' });
  }
}

async function _raw_logout(req: Request, res: Response) {
  try {
    const result = await authService.logout(req.userId!);
    return res.status(httpStatusCode.OK).json(result);
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ message: err.message || 'Error interno del servidor' });
  }
}

const _handlers = { register: _raw_register, login: _raw_login, refreshTokenEndpoint: _raw_refreshTokenEndpoint, changePassword: _raw_changePassword, logout: _raw_logout };
const _proxied: any = proxyController(_handlers as any);
export const register = _proxied.register;
export const login = _proxied.login;
export const refreshTokenEndpoint = _proxied.refreshTokenEndpoint;
export const changePassword = _proxied.changePassword;
export const logout = _proxied.logout;

