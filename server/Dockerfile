FROM node:22-alpine

# Patch OS packages (fixes CRITICAL OpenSSL CVEs flagged by Choreo's Trivy scan).
RUN apk upgrade --no-cache

WORKDIR /app

# Install production dependencies (package-lock.json is committed)
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Bind to the port declared in .choreo/component.yaml (server.js reads process.env.PORT).
ENV PORT=5001

# Choreo requires containers to run as a non-root user with a UID in [10000, 20000].
RUN addgroup -g 10014 -S choreo && adduser -u 10014 -S choreo -G choreo
USER 10014

EXPOSE 5001

CMD ["npm", "start"]
