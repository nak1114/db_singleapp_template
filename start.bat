@echo off
setlocal
set RACK_ENV=production
set BROWSER="C:\Program Files (x86)\Internet Explorer\iexplore.exe "
set DB_PASSWORD=xxxxxx

cd %~dp0
call ..\password.bat
.\vendor\2.1.8\bin\ruby ru.rb
