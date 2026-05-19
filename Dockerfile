FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

# Limpa conteúdo padrão do nginx e copia o jogo
RUN rm -rf /usr/share/nginx/html/*
COPY . /usr/share/nginx/html

EXPOSE 80
