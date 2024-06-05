import { boldEnd, boldStart } from './data.mjs';

export * as data from './data.mjs';

export default function convert (content) {
    if (content === '') return content;
    const parts = splitPreformatted(content);
    for (let i = 0; i < parts.length - 1; i += 2) {
        parts[i] = paragraphSplit(parts[i]);
        parts[i] = replaceTags(parts[i]);
    }

    parts = parts.map((part, index) => {
        if (index % 2 === 0) return part;
        return data.preformattedStartReplace + part + data.preformattedEndReplace;
    });

    const final = parts.join('');
    return data.paragraphStartReplace + final + data.paragraphEndReplace;
}

function splitPreformatted (text) {
    const parts = text.split(data.preformatted);
    if (parts[0] === '') parts.shift();
    if (parts[parts.length - 1] === '') parts.pop();

    if (parts.length % 2 === 0) throw new Error('Unclosed preformatted block');

    return parts;
}

function paragraphSplit (text) {
    let closing = true; 
    while (text.find(data.paragraph) !== -1) {
        if (closing) {
            text = text.replace(data.paragraph, data.paragraphStartReplace);
            closing = false;
        } else {
            text = text.replace(data.paragraph, data.paragraphEndReplace);
            closing = true;
        }
    }
    return text;
}

function replaceTags(text) {
    let expectedTag = '';

    const entries = [];
    entries.push(...boldStart.execAll(text));
    entries.push(...italicStart.execAll(text));
    entries.push(...monospacedStart.execAll(text));
    entries.push(...boldEnd.execAll(text));
    entries.push(...italicEnd.execAll(text));
    entries.push(...monospacedEnd.execAll(text));

    entries.sort((a, b) => a.index - b.index);

    for (const entry of entries) {
        if (expectedTag === '') {

            if (entry[0] === data.boldEnd || entry[0] === data.italicEnd || entry[0] === data.monospacedEnd) {
                throw new Error('Unexpected closing tag');
            }
            expectedTag = getPairTag(entry[0]);

            text = text.replace(entry[0], getReplaceTag(entry[0]));
        } else if (expectedTag === entry[0]) {
            expectedTag = '';
            text = text.replace(entry[0], getReplaceTag(entry[0]));
        } else {
            throw new Error('Unmatched tag');
        }
    }
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
        case data.boldStart: return data.boldStartReplace;
        case data.italicStart: return data.italicStartReplace;
        case data.monospacedStart: return data.monospacedStartReplace;
        case data.boldEnd: return data.boldEndReplace;
        case data.italicEnd: return data.italicEndReplace;
        case data.monospacedEnd: return data.monospacedEndReplace;
        default: return '';
    }
}