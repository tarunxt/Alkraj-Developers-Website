# Deployment checklist for www.alkraj.com

The website files are ready in this repository, but the public domain will continue showing Zoho's default page until GitHub Pages and Zoho DNS are connected.

## 1. Publish from GitHub Pages

1. Push this repository to GitHub.
2. Open the repository in GitHub.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` or your default branch
   - **Folder:** `/ (root)`
5. Under **Custom domain**, enter:

```text
www.alkraj.com
```

6. Save and wait for GitHub Pages to finish publishing.

The `CNAME` file in this repository already tells GitHub Pages that the site should answer for `www.alkraj.com`.

## 2. Update DNS in Zoho

In Zoho's DNS manager for `alkraj.com`, update website records only. Do **not** remove Zoho Mail MX records.

| Type | Host/Name | Value/Points to | Purpose |
| --- | --- | --- | --- |
| CNAME | `www` | `<your-github-user-or-org>.github.io` | Sends `www.alkraj.com` to GitHub Pages |
| A | `@` | `185.199.108.153` | Optional root domain support for `alkraj.com` |
| A | `@` | `185.199.109.153` | Optional root domain support for `alkraj.com` |
| A | `@` | `185.199.110.153` | Optional root domain support for `alkraj.com` |
| A | `@` | `185.199.111.153` | Optional root domain support for `alkraj.com` |

Important notes:

- Replace `<your-github-user-or-org>` with the GitHub account or organization that owns the repository.
- The `www` CNAME should point to `<your-github-user-or-org>.github.io`, not to `alkraj.com` and not to the repository URL.
- Remove any Zoho default website/parking records for `www` or `@` if they conflict with the records above.
- Keep MX, SPF, DKIM, and DMARC records for Zoho Mail unchanged.

## 3. Enable HTTPS

After DNS is correct, return to **GitHub → Settings → Pages** and enable **Enforce HTTPS**. GitHub may need time to issue the certificate, so the option can take a while to become available.

## 4. Do you need AWS?

No, not for this starter site. The recommended setup is:

- **GitHub Pages** for free static website hosting.
- **Zoho DNS** for domain records.
- **Zoho Mail** for email.

Use AWS later only if you add backend features such as login, databases, APIs, file uploads, search infrastructure, or server-side booking workflows.

## 5. How to verify

After DNS has propagated, check:

```bash
curl -I https://www.alkraj.com
```

A working setup should return a GitHub Pages response for the Alkraj website instead of the Zoho welcome/parking page.
