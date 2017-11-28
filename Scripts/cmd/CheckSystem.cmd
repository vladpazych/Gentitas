@ECHO off

where node.exe >nul 2>&1 && GOTO echo_pass || GOTO echo_fail
@ECHO %output%

:echo_fail
@ECHO Node.js is not installed or not in the PATH.
@ECHO:
@ECHO Next steps: 
@ECHO 1. Install Node.js - https://nodejs.org/
@ECHO 2. Run InstallDependencies
@ECHO 3. Run StartGenerator
GOTO final

:echo_pass
@ECHO Node.js is installed. Congratulations!
@ECHO:
@ECHO Next steps:
@ECHO 1. Run InstallDependencies
@ECHO 2. Run Generate
GOTO final

:final
@ECHO:
SET /p DUMMY=Process completed