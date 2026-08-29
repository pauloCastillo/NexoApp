import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import { Company } from '@/db/models/index.js';

async function listPublicCompanies(req: Request, res: Response) {
  const companies = await Company.find({ isActive: true }).select('name');
  res.status(httpStatusCode.OK).json({ companies });
}

async function getAllCompanies(req: Request, res: Response) {
  const role = (req as any).userRole;
  const companyId = (req as any).companyId;

  let companies;
  if (role === 'superuser') {
    companies = await Company.find({ isActive: true });
  } else {
    companies = await Company.find({ _id: companyId, isActive: true });
  }

  res.status(httpStatusCode.OK).json({ companies });
}

async function createCompany(req: Request, res: Response) {
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

async function getCompanyById(req: Request, res: Response) {
  const company = await Company.findById(req.params.id);
  if (!company) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Empresa no encontrada" });
  }

  const role = (req as any).userRole;
  const userCompanyId = (req as any).companyId;
  if (role !== 'superuser' && company._id.toString() !== userCompanyId) {
    return res.status(httpStatusCode.FORBIDDEN).json({ message: "Acceso denegado" });
  }

  res.status(httpStatusCode.OK).json({ company });
}

async function getMyCompany(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const company = await Company.findById(companyId);
  if (!company) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Empresa no encontrada" });
  }
  res.status(httpStatusCode.OK).json({ company });
}

async function updateCompany(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const role = (req as any).userRole;
  if (role !== 'business_owner' && role !== 'admin' && role !== 'platform_admin' && role !== 'superuser') {
    return res.status(httpStatusCode.FORBIDDEN).json({ message: "Acceso denegado" });
  }

  const company = await Company.findByIdAndUpdate(companyId, req.body, { new: true });
  if (!company) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Empresa no encontrada" });
  }

  res.status(httpStatusCode.OK).json({ company });
}

export { listPublicCompanies, getAllCompanies, createCompany, getCompanyById, getMyCompany, updateCompany };
