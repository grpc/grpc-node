// Original file: deps/xds/xds/annotations/v3/status.proto

export const PackageVersionStatus = {
  /**
   * Unknown package version status.
   */
  UNKNOWN: 'UNKNOWN',
  /**
   * This version of the package is frozen.
   */
  FROZEN: 'FROZEN',
  /**
   * This version of the package is the active development version.
   */
  ACTIVE: 'ACTIVE',
  /**
   * This version of the package is the candidate for the next major version. It
   * is typically machine generated from the active development version.
   */
  NEXT_MAJOR_VERSION_CANDIDATE: 'NEXT_MAJOR_VERSION_CANDIDATE',
} as const;

export type PackageVersionStatus =
  /**
   * Unknown package version status.
   */
  | 'UNKNOWN'
  | 0
  /**
   * This version of the package is frozen.
   */
  | 'FROZEN'
  | 1
  /**
   * This version of the package is the active development version.
   */
  | 'ACTIVE'
  | 2
  /**
   * This version of the package is the candidate for the next major version. It
   * is typically machine generated from the active development version.
   */
  | 'NEXT_MAJOR_VERSION_CANDIDATE'
  | 3

export type PackageVersionStatus__Output = typeof PackageVersionStatus[keyof typeof PackageVersionStatus]
