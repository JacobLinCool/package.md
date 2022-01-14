#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { program } from "commander";
import chalk from "chalk";
import { transform } from "./transform";

const package_json = JSON.parse(readFileSync(resolve(__dirname, "..", "package.json"), "utf8"));

program.version(`${package_json.name} ${chalk.yellowBright(package_json.version)}\n${package_json.description}`);

program
    .argument("[package-json]")
    .option("-t, --template <template>", "Template to use", "default")
    .option("-o, --output <output>", "Output file", "")
    .action((package_json?: string) => {
        const result = transform(program.opts().template || "default", package_json || "package.json");

        if (program.opts().output) {
            writeFileSync(resolve(process.cwd(), program.opts().output), result);
            console.log(`package.md: Transformed\n${chalk.greenBright("✔")} ${chalk.cyanBright(resolve(process.cwd(), program.opts().output))}\n`);
        } else {
            console.log(result);
        }
    });

program.parse();
