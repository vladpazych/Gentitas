@ECHO off
SET BASEDIR=%~dp0
CD %BASEDIR%/../../.Generator
@ECHO Installing Gentitas Dependencies...
@ECHO If you have a slow internet connection, this may take a while.
@ECHO:
CALL npm install
@ECHO: 
@ECHO Next steps:
@ECHO 1. Run StartGenerator
@ECHO:
SET /p DUMMY=Process completed