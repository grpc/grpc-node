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

powershell -c "& { iwr https://raw.githubusercontent.com/grumpycoders/nvm-ps/master/nvm.ps1 | iex }"

call nvm install 10
call nvm use 10

call npm install -g npm@6.10.x
@rem https://github.com/mapbox/node-pre-gyp/issues/362
call npm install -g node-gyp@3

cd /d %~dp0
cd ..\..\..\..\..

git submodule update --init --recursive

set ARTIFACTS_OUT=%cd%\artifacts

cd packages\grpc-native-core

set PATH=%PATH%;C:\Program Files\nodejs\;%APPDATA%\npm

set JOBS=8

del /f /q BUILD || rmdir build /s /q

call npm update || goto :error

if "%RUNTIME%"=="electron" (
  set "HOME=%USERPROFILE%\electron-gyp"
  set "npm_config_disturl=https://atom.io/download/electron"
)

call .\node_modules\.bin\node-pre-gyp.cmd configure build --target=%%v --target_arch=%%a && goto :EOF
@rem Try again after removing openssl headers
rmdir "%USERPROFILE%\.node-gyp\%%v\include\node\openssl" /S /Q
rmdir "%USERPROFILE%\.node-gyp\iojs-%%v\include\node\openssl" /S /Q
rmdir "%USERPROFILE%\AppData\Local\node-gyp\cache\%%v\include\node\openssl" /S /Q
rmdir "%USERPROFILE%\AppData\Local\node-gyp\cache\iojs-%%v\include\node\openssl" /S /Q
call .\node_modules\.bin\node-pre-gyp.cmd build package --target=%%v --target_arch=%%a || goto :error

xcopy /Y /I /S build\stage\* %ARTIFACTS_OUT%\ || goto :error

if %errorlevel% neq 0 exit /b %errorlevel%

goto :EOF

:error
exit /b 1