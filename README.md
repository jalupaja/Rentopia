# Rentopia

## development

### docker
update docker images (This will copy the current database. This should be disabled for actual use):
`docker compose build`

run docker images:
`docker compose up`

export docker image:
`docker save -o rentopia.tar rentopia-backend rentopia-frontend`

import docker image:
`docker load -i rentopia.tar`
