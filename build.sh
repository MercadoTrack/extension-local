echo "Removing dist folder..."
rm -rf ./dist

echo "Creating dist folder..."
mkdir dist

echo "Copying manifest..."
cp ./src/manifest.json ./dist/

echo "Copying images..."
cp -r ./images ./dist/

echo "Transpiling..."
npx tsc

echo "Done!"
