# Fix GitHub Pages DNS for `alkraj.com`

GitHub Pages is showing a 404 for `alkraj.com` because the Pages custom domain and the public DNS records must agree on the root/apex domain.

The website code and `CNAME` file in this repository are already configured for:

```text
alkraj.com
```

The remaining fix is in the domain DNS control panel shown in your screenshot: **OpenSRS → Name Servers/DNS → Modify DNS Zone**.

## 1. Confirm the active DNS provider

In OpenSRS, DNS records in **Modify DNS Zone** only work when the domain's name servers are set to OpenSRS SystemDNS:

```text
ns1.systemdns.com
ns2.systemdns.com
ns3.systemdns.com
```

If the domain uses different name servers, update the same records at that external DNS provider instead. Do not edit records in multiple places; only the authoritative DNS provider matters.

## 2. Records to create in OpenSRS DNS Zone

Remove any existing website, parking, forwarding, Zoho Sites, or default host records for `www` or the root/apex domain before adding these records. Keep mail records such as MX, SPF, DKIM, and DMARC unchanged.

| Type | Host/Name | Value/Points to | Purpose |
| --- | --- | --- | --- |
| CNAME | `www` | `tarunxt.github.io` | Redirects `www.alkraj.com` to this GitHub Pages account |
| A | `@` or blank root host | `185.199.108.153` | Sends `alkraj.com` to GitHub Pages |
| A | `@` or blank root host | `185.199.109.153` | Sends `alkraj.com` to GitHub Pages |
| A | `@` or blank root host | `185.199.110.153` | Sends `alkraj.com` to GitHub Pages |
| A | `@` or blank root host | `185.199.111.153` | Sends `alkraj.com` to GitHub Pages |
| AAAA | `@` or blank root host | `2606:50c0:8000::153` | Optional IPv6 support for `alkraj.com` |
| AAAA | `@` or blank root host | `2606:50c0:8001::153` | Optional IPv6 support for `alkraj.com` |
| AAAA | `@` or blank root host | `2606:50c0:8002::153` | Optional IPv6 support for `alkraj.com` |
| AAAA | `@` or blank root host | `2606:50c0:8003::153` | Optional IPv6 support for `alkraj.com` |

Important:

- `www` must be a **CNAME** to `tarunxt.github.io`, not an A record, not `alkraj.com`, and not a GitHub repository URL.
- The root/apex host is usually entered as `@`, blank, or `alkraj.com` depending on the DNS form.
- Do not create more than one `www` record. A second `www` A, CNAME, forwarding, or parking record can keep GitHub's check failing.

## 3. GitHub Pages settings

1. Open the repository that actually deploys this site on GitHub.
2. Go to **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Set **Custom domain** to:

```text
alkraj.com
```

5. Wait for the Pages workflow to deploy.
6. Click **Check again** after DNS has propagated.
7. Enable **Enforce HTTPS** only after GitHub finishes validating DNS and issuing the certificate.

If GitHub Pages is configured in a different repository from the one containing this website, move the Pages configuration and custom domain to the website repository or deploy this repository from the repository currently selected in GitHub Pages.

## 4. Verify after DNS propagation

Run these checks after saving DNS changes:

```bash
dig alkraj.com A +short
dig www.alkraj.com CNAME +short
dig alkraj.com AAAA +short
curl -I https://alkraj.com
```

Expected results:

- `alkraj.com` resolves to the four GitHub Pages A records listed above.
- `www.alkraj.com` resolves to `tarunxt.github.io`.
- If IPv6 records were added, `alkraj.com` resolves to the four GitHub Pages AAAA records listed above.
- `curl -I https://alkraj.com` returns a GitHub Pages response instead of a parking or default hosting page.

DNS and HTTPS certificate updates can take minutes to a few hours. If the old page still appears immediately after changing records, clear the browser cache or test in an incognito window.
