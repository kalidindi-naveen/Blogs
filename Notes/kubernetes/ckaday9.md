# Kubernetes Services

    Day 9 of 40 days of CKA challenge.

---

## Introduction to Kubernetes Services

A Kubernetes service is an abstraction that defines a logical set of Pods and a policy by which to access them. Services enable loose coupling between dependent Pods. They allow you to expose an application running on a set of Pods as a network service, making it possible to access the Pods without knowing their IP addresses.

### Key components of Kubernetes Services:

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_1.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

#### 1. `ClusterIP`: Default type. Exposes the Service on an internal IP in the cluster. Only reachable from within the cluster.

#### 2. `NodePort`: Exposes the Service on each Node's IP at a static port. It makes the Service accessible from outside the cluster using NodePort.

#### 3. `LoadBalancer`: Exposes the Service externally using a cloud provider’s load balancer. Automatically creates a ClusterIP and NodePort service.

#### 4. `ExternalName`: Maps the Service to a DNS name. Provides an alias for external services.

---

## Lets have a scenario of a cluster.

-   =>We will create a cluster with 3 nodes.
-   =>In that cluster we'll have 2 pods which will serve our react application with the help of Nginx, 2 pods which will serve our NodeJs backend, 2 pods for our postgresql DB and 1 pod for redis which will be used as cache.
-   =>Now, lets try to do the hands on and try to understand why we'll need kubernetes service

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_2.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

### Lets try to understand the communication challenges we'll face while implementing the above scenario.

-   Our react application pods need to be exposed to the external world. Also we're using 2 instances of our react application, so we need a loadbalancer to route the trafffic to both the pods.

-   Next, our frontend application needs a way top communicate with our backend services as well as our backend services needs to communicate with the DB and the redis server.

### We know the challenges we'll face while implementing the above scenario. Now lets talk about the solution.

### We have to use Kubernetes services for overcoming the communication challenges. Here are few Kubernetes service components which we'll use to implement the above scenario.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_3.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

### 1. NodePort:

NodePort is a type of service that exposes the service on each node's IP at a static port. This makes the service accessible from outside the Kubernetes cluster using NodePort.

-   NodePort range: By default, Kubernetes allocates ports from a range typically between `30000-32767`, but this range can be configured.
-   Use case: Useful for exposing a service externally without a load balancer, making it accessible from the outside world.

### ServicePort:

ServicePort is an abstraction that allows a Kubernetes service to be defined by the port it exposes. It is a combination of IP and port that defines how the service is accessed internally within the cluster.

-   ServicePort: This is the port on which the service is exposed internally in the cluster.
-   Example: If a Service is defined with port: 80, any Pod within the cluster can access the service using this port, regardless of the port the Pods themselves are using.

### TargetPort:

TargetPort is the port on the Pod that the traffic should be directed to. This is the port on which your application is running inside the container.

-   TargetPort: Specifies the port on the container to which the traffic is forwarded.
-   Example: If your application is running on port 8080 inside the container, you would set targetPort: 8080 in your Service definition.

---

## Lets try to create some nodes and try to expose them

-   Let's create a `kind.yaml` file to create a cluster.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_4.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9)

-   After saving the kind.yaml file, let's move to the directory where it is located and run the below command:

<Code language="bash">kind create cluster --config kind.yaml --name cka-cluster</Code>

-   Once the cluster is created, let's create a `deploy.yaml` to create a deployment with 3 replicas of nginx.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_5.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9)

-   After saving the deploy.yaml file, let's move to the directory where it is located and run the below command:

<Code language="bash">kubectl apply -f deploy.yaml</Code>

-   Now, let's create a `nodeport.yaml` file to create a nodeport to expose the nodes.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_6.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9)

-   After saving the nodepod.yaml file, let's move to the directory where it is located and run the below command:

<Code language="bash">kubectl apply -f nodeport.yaml</Code>

-   In the nodeport.yaml file, we have to specify the `nodePort` and `targetPort` as below.
-   `nodePort: 30001`
-   `targetPort: 80`
-   We are exposing the service on port 30001 from the cluster.
-   Once we are done with creating the nodeport service, let's try to access the nginx service from the browser on port `30001`.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_7.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   It's working fine.🎉🎉

---

## Lets try to establish communication between the pods

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   To establish communication between the pods, we need to have clusterIP. Let's create a `clusterip.yaml` file to create a clusterIP.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_9.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9)

-   After saving the clusterip.yaml file, let's move to the directory where it is located and run the below command:

<Code language="bash">kubectl apply -f clusterip.yaml</Code>

-   And that's it.🎉

---

## Can we make the communication more effective and fault tolerant?

-   Yes we can. How? Using a load balancer.🎉

-   Lets create a `loadbalancer.yaml` file to create a loadbalancer.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_10.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9)

-   After saving the loadbalancer.yaml file, let's move to the directory where it is located and run the below command:

<Code language="bash">kubectl apply -f loadbalancer.yaml</Code>

-   And that's it.🎉

---

## Lets verify what we did

-   We can see that our application is accessible to the external world.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_11.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Lets check all the service in the cluster by running the below command:

<Code language="bash">kubectl get svc</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_12.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like everything working fine.🎉🎉

---

---

# Task

1. Create a Service named `myapp` of type `ClusterIP` that exposes port 80 and maps to the target port 80.
2. Create a Deployment named `myapp` that creates 1 replica running the image `nginx:1.23.4-alpine`. Expose the container port 80.
3. Scale the Deployment to 2 replicas.
4. Create a temporary Pod using the image `busybox` and run a `wget` command against the IP of the service.
5. Run a `wget` command against the service outside the cluster.
6. Change the service type so the Pods can be reached outside the cluster.
7. Run a `wget` command against the service outside the cluster.
8. Discuss: Can you expose the Pods as a service without a deployment?
9. Discuss: Under what condition would you use the service types `LoadBalancer,` `node port,` `clusterIP,` and `external`?

---

-   Lets cerate a `clusterip.yaml` file to create a `clusterIP` with the mentioned config.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_16.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9/task](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9/task)

-   After saving the `clusterip.yaml` file, let's move to the directory where it is located and run the below command:

<Code language="bash">kubectl apply -f clusterip.yaml</Code>

-   Now we have to create a depoloyment named `myapp` with 1 replica of `nginx:1.23.4-alpine` image. Lets create a `deployment.yaml` file which will have the mentioned configs.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_17.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9/task](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9/task)

-   After saving the `deployment.yaml` file, let's move to the directory where it is located and run the below command:

<Code language="bash">kubectl apply -f deployment.yaml</Code>

-   Now, we have to scale the deployment to 2 replicas. The imperative way of doing it will be running the below command:

<Code language="bash">kubectl scale deployment myapp --replicas=2</Code>

-   Now to create a temporary Pod using the image `busybox` we can run the below command

<Code language="bash">kubectl run busybox --image=busybox</Code>

-   But as per instructions, we need to create a temporary pod using the image `busybox` and run a `wget` command against the IP of the service. So let's create the pod using the below command, which will create a temporary pod in interactive mode.

<Code language="bash">kubectl run busybox --image=busybox --rm -it -- /bin/sh
</Code>

-   Before creating the busybox pod lets get the IP of the service by running the below command:

<Code language="bash">kubectl describe pods myapp</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_13.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see that the IP is `10.244.2.3`. So let's create a temporary pod using the image `busybox` and run a `wget` command against the IP of the service.

-   Let's try to wget the service from the busybox pod using the below command:

<Code language="bash">wget -qO- 10.244.2.3:80</Code>

-   Looks like we aren't able to access the IP as the service is not exposed. So let's change the service type so the Pods can be reached outside the cluster.

-   Rather than changing the `clusterip.yaml` file lets create a `nodeport.yaml` file with almost same configs.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_14.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9/task](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9/task)

-   Let's create the `NodePort` service using the below command:

<Code language="bash">kubectl apply -f nodeport.yaml</Code>

-   Now, we can try to access the `nginx` service from the `busybox` terminal by running the below command:

<Code language="bash">wget -qO- localhost:30001
</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day9/10th_15.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like the nginx service is accessible.

## Can I Expose the Pods as a service without a deployment?

-   Yes, we can expose the Pods as a service without a deployment by creating Pods directly and then creating a service that selects those Pods using labels.

---

---

# Resources:

<iframe style="max-width:100%; height:auto;" src="https://www.youtube.com/embed/tHAQWLKMTB0" title="Day 9/40 - Kubernetes Services Explained - ClusterIP vs NodePort vs Loadbalancer vs External" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

-   [https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9)

-   [https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9/task](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day9/task)
