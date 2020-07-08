// Original file: deps/udpa/udpa/annotations/status.proto

import { PackageVersionStatus as _udpa_annotations_PackageVersionStatus } from '../../udpa/annotations/PackageVersionStatus';

export interface StatusAnnotation {
  'work_in_progress'?: (boolean);
  'package_version_status'?: (_udpa_annotations_PackageVersionStatus | keyof typeof _udpa_annotations_PackageVersionStatus);
}

export interface StatusAnnotation__Output {
  'work_in_progress': (boolean);
  'package_version_status': (keyof typeof _udpa_annotations_PackageVersionStatus);
}
