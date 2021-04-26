let count = 0;

export function uid(name?: string) {
    return new Id("O-" + (name ? "" : name + "-") + ++count);
}

export class Id {
    id: string;
    href: string;

    constructor(id: string) {
        this.id = id;
        // @ts-ignore
        // eslint-disable-next-line no-restricted-globals
        this.href = new URL(`#${id}`, location) + "";
    }

    toString() {
        return "url(" + this.href + ")";
    }
}
