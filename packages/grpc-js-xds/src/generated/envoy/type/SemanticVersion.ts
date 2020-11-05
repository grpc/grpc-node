// Original file: deps/envoy-api/envoy/type/semantic_version.proto


/**
 * Envoy uses SemVer (https://semver.org/). Major/minor versions indicate
 * expected behaviors and APIs, the patch version field is used only
 * for security fixes and can be generally ignored.
 */
export interface SemanticVersion {
  'major_number'?: (number);
  'minor_number'?: (number);
  'patch'?: (number);
}

/**
 * Envoy uses SemVer (https://semver.org/). Major/minor versions indicate
 * expected behaviors and APIs, the patch version field is used only
 * for security fixes and can be generally ignored.
 */
export interface SemanticVersion__Output {
  'major_number': (number);
  'minor_number': (number);
  'patch': (number);
}
