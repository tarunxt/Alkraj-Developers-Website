# Alkraj Real Estate Website

A basic static real estate website for `www.alkraj.com`. It can be hosted from GitHub Pages and connected to the domain that is currently managed in Zoho.

## What is included

- Responsive landing page with hero, featured property, sample listings, services, setup guidance, and enquiry form.
- Mobile navigation menu.
- Clear guidance that Zoho can continue to manage DNS and email while GitHub Pages hosts the static site.

## Hosting recommendation

For this starter website, AWS is not required. Use this setup instead:

1. Push this repository to GitHub.
2. Enable GitHub Pages for the repository from **Settings → Pages**.
3. Set the GitHub Pages custom domain to `www.alkraj.com`; the repository includes a `CNAME` file for this.
4. In Zoho DNS, point the `www` CNAME record to your GitHub Pages default domain, such as `<your-github-user-or-org>.github.io`.
5. Keep existing Zoho MX records unchanged so Zoho Mail continues working.

If `www.alkraj.com` still shows a Zoho welcome page, the site files are not the problem; the domain is still pointed at Zoho parking/default website records. Follow `DEPLOYMENT.md` to connect Zoho DNS to GitHub Pages.

AWS is only needed later if the website grows into a dynamic application that needs backend APIs, databases, file storage, authentication, or other cloud infrastructure.

## Local preview

Open `index.html` directly in a browser, or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
