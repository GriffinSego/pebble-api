run-dev:
	bun run index.ts

run-prod:
	bun --smol run index.ts

deploy:
	git add .
	git commit -m "Automatic deployment"
	git push

.PHONY: dev prod deploy