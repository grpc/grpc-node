// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

/**
 * A severity enum used to test enum capabilities in GAPIC surfaces
 */
export const Severity = {
  UNNECESSARY: 'UNNECESSARY',
  NECESSARY: 'NECESSARY',
  URGENT: 'URGENT',
  CRITICAL: 'CRITICAL',
} as const;

/**
 * A severity enum used to test enum capabilities in GAPIC surfaces
 */
export type ISeverity =
  | 'UNNECESSARY'
  | 0
  | 'NECESSARY'
  | 1
  | 'URGENT'
  | 2
  | 'CRITICAL'
  | 3

/**
 * A severity enum used to test enum capabilities in GAPIC surfaces
 */
export type OSeverity = typeof Severity[keyof typeof Severity]
