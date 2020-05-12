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

@echo "Starting Windows build"

call npm install -g npm@6.10.x
@rem https://github.com/mapbox/node-pre-gyp/issues/362
call npm install -g node-gyp@3

cd /d %~dp0
cd ..\..\..\..\..

set ARTIFACTS_OUT=%cd%\artifacts

cd packages\grpc-native-core

set PATH=%PATH%;C:\Program Files\nodejs\;%APPDATA%\npm

set JOBS=8

del /f /q BUILD || rmdir build /s /q

call npm update || goto :error

if "%RUNTIME%"=="electron" (
  set "npm_config_disturl=https://atom.io/download/electron"
)

call .\node_modules\.bin\node-pre-gyp.cmd configure build package --target=%VERSION% --target_arch=%ARCH% --runtime=%RUNTIME% && goto :success
@rem Try again after removing openssl headers
rmdir "%USERPROFILE%\.node-gyp\%VERSION%\include\node\openssl" /S /Q
rmdir "%USERPROFILE%\.node-gyp\iojs-%VERSION%\include\node\openssl" /S /Q
rmdir "%USERPROFILE%\AppData\Local\node-gyp\cache\%VERSION%\include\node\openssl" /S /Q
rmdir "%USERPROFILE%\AppData\Local\node-gyp\cache\iojs-%VERSION%\include\node\openssl" /S /Q
call .\node_modules\.bin\node-pre-gyp.cmd build package --target=%VERSION% --target_arch=%ARCH% --runtime=%RUNTIME% || goto :error

:success

xcopy /Y /I /S build\stage\* %ARTIFACTS_OUT%\ || goto :error

if %errorlevel% neq 0 exit /b %errorlevel%

goto :EOF

:error
exit /b 1