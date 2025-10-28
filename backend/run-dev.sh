#!/bin/bash
set -a
source ../db/.env
set +a
./mvnw spring-boot:run
