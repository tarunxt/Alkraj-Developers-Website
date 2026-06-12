# Deployment checklist for `www.alkraj.com`

This repository is ready to deploy as a static GitHub Pages site for `www.alkraj.com`. If GitHub shows `DNS check unsuccessful`, the issue is almost always that the live DNS records for the domain still point somewhere else or are being edited at the wrong DNS provider.

## 1. Publish from GitHub Pages

1. Push this repository to GitHub.
2. Open the repository that should host the Alkraj website.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Source: GitHub Actions**. The included workflow deploys this static site automatically after pushes to `main` or `work`.
5. Under **Custom domain**, enter:

```text
www.alkraj.com
```

6. Save and wait for GitHub Pages to finish publishing.

The `CNAME` file in this repository already tells GitHub Pages that the site should answer for `www.alkraj.com`.

## 2. Update DNS in OpenSRS or the authoritative DNS provider

Your screenshot shows OpenSRS. OpenSRS DNS zone records only apply if the domain uses these name servers:

```text
ns1.systemdns.com
ns2.systemdns.com
ns3.systemdns.com
```

If the domain uses another provider's name servers, make the same DNS changes there instead.

Update website records only. Do **not** remove Zoho Mail or other email records.

| Type | Host/Name | Value/Points to | Purpose |
| --- | --- | --- | --- |
| CNAME | `www` | `tarunxt.github.io` | Sends `www.alkraj.com` to GitHub Pages |
| A | `@` or blank root host | `185.199.108.153` | Sends `alkraj.com` to GitHub Pages |
| A | `@` or blank root host | `185.199.109.153` | Sends `alkraj.com` to GitHub Pages |
| A | `@` or blank root host | `185.199.110.153` | Sends `alkraj.com` to GitHub Pages |
| A | `@` or blank root host | `185.199.111.153` | Sends `alkraj.com` to GitHub Pages |
| AAAA | `@` or blank root host | `2606:50c0:8000::153` | Optional IPv6 support |
| AAAA | `@` or blank root host | `2606:50c0:8001::153` | Optional IPv6 support |
| AAAA | `@` or blank root host | `2606:50c0:8002::153` | Optional IPv6 support |
| AAAA | `@` or blank root host | `2606:50c0:8003::153` | Optional IPv6 support |

Important notes:

- The `www` host should point to `tarunxt.github.io`, not to `alkraj.com`, not to a GitHub repository URL, and not to any website parking target.
- Remove any website, forwarding, parking, or default records for `www` or `@` if they conflict with the records above.
- Keep MX, SPF, DKIM, and DMARC records unchanged so email continues working.

## 3. Enable HTTPS

After DNS is correct, return to **GitHub → Settings → Pages** and click **Check again**. Enable **Enforce HTTPS** after GitHub validates the domain and issues the certificate. The HTTPS option can remain unavailable until DNS is correct.

## 4. Do you need AWS?

No, not for this starter site. The recommended setup is:

- **GitHub Pages** for free static website hosting.
- **OpenSRS or the active DNS provider** for domain records.
- **Zoho Mail** for email, if email is already hosted there.

Use AWS later only if you add backend features such as login, databases, APIs, file uploads, search infrastructure, or server-side booking workflows.

## 5. How to verify

After DNS has propagated, check:

```bash
dig www.alkraj.com CNAME +short
dig alkraj.com A +short
curl -I https://www.alkraj.com
```

A working setup returns `tarunxt.github.io` for `www.alkraj.com` and a GitHub Pages response for `https://www.alkraj.com` instead of a parking, forwarding, or default hosting page.
