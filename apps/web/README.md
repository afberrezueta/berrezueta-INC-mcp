# deltalyn.com

The Deltalyn landing page and waitlist. English first, for the US launch; Spanish comes in Phase 3 (see `docs/PLAN_APP_WEB.md`).

A single static file, `index.html`, with no build step.

## Preview locally

Open `index.html` in a browser, or run:

```bash
npx serve apps/web
```

## Connect the waitlist

Sign-ups are off until you set `WAITLIST_ENDPOINT` near the top of the `<script>` in `index.html`. While it is empty, the form says it is in preview mode and sends nothing.

The form sends a JSON `POST` with these fields:

| Field | Type | What it holds |
|---|---|---|
| `email` | string | Sign-up address |
| `os` | string | `windows`, `mac` or `both` |
| `markets` | string[] | Any of `futures`, `stocks`, `options`, `forex`, `crypto` |
| `prop` | string | `now`, `planning` or `no` |
| `founder` | boolean | Interested in a founding-member license |
| `lang` | string | The browser's language |

Any form service that accepts JSON works:

- **Formspree.** Create a form and use its URL, for example `https://formspree.io/f/abcd1234`.
- **Loops.** Use a form endpoint.
- **Your own function.** For example a Vercel function that writes to Supabase.

## Deploy on Vercel

1. In Vercel, create a new project from this repository.
2. Set **Root Directory** to `apps/web`. Leave the framework preset as **Other** and the build command empty.
3. Under Domains, add `deltalyn.com` and `www.deltalyn.com`, then copy the DNS records Vercel shows into your domain registrar.

The `vercel.json` file at the repository root turns off automatic Git deployments for the whole repository, so trigger deployments from the Vercel dashboard or the CLI (`vercel --prod` inside `apps/web`). You can also remove that file.
