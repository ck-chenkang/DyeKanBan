@echo off 

　　if "%1" == "h" goto begin 

　　mshta vbscript:createobject("wscript.shell").run("%~nx0 h",0)(window.close)&&exit 

　　:begin

@echo off
::echo.

set NodePackagesPath=E:\kanban // This is my path, you can edit them

set Path=%NodePackagesPath%\node_modules\.bin;%PATH%
set Path=%NodePackagesPath%;%PATH%

set NODE_PATH=%NodePackagesPath%\node_modules;%NODE_PATH%
set NODE_ENV=production

::echo Environment variables are successfully added.
::echo. 
::echo. 
::echo. 

npm start