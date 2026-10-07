FROM dockerhub.camara.leg.br/dockerhub/library/node:22 AS build

# Adiciona certificado raiz da Câmara dos Deputados
RUN cd /usr/local/share/ca-certificates && \
	curl -LOs https://www.camara.leg.br/ac-raiz.crt && \
	update-ca-certificates

# Create app directory
WORKDIR /usr/src/app

# Limpar pastas antes do build
RUN rm -rf /usr/src/alcance-vue/utils /usr/src/alcance-react/utils

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY /packages/alcance/ ./
#COPY package*.json ./

RUN npm config set registry https://hub.camara.gov.br/repository/npm-camara/
RUN npm install --location=global yarn --force
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN yarn install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
RUN ls

RUN yarn build storybook
RUN yarn build-storybook

FROM dockerhub.camara.leg.br/dockerhub/library/ubuntu:22.04

ARG UBUNTU_MIRROR=http://mirror.camara.gov.br/ubuntu/
RUN sed -i "s|deb http://.*/ubuntu/|deb $UBUNTU_MIRROR|g" /etc/apt/sources.list

### Dependencias e Pacotes S.O. ###

ENV DEBIAN_FRONTEND=noninteractive

# Instala dependências de S.O. e adiciona certificado raiz da Câmara dos Deputados
RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates curl rsync \
	&& mkdir -p /usr/local/share/ca-certificates \
	&& cd /usr/local/share/ca-certificates \
	&& curl -LOs https://www.camara.leg.br/ac-raiz.crt \
	&& update-ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/src/assets /usr/src/app/storybook-static/assets
COPY --from=build /usr/src/app/storybook-static /usr/src/app/storybook-static
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

CMD ["/usr/src/app/entrypoint.sh"]
