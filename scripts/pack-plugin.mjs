// Empacota as duas versões do plugin em arquivos .zip com os arquivos na raiz, sem dependências (só o zlib do Node):
// - dist/cotrip.plugin: versão do Claude, a pasta claude/ inteira (.claude-plugin/plugin.json, .mcp.json, agente e skills).
// - dist/cotrip-openai.zip: versão da OpenAI, a pasta openai/ (plugin.json e mcp.json portáteis, skills) mais o ícone.
//   O ícone não fica no repositório: o diretório do Claude segura para revisão a versão com imagem ou binário que ele não lê.
//   Ele vem do site na hora de empacotar.
// Cada versão tem o próprio número; uso: node scripts/pack-plugin.mjs [claude|openai] (sem argumento, as duas).
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { deflateRawSync } from "node:zlib";

const root = new URL("../", import.meta.url).pathname;
// Cada item é a pasta que vira a raiz do zip e os arquivos extras.
const TARGETS = {
  claude: { out: "cotrip.plugin", dir: "claude", extra: async () => [["LICENSE", readFileSync(join(root, "LICENSE"))]] },
  openai: {
    out: "cotrip-openai.zip", dir: "openai",
    extra: async () => {
      // O ícone do app (512 px), o mesmo que o openai/plugin.json cita em logo e composerIcon.
      const icon = Buffer.from(await (await fetch("https://cotrip.wlln.dev/icons/icon-512.png")).arrayBuffer());
      if (!icon.subarray(1, 4).equals(Buffer.from("PNG"))) throw new Error("O site não devolveu o ícone em PNG");
      return [["assets/icon.png", icon], ["LICENSE", readFileSync(join(root, "LICENSE"))]];
    },
  },
};

const files = (dir) => readdirSync(dir).sort().flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? files(path) : name === ".DS_Store" ? [] : [path];
});

const table = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = table[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };

// Data fixa (1/1/2026) para o arquivo sair igual a cada build.
const DOS_TIME = 0, DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;
function pack(out, dir, extra = []) {
const locals = [], centrals = [];
let offset = 0;
for (const [zipName, data] of files(join(root, dir)).map((file) => [relative(join(root, dir), file).split("\\").join("/"), readFileSync(file)]).concat(extra)) {
  const name = Buffer.from(zipName);
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
const directory = Buffer.concat(centrals);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(centrals.length / 2, 8); end.writeUInt16LE(centrals.length / 2, 10);
end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", out), Buffer.concat([...locals, directory, end]));
console.log(`plugin empacotado: dist/${out} (${centrals.length / 2} arquivos)`);
}

const pick = process.argv[2];
if (pick && !TARGETS[pick]) throw new Error(`Versão desconhecida: ${pick} (use claude ou openai)`);
for (const [name, { out, dir, extra }] of Object.entries(TARGETS)) if (!pick || pick === name) pack(out, dir, await extra());
