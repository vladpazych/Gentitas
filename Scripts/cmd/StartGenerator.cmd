@ECHO off
SET BASEDIR=%~dp0
CD %BASEDIR%/../../.Generator
@ECHO Starting Gentitas Generator...
@ECHO:
CALL npm start
@ECHO: 
SET /p DUMMY=Process completed