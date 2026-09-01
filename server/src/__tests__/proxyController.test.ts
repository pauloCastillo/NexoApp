// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error jest ESM
import { jest } from '@jest/globals';
import { proxyController } from '@/utils/proxyController.js';

function mockReqRes(requestId = 'req-test') {
  const req: any = { id: requestId, log: { error: jest.fn() }, headers: {} };
  const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis(), setHeader: jest.fn() };
  return { req, res };
}

describe('proxyController', () => {
  it('calls handler on success', async () => {
    const h = jest.fn(async (_req: any, res: any) => res.json({ ok: true }));
    const proxied = proxyController({ h } as any);
    const { req, res } = mockReqRes();
    await (proxied as any).h(req, res);
    expect(h).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
  it('maps ValidationError to 400 with code and requestId', async () => {
    const h = async () => { const e: any = new Error('v'); e.name = 'ValidationError'; e.errors = { name: { message: 'req' } }; throw e; };
    const proxied = proxyController({ h } as any);
    const { req, res } = mockReqRes('req-123');
    await (proxied as any).h(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    const body = res.json.mock.calls[0][0];
    expect(body.code).toBe('VALIDATION_ERROR');
    expect(body.requestId).toBe('req-123');
    expect(body.message).toBeDefined();
  });
  it('maps CastError to INVALID_ID', async () => {
    const h = async () => { throw Object.assign(new Error('cast'), { name: 'CastError' }); };
    const proxied = proxyController({ h } as any);
    const { req, res } = mockReqRes();
    await (proxied as any).h(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].code).toBe('INVALID_ID');
  });
  it('maps duplicate 11000 to 409', async () => {
    const h = async () => { const e: any = new Error('dup'); e.code = 11000; throw e; };
    const proxied = proxyController({ h } as any);
    const { req, res } = mockReqRes();
    await (proxied as any).h(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });
  it('maps generic to 500 INTERNAL', async () => {
    const h = async () => { throw new Error('boom'); };
    const proxied = proxyController({ h } as any);
    const { req, res } = mockReqRes();
    await (proxied as any).h(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json.mock.calls[0][0].code).toBe('INTERNAL');
  });
  it('includes errors array for validation', async () => {
    const h = async () => { const e: any = new Error('v'); e.name = 'ValidationError'; e.errors = { email: { message: 'bad' } }; throw e; };
    const proxied = proxyController({ h } as any);
    const { req, res } = mockReqRes();
    await (proxied as any).h(req, res);
    expect(res.json.mock.calls[0][0].errors).toBeDefined();
  });
  it('logs with requestId', async () => {
    const h = async () => { throw new Error('boom'); };
    const proxied = proxyController({ h } as any);
    const { req, res } = mockReqRes('req-log');
    await (proxied as any).h(req, res);
    expect(req.log.error).toHaveBeenCalled();
  });
  it('dev includes debug', async () => {
    process.env.DEV_STATUS = 'development';
    const h = async () => { throw new Error('boom'); };
    const proxied = proxyController({ h } as any);
    const { req, res } = mockReqRes();
    await (proxied as any).h(req, res);
    expect(res.json.mock.calls[0][0].debug).toBeDefined();
    process.env.DEV_STATUS = 'test';
  });
  it('prod hides debug', async () => {
    process.env.DEV_STATUS = 'production';
    const h = async () => { throw new Error('boom'); };
    const proxied = proxyController({ h } as any);
    const { req, res } = mockReqRes();
    await (proxied as any).h(req, res);
    expect(res.json.mock.calls[0][0].debug).toBeUndefined();
    process.env.DEV_STATUS = 'test';
  });
  it('maps legacy throw', async () => {
    const h = async () => { throw { statusCode: 404, message: 'not found' } as any; };
    const proxied = proxyController({ h } as any);
    const { req, res } = mockReqRes();
    await (proxied as any).h(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
  it('preserves handler count', () => {
    const proxied = proxyController({ a: async () => {}, b: async () => {} } as any);
    expect(Object.keys(proxied)).toEqual(['a', 'b']);
  });
});
