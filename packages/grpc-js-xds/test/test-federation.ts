/*
 * Copyright 2023 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Backend, createBackends } from "./backend";
import { XdsTestClient } from "./client";
import { FakeEdsCluster, FakeRouteGroup, FakeServerRoute } from "./framework";
import { ControlPlaneServer } from "./xds-server";
import assert = require("assert");

/* Test cases in this file are derived from examples in the xDS federation proposal
 * https://github.com/grpc/proposal/blob/master/A47-xds-federation.md */
describe('Federation', () => {
  let xdsServers: ControlPlaneServer[] = [];
  let xdsClient: XdsTestClient;
  afterEach(() => {
    xdsClient?.close();
    for (const server of xdsServers) {
      server.shutdownServer();
    }
    xdsServers = [];
  });
  describe('Bootstrap Config Contains No New Fields', () => {
    let bootstrap: string;
    beforeEach((done) => {
      const xdsServer = new ControlPlaneServer();
      xdsServers.push(xdsServer);
      xdsServer.startServer(async error => {
        if (error) {
          done(error);
          return;
        }
        const [backend] = await createBackends(1);
        const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute');
        xdsServer.setRdsResource(serverRoute.getRouteConfiguration());
        xdsServer.setLdsResource(serverRoute.getListener());
        const cluster = new FakeEdsCluster('cluster1', 'endpoint1', [{backends: [backend], locality:{region: 'region1'}}]);
        const routeGroup = new FakeRouteGroup('server.example.com', 'route1', [{cluster: cluster}]);
        xdsServer.setEdsResource(cluster.getEndpointConfig());
        xdsServer.setCdsResource(cluster.getClusterConfig());
        xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
        xdsServer.setLdsResource(routeGroup.getListener());
        await routeGroup.startAllBackends(xdsServer);
        const bootstrapInfo = {
          xds_servers: [xdsServer.getBootstrapServerConfig()],
          node: {
            id: 'test',
            locality: {}
          }
        };
        bootstrap = JSON.stringify(bootstrapInfo);
        done();
      });
    });
    it('Should accept an old-style name', (done) => {
      xdsClient = new XdsTestClient('xds:server.example.com', bootstrap);
      // There is only one server, so a successful request must go to that server
      xdsClient.sendOneCall(done);
    });
    it('Should reject a new-style name', (done) => {
      xdsClient = new XdsTestClient('xds://xds.authority.com/server.example.com', bootstrap);
      xdsClient.sendOneCall(error => {
        assert(error);
        done();
      });
    });
  });
  describe('New-Style Names on gRPC Client', () => {
    let bootstrap: string;
    beforeEach((done) => {
      const xdsServer = new ControlPlaneServer();
      xdsServers.push(xdsServer);
      xdsServer.startServer(async error => {
        if (error) {
          done(error);
          return;
        }
        const [backend] = await createBackends(1);
        const serverRoute = new FakeServerRoute(backend.getPort(), 'serverRoute');
        xdsServer.setRdsResource(serverRoute.getRouteConfiguration());
        xdsServer.setLdsResource(serverRoute.getListener());
        const cluster = new FakeEdsCluster('xdstp://xds.authority.com/envoy.config.cluster.v3.Cluster/cluster1', 'xdstp://xds.authority.com/envoy.config.endpoint.v3.ClusterLoadAssignment/endpoint1', [{backends: [backend], locality:{region: 'region1'}}]);
        const routeGroup = new FakeRouteGroup('xdstp://xds.authority.com/envoy.config.listener.v3.Listener/server.example.com', 'xdstp://xds.authority.com/envoy.config.route.v3.RouteConfiguration/route1', [{cluster: cluster}]);
        xdsServer.setEdsResource(cluster.getEndpointConfig());
        xdsServer.setCdsResource(cluster.getClusterConfig());
        xdsServer.setRdsResource(routeGroup.getRouteConfiguration());
        xdsServer.setLdsResource(routeGroup.getListener());
        await routeGroup.startAllBackends(xdsServer);
        const bootstrapInfo = {
          xds_servers: [xdsServer.getBootstrapServerConfig()],
          node: {
            id: 'test',
            locality: {}
          },
          "client_default_listener_resource_name_template": "xdstp://xds.authority.com/envoy.config.listener.v3.Listener/%s",
          "authorities": {
            "xds.authority.com": {
            }
          }
        };
        bootstrap = JSON.stringify(bootstrapInfo);
        done();
      });
    });
    it('Should accept a target with no authority', (done) => {
      xdsClient = new XdsTestClient('xds:server.example.com', bootstrap);
      // There is only one server, so a successful request must go to that server
      xdsClient.sendOneCall(done);
    });
    it('Should accept a target with a listed authority', (done) => {
      xdsClient = new XdsTestClient('xds://xds.authority.com/server.example.com', bootstrap);
      // There is only one server, so a successful request must go to that server
      xdsClient.sendOneCall(done);
    });
  });
  describe('Multiple authorities', () => {
    let bootstrap: string;
    let defaultRouteGroup: FakeRouteGroup;
    let otherRouteGroup: FakeRouteGroup;
    beforeEach((done) => {
      const defaultServer = new ControlPlaneServer();
      xdsServers.push(defaultServer);
      const otherServer = new ControlPlaneServer();
      xdsServers.push(otherServer);
      defaultServer.startServer(error => {
        if (error) {
          done(error);
          return;
        }
        otherServer.startServer(async error => {
          if (error) {
            done(error);
            return;
          }
          const [defaultBackend, otherBackend] = await createBackends(2);
          const defaultServerRoute = new FakeServerRoute(defaultBackend.getPort(), 'serverRoute');
          defaultServer.setRdsResource(defaultServerRoute.getRouteConfiguration());
          defaultServer.setLdsResource(defaultServerRoute.getListener());
          const otherServerRoute = new FakeServerRoute(otherBackend.getPort(), 'serverRoute');
          otherServer.setRdsResource(otherServerRoute.getRouteConfiguration());
          otherServer.setLdsResource(otherServerRoute.getListener());
          const defaultCluster = new FakeEdsCluster('xdstp://xds.authority.com/envoy.config.cluster.v3.Cluster/cluster1', 'xdstp://xds.authority.com/envoy.config.endpoint.v3.ClusterLoadAssignment/endpoint1', [{backends: [defaultBackend], locality:{region: 'region1'}}]);
          defaultRouteGroup = new FakeRouteGroup('xdstp://xds.authority.com/envoy.config.listener.v3.Listener/grpc/client/server.example.com?project_id=1234', 'xdstp://xds.authority.com/envoy.config.route.v3.RouteConfiguration/route1', [{cluster: defaultCluster}]);
          const otherCluster = new FakeEdsCluster('xdstp://xds.other.com/envoy.config.cluster.v3.Cluster/cluster2', 'xdstp://xds.other.com/envoy.config.endpoint.v3.ClusterLoadAssignment/endpoint2', [{backends: [otherBackend], locality:{region: 'region2'}}]);
          otherRouteGroup = new FakeRouteGroup('xdstp://xds.other.com/envoy.config.listener.v3.Listener/server.other.com', 'xdstp://xds.other.com/envoy.config.route.v3.RouteConfiguration/route2', [{cluster: otherCluster}]);
          defaultServer.setEdsResource(defaultCluster.getEndpointConfig());
          defaultServer.setCdsResource(defaultCluster.getClusterConfig());
          defaultServer.setRdsResource(defaultRouteGroup.getRouteConfiguration());
          defaultServer.setLdsResource(defaultRouteGroup.getListener());
          otherServer.setEdsResource(otherCluster.getEndpointConfig());
          otherServer.setCdsResource(otherCluster.getClusterConfig());
          otherServer.setRdsResource(otherRouteGroup.getRouteConfiguration());
          otherServer.setLdsResource(otherRouteGroup.getListener());
          await Promise.all([defaultRouteGroup.startAllBackends(defaultServer), otherRouteGroup.startAllBackends(otherServer)]);
          const bootstrapInfo = {
            xds_servers: [defaultServer.getBootstrapServerConfig()],
            node: {
              id: 'test',
              locality: {}
            },

            // Resource name template for xds: target URIs with no authority.
            "client_default_listener_resource_name_template": "xdstp://xds.authority.com/envoy.config.listener.v3.Listener/grpc/client/%s?project_id=1234",

            // Resource name template for xDS-enabled gRPC servers.
            "server_listener_resource_name_template": "xdstp://xds.authority.com/envoy.config.listener.v3.Listener/grpc/server/%s?project_id=1234",

            // Authorities map.
            "authorities": {
              "xds.authority.com": {
                "client_listener_resource_name_template": "xdstp://xds.authority.com/envoy.config.listener.v3.Listener/grpc/client/%s?project_id=1234"
              },
              "xds.other.com": {
                "xds_servers": [otherServer.getBootstrapServerConfig()]
              }
            }
          };
          bootstrap = JSON.stringify(bootstrapInfo);
          done();
        });
      });
    });
    it('Should accept a name with no authority', (done) => {
      xdsClient = new XdsTestClient('xds:server.example.com', bootstrap);
      xdsClient.sendOneCall(error => {
        assert.ifError(error);
        assert(defaultRouteGroup.haveAllBackendsReceivedTraffic());
        done();
      });
    });
    it('Should accept a with an authority that has no server configured', (done) => {
      xdsClient = new XdsTestClient('xds://xds.authority.com/server.example.com', bootstrap);
      xdsClient.sendOneCall(error => {
        assert.ifError(error);
        assert(defaultRouteGroup.haveAllBackendsReceivedTraffic());
        done();
      });
    });
    it('Should accept a name with an authority that has no template configured', (done) => {
      xdsClient = new XdsTestClient('xds://xds.other.com/server.other.com', bootstrap);
      xdsClient.sendOneCall(error => {
        assert.ifError(error);
        assert(otherRouteGroup.haveAllBackendsReceivedTraffic());
        done();
      });
    });
  });
});
