<#
  Copyright 2019 gRPC authors.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
#>

$ErrorActionPreference = "Stop"

Install-PackageProvider -Name NuGet -RequiredVersion 2.8.5.201 -Force
Import-PackageProvider -Name NuGet -RequiredVersion 2.8.5.201
Install-Module -Force -Name 7Zip4Powershell

$env:Path += ";C:\Program Files\CMake\bin"

function MkDir-p($Path) {
    $FullPath = "\\?\" + $Path
    if (-not (Test-Path -Path $FullPath)) {
        New-Item -ItemType directory -Path $FullPath | Out-Null
    }
}

$Base = $PSScriptRoot
cd $Base
$ProtobufBase = $Base + "/deps/protobuf"
MkDir-p ($Base + "/build/bin")

$PackageFile = $Base + "/package.json"
$ToolsVersion = ((Get-Content $PackageFile) -join "`n" | ConvertFrom-Json).version

$OutDir = $Env:ARTIFACTS_OUT + "/grpc-tools/v" + $ToolsVersion
Mkdir-p $OutDir

$ArchList = "ia32","x64"

foreach ($Arch in $ArchList) {
  if ($Arch -eq "x64") {
    $Generator = "Visual Studio 14 2015 Win64"
  } else {
    $Generator = "Visual Studio 14 2015"
  }

  & cmake.exe .
  if ($LASTEXITCODE -ne 0) {
    throw "cmake failed"
  }
  & cmake.exe --build .
  if ($LASTEXITCODE -ne 0) {
    throw "cmake build failed"
  }

  Copy-Item ($ProtobufBase + "/Debug/protoc.exe") -Destination ($Base + "/build/bin/protoc.exe")
  Copy-Item ($Base + "/Debug/grpc_node_plugin.exe") -Destination ($Base + "/build/bin/grpc_node_plugin.exe")

  Compress-7Zip -Path ($Base + "/build") -Format Tar -ArchiveFileName ($Base + "/Archive.tar")
  Compress-7Zip -Path ($Base + "/Archive.tar") -Format GZip -ArchiveFileName ($OutDir + "/win32-" + $Arch + ".tar.gz")

  Remove-Item ($Base + "/build/bin/protoc.exe")
  Remove-Item ($Base + "/build/bin/grpc_node_plugin.exe")
  Remove-Item ($Base + "/CMakeCache.txt")
}