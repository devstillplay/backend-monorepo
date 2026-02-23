# MyWorkspace

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/nest?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Important: run from this directory

All `nx` and `npm` commands must be run from **this directory** (the one that contains `nx.json` and `package.json`). If you see "The current directory isn't part of an Nx workspace", change into this folder first:

```sh
cd my-workspace   # or cd path/to/my-workspace
npx nx build api-gateway
```

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve api-gateway
```

To create a production bundle:

```sh
npx nx build api-gateway
```

### Docker build

Build the workspace in Docker (context must be this directory so `nx.json` is included):

```sh
docker build -t myapp .
```

The Dockerfile uses `npm ci --omit=dev` (not the deprecated `--production` flag).

### Deploy NestJS microservice on Railway (Nixpacks, no Docker)

1. **Root Directory** in Railway must be this folder (`my-workspace`), so Nx and Prisma can run.
2. **Build command** (override in Railway): `npx nx build <service-name>`
3. **Start command**: `node dist/apps/<service-name>/main.js`

Examples:

| Service          | Build command                    | Start command                            |
|------------------|----------------------------------|------------------------------------------|
| api-gateway      | `npx nx build api-gateway`       | `node dist/apps/api-gateway/main.js`     |
| auth-service     | `npx nx build auth-service`      | `node dist/apps/auth-service/main.js`    |
| admin-service    | `npx nx build admin-service`     | `node dist/apps/admin-service/main.js`   |
| user-service     | `npx nx build user-service`      | `node dist/apps/user-service/main.js`    |
| provider-service | `npx nx build provider-service`  | `node dist/apps/provider-service/main.js`|

Root `nixpacks.toml` uses `npm install` so Nx and devDependencies are available for the build.

**Required environment variables** (e.g. in Railway → your service → Variables):

- `DATABASE_URL` – MongoDB connection string (required by Prisma; e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)

Without `DATABASE_URL`, the app will fail at startup with a PrismaClientInitializationError.

**If you only deploy api-gateway:** It talks to auth, user, loan, etc. over **TCP**. If those services are not running or not reachable, you get **500 Internal Server Error** (or 503 after the latest change). You must either:

- **Option A – Deploy every backend service** (auth-service, user-service, admin-service, loan-service, etc.) as separate Railway services from this repo (same Root Directory, different Build/Start commands per service). Then on **api-gateway** set variables so it can reach them over [Railway private networking](https://docs.railway.com/guides/private-networking):
  - `AUTH_SERVICE_HOST` = `auth-service.railway.internal` (use your Railway service name)
  - `AUTH_SERVICE_PORT` = the port the auth-service listens on (Railway sets `PORT` per service; you can reference the auth-service’s `PORT` in the api-gateway’s variables if your plan supports it, or set the same fixed port in both)
  - Same pattern for `USER_SERVICE_HOST` / `USER_SERVICE_PORT`, `ADMIN_SERVICE_HOST` / `ADMIN_SERVICE_PORT`, `LOAN_SERVICE_HOST` / `LOAN_SERVICE_PORT`, etc.
- **Option B – Deploy only the services you need** and set the corresponding `*_SERVICE_HOST` and `*_SERVICE_PORT` on api-gateway for those. Routes that call a non-deployed service will return 503 with a message like "Auth service is unavailable".

Backend microservices now listen on `0.0.0.0` and use `PORT` when set so they are reachable from the gateway on Railway’s private network.

To see all available targets to run for a project, run:

```sh
npx nx show project api-gateway
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/nest:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/node:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/nest?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
# backend-monorepo
