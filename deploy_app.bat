@echo off
echo Deploying Basecaster to Vercel...
call npm run build
call npx vercel --prod
pause
