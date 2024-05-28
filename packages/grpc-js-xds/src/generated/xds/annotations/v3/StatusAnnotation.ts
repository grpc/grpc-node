// Original file: deps/xds/xds/annotations/v3/status.proto

import type { PackageVersionStatus as _xds_annotations_v3_PackageVersionStatus, PackageVersionStatus__Output as _xds_annotations_v3_PackageVersionStatus__Output } from '../../../xds/annotations/v3/PackageVersionStatus';

export interface StatusAnnotation {
  /**
   * The entity is work-in-progress and subject to breaking changes.
   */
  'work_in_progress'?: (boolean);
  /**
   * The entity belongs to a package with the given version status.
   */
  'package_version_status'?: (_xds_annotations_v3_PackageVersionStatus);
}

export interface StatusAnnotation__Output {
  /**
   * The entity is work-in-progress and subject to breaking changes.
   */
  'work_in_progress': (boolean);
  /**
   * The entity belongs to a package with the given version status.
   */
  'package_version_status': (_xds_annotations_v3_PackageVersionStatus__Output);
}
