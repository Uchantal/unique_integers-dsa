const fs = require('fs');
const path = require('path');

class UniqueIntHandler {
    constructor() {
        this.seen = {}; // Using an object instead of an array
    }

    processFile(inputFilePath, outputFilePath) {
        try {
            const inputStream = fs.createReadStream(inputFilePath, 'utf-8');
            const outputStream = fs.createWriteStream(outputFilePath, { flags: 'w' });

            let buffer = '';
            let self = this;

            // Handling the input file line by line
            inputStream.on('data', function (chunk) {
                buffer += chunk;
                let lines = buffer.split('\n');
                buffer = lines.pop();  // Save the last line fragment for the next chunk

                lines.forEach(line => {
                    line = line.trim();

                    // Ignore empty lines or ones that are not valid integers
                    if (self.isValidInteger(line)) {
                        let num = parseInt(line);
                        if (!self.seen[num]) {  // Check if the number hasn't been seen yet
                            self.seen[num] = true;  // Mark the number as seen
                        }
                    }
                });
            });

            inputStream.on('end', function () {
                // Once the file is read, sort the unique integers
                self.sortUniqueIntegers(outputStream);
            });

            inputStream.on('error', function (err) {
                console.error(`Error reading input file: ${err.message}`);
            });

        } catch (err) {
            console.error(`Error processing file: ${err.message}`);
        }
    }

    isValidInteger(value) {
        // Checks if a given string can be converted to an integer
        return !isNaN(value) && Number.isInteger(parseFloat(value));
    }

    sortUniqueIntegers(outputStream) {
        // Since we can't use arrays, we'll loop through all possible integers
        // We'll sort the keys of the object (which represent unique integers) in ascending order
        for (let i = -1023; i <= 1023; i++) {
            if (this.seen[i]) {
                outputStream.write(`${i}\n`);
            }
        }

        outputStream.end();
        console.log('Sorting and writing completed.');
    }
}

function main() {
    const inputDir = path.join(__dirname, '../sample_inputs');
    const outputDir = path.join(__dirname, '../sample_results');

    const startTime = new Date().getTime();

    // Process all input files from the input directory
    fs.readdirSync(inputDir).forEach(inputFile => {
        const inputFilePath = path.join(inputDir, inputFile);
        const outputFilePath = path.join(outputDir, `${inputFile}_results.txt`);

        const uniqueIntHandler = new UniqueIntHandler();
        uniqueIntHandler.processFile(inputFilePath, outputFilePath);
    });

    const endTime = new Date().getTime();
    const elapsedTime = (endTime - startTime);  // Time in milliseconds
    console.log(`Time taken: ${elapsedTime} ms`);
}

main();

