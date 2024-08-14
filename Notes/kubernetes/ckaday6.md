# Installing Kubernetes & Creating a Cluster

    Day 6 of 40 days of CKA challenge.

---

## Installing Kubernetes To My Local Machine

Download and install kind in your local machine using the following commands:

<Code language="bash">
brew install kind
</Code>

---

## Creating a Single Node Cluster

We can create a single node cluster using the following command:

<Code language="bash">
kind create cluster --name cka-cluster1 --image kindest/node:v1.29.0
</Code>

The above comand will create a single node cluster named `cka-cluster1` using the `kindest/node:v1.29.0` image. If you don't provide the image name, the default latest image will be used.

After successful excecution of the above command, you will se the below output in your terminal.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day6/kind-single-node.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

You can now check all the available nodes in your local machine by running the below command:

<Code language="bash">
kubectl get nodes
</Code>

You can see that you have a single node named `cka-cluster1-control-pane` in your local machine. You won't see any worker nodes in your local machine because you have only created a single node cluster.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day6/kubectl-get-nodes.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

---

## Creating Multi Node Cluster

To create a cluster with multiple nodes, you have to create a `kind-config.yaml` file int the same directory where you running your command. The `kind-config.yaml` file contains the configuration for the cluster you want to create. here is the process to create the `kind-config.yaml` file:

<Code language="bash">
sudo vi kind-config.yaml
</Code>

Paste the below content in the `kind-config.yaml` file and save it.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day6/kind-congig-yaml.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

Or get the yaml file here: [Yaml file code](https://raw.githubusercontent.com/kubernetes-sigs/kind/main/site/content/docs/user/kind-example-config.yaml)

Once you have created the `kind-config.yaml` file, you can create the cluster using the following command:

<Code language="bash">
kind create cluster --config kind-config.yaml --image kindest/node:v1.29.0
</Code>

This command will create a multi-node cluster named `cka-cluster2` using the `kindest/node:v1.29.0` image. If you don't provide the image name, the default latest image will be used. The below image shows the output of the above command.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day6/kind-multiple-nodes.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

You can now check all the available nodes in your local machine by running the below command:

<Code language="bash">
kubectl get nodes
</Code>

You can see that you have 4 nodes named `cka-cluster2-control-pane` and `cka-cluster2-worker` , `cka-cluster2-worker-2` and `cka-cluster2-worker-3` in your local machine.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day6/kubectl-cluster2.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

Alternatively you can view the all the nodes in your local machine by running the below docker command:

<Code language="bash">
docker ps
</Code>

These nodes are nothing but containers as `KIND` means `Kubernetes IN Docker`, which creates containers and uses them as nodes.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day6/docker-ps.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

---

## Context in Kubectl

In kubectl, a context is a grouping of access parameters under a name. Contexts allow you to switch between different clusters and user configurations quickly and easily without having to specify all the details each time you run a command. A context in kubectl typically includes:

-   `Cluster`: The cluster that you want to connect to.
-   `User`: The user credentials to use when accessing the cluster.
-   `Namespace`: The default namespace that kubectl commands will operate in if not specified otherwise.
-   These parameters are stored in the kubeconfig file, which is usually located at ~/.kube/config.

### Managing Contexts in Kubectl

-   ### Viewing Contexts

To view the contexts in your kubeconfig file, use the below command:

<Code language="bash">
kubectl config get-contexts
</Code>

-   ### Viewing the Current Context

To view the current context:

<Code language="bash">
kubectl config current-context
</Code>

-   ### Setting Current Context

To set the current context to a specific context:

<Code language="bash">
kubectl config use-context CONTEXT_NAME
</Code>

For example, if you have created a multi-node kind cluster named cka-cluster2, you would set the context like this:

<Code language="bash">
kubectl config use-context cka-cluster2
</Code>

---

## Deleting a Cluster

To delete Kubernetes clusters created using kind, you can use the kind delete cluster command. Here are the steps to delete both the single-node and multi-node clusters:

<Code language="bash">
kind delete cluster --name kind-cka-cluster1
kind delete cluster --name kind-cka-cluster2
</Code>

---

---

## Resources

<iframe style="max-width:100%; height:auto;" src="https://www.youtube.com/embed/RORhczcOrWs" title="Day 6/40 - Kubernetes Multi Node Cluster Setup Step By Step | Kind Tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
