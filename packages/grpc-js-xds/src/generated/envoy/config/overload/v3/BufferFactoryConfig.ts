// Original file: deps/envoy-api/envoy/config/overload/v3/overload.proto


/**
 * Configuration for which accounts the WatermarkBuffer Factories should
 * track.
 */
export interface BufferFactoryConfig {
  /**
   * The minimum power of two at which Envoy starts tracking an account.
   * 
   * Envoy has 8 power of two buckets starting with the provided exponent below.
   * Concretely the 1st bucket contains accounts for streams that use
   * [2^minimum_account_to_track_power_of_two,
   * 2^(minimum_account_to_track_power_of_two + 1)) bytes.
   * With the 8th bucket tracking accounts
   * >= 128 * 2^minimum_account_to_track_power_of_two.
   * 
   * The maximum value is 56, since we're using uint64_t for bytes counting,
   * and that's the last value that would use the 8 buckets. In practice,
   * we don't expect the proxy to be holding 2^56 bytes.
   * 
   * If omitted, Envoy should not do any tracking.
   */
  'minimum_account_to_track_power_of_two'?: (number);
}

/**
 * Configuration for which accounts the WatermarkBuffer Factories should
 * track.
 */
export interface BufferFactoryConfig__Output {
  /**
   * The minimum power of two at which Envoy starts tracking an account.
   * 
   * Envoy has 8 power of two buckets starting with the provided exponent below.
   * Concretely the 1st bucket contains accounts for streams that use
   * [2^minimum_account_to_track_power_of_two,
   * 2^(minimum_account_to_track_power_of_two + 1)) bytes.
   * With the 8th bucket tracking accounts
   * >= 128 * 2^minimum_account_to_track_power_of_two.
   * 
   * The maximum value is 56, since we're using uint64_t for bytes counting,
   * and that's the last value that would use the 8 buckets. In practice,
   * we don't expect the proxy to be holding 2^56 bytes.
   * 
   * If omitted, Envoy should not do any tracking.
   */
  'minimum_account_to_track_power_of_two': (number);
}
