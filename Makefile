.PHONY: all art build dev screenshots smoke-test push clean

# Default: generate art + build
all: art build

# Generate pre-rendered background PNGs (procedural)
art:
	node scripts/generate-backgrounds.js

# Generate AI art backgrounds (Pollinations.ai, free, no API key)
ai-art:
	node scripts/generate-ai-art.js

# Build for production
build:
	npx vite build

# Generate i18n from content source files
generate:
	npm run generate

# Start local dev server
dev:
	npx vite --port 4444 --host

# Smoke test: launch game at DPR=3, check for JS errors + black screen.
# Self-contained: starts vite on port 4444 if not already running, then stops it.
# Always the same command → "always allow" in Claude Code works stably.
smoke-test:
	node scripts/run-smoke.js

# Generate screenshots (requires dev server running: make dev)
screenshots:
	rm -rf screenshots/
	node scripts/screenshots.js

# Extract i18n strings from dialogues
i18n:
	node scripts/extract-i18n.js

# Generate stub translation files
i18n-stubs:
	node scripts/generate-i18n-stubs.js

# Build and push to GitHub
push: all
	git add -A
	git status --short
	@echo "Ready to push. Run: git commit -m 'your message' && git push origin main"

# Clean generated files
clean:
	rm -rf dist/ screenshots/
