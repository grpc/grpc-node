Install-Module -Name 7Zip4Powershell

function MkDir-p($Path) {
    $FullPath = "\\?\" + $Path
    if (-not (Test-Path -Path $FullPath)) {
        New-Item -ItemType directory -Path $FullPath | Out-Null
    }
}

$WellKnownProtos = "any","api","compiler/plugin","descriptor","duration","empty","field_mask","source_context","struct","timestamp","type","wrappers"

$Base = %~dp0
cd $Base
$ProtobufBase = $Base + "/deps/protobuf"
MkDir-p $Base + "/build/bin"

$PackageFile = $Base + "/package.json"
$ToolsVersion = (Get-Content $PackageFile) -join "`n" | ConvertFrom-Json | Get-Member -Name version

$OutDir = $Env:ARTIFACTS_OUT + "/grpc-tools/v" + $ToolsVersion
Mkdir-p $OutDir

foreach ($Proto in $WellKnownProtos) {
  Copy-Item $ProtobufBase + "/src/google/protobuf/" + $Proto + ".proto" -Destination $Base + "/build/bin/google/protobuf/" + $Proto + ".proto"
}

$ArchList = "ia32","x64"

foreach ($Arch in $ArchList) {
  if ($Arch -eq "x64") {
    $Generator = "Visual Studio 14 2015 Win64"
  } else {
    $Generator = "Visual Studio 14 2015"
  }
  Remove-Item $Base + "/build/bin/protoc.exe"
  Remove-Item $Base + "/build/bin/grpc_node_plugin.exe"
  Remove-Item $Base + "CMakeCache.txt"

  Invoke-Expression "cmake ."
  Invoke-Expression "cmake --build ."

  Copy-Item $ProtobufBase + "/protoc.exe" -Destination $Base + "/build/bin/protoc.exe"
  Copy-Item $Base + "/grpc_node_plugin.exe" -Destination $Base + "/build/bin/grpc_node_plugin.exe"

  Compress-7Zip -Path $Base + "/build" -Format Tar -ArchiveFileName $Base + "/Archive.tar"
  Compress-7Zip -Path $Base + "/Archive.tar" -Format GZip -ArchiveFileName $OutDir + "/windows-x64.tar.gz"
}