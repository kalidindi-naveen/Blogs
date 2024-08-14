# Kubernetes Multi Container Pod Kubernetes - `Sidecar` vs `Init` Container

    Day 11 of 40 days of CKA challenge.

---

## What is `Init` container?

Init containers are special containers that run before the main application containers in a Pod. They are primarily used for initialization tasks that must be completed before the main application containers start. Examples include setting up environment variables, loading configuration files, or performing database migrations. Init containers are defined in the Pod specification and are executed sequentially. Each init container must complete successfully before the next one starts, and the main application containers are only started after all init containers have successfully completed.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day11/11_0.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

### Few use cases of `Init` container:

-   Setting up prerequisites for the main application.
-   Performing tasks that need to run before the main application starts.
-   Ensuring dependencies are available and correctly configured.

## What is `Sidecar` container?

Sidecar containers are regular containers that run alongside the main application containers within the same Pod. They share the same network namespace and can communicate with each other via `localhost`. Sidecar containers are typically used to enhance the functionality of the main application, such as logging, monitoring, or proxying.

### Few use cases of `Sidecar` container:

-   Adding logging and monitoring capabilities.
-   Injecting configuration and secrets.
-   Performing tasks that complement the main application, like data synchronization.

---

## Lets try to create a multi container pod with `init` container

### Let's think of a scenario where we are hosting our `node.js` backend. We have an application container where our express app is running also we have a DB container where our `postgresql` running. We want to inform our backend application the DB container's IP as soon as the pod is up and running using `init` container (There is better way of acheiving this but just for tutorial purpose we're performing it).

-   First lets create the pod.yaml file which will have the required configs for our multi container pod.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day11/11_1.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day11](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day11)

-   We are creating total of 3 containers. 1 application container which is named as `myapp-container`,1 DB container which is named as `postgres-container` and 1 init container which is named as `init-db-ip`.

-   Our `init-db-ip` container uses the `busybox` image to run a shell script.
-   The scripts goes as below:

<Code language="bash">'
"sh",
"-c",
"until nslookup postgres-service.default.svc.cluster.local;
do echo waiting for postgres-service;
sleep 2;
done; ",
'</Code>

### `until nslookup postgres-service.default.svc.cluster.local`

-   This line attempts to resolve the DNS name `postgres-service` continuously. The `until` loop will keep running until the `nslookup` command successfully resolves the DNS name. The `nslookup` command is used to query DNS and get information about the specified hostname.

### `do echo waiting for postgres-service;`

-   If the `nslookup` command fails (meaning the `postgres-service` is not yet available), this line prints "waiting for postgres-service" to the console.

### `sleep 2;`

-   This line pauses the execution for 2 seconds before retrying the `nslookup` command.This creates a delay between each DNS lookup attempt.

### `done;`

-   This marks the end of the `until` loop. The loop will continue to run until `nslookup` successfully resolves the `postgres-service`.

-   Now lets save the `pod.yaml` file and create the pod using the below command.

<Code language="bash">kubectl apply -f pod.yaml</Code>

-   You can check the created pods using the below command.

<Code language="bash">kubectl get pods</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day11/11_2.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see that our `mypod` container is created but its stuck at init state. Our `init` container is still waiting for the `postgres-service` to be available so the other pod is waiting for that.

-   Lets create a deployment for our `postgres` db container. It will contain a `postgres` image. Later we will expose this container as a `service`.

-   Create a `deployment.yaml` file and save it.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day11/11_3.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day11](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day11)

-   Now, let's go the directory where the file is located and run the below command.

<Code language="bash">kubectl apply -f deployment.yaml</Code>

-   It will create the deployment, now lets create the `postgres-service` which will expose the `postgres` container as a service.

-   Lets create a posrgres-service.yaml file and save it.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day11/11_4.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day11](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day11)

-   Now, let's go the directory where the file is located and run the below command.

<Code language="bash">kubectl apply -f postgres-service.yaml</Code>

-   Now, lets try to watch our pods by running the below command.

<Code language="bash">kubectl get pods -w</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day11/11_5.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see that `mypod` is initializing.

-   Lets wait for a few seconds. Now, we can see that as soon as our service gets configured, our `mypod` container's state got changed to running.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day11/11_6.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

🎉🎉🎉

---

---

# Resources

<iframe style="max-width:100%; height:auto;"  src="https://www.youtube.com/embed/yRiFq1ykBxc" title="Day 11/40 - Multi Container Pod Kubernetes - Sidecar vs Init Container" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day11](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day11)

---

---

## Ignore this part as I was trying to configure

### `POSTGRES_IP=$(nslookup postgres-service | grep Address | tail -n1 | awk \'{print $3}\'); `

-   This line captures the output of the commands within the parentheses and assigns it to the variable `POSTGRES_IP`.

-   `nslookup postgres-service`: This command queries the DNS for the `postgres-service`. The output typically includes several lines of information, including the IP address of the service.

-   `grep Address:` This command filters the output of `nslookup` to only include lines containing the word "Address". DNS responses often have multiple addresses (e.g., for IPv4 and IPv6).

-   `tail -n1`: This command selects the last line from the filtered output. This is useful when there are multiple addresses, and we are interested in the last one (usually the IPv4 address).

-   `awk '{print $3}'`: This command extracts the third field from the line, which is expected to be the IP address. The fields are assumed to be space-separated.

### `echo "POSTGRES_IP=$POSTGRES_IP" > /app/config/db_ip.env`

-   `echo "POSTGRES_IP=$POSTGRES_IP"`: This command prints the string POSTGRES_IP= followed by the value of the `POSTGRES_IP` variable. It formats the output as an environment variable assignment.

-   `> /app/config/db_ip.env`: This redirects the output of the echo command to the file `/app/config/db_ip.env`. If the file does not exist, it will be created. If it exists, its content will be overwritten with the new value.

---
