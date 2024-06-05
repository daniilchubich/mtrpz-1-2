export const preformatted = /```/g;
export const paragraph = /(\n|\r\n){2,}/g;


export const boldStart = /(?<=^|\s)\*\*(?=\S)/g;
export const boldEnd = /(?<=\S)\*\*(?=\s|$)/g;

export const italicStart = /(?<=^|\s)_(?=\S)/g;
export const italicEnd = /(?<=\S)_(?=\s|$)/g;

export const monospacedStart = /(?<=^|\s)`(?=\S)/g;
export const monospacedEnd = /(?<=\S)`(?=\s|$)/g;


export const boldStartReplace = '<b>';
export const boldEndReplace = '</b>';
export const italicStartReplace = '<i>';
export const italicEndReplace = '</i>';
export const monospacedStartReplace = '<tt>';
export const monospacedEndReplace = '</tt>';
export const preformattedStartReplace = '<pre>';
export const preformattedEndReplace = '</pre>';
export const paragraphStartReplace = '<p>';
export const paragraphEndReplace = '</p>';
