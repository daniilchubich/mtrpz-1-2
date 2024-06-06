import * as data from './data.mjs';

const supportedFormats = ['html', 'esc'];

let fmt = '';

export default function convert (content, format) {
    if (!supportedFormats.includes(format)) throw new Error('Unsupported format: ' + format);
    fmt = format;
    if (content === '') return content;
    const parts = splitPreformatted(content);
    for (let i = 0; i < parts.length; i += 2) {
        parts[i] = replaceTags(parts[i]);
        if (fmt === 'html') parts[i] = paragraphSplit(parts[i]);
    }

    const newParts = parts.map((part, index) => {
        if (index % 2 === 0) return part;
        return data.preformattedStartReplace[fmt] + part + data.preformattedEndReplace[fmt];
    });

    const final = newParts.join('');

    if (fmt === 'esc') return final;
    return data.paragraphStartReplace + final + data.paragraphEndReplace;
}

function splitPreformatted (text) {
    const parts = text.split(data.preformatted);
    if (parts.length % 2 === 0) throw new Error('Unclosed preformatted block');

    return parts;
}

function paragraphSplit (text) {
    while (text.search(data.paragraph) !== -1) {
        text = text.replace(data.paragraph, data.paragraphEndReplace + data.paragraphStartReplace);
    }
    return text;
}

function replaceTags(text) {
    let expectedTag = '';

    const entries = [];
    entries.push(...match(text, data.boldStart));
    entries.push(...match(text, data.italicStart));
    entries.push(...match(text, data.monospacedStart));
    entries.push(...match(text, data.boldEnd));
    entries.push(...match(text, data.italicEnd));
    entries.push(...match(text, data.monospacedEnd));


    entries.sort((a, b) => a.index - b.index);

    for (const entry of entries) {
        if (expectedTag === '') {

            if (entry[0] === data.boldEnd || entry[0] === data.italicEnd || entry[0] === data.monospacedEnd) {
                throw new Error('Unexpected closing tag');
            }
            expectedTag = getPairTag(entry[0]);

            text = text.replace(entry[0], getReplaceTag(entry.original));
        } else if (expectedTag === entry[0]) {
            expectedTag = '';
            text = text.replace(entry[0], getReplaceTag(entry.original));
        } else {
            throw new Error('Unmatched tag');
        }
    }

    if (expectedTag !== '') {
        throw new Error('Unclosed tag');
    }

    return text;
}

function getPairTag (text) {
    switch (text) {
        case data.boldStart: return data.boldEnd;
        case data.italicStart: return data.italicEnd;
        case data.monospacedStart: return data.monospacedEnd;
        default: return '';
    }
}

function getReplaceTag (text) {
    switch (text) {
        case data.boldStart: return data.boldStartReplace[fmt];
        case data.italicStart: return data.italicStartReplace[fmt];
        case data.monospacedStart: return data.monospacedStartReplace[fmt];
        case data.boldEnd: return data.boldEndReplace[fmt];
        case data.italicEnd: return data.italicEndReplace[fmt];
        case data.monospacedEnd: return data.monospacedEndReplace[fmt];
        default: throw new Error('Unknown tag: ', text);
    }
}

function match(text, regex) {
    const matches = [];

    while (true) {
        const match = regex.exec(text);
        if (!match) break;
        
        match.original = regex;
        matches.push(match);
    }

    return matches;
}