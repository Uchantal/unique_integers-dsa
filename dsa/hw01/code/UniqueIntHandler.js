const fs = require('fs');
const path = require('path');

class UniqueIntHandler {
    constructor() {
        this.seen = Array(2047).fill(false); 
        // to track integers from -1023 to 1023 (add 1023 to shift)
    }

    processFile(inputFilePath, outputFilePath) {
        try {
            const inputData = fs.readFileSync(inputFilePath, 'utf-8');
            const outputData = [];

            let uniqueIntegers = [];

            // Go line by line and clean up spaces
            inputData.split('\n').forEach(line => {
                line = line.trim();

                // Ignore empty lines or ones that are not valid integers
                if (this.isValidInteger(line)) {
                    let num = parseInt(line);
                    if (!this.seen[num + 1023]) {  // We adjust by 1023 to make -1023 fit
                        uniqueIntegers.push(num);
                        this.seen[num + 1023] = true;  // Mark the number as seen
                    }
                }
            });

            // Sort the unique integers list (using bubble sort)
            this.sortUniqueIntegers(uniqueIntegers);

            // Write results to the output file
            uniqueIntegers.forEach(num => {
                outputData.push(`${num}\n`);
            });

            fs.writeFileSync(outputFilePath, outputData.join(''), 'utf-8');
        } catch (err) {
            console.error(`Error processing file: ${err.message}`);
        }
    }

    isValidInteger(value) {
        // Checks if a given string can be converted to an integer
        return !isNaN(value) && Number.isInteger(parseFloat(value));
    }

    sortUniqueIntegers(integers) {
        // Bubble sort implementation
        let n = integers.length;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (integers[j] > integers[j + 1]) {
                    // Swap the numbers if they are out of order
                    [integers[j], integers[j + 1]] = [integers[j + 1], integers[j]];
                }
            }
        }
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

B
B
B
B
B
B
B
B
B
B
B
B
B
B
B

