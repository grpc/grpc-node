// Original file: deps/envoy-api/envoy/config/bootstrap/v3/bootstrap.proto

import type { RuntimeLayer as _envoy_config_bootstrap_v3_RuntimeLayer, RuntimeLayer__Output as _envoy_config_bootstrap_v3_RuntimeLayer__Output } from '../../../../envoy/config/bootstrap/v3/RuntimeLayer';

/**
 * Runtime :ref:`configuration overview <config_runtime>`.
 */
export interface LayeredRuntime {
  /**
   * The :ref:`layers <config_runtime_layering>` of the runtime. This is ordered
   * such that later layers in the list overlay earlier entries.
   */
  'layers'?: (_envoy_config_bootstrap_v3_RuntimeLayer)[];
}

/**
 * Runtime :ref:`configuration overview <config_runtime>`.
 */
export interface LayeredRuntime__Output {
  /**
   * The :ref:`layers <config_runtime_layering>` of the runtime. This is ordered
   * such that later layers in the list overlay earlier entries.
   */
  'layers': (_envoy_config_bootstrap_v3_RuntimeLayer__Output)[];
}
