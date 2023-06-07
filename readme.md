- Go to auth directory and create the dockerfile, and build it
- create auth depl yaml file for kubernetes deployments and pods
- run the skaffold yaml
- for local add domain name use (code /etc/hosts)
- write (thisisunsafe) when browser says it is untrusted

- creating a secret in kubernetes

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

- to get the secrets

```bash
kubectl get secrets
```
