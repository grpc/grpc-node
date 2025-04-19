/*
 * Copyright 2025 gRPC authors.
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
 */

import { Metadata } from "@grpc/grpc-js";
import { Matcher, ValueMatcher } from "./matcher";
import { CidrRange, cidrRangeMessageToCidrRange, inCidrRange } from "./cidr";
import { PeerCertificate } from "tls";
import { RBAC__Output } from "./generated/envoy/config/rbac/v3/RBAC";
import { Policy__Output } from "./generated/envoy/config/rbac/v3/Policy";
import { Permission__Output } from "./generated/envoy/config/rbac/v3/Permission";
import { Principal__Output } from "./generated/envoy/config/rbac/v3/Principal";
import { getPredicateForHeaderMatcher, getPredicateForStringMatcher } from "./route";

export interface RbacRule<InfoType> {
  apply(info: InfoType): boolean;
  toString(): string;
}

export class AndRules<InfoType> implements RbacRule<InfoType> {
  constructor(private childRules: RbacRule<InfoType>[]) {}

  apply(info: InfoType) {
    return this.childRules.every(rule => rule.apply(info));
  }

  toString(): string {
    return `And(${this.childRules.map(rule => rule.toString())})`;
  }
}

export class OrRules<InfoType> implements RbacRule<InfoType> {
  constructor(private childRules: RbacRule<InfoType>[]) {}

  apply(info: InfoType) {
    return this.childRules.some(rule => rule.apply(info));
  }

  toString(): string {
    return `Or(${this.childRules.map(rule => rule.toString())})`;
  }
}

export class NotRule<InfoType> implements RbacRule<InfoType> {
  constructor(private childRule: RbacRule<InfoType>) {}

  apply(info: InfoType) {
    return !this.childRule.apply(info);
  }

  toString(): string {
    return `Not(${this.childRule.toString()})`;
  }
}

export class AnyRule<InfoType> implements RbacRule<InfoType> {
  constructor() {}

  apply(info: InfoType) {
    return true;
  }

  toString(): string {
    return `Any()`;
  }
}

export class NoneRule<InfoType> implements RbacRule<InfoType> {
  constructor() {}

  apply(info: InfoType) {
    return false;
  }

  toString(): string {
    return `None()`;
  }
}

export interface PermissionInfo {
  headers: Metadata;
  urlPath: string;
  destinationIp: string;
  destinationPort: number;
}

export type PermissionRule = RbacRule<PermissionInfo>;

export class HeaderPermission implements PermissionRule {
  constructor(private matcher: Matcher) {}

  apply(info: PermissionInfo) {
    return this.matcher.apply(info.urlPath, info.headers);
  }

  toString(): string {
    return `Header(${this.matcher.toString()})`;
  }
}

export class UrlPathPermission implements PermissionRule {
  constructor(private matcher: ValueMatcher) {}

  apply(info: PermissionInfo): boolean {
    return this.matcher.apply(info.urlPath);
  }

  toString(): string {
    return `UrlPath(${this.matcher.toString()})`;
  }
}

export class DestinationIpPermission implements PermissionRule {
  constructor(private cidrRange: CidrRange) {}

  apply(info: PermissionInfo): boolean {
    return inCidrRange(this.cidrRange, info.destinationIp);
  }

  toString(): string {
    return `DestinationIp(${this.cidrRange.addressPrefix}/${this.cidrRange.prefixLen})`;
  }
}

export class DestinationPortPermission implements PermissionRule {
  constructor(private port: number) {}

  apply(info: PermissionInfo): boolean {
    return info.destinationPort === this.port;
  }
  toString(): string {
    return `DestinationPort(${this.port})`;
  }
}

export class MetadataPermission implements PermissionRule {
  constructor() {}

  apply(info: PermissionInfo): boolean {
    return false;
  }
  toString(): string {
    return `Metadata()`;
  }
}

export class RequestedServerNamePermission implements PermissionRule {
  constructor(private matcher: ValueMatcher) {}

  apply(info: PermissionInfo): boolean {
    return this.matcher.apply('');
  }
  toString(): string {
    return `RequestedServerName(${this.matcher.toString()})`;
  }
}

export type BasicPeerCertificate = Pick<PeerCertificate, 'subjectaltname' | 'subject'>;

export interface PrincipalInfo {
  tls: boolean;
  peerCertificate: BasicPeerCertificate | null;
  sourceIp: string;
  headers: Metadata;
  urlPath: string;
}

export type PrincipalRule = RbacRule<PrincipalInfo>;

interface SanEntry {
  type: string;
  value: string;
}

function splitSanEntry(entry: string): SanEntry | null {
  const colonIndex = entry.indexOf(':');
  if (colonIndex < 0) {
    return null;
  }
  return {
    type: entry.substring(0, colonIndex),
    value: entry.substring(colonIndex + 1)
  }
}

export class AuthenticatedPrincipal implements PrincipalRule {
  constructor(private nameMatcher: ValueMatcher | null) {}

  apply(info: PrincipalInfo): boolean {
    if (this.nameMatcher === null) {
      return info.tls;
    }
    if (!info.peerCertificate) {
      return this.nameMatcher.apply('');
    }
    if (info.peerCertificate.subjectaltname) {
      const sanEntries = info.peerCertificate.subjectaltname.split(', ').map(splitSanEntry).filter(x => x !== null);
      if (sanEntries.some(entry => entry.type === 'URI')) {
        for (const entry of sanEntries) {
          if (entry.type === 'URI') {
            if (this.nameMatcher.apply(entry.value)) {
              return true;
            }
          }
        }
      } else if (sanEntries.some(entry => entry.type === 'DNS')) {
        for (const entry of sanEntries) {
          if (entry.type === 'DNS') {
            if (this.nameMatcher.apply(entry.value)) {
              return true;
            }
          }
        }
      }
    }
    return this.nameMatcher.apply(info.peerCertificate.subject.CN);
  }
  toString(): string {
    return `Authenticated(principal=${this.nameMatcher?.toString() ?? null})`;
  }
}

export class SourceIpPrincipal implements PrincipalRule {
  constructor(private cidrRange: CidrRange) {}

  apply(info: PrincipalInfo): boolean {
    return inCidrRange(this.cidrRange, info.sourceIp);
  }
  toString(): string {
    return `SourceIp(${this.cidrRange.addressPrefix}/${this.cidrRange.prefixLen})`;
  }
}

export class HeaderPrincipal implements PrincipalRule {
  constructor(private matcher: Matcher) {}

  apply(info: PrincipalInfo) {
    return this.matcher.apply(info.urlPath, info.headers);
  }

  toString(): string {
    return `Header(${this.matcher.toString()})`;
  }
}

export class UrlPathPrincipal implements PrincipalRule {
  constructor(private matcher: ValueMatcher) {}

  apply(info: PrincipalInfo): boolean {
    return this.matcher.apply(info.urlPath);
  }

  toString(): string {
    return `UrlPath(${this.matcher.toString()})`;
  }
}

export class MetadataPrincipal implements PrincipalRule {
  constructor() {}

  apply(info: PrincipalInfo): boolean {
    return false;
  }
  toString(): string {
    return `Metadata()`;
  }
}

export interface UnifiedInfo extends PermissionInfo, PrincipalInfo {}

export class RbacPolicy {
  private permission: PermissionRule;
  private principal: PrincipalRule;

  constructor(permissions: PermissionRule[], principals: PrincipalRule[]) {
    this.permission = new OrRules(permissions);
    this.principal = new OrRules(principals);
  }

  matches(info: UnifiedInfo) {
    return this.principal.apply(info) && this.permission.apply(info);
  }

  toString() {
    return `principal=${this.principal.toString()} permission=${this.permission.toString()}`;
  }
}

export class RbacPolicyGroup {
  constructor(private policies: Map<string, RbacPolicy>, private allow: boolean) {}

  /**
   *
   * @param info
   * @returns True if the call should be accepted, false if it should be rejected
   */
  apply(info: UnifiedInfo): boolean {
    for (const policy of this.policies.values()) {
      if (policy.matches(info)) {
        return this.allow;
      }
    }
    return !this.allow;
  }

  toString() {
    const policyStrings: string[] = [];
    for (const [name, policy] of this.policies) {
      policyStrings.push(`${name}: ${policy.toString()}`);
    }
    return `RBAC
    action=${this.allow ? 'ALLOW' : 'DENY'}
    policies:
    ${policyStrings.join('\n')}`;
  }
}

export function parsePermission(permission: Permission__Output): PermissionRule {
  switch (permission.rule) {
    case 'and_rules':
      return new AndRules(permission.and_rules!.rules.map(parsePermission));
    case 'or_rules':
      return new OrRules(permission.or_rules!.rules.map(parsePermission));
    case 'not_rule':
      return new NotRule(parsePermission(permission.not_rule!));
    case 'any':
      return new AnyRule();
    case 'destination_ip':
      return new DestinationIpPermission(cidrRangeMessageToCidrRange(permission.destination_ip!));
    case 'destination_port':
      return new DestinationPortPermission(permission.destination_port!);
    case 'header':
      return new HeaderPermission(getPredicateForHeaderMatcher(permission.header!));
    case 'metadata':
      return new MetadataPermission();
    case 'requested_server_name':
      return new RequestedServerNamePermission(getPredicateForStringMatcher(permission.requested_server_name!));
    case 'url_path':
      return new UrlPathPermission(getPredicateForStringMatcher(permission.url_path!.path!));
    default:
      return new NoneRule();
  }
}

export function parsePrincipal(principal: Principal__Output): PrincipalRule {
  switch (principal.identifier) {
    case 'and_ids':
      return new AndRules(principal.and_ids!.ids.map(parsePrincipal));
    case 'or_ids':
      return new OrRules(principal.or_ids!.ids.map(parsePrincipal));
    case 'not_id':
      return new NotRule(parsePrincipal(principal.not_id!));
    case 'any':
      return new AnyRule();
    case 'authenticated':
      return new AuthenticatedPrincipal(principal.authenticated?.principal_name ? getPredicateForStringMatcher(principal.authenticated.principal_name) : null);
    case 'direct_remote_ip':
      return new SourceIpPrincipal(cidrRangeMessageToCidrRange(principal.direct_remote_ip!));
    case 'remote_ip':
      return new SourceIpPrincipal(cidrRangeMessageToCidrRange(principal.remote_ip!));
    case 'source_ip':
      return new SourceIpPrincipal(cidrRangeMessageToCidrRange(principal.source_ip!));
    case 'header':
      return new HeaderPrincipal(getPredicateForHeaderMatcher(principal.header!));
    case 'metadata':
      return new MetadataPrincipal();
    case 'url_path':
      return new UrlPathPrincipal(getPredicateForStringMatcher(principal.url_path!.path!));
    default:
      return new NoneRule();
  }
}

export function parsePolicy(policy: Policy__Output): RbacPolicy {
  return new RbacPolicy(policy.permissions.map(parsePermission), policy.principals.map(parsePrincipal));
}

export function parseConfig(rbac: RBAC__Output): RbacPolicyGroup {
  if (rbac.action === 'LOG') {
    throw new Error('Invalid RBAC action LOG');
  }
  const policyMap = new Map<string, RbacPolicy>();
  for (const [name, policyConfig] of Object.entries(rbac.policies)) {
    policyMap.set(name, parsePolicy(policyConfig));
  }
  return new RbacPolicyGroup(policyMap, rbac.action === 'ALLOW');
}
