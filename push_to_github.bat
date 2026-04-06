@echo off
echo Pushing code to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo ----------------------------------------------------------------
    echo Push failed. Please check your internet connection or credentials.
    echo If prompted, please enter your GitHub username and password/token.
    echo ----------------------------------------------------------------
) else (
    echo.
    echo ----------------------------------------------------------------
    echo Push successful! Your code is now on GitHub.
    echo ----------------------------------------------------------------
)
pause
