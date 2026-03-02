Here's the improved `README.md` file incorporating the new content while maintaining the existing structure and coherence:

# Project Title

## Description

[Provide a brief description of the project, its purpose, and key features.]

## Installation

[Instructions on how to install the project, including prerequisites and dependencies.]

## Usage

[Instructions on how to use the project, including examples and command-line options.]

## Database Setup

This project uses **SQLite** with **Entity Framework Core** migrations.

### Prerequisites

Install the EF Core CLI tools (if not already installed):

```
dotnet tool install --global dotnet-ef
```

### Apply Migrations

From the `NoCableApp.Server` directory, run:

```
cd NoCableApp.Server
dotnet ef database update
```

This will create the `NoCableApp.db` SQLite file and apply all existing migrations.

### Create a New Migration (when you change models)

```
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

---

## Local HTTPS Development (mkcert)

This project uses a local TLS certificate for the Vite dev server when running the SPA over HTTPS. **Do NOT commit private key files to source control** � each developer should generate their own trusted dev certificate.

### Steps to Set Up a Trusted Local Certificate (Recommended Using mkcert):

1. **Install mkcert.** On Windows, you can use Chocolatey:
   choco install mkcert -y

2. **Install the local CA into your OS trust store:**
   mkcert -install

3. **From the repository root, create a `certs` folder inside the client project and generate certs for localhost:**
   mkdir -p nocableapp.client/certs
   mkcert -cert-file nocableapp.client/certs/localhost.pem -key-file nocableapp.client/certs/localhost-key.pem localhost 127.0.0.1 ::1

4. **Ensure the `nocableapp.client/certs` folder is ignored by Git** (it is already added to `.gitignore`).

5. **The Vite config is set to load the cert/key from `nocableapp.client/certs/localhost.pem` and `nocableapp.client/certs/localhost-key.pem`.** Restart your IDE after installing the mkcert CA if you still see TLS errors.

### Notes
- If you cannot install mkcert on a managed machine, use HTTP for local development or ask your IT team to provide a trusted cert.
- Do not commit `localhost-key.pem` or any private keys. Add them to `.gitignore` if not already ignored.

## Running the Application

### Server

Always start the server with the **https** launch profile so that port `7054` (HTTPS) is active. The Vite dev proxy forwards `/api` requests to that port.

```bash
cd NoCableApp.Server
dotnet run --launch-profile https
```

> If you run `dotnet run` without specifying a profile, the default `http` profile is used (port `5038` HTTP only), and the Vite proxy will fail to connect.

### Client

From the `nocableapp.client` directory:

```bash
npm run dev
```

The React app will be available at `https://localhost:5173`. All `/api` requests are automatically proxied to `https://localhost:7054`.

---

## Contributing

[Instructions for contributing to the project, including guidelines for submitting issues and pull requests.]

## License

[Information about the project's license.]

### Changes Made:
- Added a section header for "Local HTTPS Development (mkcert)" to clearly delineate this important setup information.
- Used bullet points and bold text for emphasis and clarity.
- Ensured that the instructions are clear and easy to follow, maintaining a logical flow.
- Preserved the overall structure of the README while integrating the new content seamlessly.