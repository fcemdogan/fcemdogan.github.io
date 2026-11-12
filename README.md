# Fırat Cem Doğan — Academic Website

**Website:** https://fcemdogan.github.io/  
**Repository:** https://github.com/fcemdogan/fcemdogan.github.io

Academic name: **Asst. Prof. Dr. Fırat Cem Doğan**  
Institution: Hasan Kalyoncu University, Department of Banking and Insurance.

## Current implementation

- English-language responsive homepage with a custom interactive network animation (Canvas) and subtle optional interface sounds (off by default).
- Dedicated printable academic CV at /cv.html. Use browser Print → Save as PDF.
- DOI-linked selected publications with search/year filtering.
- HKÜ course records (14 as of 11 November 2026), with academic-year filtering.
- Links to Scopus (Author ID 59063154900), Web of Science (Researcher ID ITV-3612-2023), ORCID, YÖK Akademik, HKÜ.
- School portrait is referenced from an external HKÜ web address. **The hotlink cannot be guaranteed**; if unavailable, FCD initials appear as a fallback. Verify the picture on the live website and upload a locally saved official headshot if necessary.

## Automatic updates

GitHub Actions workflow: `.github/workflows/update-academic-data.yml`  
Updater: `scripts/update_academic_data.py`

- Daily schedule attempts to retrieve new publications using ORCID-matched authorship from OpenAlex and DOI identifiers.
- Attempts to refresh HKÜ's public teaching table and preserve existing data when a request fails.
- Live output: `data/live-publications.json`, `data/live-courses.json`.
- Initial records live in `publications.json`, `courses.json`.
- The updater **does not directly synchronize Google Scholar or Scopus**, whose direct API access is restricted. It does not query YÖK directly; HKÜ displays YÖKSİS-backed data.
- Automation does **not** guarantee real-time updates. OpenAlex may lag, HTML changes at HKÜ can break parsing, and GitHub Actions execution depends on repository permissions and workflow status.
- To run manually: GitHub → Actions → Refresh academic publications and teaching → Run workflow.
- If the workflow encounters a push-permission error, enable repository **Settings → Actions → General → Workflow permissions → Read and write permissions**, if the setting is available.

## Editing

- Design: `styles.css`
- Homepage: `index.html`
- Interactive logic: `site.js`
- CV: `cv.html`
- Source fallback data: `publications.json`, `courses.json`

**To publish:** GitHub → Settings → Pages → Build and deployment → Deploy from a branch → main / (root). No custom domain needed. https://fcemdogan.github.io/ is provided free by GitHub Pages.

## Authoritative profiles

- https://profil.hku.edu.tr/akademik/firat-cem-dogan/
- https://www.scopus.com/authid/detail.uri?authorId=59063154900
- https://www.webofscience.com/wos/author/record/ITV-3612-2023
- https://orcid.org/0000-0002-2398-1484
- https://akademik.yok.gov.tr/academician-details?authorGuidId=477B29C74BDA99ED

**Data caveat:** This site initially displays a selected list of 15 DOI-linked publications, not all the author's HKÜ records. A Google Scholar profile link should be added only once the correct profile URL is supplied.


## Visitor statistics (daily / weekly / monthly)

The homepage now shows a **PROFILE VISITORS** panel beside the faculty portrait, with
Today, This Week and This Month counters. The display uses **real analytics data only**.
Until a tracking account is connected, it displays **—** (never fabricated numbers).

GitHub Pages is a static hosting service and does not have a built-in public API
for site visitor counts. The panel supports the free privacy-friendly GoatCounter.

To activate:

1. Register a GoatCounter account at https://www.goatcounter.com/ and add the website
   `https://fcemdogan.github.io/`.
2. In GoatCounter site settings enable **"Allow adding visitor counts on your website"**
   (the public counter setting is disabled by default).
3. Edit `analytics-config.json` in this GitHub repository:
   set `"siteCode"` to your real GoatCounter subdomain code, e.g. if the tracking
   URL is `https://YOURCODE.goatcounter.com/count`, set it to `"YOURCODE"`.
   Change `"enabled": false` to `"enabled": true`.
4. Commit the change. The page will load GoatCounter's lightweight tracking script
   and populate the three counters with real data, once available.

Counter windows use **Europe/Istanbul** calendar dates: today, this calendar week
(Monday onward), and this calendar month. The display measures the provider's
**visit counts**, not guaranteed unique individuals. GoatCounter counters can be
cached for up to four hours; past visits are not reconstructed automatically.
Never put private API tokens in the public repository.

## Writing and publishing Blogs

The homepage has a **Blogs** preview section and the dedicated address
https://fcemdogan.github.io/blogs.html.

The file `blogs.json` starts with an empty `"posts"` array. It is intentionally
empty until the author's first real blog article is ready. Posts are published
automatically on the homepage and on `blogs.html` once added.

Example structure for a future article (example only, **not published**):

```json
{
  "updated": "2026-11-11",
  "posts": [
    {
      "slug": "economic-policy-reflections",
      "date": "2026-11-11",
      "category": "ECONOMIC POLICY",
      "title": "Your real blog post title here",
      "excerpt": "A short summary of your original article.",
      "content": [
        {"type": "paragraph", "text": "Your introduction paragraph."},
        {"type": "heading", "text": "A section heading"},
        {"type": "paragraph", "text": "Another paragraph."},
        {"type": "quote", "text": "An optional quotation from your own writing."}
      ]
    }
  ]
}
```

To publish, replace the example text with the actual post in `blogs.json`
and commit the file. All text is rendered safely rather than interpreted as HTML.
Each blog post has its own shareable link:
`https://fcemdogan.github.io/blogs.html?post=your-post-slug`.
Multiple posts can be placed in the `posts` array, newest first by date.
