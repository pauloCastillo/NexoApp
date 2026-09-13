import { Request, Response } from 'express';
import { proxyController } from '@/utils/proxyController.js';
import { httpStatusCode } from '@/utils/httpStatus.js';
import authService from '@/services/authService.js';
import { AppError } from '@/utils/appError.js';

async function _raw_register(req: Request, res: Response) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { role } = req.body;
    const result = role === 'business_owner'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ? await authService.registerOwner(req.body)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      : await authService.registerUser(req.body);
    res.status(httpStatusCode.CREATED).json(result);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      res.status(err.statusCode || 500).json({
        message: err.message || 'Error interno del servidor',
        ...(err.errors && { errors: err.errors }),
      });
    } else {
      res.status(500).json({
        message: 'Error interno del servidor',
      });
    }
  }
}

async function _raw_login(req: Request, res: Response) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = await authService.login(req.body);
    res.status(httpStatusCode.OK).json(result);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      res.status(err.statusCode || 500).json({
        message: err.message || 'Error interno del servidor',
        ...(err.errors && { errors: err.errors }),
      });
    } else {
      res.status(500).json({
        message: 'Error interno del servidor',
      });
    }
  }
}

async function _raw_refreshTokenEndpoint(req: Request, res: Response) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const result = await authService.refreshToken(req.body.refreshToken);
    res.status(httpStatusCode.OK).json(result);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      res.status(err.statusCode || 500).json({
        message: err.message || 'Error interno del servidor',
        ...(err.errors && { errors: err.errors }),
      });
    } else {
      res.status(500).json({
        message: 'Error interno del servidor',
      });
    }
  }
}

async function _raw_changePassword(req: Request, res: Response) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { currentPassword, newPassword } = req.body;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-non-null-assertion
    const result = await authService.changePassword(req.userId!, currentPassword, newPassword);
    res.status(httpStatusCode.OK).json(result);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      res.status(err.statusCode || 500).json({
        message: err.message || 'Error interno del servidor',
        ...(err.errors && { errors: err.errors }),
      });
    } else {
      res.status(500).json({
        message: 'Error interno del servidor',
      });
    }
  }
}

async function _raw_logout(req: Request, res: Response) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await authService.logout(req.userId!);
    res.status(httpStatusCode.OK).json(result);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      res.status(err.statusCode || 500).json({
        message: err.message || 'Error interno del servidor',
        ...(err.errors && { errors: err.errors }),
      });
    } else {
      res.status(500).json({
        message: 'Error interno del servidor',
      });
    }
  }
}

const _handlers = { 
  register: _raw_register, 
  login: _raw_login, 
  refreshTokenEndpoint: _raw_refreshTokenEndpoint, 
  changePassword: _raw_changePassword, 
  logout: _raw_logout 
};

const _proxied = proxyController(_handlers);
export const register = _proxied.register;
export const login = _proxied.login; 
export const refreshTokenEndpoint = _proxied.refreshTokenEndpoint;
export const changePassword = _proxied.changePassword;
export const logout = _proxied.logout;

