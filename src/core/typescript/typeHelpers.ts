/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Borrowed from: https://www.jpwilliams.dev/how-to-unpack-the-return-type-of-a-promise-in-typescript
 */
export type Unwrap<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : T

// eslint@typescript-eslint/ban-types
// Don't use `{}` as a type. `{}` actually means "any non-nullish value".
// If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.
export type AnyObject = Record<string, unknown>
// If you want a type meaning "any value", you probably want `unknown` instead.
export type AnyValue = unknown
// If you want a type meaning "empty object", you probably want `Record<string, never>`
export type EmptyObject = Record<string, never>
