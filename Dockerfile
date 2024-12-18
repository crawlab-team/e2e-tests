# Use the official Playwright image with the latest version
FROM mcr.microsoft.com/playwright:v1.48.1-jammy

# Set the working directory in the container
WORKDIR /app

# Set environment variables
ENV CI=true

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install project dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Set the command to run tests
# Use TEST_SCRIPT to specify which test script to run (e.g., test:normal, test:extended, test:full)
CMD pnpm run ${TEST_SCRIPT:-test:normal}
