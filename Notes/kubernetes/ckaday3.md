# Multi-Stage Docker Build

    Day 3 of #40daysofkubernetes

---

## What is multi-stage docker build and why is it important?

A multi-stage Docker build is a Dockerfile technique that allows you to use multiple FROM statements in a single Dockerfile, each defining a separate stage of the build process. You can selectively copy artifacts from one stage to another, making it possible to optimize the final Docker image by excluding unnecessary files and dependencies.

### Importance of multi-stage docker build:

-   By including only the necessary artifacts in the final image, multi-stage builds help significantly reduce the size of Docker images. For example, you can exclude build tools and development dependencies, resulting in a leaner and more efficient image.

-   Smaller images with fewer components reduce the attack surface, enhancing security. By excluding build tools and unnecessary files, you limit potential vulnerabilities.

-   Multi-stage builds help in separating concerns. Each stage can focus on a specific part of the build process (e.g., installing dependencies, building the application, configuring the server). This separation makes Dockerfiles easier to read and maintain.

-   Intermediate stages can cache dependencies and intermediate artifacts, speeding up subsequent builds. This is particularly useful in CI/CD pipelines where build times can be significantly reduced.

-   With multi-stage builds, you can combine the benefits of multiple Dockerfiles into one, avoiding the need to manage multiple files for different stages of the build process.

---

## Example Explanation

Here is a dockerfile which is being built using the concept of multi-stage build.

<Code language="dockerfile">

FROM node:14-alpine as build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

</Code>

### Build Stage (`node:14-alpine as build`)

This stage is responsible for installing dependencies and building the application. The resulting build artifacts are stored in the `/app/build` directory.

### Serve Stage (`nginx:alpine`)

This stage uses the lightweight `nginx:alpine` image to serve the built application. It copies only the necessary build output from the first stage, ensuring that the final image does not include Node.js or other build tools.

---

## Some Other Best Practices While Building a Docker Build

1.  Use Official Base Images:
    Official images are maintained by the Docker community and are usually more secure and well-documented. In the above example we have used `node:14-alpine` as the base image which is a lightweight official base image for node.
    <Code>
    FROM node:14-alpine
    </Code>
2.  Minimize Image Layers:
    Each command in the Dockerfile adds a layer. Reducing the number of layers can help minimize the image size. It is a good practice to minimize the number of layers in the Dockerfile.
    <Code>
    RUN apt-get update && apt-get install -y \
    package1 \
    package2 && \
    apt-get clean && rm -rf /var/lib/apt/lists/\*
    </Code>
3.  Leverage Layer Caching:
    Layer caching can be used to speed up the build process. It is a good practice to leverage layer caching when building Docker images. Ordering instructions wisely can help Docker use the cache efficiently.
    I the below example we are copying the `package.json` and `yarn.lock` files first before copying other files because changes in `package.json` and `yarn.lock` files are rare in comparison to other files which includes the business logic.
    <Code>
    COPY package.json yarn.lock ./
    RUN yarn install
    COPY . .
    RUN yarn build
    </Code>
4.  Use `.dockerignore` File:
    The `.dockerignore` file is used to specify which files and directories should be ignored when building the Docker image. This can help reduce the size of the image.
    <Code>
    node_modules
    dist
    .git
    </Code>
5.  Avoid Running as Root:
    Running as root can result in unnecessary security vulnerabilities. It is a good practice to avoid running as root when building Docker images.
    <Code>RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    USER appuser
    </Code>

---

## Exploring `docker init` Command

The `docker init` command is a relatively new addition to Docker's suite of tools, designed to simplify the process of creating Docker configurations for projects. This command helps to quickly set up Docker-related files such as `Dockerfile` and `docker-compose.yml` with sensible defaults based on the project's structure and the languages or frameworks it uses.

### Key Features of `docker init`

-   docker init automatically detects the type of project (e.g., Node.js, Python, Go) and sets up the appropriate Docker configurations.
-   The command often provides interactive prompts to customize the configuration according to the user's needs.
-   It incorporates Docker best practices, ensuring that the generated files follow common guidelines and standards.
-   It significantly speeds up the process of containerizing applications, especially for developers who are new to Docker or those working on new projects.

### Example Usage

Navigate to the root directory of your project in the terminal and run:

<Code language="bash"> 
docker init
</Code>

1.  The command will guide you through a series of questions about your project, such as the programming language, the desired base image, and any additional services (e.g., databases) you might need.
2.  After completing the prompts, `docker init` generates the necessary Docker configuration files, typically including a `Dockerfile` and a `docker-compose.yml`. Review these files and make any adjustments as needed.

## Generated Files for Example

The following files are generated by the `docker init` command for the `cka-blog` project:

### Dockerfile

<Code>

FROM node:14-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000
CMD ["yarn", "start"]

</Code>

### docker-compose.yml

<Code language="yaml">

version: '3.8'

services:
app:
build: .
ports: - "3000:3000"
volumes: - .:/app
environment: - NODE_ENV=development
</Code>

---

---

# Resources

<iframe style="max-width:100%; height:auto;" src="https://www.youtube.com/embed/ajetvJmBvFo" title="Day 3/40 - Multi Stage Docker Build - Docker Tutorial For Beginners - CKA Full Course 2024" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Github Repo: [https://github.com/RockingThor/markdown-blog](https://github.com/RockingThor/markdown-blog)
