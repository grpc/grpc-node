#!/usr/bin/env python2.7

# Copyright 2020 gRPC authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from __future__ import print_function
import re
import os
import sys
import yaml

node_versions = ["4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]
electron_versions = ["1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "2.0", "3.0", "3.1", "4.1", "4.2", "5.0", "6.0", "6.1", "7.0", "7.1", "8.0"]

def gen_linux_configs():
  configs = []

  node_arches = ["ia32", "x64", "arm", "arm64", "s390x"]
  electron_arches = ["ia32", "x64"]
  alpine_arches = ["x64"]

  for version in node_versions:
    for arch in node_arches:
      configs.append({
        "name": "node_{version}_{arch}_glibc".format(version=version, arch=arch),
        "runtime": "node",
        "version": version,
        "arch": arch,
        "libc": "glibc"
      })
    for arch in alpine_arches:
      configs.append({
        "name": "node_{version}_{arch}_musl".format(version=version, arch=arch),
        "runtime": "node",
        "version": version,
        "arch": arch,
        "libc": "glibc"
      })
  for version in electron_versions:
    for arch in electron_arches:
      configs.append({
        "name": "electron_{version}_{arch}_glibc".format(version=version, arch=arch),
        "runtime": "electron",
        "version": version,
        "arch": arch,
        "libc": "glibc"
      })
  return configs

def gen_mac_configs():
  configs = []

  node_arches = ["ia32", "x64"]
  electron_arches = ["ia32", "x64"]

  for version in node_versions:
    for arch in node_arches:
      configs.append({
        "name": "node_{version}_{arch}".format(version=version, arch=arch),
        "runtime": "node",
        "version": version,
        "arch": arch
      })
  for version in electron_versions:
    for arch in electron_arches:
      configs.append({
        "name": "electron_{version}_{arch}".format(version=version, arch=arch),
        "runtime": "electron",
        "version": version,
        "arch": arch
      })
  return configs

def gen_windows_configs():
  configs = []

  node_arches = ["ia32", "x64"]
  electron_arches = ["ia32", "x64"]

  for version in node_versions:
    for arch in node_arches:
      configs.append({
        "name": "node_{version}_{arch}".format(version=version, arch=arch),
        "runtime": "node",
        "version": version,
        "arch": arch
      })
  for version in electron_versions:
    for arch in electron_arches:
      configs.append({
        "name": "electron_{version}_{arch}".format(version=version, arch=arch),
        "runtime": "electron",
        "version": version,
        "arch": arch
      })
  return configs

out = {
  "linux_configs": gen_linux_configs(),
  "mac_configs": gen_mac_configs(),
  "windows_configs": gen_windows_configs()
}

print(yaml.dump(out))