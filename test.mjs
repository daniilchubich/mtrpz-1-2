import convert from "./converter.mjs";

function assertEqual (actual, expected) {
    if (actual !== expected) throw new Error('Assertion failed:\n' + actual + '\nExpected to be:\n' + expected);
}

function assertThrow (fn) {
    try {
        fn();
        throw new Error('Assertion failed: No exception thrown');
    } catch (error) {
        // pass
    }
}

console.log('Running tests...');

console.log("Testing empty string...");
assertEqual(convert('', 'html'), '');
assertEqual(convert('', 'esc'), '');
console.log("Empty string passed");

console.log("Testing md basic conversion");
assertEqual(convert('**Hello,** _World!_', 'html'), '<p><b>Hello,</b> <i>World!</i></p>');
assertEqual(convert('**Hello,** _World!_', 'esc'), '\x1b[1mHello,\x1b[0m \x1b[3mWorld!\x1b[0m');
console.log("Basic conversion passed");

console.log("Testing paragraphs");
assertEqual(convert("Hello\n\nWorld!", 'html'), '<p>Hello</p><p>World!</p>');
assertEqual(convert("Hello\n\nWorld!", 'esc'), 'Hello\n\nWorld!');
console.log("Paragraphs passed");

console.log("Testing preformatted");
assertEqual(convert('```Hello**\n\n_World!_```', 'html'), '<pre>Hello**\n\n_World!_</pre>');
assertEqual(convert('```**Hello** World!```', 'esc'), '\x1b[7m**Hello** World!\x1b[0m');
console.log("Preformatted passed");

console.log("Testing unmatched tags handling");
assertThrow(() => convert('**Hello** _World!', 'html'));
assertThrow(() => convert('Hello** World!', 'esc'));
assertThrow(() => convert('**Hello_ World!', 'html'));
console.log("Unmatched tags passed");

console.log("Test passed");
