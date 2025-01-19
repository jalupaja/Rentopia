# Rentopia

## development

### docker
update docker images (This will copy the current database. This should be disabled for actual use):
`docker build -t obviousboxer/rentopia .`

run docker images:
`docker run -p 8080:8080 -p 3000:3000 obviousboxer/rentopia`

