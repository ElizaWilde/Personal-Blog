---
title: 'first'
publishDate: 2026-01-04
draft: false
excerpt: '...'
category: ''
tags: []
metadata: {}
---

---

Create file: src/data/post/<slug>.md
Fill front matter:

---

hello,world!

---

rebuild and restart the Docker deployment:
cd D:\bloger\Personal-Blog
docker compose up -d --build

To check its status and logs:
docker compose ps
docker compose logs -f astrowind
If Docker keeps showing an old cached version:
docker compose build --no-cache
docker compose up -d

push:
git add .
git commit -m "Add post: <title>"
git push

update:
git add -A; git commit -m "Update post"; git push

---
