@rem Copyright 2018 gRPC authors.
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

SET PATH=%APPDATA%\nvm-ps;%APPDATA%\nvm-ps\nodejs;%PATH%
call nvm install 10
call nvm use 10

call npm install -g npm
@rem https://github.com/mapbox/node-pre-gyp/issues/362
call npm install -g node-gyp@3

cd /d %~dp0
cd ..\..

git submodule update --init
git submodule foreach --recursive git submodule update --init

set ARTIFACTS_OUT=artifacts
cd packages\grpc-native-core
call tools\run_tests\artifacts\build_artifact_electron.bat || goto :error
cd ..\..

move packages\grpc-native-core\artifacts .
goto :EOF

:error
exit /b 1
