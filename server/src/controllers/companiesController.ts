import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import { Company } from '@/db/models/index.js';
import { generateInviteCode } from '@/utils/utils.js';

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

  const company = new Company({
    name: name.trim(),
    inviteCode: generateInviteCode(),
  });
  await company.save();

  res.status(httpStatusCode.CREATED).json({ company });
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

async function regenerateInviteCode(req: Request, res: Response) {
  const company = await Company.findById(req.params.id);
  if (!company) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Empresa no encontrada" });
  }

  company.inviteCode = generateInviteCode();
  await company.save();

  res.status(httpStatusCode.OK).json({ company });
}

export { getAllCompanies, createCompany, getCompanyById, regenerateInviteCode };
