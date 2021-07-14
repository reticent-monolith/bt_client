#! /bin/bash

npm run build
docker build -t reticentmonolith/bigtop .
docker push reticentmonolith/bigtop

