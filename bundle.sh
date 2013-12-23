rm -r ./target
rm -r ./build
mkdir ./target
mkdir ./build
./node_modules/coffee-script/bin/coffee -c -o ./target ./src/*.coffee
./node_modules/browserify/bin/cmd.js ./target/index.js > ./build/syncify.js
./node_modules/browserify/bin/cmd.js ./target/index.js | ./node_modules/uglify-js/bin/uglifyjs > ./build/syncify.min.js
rm -r ./target