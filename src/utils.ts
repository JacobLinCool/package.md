import type { AnyObject } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deep_find(obj: AnyObject, path: string): any {
    const parts = path.split(".");
    let current = obj;

    for (const part of parts) {
        if (current[part] === undefined) {
            return undefined;
        }

        current = current[part];
    }

    return current;
}
