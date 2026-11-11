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
- Links to Scopus (Author ID 59063154900), ORCID, YÖK Akademik, HKÜ.
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
- https://orcid.org/0000-0002-2398-1484
- https://akademik.yok.gov.tr/academician-details?authorGuidId=477B29C74BDA99ED

**Data caveat:** This site initially displays a selected list of 15 DOI-linked publications, not all the author's HKÜ records. A Google Scholar profile link should be added only once the correct profile URL is supplied.
