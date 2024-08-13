let resetDisplay = false;

function appendToDisplay(input) {
    if (resetDisplay) {
        display.value = ""; 
        resetDisplay = false;
    }

    
    const lastChar = display.value.slice(-1);
    if (isOperator(input) && isOperator(lastChar)) {
        return;
    }

    display.value += input;
}

function clearDisplay() {
    display.value = "";
    resetDisplay = false;
}

function calculate() {
    const expression = display.value;


    if (!expression || isOperator(expression.slice(-1)) || expression.slice(-1) === "." || expression.startsWith('^')) {
        display.value = "Error! Try again!";
        resetDisplay = true;
        return;
    }

    try {
        const result = evaluateExpression(expression);
        display.value = result;
        resetDisplay = true;
    } catch (error) {
        display.value = "Error! Try again!";
        resetDisplay = true;
    }
}

function evaluateExpression(expression) {
    const tokens = tokenize(expression);
    const outputQueue = [];
    const operatorStack = [];

    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '^': 3
    };

    const associativity = {
        '+': 'L',
        '-': 'L',
        '*': 'L',
        '/': 'L',
        '^': 'R'
    };

    tokens.forEach(token => {
        if (!isNaN(token)) {
            outputQueue.push(token);
        } else if (['+', '-', '*', '/', '^'].includes(token)) {
            while (operatorStack.length > 0 &&
                   precedence[operatorStack[operatorStack.length - 1]] >= precedence[token] &&
                   associativity[token] === 'L') {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        }
    });

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    return evaluatePostfix(outputQueue);
}

function tokenize(expression) {
    const tokens = [];
    let numberBuffer = [];

    for (let char of expression) {
        if (!isNaN(char) || char === '.') {
            numberBuffer.push(char);
        } else if (['+', '-', '*', '/', '^'].includes(char)) {
            if (numberBuffer.length > 0) {
                tokens.push(numberBuffer.join(''));
                numberBuffer = [];
            }
            tokens.push(char);
        }
    }

    if (numberBuffer.length > 0) {
        tokens.push(numberBuffer.join(''));
    }

    return tokens;
}

function evaluatePostfix(postfix) {
    const stack = [];

    postfix.forEach(token => {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else {
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '^':
                    stack.push(Math.pow(a, b));
                    break;
                case '/':
                    if (b === 0) {
                        throw new Error("Error! Try again!");
                    }
                    stack.push(a / b);
                    break;
            }
        }
    });

    return stack.pop();
}

function isOperator(char) {
    return ['+', '-', '*', '/', '^'].includes(char);
}