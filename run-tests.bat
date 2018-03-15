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

PowerShell -Command .\install-nvm-windows.ps1

SET NVM_HOME=%ROOT%nvm
SET NVM_SYMLINK=%ROOT%nvm\nodejs
SET PATH=%NVM_HOME%;%NVM_SYMLINK%;%PATH%
SET JOBS=8

nvm version

nvm install 8.5.0
nvm use 8.5.0

call npm install || goto :error

SET JUNIT_REPORT_STACK=1
SET FAILED=0

for %%v in (4.8.4 6.11.3 7.9.0 8.5.0) do (
  nvm install %%v
  nvm use %%v
  call npm install -g npm
  node -e "console.log(process.versions)"

  mkdir reports\node%%v
  SET JUNIT_REPORT_PATH=reports/node%%v

  call .\node_modules\.bin\gulp clean.all || SET FAILED=1
  call .\node_modules\.bin\gulp setup.windows || SET FAILED=1
  call .\node_modules\.bin\gulp native.test || SET FAILED=1
)

node merge_kokoro_logs.js
if %FAILED% neq 0 exit /b 1
goto :EOF

:error
exit /b 1
