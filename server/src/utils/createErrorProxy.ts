import { normalizeError } from '@/utils/normalizeError.js';

// ponytail: generic proxy — wraps instance methods, rethrows as AppError via normalizeError
export function createErrorProxy<T extends object>(target: T, opts?: { requestId?: string }): T {
  return new Proxy(target, {
    get(obj, prop, receiver) {
      const orig = Reflect.get(obj, prop, receiver);
      if (typeof orig !== 'function') return orig;
      // avoid proxying constructor
      if (prop === 'constructor') return orig;
      return async (...args: unknown[]) => {
        try {
          return await orig.apply(obj, args);
        } catch (e) {
          throw normalizeError(e, opts?.requestId);
        }
      };
    },
  });
}
