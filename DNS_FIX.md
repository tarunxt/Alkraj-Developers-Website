# Fix `www.alkraj.com` showing the Zoho welcome page

The website code is ready in this repository. If `https://www.alkraj.com` still opens the Zoho welcome page, the domain is still pointing to Zoho's default website/parking service instead of GitHub Pages.

## Exact Zoho DNS records to use

In Zoho DNS, change only the website records below. Keep all Zoho Mail records unchanged.

| Type | Host/Name | Value/Points to | TTL | Action |
| --- | --- | --- | --- | --- |
| CNAME | `www` | `tarunxt.github.io` | Auto/default | Add or replace |
| A | `@` | `185.199.108.153` | Auto/default | Add or replace |
| A | `@` | `185.199.109.153` | Auto/default | Add or replace |
| A | `@` | `185.199.110.153` | Auto/default | Add or replace |
| A | `@` | `185.199.111.153` | Auto/default | Add or replace |

Remove any conflicting Zoho Website, Zoho Sites, forwarding, parking, or default host records for `www` or `@`. Do not remove MX, SPF, DKIM, DMARC, or other mail-related records.

## GitHub Pages settings

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Confirm the custom domain is `www.alkraj.com`.
5. Wait for the deployment workflow to finish.
6. Enable **Enforce HTTPS** after GitHub finishes issuing the certificate.

This repository includes a GitHub Actions workflow that publishes the static site automatically after pushes to `main` or `work`.

## Verify after DNS propagation

Run these checks after saving DNS changes:

```bash
dig www.alkraj.com CNAME +short
dig alkraj.com A +short
curl -I https://www.alkraj.com
```

Expected results:

- `www.alkraj.com` should resolve to `tarunxt.github.io`.
- `alkraj.com` should resolve to the four GitHub Pages IP addresses listed above.
- `curl -I https://www.alkraj.com` should return a GitHub Pages response instead of the Zoho welcome page.

DNS and HTTPS certificate updates can take minutes to a few hours. If the Zoho page still appears immediately after changing records, clear the browser cache or test in an incognito window.
