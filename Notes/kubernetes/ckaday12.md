# Kubernetes Daemonset, Job and Cronjob

    Day 11 of 40 days of CKA challenge.

---

## What is daemonset?

In Kubernetes, a DaemonSet is a type of workload resource that ensures a copy of a specific Pod runs on all (or some) nodes in a cluster. DaemonSets are typically used for tasks that should run on every node, such as log collection, monitoring, or network management.

### Key Characteeristics of Daemonsets:

-   By default, a DaemonSet ensures that a Pod runs on all nodes in the cluster.
-   Anyone can configure a DaemonSet to run on a subset of nodes using node selectors, node affinity, or taints and tolerations.
-   When nodes are added to the cluster, the DaemonSet automatically schedules Pods on the new nodes. When nodes are removed, the DaemonSet garbage collects the Pods from those nodes.

---

# Suppose we want to deploy a log collector to all the nodes in the cluster. We can use the following command to create a daemonset:

## Creating the Daemonset:

-   Lets create a `daemon.yaml` file and save it in our fil system.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day12/12_1.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day12](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day12)

-   Now, let's go the directory where the file is located and run the below command.

<Code language="bash">kubectl apply -f daemon.yaml</Code>

-   It will create the daemonset. Lets verify if the daemonset is created and runing in every nodes in our `default` namespace.

-   Lets get all the nodes by running the below command.

<Code language="bash">kubectl get nodes</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day12/12_2.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   As we can see that we have total 3 nodes present in our `default` namespace. We should have 3 instances of of the `fluentd` daemonset running in our cluster. Lets try to check all the pods in our `default` namespace by running the below command.

<Code language="bash">kubectl get pods -n default -A</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day12/12_3.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Although we have 3 nodes running in our cluster, we can see only 2 instances of `fluentd` daemonset running in our cluster and those are `log-collector-bjtxp` and `log-collector-rbtn9`.

-   We have 3 nodes available in our cluster icluding the `control-plane`.By default, the `control-plane` nodes in a Kubernetes cluster have certain restrictions that prevent regular workloads, including DaemonSets, from being scheduled on them. These restrictions are intended to ensure that the control-plane components (e.g., API server, controller manager, etc.) have the necessary resources and are not disrupted by other workloads. This is the reason why we have 2 instances of `fluentd` instead of 3 daemonset running in our cluster.

---

## Cronjob and Jobs

### `Jobs`

A Job in Kubernetes is a resource used to create one or more pods that run a specific task and ensure completion. Once a Job completes successfully, all its associated pods terminate. Jobs are typically used for batch processing, data migration, or other tasks that need to run to completion.

### Here is a example yaml file for creating a job:

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day12/12_4.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day12](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day12)

### `CronJobs`

A CronJob is a resource used for creating Jobs on a recurring schedule, similar to cron jobs in Unix-like operating systems. CronJobs are useful for tasks that need to be run periodically, such as backups, data synchronization, or regular maintenance tasks.

## Here is a example yaml file for creating a cronjob:

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day12/12_5.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day12](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day12)

---

---

# Resources

<iframe style="max-width:100%; height:auto;" src="https://www.youtube.com/embed/kvITrySpy_k" title="Day 12/40 - Kubernetes Daemonset Explained - Daemonsets, Job and Cronjob in Kubernetes" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day12](https://github.com/RockingThor/markdown-blog/tree/main/code-resources/cka/day12)
