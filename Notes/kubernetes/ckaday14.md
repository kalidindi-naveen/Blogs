# Taints and Tolerations and `nodeSelectors` in Kubernetes

    Day 14 of 40 days of CKA challenge.

---

## What are Taints and Tolerations?

In Kubernetes, taints and tolerations are mechanisms that allow you to control which nodes can run which pods. This is useful for ensuring that certain workloads are only run on specific nodes, or to prevent certain workloads from running on nodes that may not be suitable for them.

## Taints

Taints are applied to nodes, and they mark a node as having some special property that might cause it to be undesirable for some pods. A taint consists of three components:

#### 1. `Key`: A string that represents the taint's label.

#### 2. `Value`: A string that represents the taint's value.

#### 3. `Effect`: A string that specifies the effect of the taint. It can be one of the following:

-   `NoSchedule`: Pods that do not tolerate the taint are not scheduled on the node.

-   `PreferNoSchedule`: Kubernetes will try to avoid placing pods that do not tolerate the taint on the node, but it is not guaranteed.

-   `NoExecute`: Pods that do not tolerate the taint are evicted from the node if they are already running, and not scheduled onto the node if they are not running.

## Tolerations

Tolerations are applied to pods. They allow the pods to be scheduled onto nodes with matching taints. A toleration consists of the following components:

#### 1. `Key`: The key of the taint that the pod can tolerate.

#### 2. `Operator`: Represents a key’s relationship to the value. Valid values are `Equal` and `Exists`.

#### 3. `Value`: The value of the taint that the pod can tolerate.

#### 4. `Effect`: The effect of the taint. Valid values are `NoSchedule`, `PreferNoSchedule` and `NoExecute`.

#### 5. `TolerationSeconds`: Only for `NoExecute` taints. This specifies the period of time the pod can tolerate the taint.

---

## Lets try to schedule a pod to a node with taints and tolerations.

-   First lets fetch what all nodes we have in our cluster and try to give a taint to each of them.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_1.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like we have 3 nodes which are `cka-cluster-control-plane`, `cka-cluster-worker`, and `cka-cluster-worker2`.

-   Now lets try to assign a taint of `intenseWork=true` with an effect of `NoSchedule` to all the worker nodes by running the below command:

<Code language="bash">
kubectl taint nodes cka-cluster-worker intenseWork=true:NoSchedule
kubectl taint nodes cka-cluster-worker2 intenseWork=true:NoSchedule
</Code>

-   Once the taint is applied to the worker nodes, lets try to create a pod using nginx image without applying any tolerations and see if the pod is scheduled or not.

<Code language="bash">kubectl run nginx --image=nginx</Code>

-   Once we excecute the above command, we can see that the nginx pod is in pending state and not scheduled to any node.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_2.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Lets try to find the reason by running a `describe` command on the pod.

<Code language="bash">kubectl describe pod nginx</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_3.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like we found the reason for the pod not being scheduled. As all the worker nodes is having a taint of `intenseWork=true` with an effect of `NoSchedule`, the pod will not be scheduled to any node without tolerations.

-   Lets try to apply some tolerations to the pod and see if the pod is scheduled or not. First lets delete the existing pod and get the manifest by running the below commands:

<Code language="bash">
kubectl delete pod nginx
kubectl run nginx --image=nginx --dry-run=client -o yaml > nginx.yaml
</Code>

-   The above command will create a `nginx.yaml`. Lets make some changes to the yaml file and apply the toleration.

-   Here is the updated `nginx.yaml` file:

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_4.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day14](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day14)

-   Now lets create the pod by running the below command and see if it is now getting scheduled or not.

<Code language="bash">kubectl apply -f nginx.yaml</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_5.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_6.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like this time the pod is in running state and scheduled to the `cka-cluster-worker` node.

-   Lets try to delete the taints applied to the worker nodes by running the below commands:

<Code language="bash">
kubectl taint nodes cka-cluster-worker intenseWork=true:NoSchedule-
kubectl taint nodes cka-cluster-worker intenseWork=true:NoSchedule-
</Code>

---

## `nodeSelector`

In Kubernetes, `nodeSelector` is a simple way to constrain pods to only be scheduled onto nodes that satisfy certain criteria. This is achieved by specifying a set of key-value pairs that a node must have for the pod to be scheduled onto it.

When you define a `nodeSelector` in a pod's specification, Kubernetes ensures that the pod is only scheduled on nodes that have all the specified labels.

### Lets try to schedule a pod to a node with `nodeSelector`.

-   Suppose that we have a node deployed in asia-pacific region and we want to schedule a `nginx` pod which will serve the asia-pacific region. For this we can give the node a label as `region=asia-pacific` and to schedule the pod on that node we have to give the pod same label as `region=asia-pacific`.

-   Lets create a pod manifest and save it as `asia-pacific-nginx-pod.yaml`.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_7.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day14](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day14)

-   Now lets create the pod by running the below command and see if it is now getting scheduled or not.

<Code language="bash">kubectl apply -f asia-pacific-nginx-pod.yaml</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like he pod is in pending state and not scheduled to any node as we haven't provided the `region` label to any of our worker nodes.

-   Let's give our `cka-cluster-worker2` node a `region=asia-pacific` label by running the below command:

<Code language="bash">kubectl label nodes cka-cluster-worker2 region=asia-pacific</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_9.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   As soon as we give the `region=asia-pacific` label to the `cka-cluster-worker2` node, the pod will be scheduled to the `cka-cluster-worker2` node.

-   Lets try to delete the labels applied to the worker nodes by running the below command:

<Code language="bash">
kubectl label nodes cka-cluster-worker2 region-
</Code>

---

---

# Task

-   Taint both of your worker nodes as below

-   `worker01--> gpu=true:NoSchedule`
-   `worker02--> gpu=false:NoSchedule`

-   Create a new pod with the image nginx and see why it's not getting scheduled on worker nodes and control plane nodes.
-   Create a toleration on the pod gpu=true:NoSchedule to match with the taint on worker01
-   The pod should be scheduled now on worker01
-   Delete the taint on the control plane node
-   Create a new pod with the image redis , it should be scheduled on control plane node
-   Add the taint back on the control plane node(the one that was removed)

---

# Solution

-   Lets assign both of the nodes a taint of `gpu=true:NoSchedule` and `gpu=false:NoSchedule` by running the below commands:

<Code language="bash">
kubectl taint nodes cka-cluster-worker gpu=true:NoSchedule
kubectl taint nodes cka-cluster-worker2 gpu=false:NoSchedule
</Code>

-   Lets create a new pod with the `nginx` image and see why it's not getting scheduled on worker nodes and control plane nodes.

<Code language="bash">kubectl run nginx --image=nginx</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_10.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   After excecuting the command we ca see the `nginx` pod is in oending state. It is not yet scheduled to any node. Lets try finding the reason by running the below command:

<Code language="bash">kubectl describe pod nginx</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_11.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like, our all nodes are tainted with `NoSchedule` effect. Lets delete the existing `nginx` pod and try to create a new pod with a manifest file.

-   We have created a `nginx-gpu-true.yaml` file.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_12.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day14](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day14)

-   Now lets create the pod by running the below command and see if it is now getting scheduled or not.

<Code language="bash">kubectl apply -f nginx-gpu-true.yaml</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_13.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like, our pod is scheduled and running this time. Lets try to find out if the pod is scheduled on `cka-cluster-worker` or not by running the below command:

<Code language="bash">kubectl get pods -o wide</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_14.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can see that our nginx pod is running on `cka-cluster-worker` node.

-   Lets try to get the taint on the `cka-cluster-control-plane` node by running the below command:

<Code language="bash">kubectl describe node cka-cluster-control-plane | grep Taints</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_15.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   The `cka-cluster-control-plane` node is tainted with `node-role.kubernetes.io/control-plane:NoSchedule`.

-   Lets remove the tent by running the below command:

<Code language="bash">kubectl taint nodes cka-cluster-control-plane node-role.kubernetes.io/control-plane:NoSchedule-</Code>

-   Now lets create a pod with the image `redis` , it should be scheduled on control plane node as we have removed the taint on `cka-cluster-control-plane` node.

<Code language="bash">kubectl run redis --image=redis</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day14/14_16.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like the redis pod is scheduled on control plane node.

-   Lets put the taint back on the control plane node by running the below command:

<Code language="bash">kubectl taint nodes cka-cluster-control-plane node-role.kubernetes.io/control-plane:NoSchedule</Code>

---

---

# References

<iframe style="max-width:100%; height:auto;" src="https://www.youtube.com/embed/nwoS2tK2s6Q" title="Day 14/40 - Taints and Tolerations in Kubernetes - CKA Full Course 2024" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day14](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day14)
