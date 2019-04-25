@rem Copyright 2017 gRPC authors.
@rem
@rem Licensed under the Apache License, Version 2.0 (the "License");
@rem you may not use this file except in compliance with the License.
@rem You may obtain a copy of the License at
@rem
@rem     http://www.apache.org/licenses/LICENSE-2.0
@rem
@rem Unless required by applicable law or agreed to in writing, software
@rem distributed under the License is distributed on an "AS IS" BASIS,
@rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@rem See the License for the specific language governing permissions and
@rem limitations under the License.

SET ROOT=%~dp0
cd /d %~dp0

powershell -c "Get-Host"
powershell -c "$PSVersionTable"
powershell -c "[System.Environment]::OSVersion"
powershell -c "Get-WmiObject -Class Win32_ComputerSystem"
powershell -c "(Get-WmiObject -Class Win32_ComputerSystem).SystemType"

powershell -c "& { iwr https://raw.githubusercontent.com/grumpycoders/nvm-ps/master/nvm.ps1 | iex }"

SET PATH=%APPDATA%\nvm-ps;%APPDATA%\nvm-ps\nodejs;%PATH%
SET JOBS=8

call nvm version

call nvm install 8
call nvm use 8

SET npm_config_fetch_retries=5

call npm install || goto :error

SET JUNIT_REPORT_STACK=1
SET FAILED=0

for %%v in (6 7 8 9 10 11 12) do (
  call nvm install %%v
  call nvm use %%v
  if "%%v"=="4" (
    call npm install -g npm@5
  )
  @rem https://github.com/mapbox/node-pre-gyp/issues/362
  call npm install -g node-gyp
  node -e "console.log(process.versions)"

  mkdir reports\node%%v
  SET JUNIT_REPORT_PATH=reports/node%%v

  node -e "process.exit(process.version.startsWith('v%%v') ? 0 : -1)" || goto :error

  call .\node_modules\.bin\gulp cleanAll || SET FAILED=1
  call .\node_modules\.bin\gulp setupWindows || SET FAILED=1
  call .\node_modules\.bin\gulp test || SET FAILED=1
)

node merge_kokoro_logs.js
if %FAILED% neq 0 exit /b 1
goto :EOF

:error
exit /b 1
