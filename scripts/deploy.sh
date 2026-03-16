#!/bin/bash
set -e
cd /home/ubuntu/nocableapp

# Load ECR env vars written by CodeBuild
set -a
source ecr_env
set +a

# Authenticate and pull
aws ecr get-login-password --region $AWS_DEFAULT_REGION \
  | docker login --username AWS --password-stdin $ECR_REGISTRY

docker pull $ECR_REGISTRY/nocableapp:latest

# Restart container with new image, keep the volume
docker-compose up --force-recreate --no-build -d

# Clean up old images
docker image prune -f
