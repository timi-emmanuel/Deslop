import { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

/**
 * LESSON: OpenAPI & Swagger Documentation in Fastify
 * ---------------------------------------------------
 * OpenAPI (formerly Swagger) is the industry-standard specification for REST APIs.
 *
 * 1. Self-Documenting Code:
 *    Instead of manually maintaining an outdated Postman collection or Markdown file,
 *    Fastify inspects route schemas in code and auto-generates an OpenAPI 3.1 JSON document.
 *
 * 2. Interactive Swagger UI:
 *    `@fastify/swagger-ui` mounts an interactive web dashboard at `/documentation`,
 *    allowing developers, QA, and frontend teammates to test every endpoint with live requests.
 *
 * 3. Type-Safe Client Generation:
 *    Tools like `openapi-typescript` or `orval` can read this spec to auto-generate
 *    end-to-end typed API fetchers for the frontend.
 */
export async function registerSwagger(app: FastifyInstance) {
  // 1. Register Core Swagger Spec Generator
  await app.register(fastifySwagger, {
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "Deslop API Specification",
        description:
          "Official REST & SSE API for the Deslop Design System Extractor, Token Synthesis, and Anti-Slop Audit Engine.",
        version: "0.1.0",
        contact: {
          name: "Deslop Engineering",
        },
      },
      servers: [
        {
          url: "http://localhost:4000",
          description: "Local Development Server",
        },
      ],
      tags: [
        { name: "Health", description: "Universal service health and diagnostic endpoints" },
        { name: "Auth", description: "Authentication, session management, and user profile" },
        { name: "Crawler", description: "Headless Playwright extraction and real-time SSE streams" },
        { name: "Scans", description: "Persisted design system scan history and token retrieval" },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "deslop_session",
            description: "Session token stored in httpOnly cookie upon successful login",
          },
        },
      },
    },
  });

  // 2. Register Interactive Swagger UI
  await app.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
      displayRequestDuration: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
}
