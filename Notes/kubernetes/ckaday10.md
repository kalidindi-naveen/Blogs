# Kubernetes Namespace

    Day 10 of 40 days of CKA challenge.

---

## What is Namespace?

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_main.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

In Kubernetes, a namespace is a way to divide cluster resources between multiple users (via resource quota). It is intended for use in environments with many users spread across multiple teams or projects. Namespaces provide a scope for names and are a way to organize clusters. They are useful for dividing cluster resources between multiple users or applications, managing resource limits, and preventing name collisions.

### Lets check if we have a namespace in our cluster

-   We have to run the below command to get all the namespaces in our cluster:

<Code language="bash">kubectl get namespaces
</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_1.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Although, we haven't created any namespace, we can see 5 namespace is already there in our cluster.

### `default` Namespace:

In Kubernetes, the `default` namespace is a pre-defined namespace named `default`. When you create resources (such as pods, services, deployments) without specifying a namespace, they are placed in the `default` namespace.

-   If you don't specify a namespace when creating a resource, it goes into the `default` namespace.
-   It's designed for convenience so that users do not have to explicitly specify a namespace for every resource they create.
-   It's often used for resources that do not need to be isolated into their own namespace or for simple setups and examples.

## Create a Namespace:

### Declarative way of creating a namespace:

-   We have to create a namespace.yaml file and save it.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_2.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day10](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day10)

-   Now, lets go to the directory where we saved our namespace.yaml file and lets run the below command.

<Code language="bash">kubectl apply -f namespace.yaml</Code>

-   We can delete the namespace by running the below command.

<Code language="bash">kubectl delete namespace app-space</Code>

### Imperative way of creating a namespace:

-   TO create a namespace, we can use the below command.

<Code language="bash">kubectl create namespace app-space</Code>

## Communication Between Namespaces:

-   We already have 6 pods running in our `default` namespace. We can check it by running the below command.

<Code language="bash">kubectl get pods -n default</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_4.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Now lets try to make 1 pod with `nginx:1.23.4-alpine` image in our `app-space` namespace. We can do that by creating a `deploy.yaml` file.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_3.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day10](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day10)

-   Lets go to the directory where we saved our `deploy.yaml` file and lets run the below command.

<Code language="bash">kubectl apply -f deploy.yaml</Code>

-   Right now, we have total 7 pods in our cluster. 6 pods in `default` namespace and 1 in `app-space` namespace.

### Communication between pods using IP address:

-   Let's try to fetch the IP address of the `nginx` pod in our `app-space` namespace by running the below command.

<Code language="bash">kubectl describe po ngnix -n app-space </Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_5.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see that the IP address of the `nginx` pod is `10.244.1.5`.

-   Now, lets get into the `busybox` container's shell by running the below command:

<Code language="bash">kubectl exec -it busybox -n default -- sh</Code>

-   Once we are in the shell, we can wget the IP address of the `nginx` pod in our `app-space` namespace by running the below command.

<Code language="bash">wget 10.244.1.5</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_6.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see taht we are getting back a `HTML` file from our `nginx` pod. Yes, we are able to communicate with the pods in various namespaces using the IP address of the pods.

### Communicate between pods using host name:

-   First, lets try to create a service which will expose the `nginx` pod in our `app-space` namespace by running the below command.

<Code language="bash">kubectl expose deployment/ngnix-deployment -n app-space --name=nginx-svc --port=80 --target-port=80</Code>

-   We can see that the service is exposed.

-   Now, lets try to `wget` the `nginx-svc` from the `busybox` pod which is located in the `default` namespace.

-   Access the shell of the busybox pod by running the below command.

<Code language="bash">kubectl exec -it busybox -n default -- sh</Code>

-   Once we are in the shell, run the below command to `wget`.

<Code language="bash">wget nginx-svc</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_7.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like the `busybox` is not able to `wget` the `nginx` pod.

### Solution?

### Fully Quallified Domain Name(FQDN)

A Fully Qualified Domain Name (FQDN) is the complete domain name for a specific computer, host, or service in the internet's hierarchy of domain names. It uniquely identifies the location of an entity within the Domain Name System (DNS) hierarchy. An FQDN specifies all domain levels, including the root domain, and typically includes both the host name and the domain name.

-   Lets get the FQDN of the `nginx` pod in our `app-space` namespace by getting into the `/etc/resolv.conf` file which is responsible for DNS resolution within the pod. Run the below command:

<Code language="bash">kubectl exec -it ngnix-deployment-86b5986f97-rfv7f -n app-space -- sh</Code>

<Code language="bash">cat /etc/resolv.conf</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see that the FQDN of the `nginx` pod is `app-space.svc.cluster.local`.

-   Now lets try to wget the FQDN of the `nginx` pod in our `app-space` namespace by running the below command from `busybox` pod.

<Code language="bash">kubectl exec -it busybox -n default -- sh</Code>
<Code language="bash">wget nginx-svc.app-space.svc.cluster.local</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_9.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see that we're able to communicate between the pods using `FQDN`. 🎉🎉

---

---

# Task

### Task details

-   Create two namespaces and name them ns1 and ns2
-   Create a deployment with a single replica in each of these namespaces with the image as nginx and name as deploy-ns1 and deploy-ns2, respectively
-   Get the IP address of each of the pods (Remember the kubectl command for that?)
-   Exec into the pod of deploy-ns1 and try to curl the IP address of the pod running on deploy-ns2
-   Your pod-to-pod connection should work, and you should be able to get a successful response back.
-   Now scale both of your deployments from 1 to 3 replicas.
-   Create two services to expose both of your deployments and name them svc-ns1 and svc-ns2
-   exec into each pod and try to curl the IP address of the service running on the other namespace.
-   This curl should work.
-   Now try curling the service name instead of IP. You will notice that you are getting an error and cannot resolve the host.
-   Now use the FQDN of the service and try to curl again, this should work.
-   In the end, delete both the namespaces, which should delete the services and deployments underneath them.

---

## Solution

### Step 1: Create two namespaces (`ns1` and `ns2`)

-   We can run the below commands to create the namespaces:

<Code language="bash">kubectl create namespace ns1</Code>
<Code language="bash">kubectl create namespace ns2</Code>

### Step 2: Create deployments in each namespace

-   Let's ceate two files named `deploy-ns1.yaml` and `deploy-ns2.yaml`. These files contain the YAML for the deployment.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_10.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_11.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day10/task](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day10/task)

-   Lets create the deployments using the below command.

<Code language="bash">kubectl apply -f deploy-ns1.yaml</Code>
<Code language="bash">kubectl apply -f deploy-ns2.yaml</Code>

### Step 3: Get the IP address of the pods in each namespace

-   Lets run the below command to get the IP address of the pods in each namespace.

<Code language="bash">kubectl get pods -o wide -n ns1</Code>
<Code language="bash">kubectl get pods -o wide -n ns2</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_12.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see that the pod `deploy-ns1-576c6b7b6-h4fqk` which is in `ns1` namespace, has an IP of `10.244.2.5` and the pod `deploy-ns2-576c6b7b6-kvdbk` which is in `ns2` namespace has an IP of `10.244.1.6`.

### Step 4: Exec into the pod of `deploy-ns1` and curl the pod in `deploy-ns2`

-   Let's run the below command to exec into the `deploy-ns1` pod:

<Code language="bash">kubectl exec -it deploy-ns1-576c6b7b6-h4fqk -n ns1 -- sh</Code>

-   Let's `curl` into the `deploy-ns2` pod's ip from the pod `deploy-ns1` by running the below command:

<Code language="bash">curl 10.244.1.6</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_13.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like we are able to get a successful response back.

### Step 5: Scale both of your deployments from 1 to 3 replicas

-   We can scale both of your deployments from 1 to 3 replicas by running the below commands.

<Code language="bash">kubectl scale deploy deploy-ns1 -n ns1 --replicas=3</Code>
<Code language="bash">kubectl scale deploy deploy-ns2 -n ns2 --replicas=3</Code>

### Step 6: Create services to expose both deployments and name them svc-ns1 and svc-ns2

-   We can create services to expose both deployments and name them `svc-ns1` and `svc-ns2` by creating the yaml files `svc-ns1.yaml` `svc-ns2.yaml`.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_14.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_15.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Now, lets create the services using the below commands:

<Code language="bash">kubectl apply -f svc-ns1.yaml</Code>
<Code language="bash">kubectl apply -f svc-ns2.yaml</Code>

### Step 7: Exec into each pod and curl the IP address of the service in the other namespace

-   Lts get the IPs of both the services using the below commands:

<Code language="bash">kubectl get svc -o wide -n ns1</Code>
<Code language="bash">kubectl get svc -o wide -n ns2</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_16.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see thet the service `svc-ns1` has an IP of `10.96.192.162` and the service `svc-ns2` has an IP of `10.96.4.154`.

-   Now, lets try to curl the IP address of the service in the other namespace by running the below command from the `deploy-ns1` pod:

<Code language="bash">kubectl exec -it deploy-ns1-576c6b7b6-h4fqk -n ns1 -- sh</Code>
<Code language="bash">curl 10.96.4.154</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_17.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see that the we got a response `html` from the `service-ns2`

-   Also we can perform the `curl` from `deploy-ns2` to the IP of `deploy-ns1` by running the below commands:

<Code language="bash">kubectl exec -it deploy-ns2-576c6b7b6-kvdbk -n ns2 -- sh</Code>
<Code language="bash">curl 10.96.192.162</Code>

### Step 8: Exec into pod and curl the host service

-   We can do this by running the below commands:

<Code language="bash">kubectl exec -it deploy-ns1-576c6b7b6-h4fqk -n ns1 -- sh</Code>
<Code language="bash">curl svc-ns2</Code>

-   Looks like, we are unable to `curl` using the service host.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_18.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

### Step 9: Curl using the FQDN of the services

-   Lets first get the FQDN of the deploy-ns1 by running the below commands:

<Code language="bash">kubectl exec -it deploy-ns1-576c6b7b6-h4fqk -n ns1 -- sh</Code>
<Code language="bash">cat /etc/resolv.conf</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_19.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Now, lets try to curl to `deploy-ns1` from the `deploy-ns2` using FQDN.

<Code language="bash">kubectl exec -it deploy-ns2-576c6b7b6-kvdbk -n ns2 -- sh</Code>
<Code language="bash">curl svc-ns1.ns1.svc.cluster.local</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day10/10_20.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like we're able to successfully `curl` using the FQDN.

### Step 10: Delete both namespaces

-   We can delete both the namespaces and its resources by running the below commands:

<Code language="bash">kubectl delete namespace ns1</Code>
<Code language="bash">kubectl delete namespace ns2</Code>

---

---

# Resources

<iframe style="max-width:100%; height:auto;" src="https://www.youtube.com/embed/yVLXIydlU_0" title="Day 10/40 - Kubernetes Namespace Explained - CKA Full Course 2024" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day10](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day10)

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day10/task](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day10/task)
