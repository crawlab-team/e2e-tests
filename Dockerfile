# Use the official Playwright image
FROM mcr.microsoft.com/playwright:v1.42.1-jammy

# Set the working directory in the container
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy pnpm-lock.yaml (if available)
COPY pnpm-lock.yaml ./

# Install project dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Set the command to run Playwright tests
CMD ["pnpm", "exec", "playwright", "test"]