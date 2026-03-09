FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_GATEWAY_URL
ARG VITE_HA_URL
ARG VITE_HA_TOKEN
ENV VITE_GATEWAY_URL=$VITE_GATEWAY_URL
ENV VITE_HA_URL=$VITE_HA_URL
ENV VITE_HA_TOKEN=$VITE_HA_TOKEN

RUN npm run build

# --- Production stage ---
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

# PWA SPA 라우팅: 404 → index.html
RUN printf 'server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
