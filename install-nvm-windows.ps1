# Copyright 2017 gRPC authors.
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

# We're going to store nvm-windows in the .\nvm directory.
$env:NVM_HOME = (Get-Item -Path ".\" -Verbose).FullName + "\nvm"

# Downloading and unpacking nvm-windows
Invoke-WebRequest -Uri https://github.com/coreybutler/nvm-windows/releases/download/1.1.5/nvm-noinstall.zip -OutFile nvm-noinstall.zip
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory("nvm-noinstall.zip", "nvm")

$env:Path = $env:NVM_HOME + ";" + $env:Path
Out-File -Encoding "OEM" nvm\settings.txt
nvm root $env:NVM_HOME
"%*" | Out-File -Encoding "OEM" nvm\elevate.cmd
