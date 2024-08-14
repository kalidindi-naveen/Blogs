# Kubernetes Cluster Architecture

    Day 5 of 40 days of CKA challenge.

---

## Components of Kubernetes

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day5/kubernetes-architecture.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

## Master Node Components

In a Kubernetes cluster, the master node (or control plane node) is responsible for managing the entire cluster. It runs several critical components that handle the orchestration of workloads, maintain the desired state of the cluster, and manage the lifecycle of applications running on the cluster. Here are the key components typically running on the master node:

### 1. Kube-API-Server:

The API server is the front end for the Kubernetes control plane. It handles RESTful requests, validates them, and processes the state of the Kubernetes cluster. It serves as the communication hub for all other components.

### 2. ETCD:

This is a consistent and highly available key-value store used as Kubernetes' backing store for all cluster data. It stores configuration data, status information, and metadata about the Kubernetes cluster.

### 3. Scheduler:

The scheduler is responsible for assigning workloads (pods) to nodes. It looks at the resource requirements of pods and the resource availability on nodes and decides where each pod should be scheduled.

### 4. Control Manager:

This component includes several controllers that handle routine tasks in the cluster, such as node controller, replication controller, endpoints controller, and service account & token controllers. They ensure the desired state of the cluster matches the actual state.

### 5. Cloud Control Manager:

If the cluster is running on a cloud platform, this component interacts with the cloud provider's API to manage resources like load balancers, storage volumes, and nodes. It abstracts the cloud-specific operations from the rest of the Kubernetes components.

---

## Worker Node Components

A worker node in a Kubernetes cluster is a machine (physical or virtual) that runs the applications and workloads. Worker nodes host the pods, which are the smallest deployable units in Kubernetes, containing one or more containers. Each worker node contains the necessary services to manage the networking between the containers, communicate with the master node, and ensure that the containers are running as expected.

### 1. Kubelet:

This is an agent that runs on each node in the cluster. It ensures that containers are running in a pod. Kubelet takes a set of PodSpecs provided through various means and ensures that the described containers are running and healthy.

### 2. Kube-proxy:

This network proxy runs on each node in the cluster, maintaining network rules on nodes. These rules allow network communication to the pods from network sessions inside or outside the cluster. Kube-Proxy uses the operating system packet filtering layer if available or forwards the traffic itself.

### 3. Pods:

The smallest and simplest Kubernetes object. A pod represents a set of running containers on your cluster. Each pod contains one or more containers (e.g., Docker containers) and shared resources for those containers, such as storage, networking, and a specification for how to run the containers.

---

## Kubermetes Pod Creation Communication Flow

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day5/pod-creation-wf.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

### 1. User Submits Pod Definition:

-   The user submits a pod definition (YAML or JSON file) using the kubectl command-line tool or another Kubernetes client.
-   Example command:

<Code language="bash">
kubectl create -f pod-definition.yaml
</Code>

### 2. kubectl Sends Request to Kube-API-Server:

-   kubectl sends an HTTP request to the Kube-API-Server with the pod definition.

### 3. Kube-API-Server Validates and Stores Pod Specification:

-   The Kube-API-Server receives the request, validates the pod specification, and ensures it adheres to the Kubernetes API schema.
-   Upon successful validation, the Kube-API-Server stores the pod specification in ETCD, the distributed key-value store that holds the cluster's state.

### 4. Scheduler Watches for Unscheduled Pods:

-   The Scheduler continuously watches the Kube-API-Server for new pods that do not have an assigned node.
-   When a new pod is detected, the Scheduler evaluates the available resources on the worker nodes and selects the most appropriate node based on the scheduling policies.

### 5. Scheduler Assigns Pod to a Worker Node:

-   The Scheduler assigns the pod to a specific worker node by updating the pod's specification in the Kube-API-Server with the selected node information.

### 6. Kube-API-Server Notifies Kubelet:

-   The Kube-API-Server updates the pod's state in ETCD.
-   The Kubelet on the assigned worker node continuously watches the Kube-API-Server for updates related to the pods it needs to manage.

### 7. Kubelet Receives Pod Specification:

-   The Kubelet on the assigned worker node receives the updated pod specification from the Kube-API-Server.
-   The Kubelet ensures that the container runtime (e.g., Docker, containerd) pulls the required container images from the specified container registry.

### 8. Kubelet Starts the Pod:

-   The Kubelet instructs the container runtime to create and start the containers defined in the pod specification.
-   The Kubelet manages the pod lifecycle, monitors the pod's health, and ensures it is running as expected.

### 9. Kube-Proxy Updates Network Rules:

-   The Kube-Proxy on the worker node updates the network rules to enable communication to and from the new pod.
-   This involves setting up the necessary IP table rules to route traffic to the pod.

### 10. Pod Becomes Available:

-   The new pod is now running on the assigned worker node.
-   The Kubelet reports the status of the pod back to the Kube-API-Server, updating the cluster's state in ETCD.

### 11. User Can Query Pod Status:

-   he user can query the status of the new pod using kubectl or other Kubernetes clients by sending requests to the Kube-API-Server.
-   Example command:

<Code language="bash">
kubectl get pods
</Code>

---

---

## Resources

<iframe style="max-width:100%; height:auto;" src="https://www.youtube.com/embed/SGGkUCctL4I" title="Day 5/40 - What is Kubernetes - CKA Full Course 2024 - Kubernetes Architecture Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
