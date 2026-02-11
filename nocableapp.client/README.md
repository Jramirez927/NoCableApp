# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Local HTTPS development (mkcert)

This project can run the Vite dev server over HTTPS for a faithful local experience. Do NOT commit private key files to source control — generate and trust your own dev certificate.

Recommended setup using `mkcert`:

1. Install `mkcert`. On Windows (example):
`choco install mkcert -y`
2. Install the local CA into your OS trust store:
`mkcert -install`
3. From the repository root, create a `certs` folder inside the client project and generate certs for localhost:
```bash
mkdir -p nocableapp.client/certs
mkcert -cert-file nocableapp.client/certs/localhost.pem -key-file nocableapp.client/certs/localhost-key.pem localhost
```
4. The Vite config loads `nocableapp.client/certs/localhost.pem` and `nocableapp.client/certs/localhost-key.pem`. Restart your IDE after installing the mkcert CA if you still see TLS errors.

Notes:
- Ensure `nocableapp.client/certs` is ignored by Git (it is listed in `.gitignore`).
- If your environment prevents installing `mkcert`, use HTTP for local development or obtain a trusted certificate via your organization.
- Never commit private keys (for example `localhost-key.pem`) to source control.