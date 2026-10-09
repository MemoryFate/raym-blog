import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildRecoveryUrl, isChunkLoadError } from "../src/js/chunkRecovery.js";

test("identifies outdated Vite page-module requests", () => {
    assert.equal(isChunkLoadError(new TypeError("Failed to fetch dynamically imported module: https://memoryfate.github.io/raym-blog/assets/SocketDemo-btbw9BeO.js")), true);
    assert.equal(isChunkLoadError(new Error("Loading chunk 148 failed")), true);
    assert.equal(isChunkLoadError(new Error("Importing a module script failed.")), true);
    assert.equal(isChunkLoadError(new Error("Request failed with status 500")), false);
    assert.equal(isChunkLoadError(new Error("Validation failed")), false);
});

test("cache-busted refresh preserves GitHub Pages base path and hash route", () => {
    const result = buildRecoveryUrl(
        "https://memoryfate.github.io/raym-blog/#/Tools",
        "/Demo/SocketDemo",
        123456,
    );
    const url = new URL(result);
    assert.equal(url.pathname, "/raym-blog/");
    assert.equal(url.searchParams.get("__raym_recover"), "123456");
    assert.equal(url.hash, "#/Demo/SocketDemo");
});

test("refresh preserves current route if a target route is not available", () => {
    const url = new URL(buildRecoveryUrl("https://memoryfate.github.io/raym-blog/#/Game/Sudoku", null, 7));
    assert.equal(url.hash, "#/Game/Sudoku");
});

test("index bootstrap catches entry script load failures even before Vue mounts", () => {
    const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
    assert.ok(html.includes('target.tagName !== "SCRIPT"'));
    assert.ok(html.includes('target.type !== "module"'));
    assert.ok(html.includes("__raym_recover"));
});
