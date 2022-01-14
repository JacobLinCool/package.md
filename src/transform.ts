import type { Package } from "./types";
import { existsSync, readFileSync } from "fs";
import { isAbsolute, resolve } from "path";
import { deep_find } from "./utils";

export function transform(template_locator: string, package_locator: string, fallback: CallableFunction = not_found): string {
    const template = get_template(template_locator);
    const data = get_package(package_locator);

    return template.replace(/<!-- *\{\{ *([^}]+) *\}\} *-->/g, (match: string, extraction: string) => {
        const [key, ...masks] = extraction.split(" ").map((s) => s.trim());
        return apply_masks(
            deep_find(data, key) || fallback(key),
            masks.map((mask) => mask.toLowerCase()),
        );
    });
}

function get_template(template_locator: string): string {
    const path = isAbsolute(template_locator) ? template_locator : resolve(process.cwd(), template_locator);
    const internal = resolve(__dirname, "..", "templates", template_locator) + ".md";

    if (existsSync(path)) {
        return readFileSync(path, "utf8");
    } else if (existsSync(internal)) {
        return readFileSync(internal, "utf8");
    }

    throw new Error(`Template ${template_locator} not found`);
}

function get_package(package_locator: string): Package {
    const path = isAbsolute(package_locator) ? package_locator : resolve(process.cwd(), package_locator);

    if (existsSync(path)) {
        return JSON.parse(readFileSync(path, "utf8"));
    }

    throw new Error(`Package ${package_locator} not found`);
}

function not_found(key: string): string {
    return `<!-- [package.md] ${key.replace("-->", "")} not found. -->`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function apply_masks(value: any, masks: string[]): string {
    return masks.reduce((value, mask) => {
        switch (mask) {
            case "lower":
                return value.toLowerCase();
            case "upper":
                return value.toUpperCase();
            case "title":
                return value.replace(/\b\w/g, (l: string) => l.toUpperCase());
            case "camel":
                return value.replace(/\b\w/g, (l: string) => l.toLowerCase());
            case "snake":
                return value.replace(/\B([A-Z])/g, (l: string) => "_" + l.toLowerCase());
            case "array":
                return value.join ? value.join(", ") : value;
            default:
                return value;
        }
    }, value);
}
