@echo off
setlocal
call password.bat
set RACK_ENV=production
rem cd %~dp0\test
rem %~dp0\test\vendor\2.1.8\bin\ruby ru.rb
rem cd %~dp0
.\vendor\2.1.8\bin\ruby ru.rb
