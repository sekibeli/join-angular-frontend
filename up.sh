git add .
git commit -m "$*"
git push
ng build
git ftp push --syncroot dist/join-angular-frontend --remote-root angular-projects/join-angular-frontend