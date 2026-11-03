import { buildServer } from "../apps/api/src/server.js";

async function verifySwagger() {
  console.log("Testing Fastify Swagger OpenAPI generation...");
  const app = await buildServer();

  // Test OpenAPI JSON endpoint
  const jsonRes = await app.inject({
    method: "GET",
    url: "/documentation/json",
  });

  if (jsonRes.statusCode !== 200) {
    console.error("Failed to fetch /documentation/json, status:", jsonRes.statusCode);
    process.exit(1);
  }

  const spec = JSON.parse(jsonRes.payload);
  console.log("✅ OpenAPI Spec Version:", spec.openapi);
  console.log("✅ API Title:", spec.info.title);
  console.log("✅ API Description:", spec.info.description);
  console.log("✅ Registered Routes in OpenAPI Spec:");
  for (const [path, methods] of Object.entries(spec.paths as Record<string, Record<string, unknown>>)) {
    console.log(`   - ${Object.keys(methods).join(", ").toUpperCase()} ${path}`);
  }

  // Export static openapi.json for Postman/client generators
  const fs = await import("fs/promises");
  await fs.writeFile(
    new URL("../apps/api/openapi.json", import.meta.url),
    JSON.stringify(spec, null, 2)
  );
  console.log("✅ Exported static specification to apps/api/openapi.json");

  // Test Swagger UI HTML endpoint
  const uiRes = await app.inject({
    method: "GET",
    url: "/documentation/static/index.html",
  });

  console.log("✅ Swagger UI HTML Status:", uiRes.statusCode);

  await app.close();
  console.log("\n🚀 All Swagger OpenAPI endpoints verified successfully!");
  process.exit(0);
}

verifySwagger().catch((err) => {
  console.error("Swagger verification failed:", err);
  process.exit(1);
});
