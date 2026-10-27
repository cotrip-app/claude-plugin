// Empacota o plugin em dist/cotrip.plugin (um .zip com os arquivos na raiz), o formato que o app do Claude aceita.
// O workflow de release anexa esse arquivo a cada versão. Não usa dependências, só o zlib do Node.
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { deflateRawSync } from "node:zlib";

const root = new URL("../", import.meta.url).pathname;
const out = join(root, "dist", "cotrip.plugin");
// Só o que o plugin usa; o resto do repositório (git, CI, este script) fica de fora.
const INCLUDE = [".claude-plugin", ".mcp.json", "agents", "skills", "README.md", "LICENSE"];

const files = (dir) => readdirSync(dir).sort().flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? files(path) : name === ".DS_Store" ? [] : [path];
});

const table = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = table[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };

// Data fixa (1/1/2026) para o arquivo sair igual a cada build.
const DOS_TIME = 0, DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;
const locals = [], centrals = [];
let offset = 0;
for (const path of INCLUDE.flatMap((name) => { const path = join(root, name); return statSync(path).isDirectory() ? files(path) : [path]; })) {
  const name = Buffer.from(relative(root, path).split("\\").join("/"));
  const data = readFileSync(path);
  const packed = deflateRawSync(data, { level: 9 });
  const crc = crc32(data);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(8, 8);
  local.writeUInt16LE(DOS_TIME, 10); local.writeUInt16LE(DOS_DATE, 12); local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(packed.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(name.length, 26);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x0800, 8); central.writeUInt16LE(8, 10);
  central.writeUInt16LE(DOS_TIME, 12); central.writeUInt16LE(DOS_DATE, 14); central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(packed.length, 20); central.writeUInt32LE(data.length, 24); central.writeUInt16LE(name.length, 28); central.writeUInt32LE(offset, 42);
  locals.push(local, name, packed); centrals.push(central, name);
  offset += local.length + name.length + packed.length;
}
const dir = Buffer.concat(centrals);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(centrals.length / 2, 8); end.writeUInt16LE(centrals.length / 2, 10);
end.writeUInt32LE(dir.length, 12); end.writeUInt32LE(offset, 16);
mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(out, Buffer.concat([...locals, dir, end]));
console.log(`plugin empacotado: dist/cotrip.plugin (${centrals.length / 2} arquivos)`);
