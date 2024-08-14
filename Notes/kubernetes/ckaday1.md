# Docker Overview

Day 1 of 40 days of CKA challenge.

---

## Introduction to Docker

Docker is a platform that enables developers to build, ship, and run applications in containers. Containers are lightweight, portable, and efficient, making them a popular choice for modern application development and deployment.

---

## How Docker is Different from Virtual Machines

| Feature             | Docker Containers                             | Virtual Machines                                   |
| ------------------- | --------------------------------------------- | -------------------------------------------------- |
| **Architecture**    | Share the host OS kernel                      | Includes entire OS                                 |
| **Performance**     | Lightweight, starts in seconds                | Heavy, takes minutes to start                      |
| **Resource Usage**  | Uses fewer resources                          | Requires more CPU and memory                       |
| **Isolation**       | Process-level isolation                       | Full hardware-level isolation                      |
| **Portability**     | Highly portable across different environments | Less portable, depends on hypervisor compatibility |
| **Deployment Size** | Small image sizes                             | Large image sizes                                  |

### Here is a basic image representation

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day1/docker-vs-vm.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

## Benefits of Using Docker

1. **Consistency Across Environments**: Docker ensures that your application runs the same way across different environments, reducing the "it works on my machine" problem.
2. **Efficiency and Speed**: Containers are lightweight and can start up quickly, making development, testing, and deployment faster.
3. **Scalability**: Easily scale applications up or down using Docker's orchestration tools like Docker Swarm and Kubernetes.
4. **Isolation**: Applications run in isolated containers, ensuring that dependencies and configurations do not conflict.
5. **Portability**: Docker containers can run on any system that supports Docker, making it easy to move applications between development, testing, and production environments.
6. **Continuous Integration and Deployment (CI/CD)**: Streamlines the CI/CD pipeline, allowing for rapid and reliable deployment of applications.

---

## How Docker Works

1. **Images**: Think of Docker images as blueprints for building containers. An image is a snapshot of everything your application needs to run: code, runtime, libraries, and configuration files.
2. **Containers**: When you run a Docker image, it becomes a container. A container is a running instance of an image. It's like taking a blueprint and constructing a building from it.
3. **Docker Engine**: This is the heart of Docker, responsible for creating and running containers. It's the engine that makes Docker work.
4. **Dockerfile**: A Dockerfile is a text file that contains instructions on how to build a Docker image. It's like a recipe that tells Docker how to create your image step by step.

---

## Basic Workflow of Docker

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day1/docker-workflow2.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

# Example Dockerfile

<Code language="dockerfile">
    FROM python:3.8-slim
    COPY . /app
    WORKDIR /app
    RUN pip install -r requirements.txt
    CMD ["python", "app.py"]
</Code>

## Resources

<iframe style="max-width:100%; height:auto;" src="https://www.youtube.com/embed/ul96dslvVwY" title="Day 1/40 - Docker Tutorial For Beginners - Docker Fundamentals - CKA Full Course 2024" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

```

```
