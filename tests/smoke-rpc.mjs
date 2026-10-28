import { spawn } from "child_process";

const proc = spawn("node", ["C:/Users/rcunn/ethostron-mcp/dist/index.js"], {
  stdio: ["pipe", "pipe", "pipe"],
});

let output = "";
proc.stdout.on("data", (data) => {
  output += data.toString();
});

proc.stderr.on("data", (data) => {
  // console.error("[Server Log]", data.toString());
});

// 1. Initialize
proc.stdin.write(JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "test-client", version: "1.0.0" },
  },
}) + "\n");

// 2. Initialized Notification
proc.stdin.write(JSON.stringify({
  jsonrpc: "2.0",
  method: "notifications/initialized",
}) + "\n");

// 3. List Tools
proc.stdin.write(JSON.stringify({
  jsonrpc: "2.0",
  id: 2,
  method: "tools/list",
  params: {},
}) + "\n");

// 4. List Prompts
proc.stdin.write(JSON.stringify({
  jsonrpc: "2.0",
  id: 3,
  method: "prompts/list",
  params: {},
}) + "\n");

setTimeout(() => {
  proc.stdin.end();
  const lines = output.trim().split("\n");
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      console.log(`\n=== Response (id: ${parsed.id}) ===`);
      if (parsed.result?.tools) {
        console.log(`Registered Tools (${parsed.result.tools.length}):`);
        parsed.result.tools.forEach((t) => console.log(` - ${t.name}: ${t.description.slice(0, 60)}...`));
      } else if (parsed.result?.prompts) {
        console.log(`Registered Prompts (${parsed.result.prompts.length}):`);
        parsed.result.prompts.forEach((p) => console.log(` - ${p.name}: ${p.description}`));
      } else {
        console.log(JSON.stringify(parsed.result, null, 2));
      }
    } catch {
      console.log("Raw:", line);
    }
  }
  proc.kill();
}, 800);
