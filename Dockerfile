FROM node
ADD . /code
WORKDIR /code
CMD node --use_strict /code/src/entrypoint
