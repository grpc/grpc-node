// Original file: deps/udpa/udpa/annotations/status.proto

export enum PackageVersionStatus {
  /**
   * Unknown package version status.
   */
  UNKNOWN = 0,
  /**
   * This version of the package is frozen.
   */
  FROZEN = 1,
  /**
   * This version of the package is the active development version.
   */
  ACTIVE = 2,
  /**
   * This version of the package is the candidate for the next major version. It
   * is typically machine generated from the active development version.
   */
  NEXT_MAJOR_VERSION_CANDIDATE = 3,
}
