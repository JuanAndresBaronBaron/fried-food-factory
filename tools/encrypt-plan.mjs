// Cifra el contenido del plan con el PIN y escribe assets/plan-data.js.
// Uso: PIN=123456 node tools/encrypt-plan.mjs ruta/plan-contenido.html
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const pin = process.env.PIN;
const src = process.argv[2];
if (!pin || !src) { console.error("Uso: PIN=123456 node tools/encrypt-plan.mjs plan-contenido.html"); process.exit(1); }

const ITER = 250000;
const enc = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey("raw", enc.encode(pin), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(readFileSync(src, "utf8"))));
const b64 = (u) => Buffer.from(u).toString("base64");
writeFileSync("assets/plan-data.js", `window.PLAN_DATA=${JSON.stringify({ iter: ITER, salt: b64(salt), iv: b64(iv), data: b64(data) })};\n`);
console.log("assets/plan-data.js listo");
