class ExtractLetters {
    constructor(word) {
        this.word = word;
    }

    // Granular breakdown of token into individual letters or characters
    getLettersList(token) {
        let lettersList = [];
        for (let char of token) {
            if (/[a-zA-Z]/.test(char)) {  // Check if the character is a letter
                lettersList.push(`'${char}'`);  // Append letter as 'char'
            } else if (char === " ") {
                lettersList.push("' '");  // Append a space
            } else if (/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(char)) {
                lettersList.push(`'${char}'`);  // Append punctuation
            } else if (!isNaN(char)) {
                lettersList.push(`'${char}'`);  // Append digit
            } else if (char === "\n") {
                lettersList.push("'\\n'");  // Append newline character
            }
        }
        return lettersList;
    }

    // Determine the type of token
    getTokenType(token) {
        const hasLetter = /[a-zA-Z]/.test(token);
        const hasDigit = /\d/.test(token);
        const isDecimalNumber = /^\d+(\.\d+)?$/.test(token);  // Handle decimals
        const hasPunctuation = /[!"#$%&'()*+,-./:<=>?@[\]^_`{|}~]/.test(token);
        const hasSpace = /\s/.test(token);

        if (token === "\n") {
            return "End of Line";
        } else if (hasLetter && hasSpace) {
            return "Phrase";
        } else if (isDecimalNumber) {
            return "Number";
        } else if (hasLetter && hasDigit) {
            return "Alphanumeric";
        } else if (hasLetter) {
            return "Word";
        } else if (hasDigit) {
            return "Number";
        } else if (hasPunctuation) {
            return "Punctuation";
        } else if (hasSpace) {
            return "White space";
        } else {
            return "Other";
        }
    }
}

// Tokenizer function 
function customTokenizer(inputString) {
    let tokens = [];
    let currentToken = "";
    let isInNumber = false;

    for (let i = 0; i < inputString.length; i++) {
        const char = inputString[i];

        // Check if it's a part of a number (with decimal handling)
        if (!isNaN(char) || (char === '.' && isInNumber && i + 1 < inputString.length && !isNaN(inputString[i + 1]))) {
            currentToken += char;
            isInNumber = true;
        } else {
            isInNumber = false;

            // If encountering space, newline, or semicolon, push the token
            if (char === " ") {
                if (currentToken.length > 0) {
                    tokens.push(currentToken);  // Push the current token before space
                    currentToken = "";
                }
                tokens.push(" ");  // Add space as its own token
            } else if (char === "\n") {
                if (currentToken.length > 0) {
                    tokens.push(currentToken);  // Push the current token before newline
                    currentToken = "";
                }
                tokens.push("\n");  // Add newline as its own token
            } else if (char === ";") {
                if (currentToken.length > 0) {
                    tokens.push(currentToken);  // Push the current token before semicolon
                    currentToken = "";
                }
                // Do not push semicolon
            } else if (/[!"#$%&'()*+,-/:;<=>?@[\]^_`{|}~]/.test(char)) {
                if (currentToken.length > 0) {
                    tokens.push(currentToken);  // Push the current token before punctuation
                    currentToken = "";
                }
                tokens.push(char);  // Add punctuation as its own token
            } else {
                currentToken += char;  // Build the current token
            }
        }
    }

    if (currentToken.length > 0) {
        tokens.push(currentToken);  // Add any remaining token
    }

    return tokens;
}

// Event listener for the "Tokenize My Text" button
document.querySelector('.bn632-hover').addEventListener('click', function() {
    const inputString = document.getElementById('input-text').value;
    const tokens = customTokenizer(inputString);  // Use custom tokenizer to split by white space, semicolon, and handle punctuation

    const letters = new ExtractLetters(inputString);

    let output = "Tokenization Result:\n";

    output += "\n===================================================\nPhase 1 Output:\n";

    // Phase 1: Display token type
    for (let token of tokens) {
        const tokenType = letters.getTokenType(token);
        output += `Token: "${token}" - Type: ${tokenType}\n`;
    }

    output += "\n===================================================\nPhase 2 Output (Granular Breakdown):\n";

    // Phase 2: Display list of letters and other characters
    for (let token of tokens) {
        if (token.length > 0) {  // Exclude empty tokens
            output += `Token: "${token}" -> ${letters.getLettersList(token).join(", ")}\n`;
        }
    }

    // Display the result in the output textarea
    document.getElementById('output-text').value = output;
});
