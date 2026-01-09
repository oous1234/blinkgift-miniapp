FROM node:18

WORKDIR /app

COPY package.json package-lock.json* /app/

RUN npm install

# --- ДОБАВИТЬ ЭТУ СТРОКУ ---
COPY . .
# ---------------------------

RUN chown -R node:node .
USER node

CMD npm run dev
