// Empacota o plugin em dois arquivos .zip com os arquivos na raiz, sem dependências (só o zlib do Node):
// - dist/cotrip.plugin: formato do Claude (.claude-plugin/plugin.json, .mcp.json, agente e skills), que o app do Claude aceita.
// - dist/cotrip-openai.zip: formato portátil da OpenAI (plugin.json e mcp.json na raiz, skills e assets), para o portal de plugins do ChatGPT/Codex.
//   Os arquivos dela moram em openai/ e vão para a raiz do zip. Ficam fora da raiz do repositório porque o diretório do Claude
//   lê o repositório inteiro: um manifesto ou ícone ali segura a versão para revisão manual.
//   O zip fica sem os arquivos do Claude para o portal não ter dois manifestos para escolher, e sem agents/, que lá não existe.
// O workflow de release anexa os dois a cada versão.
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { deflateRawSync } from "node:zlib";

const root = new URL("../", import.meta.url).pathname;
// Os dois manifestos têm de estar na mesma versão; a release usa a do .claude-plugin/plugin.json.
const versions = ["openai/plugin.json", ".claude-plugin/plugin.json"].map((path) => JSON.parse(readFileSync(join(root, path), "utf8")).version);
if (versions[0] !== versions[1]) throw new Error(`Versões diferentes: openai/plugin.json ${versions[0]}, .claude-plugin/plugin.json ${versions[1]}`);
// Só o que cada plugin usa; o resto do repositório (git, CI, este script) fica de fora.
// Cada item é o caminho no repositório e, opcionalmente, a pasta dele que vira a raiz do zip.
const TARGETS = {
  "cotrip.plugin": [".claude-plugin", ".mcp.json", "agents", "skills", "README.md", "LICENSE"],
  "cotrip-openai.zip": [["openai/plugin.json", "openai"], ["openai/mcp.json", "openai"], "skills", ["openai/assets", "openai"], "LICENSE"],
};

const files = (dir) => readdirSync(dir).sort().flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? files(path) : name === ".DS_Store" ? [] : [path];
});

const table = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = table[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };

// Data fixa (1/1/2026) para o arquivo sair igual a cada build.
const DOS_TIME = 0, DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;
function pack(out, include) {
const locals = [], centrals = [];
let offset = 0;
for (const [path, base] of include.flatMap((item) => {
  const [name, base = ""] = [item].flat();
  const path = join(root, name);
  return (statSync(path).isDirectory() ? files(path) : [path]).map((file) => [file, join(root, base)]);
})) {
  const name = Buffer.from(relative(base, path).split("\\").join("/"));
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
writeFileSync(join(root, "dist", out), Buffer.concat([...locals, dir, end]));
console.log(`plugin empacotado: dist/${out} (${centrals.length / 2} arquivos)`);
}

for (const [out, include] of Object.entries(TARGETS)) pack(out, include);
