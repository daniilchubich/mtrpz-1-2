'use strict';
import fs from 'fs/promises';
import convert from './converter.mjs';

const args = process.argv.slice(2);

let writeToFile = false;
let writeTo = '';
let readFrom = '';

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out') {
        writeToFile = true;
        if (i === args.length - 1) throw new Error('No file specified for --out');
        writeTo = args[i + 1];
    } else if (i === args.length - 1) {
        readFrom = args[i];
    } else {
        throw new Error('Unknown argument: ' + args[i]);
    }
}

if (!readFrom) throw new Error('No file specified to read from');

const content = await fs.readFile(readFrom, 'utf8');

const converted = convert(content);

if (writeToFile) {
    await fs.writeFile(writeTo, converted);
} else {
    console.log(converted);
}