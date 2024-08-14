# Dockerizing a React Application:

Day 2 of #40daysofkubernetes

---

## Step 1: Setting Up the Dockerfile

Here is the Dockerfile for our React Blogging application:

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

</Code>

## Breaking down the Dockerfile

### Stage 1: Building the React Application

<Code language="dockerfile">
    FROM node:14-alpine as build
</Code>

We start by pulling a lightweight Node.js image based on Alpine Linux. Using as build allows us to name this build stage.

<Code language="dockerfile">
WORKDIR /app
</Code>

Sets the working directory inside the container to /app.

<Code language="dockerfile">
COPY package.json yarn.lock ./
</Code>

Copies package.json and yarn.lock to the working directory.

<Code language="dockerfile">
RUN yarn install --frozen-lockfile
</Code>

Installs dependencies using the yarn package manager. The --frozen-lockfile flag ensures that only the dependencies specified in package.json are installed.

<Code language="dockerfile">
COPY . .
</Code>

Copies all files in the current directory to the working directory.

<Code language="dockerfile">
RUN yarn build
</Code>

Builds the application.

### Stage 2: Deploying the React Application

<Code language="dockerfile">
FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
</Code>

This stage copies the built application from the build stage to the nginx image. It also sets the port to 80.

---

## Step 2: Building and Running the Docker Container

<Code language="dockerfile">
docker build -t cka-blog .
</Code>

This command builds the Docker image and tags it as cka-blog. Here is the terminal output after running the command.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day2/docker-buil-terminal.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

When the build is succesful we can view the image in docker desktop in the local image section.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day2/docker-desktop-image.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

<Code language="dockerfile">
docker run -p 3003:80 react-app
</Code>

This command runs the container and maps port 3003 on your host to port 80 in the container. After excecuting the run command we can access the react application served through the container at port 3003.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day2/Screenshot 2024-06-21 at 7.56.53 PM.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

---

## Step 3: Pushing the Docker Image to Docker Hub

<Code language="dockerfile">
docker login
</Code>

Let's get authenticated with docker hub in order to push the image to docker hub. We can use docker hub's login command to authenticate with docker hub.

<Code language="dockerfile">
docker tag cka-blog your-dockerhub-username/cka-blog:latest
</Code>

Docker images need to be tagged in a specific format to be pushed to Docker Hub. The format is username/repository:tag. If you want to push the react-app image, you can tag it like this. Replace your-dockerhub-username with your actual Docker Hub username.

<Code language="dockerfile">
docker push your-dockerhub-username/cka-blog:latest
</Code>

Use the docker push command to push your tagged image to Docker Hub. Once the excecution of this command is successful, you can see the image in your Docker Hub account.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day2/docker-hub-image.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

---

## Step 4: Pulling the Docker Image from Docker Hub and runing it locally

<Code language="dockerfile">
docker pull your-dockerhub-username/cka-blog:latest
</Code>

The docker pull command is used to download Docker images from Docker Hub (or other Docker registries) to your local machine.

<Code language="dockerfile">
docker run -it your-dockerhub-username/cka-blog:latest /bin/sh
</Code>

Running a container in interactive mode allows you to interact with it directly, typically with a shell. Use the -it flags to run a container in interactive mode.

    -i (interactive): Keeps the STDIN open even if not attached.
    -t (tty): Allocates a pseudo-TTY.

In this mode, you'll get a shell prompt inside the container, and you can run commands directly.

<Code language="dockerfile">
docker run -d -p 3003:80 your-dockerhub-username/cka-blog:latest
</Code>

Running the container in detached mode and mapping port 3003 on your host to port 80 in the container.

    -d (detach): Runs the container in the background.
    -p 80:80: Maps port 80 of the host to port 80 of the container.

Once the container is running, you can access it at http://localhost:3003.

<Code language="dockerfile">
docker ps
</Code>

View all running containers.

<Code language="dockerfile">
docker exec -it <container_id_or_name> /bin/sh
</Code>

---

---

## Resources

<iframe style="max-width:100%; height:auto;" src="https://www.youtube.com/embed/nfRsPiRGx74" title="Day 2/40 - How To Dockerize a Project - CKA Full Course 2024" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

    Github Repository: https://github.com/RockingThor/markdown-blog
