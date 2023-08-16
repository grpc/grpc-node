// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { Route as _envoy_config_route_v3_Route, Route__Output as _envoy_config_route_v3_Route__Output } from '../../../../envoy/config/route/v3/Route';

/**
 * This can be used in route matcher :ref:`VirtualHost.matcher <envoy_v3_api_field_config.route.v3.VirtualHost.matcher>`.
 * When the matcher matches, routes will be matched and run.
 */
export interface RouteList {
  /**
   * The list of routes that will be matched and run, in order. The first route that matches will be used.
   */
  'routes'?: (_envoy_config_route_v3_Route)[];
}

/**
 * This can be used in route matcher :ref:`VirtualHost.matcher <envoy_v3_api_field_config.route.v3.VirtualHost.matcher>`.
 * When the matcher matches, routes will be matched and run.
 */
export interface RouteList__Output {
  /**
   * The list of routes that will be matched and run, in order. The first route that matches will be used.
   */
  'routes': (_envoy_config_route_v3_Route__Output)[];
}
