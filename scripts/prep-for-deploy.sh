shopt -s extglob
rm -rf !(dist)
mv dist/* .
rm -rf dist
