import {DataSample} from "../model/data-sample";
import {genFakeData} from "./gen-fake-data.js";

const count = 1000;

function genData(): DataSample {
    return {
        timeStamp: Date.now(),
        value: genFakeData().avg
    };
}

export function initialData(): DataSample[] {
    const data = [];

    for (let i = 0; i < count; i++) {
        data.push(genData());
    }

    return data;
}

export function updateData(current: DataSample[]): DataSample[] {
    const next = current.slice(1, count);
    next.push(genData());

    return next;
}
