function findNext(length: number, last: number): number {
    let next = -1;
    do {
        next = Math.floor(Math.random() * length);
    } while (next === last);
    return next;
}

/**
 * Returns a random string from the selection.
 * @param samples - the string samples to select a random string from
 * @param last - the last selection (which should not return again)
 */
export function newString(samples: string[][], last: number): [selection: string[], last: number] {
    const next = findNext(samples.length, last);
    return [samples[next], next];
}

export const width = 1000;

export const samples = [
    [..."React is cool!"],
    [..."Do something with React!"],
    [..."Hello World?"].reverse(),
    [..."D3 rocks!"],
    [..."Foo Bar!"]
];
