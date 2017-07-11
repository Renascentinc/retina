find . -maxdepth 1 ! -iname dist ! -iname ".." ! -iname "." ! -iname ".git" -exec rm -rf {} \;
mv dist/* .
rm -rf dist
