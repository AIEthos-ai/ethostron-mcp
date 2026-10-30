FROM debian:trixie-slim
ENV DEBIAN_FRONTEND=noninteractive \
    GLAMA_VERSION="1.0.0"

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    npm install -g mcp-proxy@6.7.16 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN npm install @aiethos/ethostron-mcp

CMD ["mcp-proxy", "--", "node", "node_modules/@aiethos/ethostron-mcp/dist/index.js"]
