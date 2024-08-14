# Kubernetes Deployment, Replication Controller and ReplicaSet

    Day 8 of 40 days of CKA challenge.

---

## What is Replication Controller?

In Kubernetes, a Replication Controller is a mechanism to ensure that a specified number of pod replicas are running at any given time. If there are too many pods, the Replication Controller will terminate the extra pods. If there are too few, it will start additional pods. This ensures the desired state of the application is maintained, providing fault tolerance and scalability.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/1st.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

### Key features of Replication Controller:

-   1.Replication: Ensures a specified number of replicas are running.
-   2.Self-Healing: Automatically replaces pods that fail, get deleted, or are terminated.
-   3.Scaling: Can manually or automatically scale the number of replicas up or down.
-   4.Rolling Updates: Helps in updating the pods to new versions without downtime.

## Creating a Replica Controller with 3 replicas of nginx image

### Lets create the config yaml file for the replication controller:

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/2nd_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8](https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8)

### Lets Create the replication controller with the help of the `rc.yaml` file.

We have to go the directory where our `rc.yaml` is loacted. After that we have to run the below command to create the replication controller with the configuration mentioned on the `rc.yaml` file.

<Code language="bash">
kubectl apply -f rc.yaml
</Code>

-   Once the command is excecuted, you can check the created pods by running the below command.

<Code language="bash">
kubectl get pods
</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/3rd_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   You can see that the pods are created successfully.

-   To delete the replication controller, you can run the below command.

<Code language="bash">
kubectl delete rc/rc-nginx
</Code>
---

## What is Replicaset?

A ReplicaSet in Kubernetes is a resource that ensures a specified number of identical pod replicas are running at all times. It's similar to a Replication Controller but with more expressive pod selection capabilities using set-based label selectors. ReplicaSets are commonly used as a building block for higher-level abstractions like Deployments.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/4th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

### Key features of ReplicaSet:

-   Maintaining Desired Number of Replicas: Ensures a specified number of pod replicas are running. If there are too many, it terminates the extras. If there are too few, it creates more.
-   Label Selectors: Uses label selectors to identify the pods it manages. This allows more flexible and fine-grained selection of pods.
-   Scalability: Can scale the number of replicas up or down manually or through automation.

### Differeneces between ReplicaSet and Replication Controller:

| Feature                       | ReplicaSet                                                 | Replication Controller                                           |
| ----------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| **API Version**               | `apps/v1`                                                  | `v1`                                                             |
| **Selector Type**             | Set-based selectors                                        | Equality-based selectors                                         |
| **Selector Flexibility**      | More expressive and flexible                               | Less flexible, only equality-based                               |
| **Usage**                     | Preferred for new configurations                           | Older, retained for backward compatibility                       |
| **Management**                | Often managed by Deployments                               | Typically managed independently                                  |
| **Rolling Updates**           | Not natively supported, use Deployments                    | Not natively supported, use Deployments                          |
| **Rollbacks**                 | Not natively supported, use Deployments                    | Not natively supported, use Deployments                          |
| **Adoption of Existing Pods** | Can adopt existing pods with matching labels               | Limited capability to adopt existing pods                        |
| **Primary Use Case**          | Ensuring a specified number of pod replicas are running    | Ensuring a specified number of pod replicas are running          |
| **Configuration**             | YAML includes `apiVersion: apps/v1` and `kind: ReplicaSet` | YAML includes `apiVersion: v1` and `kind: ReplicationController` |

## Creating a ReplicaSet with 3 replicas of nginx image

### Lets create the config yaml file for the replicaset:

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/5th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8](https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8)

### Once the yaml file is created, lets create the replicaset with the help of the `rs.yaml` file.

-   We have to go the directory where our `rs.yaml` is loacted. After that we have to run the below command to create the replicaset with the configuration mentioned on the `rs.yaml` file.

<Code language="bash">kubectl apply -f rs.yaml</Code>

-   Once the command is excecuted, you can check the created pods by running the below command.

<Code language="bash">kubectl get pods</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/6th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   You can see that the pods are created successfully.

-   To delete the replicaset, you can run the below command.

<Code language="bash">kubectl delete rs/rs-nginx</Code>

---

## Update the replicas to 4 from the YAML file

-   Let's edit the `rs.yaml` file to create 4 replicas.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/7th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8](https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8)

-   We have to go to the directory where our `rs.yaml` is loacted. After that we have to run the below command to update the replicas to 4.

<Code language="bash">kubectl apply -f rs.yaml</Code>

-   Once the command is excecuted, you can check the created pods by running the below command.

<Code language="bash">kubectl get pods</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/8th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   You can see that the pods are created successfully.

---

## Update the replicas to 6 from the command line

-   We can also update the replicas to 6 from the command line. For that we have to access the live object in command line terminal by running the below command:

<Code language="bash">kubectl edit rs rs-nginx</Code>

-   Once we excecute the command it will open the live object in the terminal using the vi editor. We can update the replicas to 6 from the terminal.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/9th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Save the live object. And thats it. The number of replicas will be updated to 6 automatically.

-   You can check the number of replicas by running the below command.

<Code language="bash">kubectl get pods</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/10th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   You can see that the number of replicas is updated to 6.

---

## Deployment

In Kubernetes, a Deployment is a higher-level abstraction that manages ReplicaSets and provides declarative updates to applications. It allows you to define the desired state of your application in a YAML file, and Kubernetes ensures that the actual state matches the desired state. Deployments are used to create, update, and scale sets of pods, and they provide mechanisms for rolling updates and rollbacks.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/11th_9.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

### Key Features of Deployments:

-   Declarative Updates: Specify the desired state in a YAML file, and Kubernetes manages the changes.
-   Rolling Updates: Update your application to a new version without downtime, ensuring a smooth transition.
-   Rollbacks: Easily revert to a previous state if something goes wrong with a new deployment.
-   Scaling: Automatically scale the number of pod replicas up or down.
-   Self-healing: Automatically replace failed pods to maintain the desired state.
    History: Keep track of deployment history and revisions.

## Create a Deployment named nginx with 3 replicas. The Pods should use the `nginx:1.23.0` image and the name nginx. The Deployment uses the label tier=backend. The Pod template should use the label `app=v1`.

-   Let's cerate the config yaml file for the deployment.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/12th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8](https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8)

-   We have to go to the directory where our `deploy.yaml` is loacted. After that we have to run the below command to create the deployment.

<Code language="bash">kubectl apply -f deploy.yaml</Code>

-   Once the command is excecuted, you can check the created pods by running the below command.

<Code language="bash">kubectl get pods</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/13th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   You can see that the pods are created successfully.

## Update the image to `nginx:1.23.4`

-   We can also update the image to `nginx:1.23.4` from the command line. For that we have to access the live object in command line terminal by running the below command:

<Code language="bash">kubectl set image deployment/nginx nginx=nginx:1.23.4 --record
</Code>

-   We can verify if the changes are applied by runnig the below command.

<Code language="bash">kubectl rollout status deployment/nginx</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/14th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Also you can check the version of the image by running the below command.

<Code language="bash">kubectl get pods -l app=v1 -o jsonpath="{..image}"
</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/15th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like we have successfully updated the image to `nginx:1.23.4`.

## Have a look at the Deployment rollout history. Revert the Deployment to revision 1.Ensure that the Pods use the image `nginx:1.23.0`.

-   You can check the rollout history by running the below command.

<Code language="bash">kubectl rollout history deployment/nginx</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/16th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   We can revert the Deployment to revision 1 by running the below command.

<Code language="bash">kubectl rollout undo deployment/nginx --to-revision=1</Code>

-   We can verify if the changes are applied and the pods are using the image `nginx:1.23.0` by runnig the below command.

<Code language="bash">kubectl get pods -l app=v1 -o jsonpath="{..image}"</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/17th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Looks like we have successfully reverted the Deployment to revision 1 and the pods are using the image `nginx:1.23.0`. 🎉

## Apply the below YAML and fix the issue with it.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/18th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   API Version: The apiVersion for Deployment should be `apps/v1`.
-   Placement of replicas: The `replicas` field should be directly under `spec`, not after `template`.

-   Here is th fixed yaml file.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/19th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8](https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8)

-   Save the fixed YAML to a file named `fixed.yaml` and apply it using the following command:

<Code language="bash">kubectl apply -f fixed.yaml</Code>

## Apply the below YAML and fix the issue with it.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/20th_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   API Version: The apiVersion for Deployment should be `apps/v1`.
-   `matchLabels`: Changed to `env: demo` under selector to match the labels defined in the pod template.

-   Here is th fixed yaml file.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day8/21st_8.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

[https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8](https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8)

-   Save the fixed YAML to a file named `fixed2.yaml` and apply it using the following command:

<Code language="bash">kubectl apply -f fixed2.yaml</Code>

-   You can see that the deployment is successfully updated.

## 🎉🎉🎉

---

---

# Resources:

<iframe style="max-width:100%; height:auto;" src="https://www.youtube.com/embed/oe2zjRb51F0" title="Day 8/40 - Kubernetes Deployment, Replication Controller and ReplicaSet Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

-   [https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8](https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day8)
