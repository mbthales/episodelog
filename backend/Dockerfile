FROM oven/bun:1-slim

WORKDIR /usr/src/app

COPY package.json bun.lock ./

RUN bun pm cache clean && bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]
