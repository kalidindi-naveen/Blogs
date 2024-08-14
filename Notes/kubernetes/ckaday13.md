# Static Pods, Manual Scheduling, Labels and Selectors in Kubernetes

    Day 13 of 40 days of CKA challenge.

---

## What are static pods?

Static pods in Kubernetes are managed directly by the kubelet on a specific node, without the intervention of the Kubernetes API server or the scheduler. They are often used for critical system components that need to run on specific nodes, such as kube-proxy or a custom logging agent.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_1.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

### Characteristics of Static Pods

#### Managed by Kubelet:

-   Static pods are created and managed by the kubelet daemon running on each node, rather than by the Kubernetes API server.

#### Static Pod Manifest Files:

-   The configuration for static pods is defined in pod manifest files, which are typically stored in a specific directory on the node, such as `/etc/kubernetes/manifests`.

#### No Replication Controller:

-   Static pods are not managed by a Deployment, ReplicaSet, or any other higher-level controller. If a static pod fails, the kubelet will try to restart it, but there is no replication or scheduling logic involved.

#### Pod Names:

-   The names of static pods are suffixed with the name of the node on which they are running. For example, a static pod defined as `nginx` running on a node named `node1` will appear as `nginx-node1`.

#### Visibility:

-   Static pods are visible through the Kubernetes API server, but you cannot manage them (e.g., delete, update) using kubectl. You must modify or delete the static pod manifest file directly on the node.

---

## Lets try to see what all static pods we have in our cluster.

-   We have created our cluster using `KIND`(Kubernetes in docker). Kind creates container images for each node in the cluster.

-   The static pods which are primarily responsible for managing the resources of a cluster, networking are created under the namespace `kube-system`. Let's try to fetch all the pods which are created under this namespace by running the below command:

<Code language="bash">kubectl get pods -n kube-system</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_2.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

We can see our master node components such as:

-                                                                                                               `kube-scheduler-cka-cluster-control-plane` aka scheduler,
-                                                                                                               `kube-controller-manager-cka-cluster-control-plane` aka controller manager,
-                                                                                                               `kube-apiserver-cka-cluster-control-plane` aka apiserver,
-                                                                                                                `kube-proxy-cka-cluster-control-plane` aka proxy.

#### Now lets try to get into our `control-plane` node

-   As we are running our cluster using Kind, we can see the docker container which is responsible for running the control-plane node. Lets try to see the container name and try to exec into into in by running the below commands:

<Code language="bash">docker ps | grep control-plane</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_3.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see the container name is `cka-cluster-control-plane`. Now lets try to exect into the container by running the below command:

<Code language="bash">docker exec -it cka-cluster-control-plane bash</Code>

-   If we go into the `/etc/kubernetes/manifests` directory, we can see the `yaml` configurations for our static pods. Lets go and see by running the below command:

<Code language="bash">cd /etc/kubernetes/manifests && ls</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_4.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

We can see these following files:

-   `etcd.yaml`
-   `kube-apiserver.yaml`
-   `kube-controller-manager.yaml`
-   `kube-scheduler.yaml`

---

## Manual Scheduling, Labels, and Selectors

### What is Manual Scheduling?

Manual scheduling in Kubernetes refers to the process of manually assigning a pod to a specific node, bypassing the default automatic scheduling mechanism of the Kubernetes scheduler. This is typically done by explicitly specifying the node where the pod should run in the pod's manifest file using the `nodeName` field.

### When to use manual scheduling?

#### 1. Control:

-   When you need precise control over which nodes run specific pods.

#### 2. Special Requirements:

-   When certain pods require specific hardware, such as GPUs, that are available only on certain nodes.

#### 3. Debugging:

-   For testing or debugging purposes to isolate the pod on a specific node.

## Lets try to schudule a pod manually

-   We know that when we don't mention the `nodeName` field in the pod manifest file, the pod is automatically scheduled to the node where the pod is running and the job of scheduling the pod is performed by the Kubernetes scheduler.

-   Let's schedule a pod using `nginx` image automatically with the help of scheduler. We will use the below command and get the yaml config file of the pod and save it as `pod.yaml`:

<Code language="bash">kubectl run nginx --image=nginx -o yaml > pod.yaml</Code>

-   The above command will create a pod named `nginx` using the `nginx` image and save the yaml config file as `pod.yaml` in the same directory.

-   We can see our pod by running the below command:

<Code language="bash">kubectl get pods | grep nginx</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_5.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Now lets copy the content of pod.yaml file and save it in a new file named `manual-pod.yaml` file and add a new field `nodeName` in the `spec` section of it and save it as `manual-pod.yaml`.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_6.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day13](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day13)

-   Before creating the pod, lets delete the exisiting `nginx` pod by running the below command:

<Code language="bash">kubectl delete pod nginx</Code>

-   Now lets create the new `nginx` pod in the node `cka-cluster-worker2` using the `manual-pod.yaml` file by running the below command:

<Code language="bash">kubectl apply -f manual-pod.yaml</Code>

-   Once the pod is created, we can verify if the pod is created inside the `cka-cluster-worker2` node by running the below command:

<Code language="bash">kubectl describe pods/nginx</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_7.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can clearly see that the node is mentioned as `cka-cluster-worker2/172.18.0.2`.

---

# Task details

-   Create a pod and try to schedule it manually without the scheduler.
-   Login to the control plane node and go to the directory of default static pod manifests and try to restart the control plane components
-   Create 3 pods with the name as `pod1`, `pod2` and `pod3` based on the `nginx` image and use labels as `env:test`, `env:dev` and `env:prod` for each of these pods respectively.
-   Then using the kubectl commands, filter the pods that have labels `dev` and `prod`.

---

# Solution

## Step 1: Create a pod and try to schedule it manually without the scheduler

-   Lets create a yaml config for our pod and save it as `manual-nginx-pod.yaml`. We also want our pod to be created in the `cka-cluster-worker2` node.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day13](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day13)

-   Now lets run the below command from the directory where we save the yaml config file.

<Code language="bash">kubectl apply -f manual-nginx-pod.yaml</Code>

-   Lets try to see if the pod is created by running the below command:

<Code language="bash">kubectl get pods | grep nginx</Code>

-   Lets try to verify f the `nginx-manual` pod is created in the `cka-cluster-worker2` node by running the below command:

<Code language="bash">kubectl describe pods/nginx-manual</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_9.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see that the `nginx-manual` pod is created inside the `cka-cluster-worker2/172.18.0.2` node.

## Step 2: Login to the control plane node and go to the directory of default static pod manifests and try to restart the control plane components

-   As we are running our cluster using Kind, we can see the docker container which is responsible for running the control-plane node. Lets try to see the container name and try to exec into into in by running the below commands:

<Code language="bash">docker ps | grep control-plane</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_3.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see the container name is `cka-cluster-control-plane`. Now lets try to exect into the container by running the below command:

<Code language="bash">docker exec -it cka-cluster-control-plane bash</Code>

-   If we go into the `/etc/kubernetes/manifests` directory, we can see the `yaml` configurations for our static pods. Lets go and see by running the below command:

<Code language="bash">cd /etc/kubernetes/manifests && ls</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_4.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

We can see these following files:

-   `etcd.yaml`
-   `kube-apiserver.yaml`
-   `kube-controller-manager.yaml`
-   `kube-scheduler.yaml`

-   If we move the files to any other directory and again put them back in the `/etc/kubernetes/manifests` directory, the components will be deleted and regenerated. ALso we can edit them and the kubelet will restart them.

## Step 3: Create 3 pods with the name as `pod1`, `pod2` and `pod3` based on the `nginx` image and use labels as `env:test`, `env:dev` and `env:prod` for each of these pods respectively.

-   Lets create 3 manifest files and save them as `pod1.yaml`, `pod2.yaml` and `pod3.yaml` for creating 3 pods.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_10.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_11.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_12.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day13](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day13)

-   Now, lets create the 3 pods using these manifest files by running the below commands:

<Code language="bash">kubectl apply -f pod1.yaml
kubectl apply -f pod2.yaml
kubectl apply -f pod3.yaml
</Code>

-   Lets verify if the pods are created by running the below command:

<Code language="bash">kubectl get pods</Code>

## Step 4: Filter Pods by Labels

-   to filter pods with label `env=dev` we can run the below command:

<Code language="bash">kubectl get pods -l env=dev</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_13.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   to filter pods with label `env=prod` we can run the below command:

<Code language="bash">kubectl get pods -l env=prod</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day13/13_14.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

---

---

# Resources

<iframe style="max-width:100%; height:auto;" src="https://www.youtube.com/embed/6eGf7_VSbrQ" title="Day 13/40 - Static Pods, Manual Scheduling, Labels, and Selectors in Kubernetes" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day13](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day13)

[Diagrams](https://app.eraser.io/workspace/NQmExV0IhDUGIzjdhgcX?origin=share)
