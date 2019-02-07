cd /d %~dp0
cd ../..

set ARTIFACTS_OUT=artifacts
powershell -File ./packages/grpc-tools/build_binaries.ps1 || exit /b 1