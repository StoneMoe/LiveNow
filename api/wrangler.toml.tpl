name = "livenow-api"
main = "dist/index.js"
node_compat = true
compatibility_date = "2023-05-04"

route = { pattern = "live.mydomain.com/api/*", zone_name = "mydomain.com" }

[vars]
JWT_KEY = ""  # long random string
ACCOUNT_ID = ""  # your cloudfalre account id
API_TOKEN = ""  # API token with Cloudflare Stream permission
TURNSTILE_SITEKEY = ""  # Cloudflare Turnstile site key
TURNSTILE_SECRETKEY = ""  # Cloudflare Turnstile secret key

[[ d1_databases ]]
binding = "DB" # DON'T change this
database_name = "livenow"
database_id = "00000000-0000-0000-0000-000000000000"  # update this after creating D1 database