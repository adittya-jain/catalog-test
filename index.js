const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to decode a number from a given base
function decodeValue(base, value) {
    return parseInt(value, base);  // Decode the value from the given base
}

// Function to calculate the constant term using Lagrange interpolation
function lagrangeInterpolation(points) {
    let constantTerm = 0.0;
    const k = points.length;

    for (let i = 0; i < k; i++) {
        const xi = points[i][0];
        const yi = points[i][1];

        // Calculate the Lagrange basis polynomial L_i(0)
        let term = yi;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const xj = points[j][0];
                term *= (0 - xj) / (xi - xj);  // Evaluate L_i at x = 0
            }
        }

        constantTerm += term;
    }

    return constantTerm;
}

// Main function to read and parse the input JSON from a file
function parseAndReadTestCaseFromFile(filePath) {
    try {
        // Read the input JSON from the file
        const jsonInput = fs.readFileSync(filePath, 'utf8');
        const inputData = JSON.parse(jsonInput);
        const keys = inputData.keys;

        const n = keys.n;
        const k = keys.k;

        // Collect the points (x, y)
        const points = [];

        // Loop through the inputData object to extract points
        Object.keys(inputData).forEach(key => {
            if (key !== 'keys') {
                const x = parseInt(key);  // The key is the x value
                const point = inputData[key];
                const base = parseInt(point.base);  // The base
                const encodedY = point.value;  // The encoded y value
                const y = decodeValue(base, encodedY);  // Decode the y value

                // Add the point (x, y) to the points array
                points.push([x, y]);

                // console.log(`Point (x, y): (${x}, ${y})`);
            }
        });

        // Ensure we have enough points to solve the polynomial
        if (points.length < k) {
            throw new Error("Not enough points to solve the polynomial");
        }

        // Calculate the constant term (secret) using Lagrange interpolation
        return lagrangeInterpolation(points.slice(0, k));  // Use the first k points
    } catch (error) {
        throw new Error(`Invalid JSON or processing error: ${error.message}`);
    }
}

// Call the function with the path to the JSON file
rl.question('Please enter the file path: ', (filePath) => {
  try {
      const secret = parseAndReadTestCaseFromFile(filePath);  // Your function to read the file
      console.log("The secret (constant term) is:", secret);
  } catch (error) {
      console.error("Error:", error.message);
  } finally {
      rl.close();  
  }
});