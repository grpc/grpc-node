cd /d %~dp0
cd ..

call ./tools/release/kokoro-nodejs.bat || goto :error
call ./tools/release/kokoro-grpc-tools.bat || goto :error

goto :EOF

:error
exit /b 1