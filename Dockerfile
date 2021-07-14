FROM node:latest
RUN mkdir -p /home/app/build/
RUN npm i -g serve
COPY build/ /home/app/build/
EXPOSE 5001
CMD serve -l 5001 -s /home/app/build/

