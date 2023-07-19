- Go to auth directory and create the dockerfile, and build it

```bash
docker build -t sayinmehmet47/auth .
```

- push it to docker hub

```bash
docker push sayinmehmet47/auth
```

- create auth depl yaml file for kubernetes deployments and pods
- run the skaffold yaml
- for local add domain name use (code /etc/hosts)
- add

```code
127.0.0.1 ticketing.dev

```

- write (thisisunsafe) when browser says it is untrusted

- creating a secret in kubernetes

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_tes
```

- to get the secrets

```bash
kubectl get secrets
```

- to run client on kubernetes this steps has ben done
  --- create a dockerfile

```bash
cd client
docker build -t sayinmehmet47/client .
docker push sayinmehmet47/client

```

- publish npm package

```code
  npm run pub
  npm publish --access public
```

- increment version

```code
  npm version patch
```

- port forwarding(forward the nat port to local port)

```code
  kubectl port-forward <pod-name> 4222:4222
```

- to open the kubernetes cluster to outside world install the ingress service, before start the skaffold dev

```code

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```

- to see mongodb in outside world

```code
  kubectl port-forward <pod-name> 27017:27017
```

- remove kubectl caches

```code
  rm -rf ~/.kube/cache
```

- fix ingress issues

```code
kubectl delete namespace ingress-nginx

kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission


kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml



```

- fake token for stripe

```code
  tok_visa
```

- son notlar
  in the last lecture we created the order service and its tests. Now we need to emit some event using task in next lecture
