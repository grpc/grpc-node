cd /d %~dp0
cd ..

call ./tools/release/kokoro-nodejs.bat
call ./tools/release/kokoro-grpc-tools.bat