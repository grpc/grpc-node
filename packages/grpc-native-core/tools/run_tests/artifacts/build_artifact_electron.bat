@rem Copyright 2016 gRPC authors.
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

set arch_list=ia32 x64

set electron_versions=1.0.0 1.1.0 1.2.0 1.3.0 1.4.0 1.5.0 1.6.0 1.7.0 1.8.0 2.0.0 3.0.0 3.1.0 4.1.0 5.0.0

set PATH=%PATH%;C:\Program Files\nodejs\;%APPDATA%\npm

set JOBS=8

del /f /q BUILD || rmdir build /s /q

call npm update || goto :error

mkdir -p %ARTIFACTS_OUT%

for %%a in (%arch_list%) do (
  for %%v in (%electron_versions%) do (
    cmd /V /C "set "HOME=%USERPROFILE%\electron-gyp" && call .\node_modules\.bin\node-pre-gyp.cmd configure rebuild package --runtime=electron --target=%%v --target_arch=%%a --disturl=https://atom.io/download/electron" || goto :error

    xcopy /Y /I /S build\stage\* %ARTIFACTS_OUT%\ || goto :error
    rmdir build /S /Q
  )
)
if %errorlevel% neq 0 exit /b %errorlevel%

goto :EOF

:error
exit /b 1
