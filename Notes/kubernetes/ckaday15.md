# Kubernetes Node Affinity

    Day 15 of 40 days of CKA challenge.

---

## What is Affinity?

Affinity rules are used to attract pods to specific nodes or to co-locate certain pods together. Affinity can be categorized into two types: `node affinity` and `pod affinity/anti-affinity`.

### 1. Node Affinity

This controls which nodes a pod is eligible to be scheduled on, based on the labels on the nodes. It is specified in the pod specification using `nodeAffinity` field. There are two types of node affinity:

-   `RequiredDuringSchedulingIgnoredDuringExecution`: Must match the specified node labels for the pod to be scheduled.
-   `PreferredDuringSchedulingIgnoredDuringExecution`: Preferentially matches the specified node labels but is not a strict requirement.

### 2. Pod Affinity/Anti-Affinity

This controls which nodes a pod can be scheduled on based on the labels of other pods running on the nodes.

-   `Pod Affinity`: Attracts pods to nodes where specified pods are running.
-   `Pod Anti-Affinity`: Prevents pods from running on nodes where specified pods are running.

---

# Task Details

-   create a pod with nginx as the image and add the nodeffinity with property requiredDuringSchedulingIgnoredDuringExecution and condition disktype = ssd
-   check the status of the pod and see why it is not scheduled
-   add the label to your worker01 node as disktype=ssd and then check the status of the pod
-   It should be scheduled on worker node 1
-   create a new pod with redis as the image and add the nodeaffinity with property requiredDuringSchedulingIgnoredDuringExecution and condition disktype without any value
-   add the label to worker02 node with disktype and no value
-   ensure that pod2 should be scheduled on worker02 node

---

# Solution

-   Lets create a manifest file and name it as `nginx-affinity.yaml` with the mentioned config int the task.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day15/15_1.png" alt="Yaml for nginx" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day15](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day15)

-   Now, lets go the directory where we saved our manifest file and run the below command.

<Code language="bash">kubectl apply -f nginx-affinity.yaml</Code>

-   Lets try to check the status of our pod by running the below command.

<Code language="bash">kubectl get pods</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day15/15_2.png" alt="nginx pod status" style="max-width:100%; height:auto;">

-   Looks like our nginx pod is in pending state as we have attached a nodeaffinity of type `requiredDuringSchedulingIgnoredDuringExecution` to our pod.

-   Lets try to add the affinity to our `cka-cluster-worker` node by running the below command:

<Code language="bash">kubectl label nodes cka-cluster-worker disktype=ssd</Code>

-   Now, lets try to check the status.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day15/15_3.png" alt="nginx pod status" style="max-width:100%; height:auto;">

-   As soon as we labelled our worker node as `disktype=ssd`, the pod was scheduled to the `cka-cluster-worker` node. Now, lets try to see on which node the pod is scheduled by running the below command:

<Code language="bash">kubectl get pods -o wide</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day15/15_4.png" alt="nginx pod status" style="max-width:100%; height:auto;">

-   Indeed, our pod is scheduled on `cka-cluster-worker` node.

-   Lets create a new pod with `redis` as the image and the `nodeAffinity` with property `requiredDuringSchedulingIgnoredDuringExecution` and condition disktype without any value.

-   Lets create a new manifest file for our `redis` pod and name it as `redis.yaml`.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day15/15_5.png" alt="Yaml for redis" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day15](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day15)

-   Now, lets go the directory where we saved our manifest file and run the below command.

<Code language="bash">kubectl apply -f redis.yaml</Code>

-   Lets try to check the status of our pod by running the below command.

<Code language="bash">kubectl get pods</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day15/15_6.png" alt="redis pod status" style="max-width:100%; height:auto;">

-   We can see that our pod is in pending state as we have attached a nodeaffinity of type `requiredDuringSchedulingIgnoredDuringExecution` to our pod.

-   Lets try to add the affinity to our `cka-cluster-worker2` node by running the below command:

<Code language="bash">kubectl label nodes cka-cluster-worker2 disktype=</Code>

-   Now, if we try to check the status of our pod by running the below command we can see that our pod is in running state.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day15/15_7.png" alt="redis pod status" style="max-width:100%; height:auto;">

-   Now lets try to check if the pod is scheduled on `cka-cluster-worker2` node by running the below command:

<Code language="bash">kubectl get pods -o wide</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day15/15_8.png" alt="redis pod status" style="max-width:100%; height:auto;">

-   Indeed, our pod is scheduled on `cka-cluster-worker2` node.

🎉🎉

---

---

# Resources

<iframe style="max-width:100%; height:auto;" src="https://www.youtube.com/embed/5vimzBRnoDk" title="Day 15/40 - Kubernetes Node Affinity Explained - CKA Full Course 2024" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day15](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day15)
