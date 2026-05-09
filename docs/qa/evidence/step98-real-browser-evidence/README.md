# Step 98 browser evidence folder

This folder is reserved for manual browser evidence after local or Netlify review.

Do not add screenshots automatically. Add them only when a reviewer intentionally captures browser evidence.

## Recommended capture order

```txt
01-public-home.png
02-public-platform.png
03-public-registry.png
04-public-registry-detail.png
05-public-gallery.png
06-public-knowledge.png
07-public-faq.png
08-public-community.png
09-public-partners.png
10-access.png
11-verify.png
12-member-center.png
13-member-profile.png
14-member-my-dogs.png
15-member-new-dog.png
16-admin-review.png
17-admin-registry.png
18-admin-ecosystem.png
19-admin-partners.png
20-admin-knowledge.png
21-runtime-db-health.txt
```

## Privacy rules

Before committing or sharing evidence, verify that screenshots do not expose:

- database URLs;
- API keys;
- auth/session cookies;
- private owner contact data;
- private admin-only personal data;
- Neon credentials;
- Netlify secrets.

`21-runtime-db-health.txt` should include only safe JSON proof such as `activeDatabase`, `activeSchema`, `environment`, `status`, and timestamp. It must never include a raw connection string.
