# Alkraj Real Estate Website

A basic static real estate website for `alkraj.com`. It can be hosted from GitHub Pages and connected to the domain that is currently managed in Zoho.

## What is included

- Responsive landing page with hero, featured property, sample listings, services, setup guidance, and enquiry form.
- Mobile navigation menu.
- Clear guidance that OpenSRS or the authoritative DNS provider can manage DNS, Zoho can continue handling email, and GitHub Pages can host the static site.

## Hosting recommendation

For this starter website, AWS is not required. Use this setup instead:

1. Push this repository to GitHub.
2. Enable GitHub Pages for the repository.
3. In OpenSRS or the authoritative DNS provider, point the root domain `alkraj.com` to GitHub Pages with the four `185.199.*.153` A records, point `www` to `tarunxt.github.io`, and remove conflicting website, forwarding, or parking records.
4. Keep existing Zoho MX records unchanged so Zoho Mail continues working.

AWS is only needed later if the website grows into a dynamic application that needs backend APIs, databases, file storage, authentication, or other cloud infrastructure.

## Local preview

Open `index.html` directly in a browser, or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Domain not opening

If GitHub Pages shows `DNS check unsuccessful` or `https://alkraj.com` opens a parking/default page, follow `DNS_FIX.md`. The required website records are root `A` records to GitHub Pages and `www` → `tarunxt.github.io`; keep Zoho Mail records unchanged.
