// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error jest ESM
import { jest } from '@jest/globals';
import { requestId } from '@/middlewares/requestId.js';

describe('requestId', () => {
  it('generates uuid when no header', () => {
    const req: any = { headers: {} };
    const res: any = { setHeader: jest.fn() };
    const next = jest.fn();
    requestId(req, res, next);
    expect(req.id).toBeDefined();
    expect(res.setHeader).toHaveBeenCalledWith('x-request-id', req.id);
    expect(next).toHaveBeenCalled();
  });
  it('propagates incoming x-request-id', () => {
    const req: any = { headers: { 'x-request-id': 'incoming-123' } };
    const res: any = { setHeader: jest.fn() };
    requestId(req, res, jest.fn());
    expect(req.id).toBe('incoming-123');
  });
  it('trims incoming header', () => {
    const req: any = { headers: { 'x-request-id': '  abc  ' } };
    const res: any = { setHeader: jest.fn() };
    requestId(req, res, jest.fn());
    expect(req.id).toBe('abc');
  });
  it('creates child logger with requestId', () => {
    const req: any = { headers: {} };
    const res: any = { setHeader: jest.fn() };
    requestId(req, res, jest.fn());
    expect(req.log).toBeDefined();
  });
  it('generates different ids', () => {
    const r1: any = { headers: {} }, s1: any = { setHeader: jest.fn() };
    const r2: any = { headers: {} }, s2: any = { setHeader: jest.fn() };
    requestId(r1, s1, jest.fn()); requestId(r2, s2, jest.fn());
    expect(r1.id).not.toBe(r2.id);
  });
});
