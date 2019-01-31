cd /d %~dp0
cd ..

call ./tools/release/kokoro-nodejs.bat
powershell -File ./packages/grpc-tools/build_binaries.ps1