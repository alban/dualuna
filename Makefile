.PHONY: all art build dev screenshots push clean

# Default: generate art + build
all: art build

# Generate pre-rendered background PNGs
art:
	node scripts/generate-backgrounds.js

# Build for production
build:
	npx vite build

# Start local dev server
dev:
	npx vite --port 4444 --host

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
