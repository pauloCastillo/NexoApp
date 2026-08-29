import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import authService from '@/services/authService.js';

async function register(req: Request, res: Response) {
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

async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    return res.status(httpStatusCode.OK).json(result);
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ message: err.message || 'Error interno del servidor' });
  }
}

async function refreshTokenEndpoint(req: Request, res: Response) {
  try {
    const result = await authService.refreshToken(req.body.refreshToken);
    return res.status(httpStatusCode.OK).json(result);
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ message: err.message || 'Error interno del servidor' });
  }
}

async function changePassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.userId!, currentPassword, newPassword);
    return res.status(httpStatusCode.OK).json(result);
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ message: err.message || 'Error interno del servidor' });
  }
}

async function logout(req: Request, res: Response) {
  try {
    const result = await authService.logout(req.userId!);
    return res.status(httpStatusCode.OK).json(result);
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ message: err.message || 'Error interno del servidor' });
  }
}

export { register, login, refreshTokenEndpoint, changePassword, logout };
