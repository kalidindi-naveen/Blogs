# Pods in Kubernetes & YAML

    Day 7 of 40 days of CKA challenge.

---

## Ways of Creating Pods in Kubernetes Using Kubectl

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day7/first.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

### 1. Imperative Creation:

-   To create a pod with the nginx image using an imperative command, you can run:

<Code language="bash">
kubectl run nginx --image=nginx
</Code>

-   This command creates a pod named `nginx` using the `nginx` image.
-   You can chect the created pods using the below command:

<Code language="bash">
kubectl get pods
</Code>
<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day7/2nd.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

### 2. Declarative Creation:

-   To create a pod with the nginx image using a declarative command, you have to have a congig file either in YAML or in JSON. Here is the config file:

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day7/3rd.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

Get the code here: [Config file code](https://github.com/RockingThor/markdown-blog/blob/main/src/CKA-CODE/day7/nginx-pod.yaml)

-   To generate a new pod using the config file, save the config file first as `ngnix-pod.yaml` (You can use any name) and run the below command in the same directory.

<Code language="bash">
kubectl apply -f nginx-pod.yaml
</Code>

-   You can chect the created pods using the below command:

<Code language="bash">
kubectl get pods
</Code>

-   Alternatively you can generate the `nginx-pod.yaml` file using the `kubectl` command and save it as `ngnix-pod.yaml` (You can use any name). Here is an example command for it:

<Code language="bash">
kubectl get pod nginx -o yaml > nginx-pod.yaml
</Code>

-   The above command will fetch the pod named `nginx` which was created using imerative command. It will save the config file of that pods as `ngnix-pod.yaml` in the same directory. You can make any changes to the file and create a new pod with new configuration.

---

## Exercise:

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day7/4th.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

### Step 1: Create the config yaml file:

-   Creating a config file for the pod named `redis` and saving it as `redis-config.yaml`
-   Once we are done with creating the yaml file, let's try to create the pod by running the below command in the sam directory where we saved our `redis-config.yaml` file.

<Code language="bash">
kubectl apply -f redis-config.yaml
</Code>

-   After excecuting the above command let's see our all available pods by excecuting the below command:

<Code language="bash">
kubectl get pods
</Code>

-   You will see that the pod named `redis` is created successfully.

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day7/5th.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Oops!! The pod is created but it's showing the status as `ImagePullBackOff` and the `Ready` column is showing as `0/1`.

### Setep 2: Fix the error in the pod:

-   We got to know that our pod has run into some error. Let's try to debug it by looking at the events of the pod. We can check the events by excecuting the below command:

<Code language="bash">
kubectl describe pod redis
</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day7/6th.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   By looking at the events, we can conclude taht there is some issue with the `rediss` image. `Kubelet` is not able to pull the `rediss` image. Ah!! Looks like we made a spelling mistake while mentionong the image name. It should be `redis` instead of `rediss`.

-   Lets change the image name in the config file and save it as `redis-config.yaml`.

-   Once we edited the name of the image we can run the below command to recreate the pod:

<Code language="bash">
kubectl apply -f redis-config.yaml
</Code>

-   You can see that the pod is recreated successfully by excecuting the below command:

<Code language="bash">
kubectl get pods
</Code>

<img src="https://d2lff49aaqvgse.cloudfront.net/cka-images/day7/7th.png" alt="Docker vs VM" style="max-width:100%; height:auto;">

-   Congrats!! 🎉 You have fixed the issue in the pod.

---

## Run the pod in interactive mode:

Running a pod in interactive mode means launching a pod and getting a shell into one of its containers immediately. This is useful for debugging or for running commands inside the container directly. Here is the command by which you can do it:

<Code language="bash">
kubectl run nginx --image=nginx -i -t -- /bin/sh
</Code>

-   `kubectl` run `nginx`: Creates a new pod named nginx.
-   `--image=nginx`: Specifies the container image to use, which is `nginx`.
-   `-i`: Stands for "interactive", which keeps stdin open.
-   `-t`: Allocates a `pseudo-TTY`, allowing you to interact with the shell.
-   `-- /bin/sh`: Specifies the command to run inside the container, in this case, `/bin/sh` to get a shell.

---

---

## Resources:

<iframe style="max-width:100%; height:auto;" src="https://www.youtube.com/embed/_f9ql2Y5Xcc" title="Day 7/40 -  Pod In Kubernetes Explained | Imperative VS Declarative Way | YAML Tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Github Repo: [https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day7](https://github.com/RockingThor/markdown-blog/tree/main/src/CKA-CODE/day7)
