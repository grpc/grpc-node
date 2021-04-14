// Original file: deps/envoy-api/envoy/config/core/v3/base.proto


/**
 * A directory that is watched for changes, e.g. by inotify on Linux. Move/rename
 * events inside this directory trigger the watch.
 */
export interface WatchedDirectory {
  /**
   * Directory path to watch.
   */
  'path'?: (string);
}

/**
 * A directory that is watched for changes, e.g. by inotify on Linux. Move/rename
 * events inside this directory trigger the watch.
 */
export interface WatchedDirectory__Output {
  /**
   * Directory path to watch.
   */
  'path': (string);
}
