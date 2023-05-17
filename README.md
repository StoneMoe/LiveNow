# LiveNow

Create your very own serverless livestream platform within seconds and on a limited budget using Cloudflare services.

- Cloudflare Stream
- Cloudflare Turnstile
- Cloudflare Pages
- Cloudflare Worker

## Init

### Install packages

```bash
npm i  # toolchain
npm run i  # install dependency
```

### Create API config from template

```bash
cp api/wrangler.toml.tpl api/wrangler.toml
vim api/wrangler.toml  # modify "vars" section
```

## Locally

```
npm run api-create-localdb
npm run dev
```

## Production

### Create production database

```bash
npx wrangler d1 create livenow  # this will give a new "database_id", use the value to update api/wrangler.toml
npx wrangler d1 execute livenow --file=./api/sql/schema.sql
```

### Deploy code

```bash
npm run publish
```

## Misc

### Admin user

First registered account will be assigned as admin automatically.
