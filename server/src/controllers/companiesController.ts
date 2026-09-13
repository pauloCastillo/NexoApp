import { Request, Response } from 'express';
import { proxyController } from '@/utils/proxyController.js';
import { httpStatusCode } from '@/utils/httpStatus.js';
import { Company } from '@/db/models/index.js';

async function _raw_listPublicCompanies(req: Request, res: Response) {
  const companies = await Company.find({ isActive: true }).select('name');
  res.status(httpStatusCode.OK).json({ companies });
}

async function _raw_getAllCompanies(req: Request, res: Response) {
  const role = req.userRole!;
  const companyId = req.companyId!;

  let companies;
  if (role === 'superuser') {
    companies = await Company.find({ isActive: true });
  } else {
    companies = await Company.find({ _id: companyId, isActive: true });
  }

  res.status(httpStatusCode.OK).json({ companies });
}

async function _raw_createCompany(req: Request, res: Response) {
  const { name } = req.body;
  if (!name) {
    return res.status(httpStatusCode.BAD_REQUEST).json({ message: "Nombre de empresa requerido" });
  }

  const existing = await Company.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (existing) {
    return res.status(httpStatusCode.CONFLICT).json({ message: "La empresa ya existe" });
  }

  await Company.create({ name: name.trim() });

  res.status(httpStatusCode.CREATED).json({ message: "Empresa creada exitosamente" });
}

async function _raw_getCompanyById(req: Request, res: Response) {
  const company = await Company.findById(req.params.id);
  if (!company) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Empresa no encontrada" });
  }

  const role = req.userRole!;
  const userCompanyId = req.companyId!;
  if (role !== 'superuser' && company._id.toString() !== userCompanyId) {
    return res.status(httpStatusCode.FORBIDDEN).json({ message: "Acceso denegado" });
  }

  res.status(httpStatusCode.OK).json({ company });
}

async function _raw_getMyCompany(req: Request, res: Response) {
  const companyId = req.companyId!;
  const company = await Company.findById(companyId);
  if (!company) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Empresa no encontrada" });
  }
  res.status(httpStatusCode.OK).json({ company });
}

async function _raw_updateCompany(req: Request, res: Response) {
  const companyId = req.companyId!;
  const role = req.userRole!;
  if (role !== 'business_owner' && role !== 'admin' && role !== 'platform_admin' && role !== 'superuser') {
    return res.status(httpStatusCode.FORBIDDEN).json({ message: "Acceso denegado" });
  }

  const company = await Company.findByIdAndUpdate(companyId, req.body, { new: true });
  if (!company) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Empresa no encontrada" });
  }

  res.status(httpStatusCode.OK).json({ company });
}

const _handlers = { listPublicCompanies: _raw_listPublicCompanies, getAllCompanies: _raw_getAllCompanies, createCompany: _raw_createCompany, getCompanyById: _raw_getCompanyById, getMyCompany: _raw_getMyCompany, updateCompany: _raw_updateCompany };
const _proxied: any = proxyController(_handlers as any);
export const listPublicCompanies = _proxied.listPublicCompanies;
export const getAllCompanies = _proxied.getAllCompanies;
export const createCompany = _proxied.createCompany;
export const getCompanyById = _proxied.getCompanyById;
export const getMyCompany = _proxied.getMyCompany;
export const updateCompany = _proxied.updateCompany;

