@echo off
setlocal
set RACK_ENV=production
set BROWSER="C:\Program Files (x86)\Internet Explorer\iexplore.exe "
set DB_PASSWORD=xxxxxx

cd %~dp0
call ..\password.bat
.\vendor\ruby\bin\ruby ru.rb
