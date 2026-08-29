import { httpStatusCode } from '@/utils/httpStatus.js';

describe('httpStatusCode', () => {
  it('should have correct status codes', () => {
    expect(httpStatusCode.OK).toBe(200);
    expect(httpStatusCode.CREATED).toBe(201);
    expect(httpStatusCode.ACCEPTED).toBe(202);
    expect(httpStatusCode.NO_CONTENT).toBe(204);
    expect(httpStatusCode.BAD_REQUEST).toBe(400);
    expect(httpStatusCode.UNAUTHORIZED).toBe(401);
    expect(httpStatusCode.PAYMENT_REQUIRED).toBe(402);
    expect(httpStatusCode.FORBIDDEN).toBe(403);
    expect(httpStatusCode.NOT_FOUND).toBe(404);
    expect(httpStatusCode.INTERNAL_SERVER_ERROR).toBe(500);
  });

  it('should not have typos', () => {
    expect((httpStatusCode as any).UNAUTHORIZE).toBeUndefined();
    expect((httpStatusCode as any).PAYMENT_REQUIRE).toBeUndefined();
    expect((httpStatusCode as any).INTERNAL_SERVER).toBeUndefined();
  });
});
