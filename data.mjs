import { escape } from "querystring";

export const preformatted = /```/g;
export const paragraph = /(\n|\r\n){2,}/g;


export const boldStart = /(?<=^|\s)\*\*(?=\S)/g;
export const boldEnd = /(?<=\S)\*\*(?=\s|$)/g;

export const italicStart = /(?<=^|\s)_(?=\S)/g;
export const italicEnd = /(?<=\S)_(?=\s|$)/g;

export const monospacedStart = /(?<=^|\s)`(?=\S)/g;
export const monospacedEnd = /(?<=\S)`(?=\s|$)/g;


export const boldStartReplace = { html: '<b>', esc: '\x1b[1m' };
export const boldEndReplace = { html: '</b>', esc: '\x1b[0m' };
export const italicStartReplace = { html: '<i>', esc: '\x1b[3m' };
export const italicEndReplace = { html: '</i>', esc: '\x1b[0m' };
export const monospacedStartReplace = { html: '<tt>', esc: '\x1b[7m' };
export const monospacedEndReplace = { html: '</tt>', esc: '\x1b[0m' };
export const preformattedStartReplace = { html: '<pre>', esc: '\x1b[7m' };
export const preformattedEndReplace = { html: '</pre>', esc: '\x1b[0m' };
export const paragraphStartReplace = '<p>';
export const paragraphEndReplace = '</p>';
