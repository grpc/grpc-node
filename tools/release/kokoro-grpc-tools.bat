@rem Copyright 2019 gRPC authors.
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

cd /d %~dp0
cd ../..

git submodule update --init --recursive

@rem make sure msys binaries are preferred over cygwin binaries
set PATH=C:\tools\msys64\usr\bin;%PATH%
set ARTIFACTS_OUT=%cd%/artifacts
powershell -File ./packages/grpc-tools/build_binaries.ps1 || goto :error
goto :EOF

:error
exit /b 1