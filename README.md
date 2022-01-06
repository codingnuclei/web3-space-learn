# Web3 Space Learning

This project was generated using [Nx](https://nx.dev).

It is a monorepo enabling the learning of the web3 space.

All projects are prototypes which are nowhere near production ready!!

## Prerequisites

- Have correct .env file in app folder - e.g `apps/chain-chat/env.example`

## Local node fork

- `npm run fork`

## Local contract deployment

- `npm run deploy:local`
- update `.env`

## Generating config

For security reasons the config is generated from `.env` files at build time. Using the npm `config` scripts will generate the correct `environment.ts` files required by the application. For different networks use different `.env` files.

## Local dev serving

- `npm run config:local -- --environment=dev`
- `npm run build`

## Local prod Build

- `npm run config:local -- --environment=prod`
- `npm run build -- --configuration=production`
