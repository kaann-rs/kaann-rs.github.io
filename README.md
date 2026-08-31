# kaanbora.dev

A project showcase. Every project keeps its own overview, changelog and roadmap;
the home page pulls each project's newest release into one feed.

Astro, Markdown, static output. No database, no comments, no analytics.

```bash
npm install
npm run dev                                   # http://localhost:4321
npm run build                                 # static output into dist/

npm run new:project -- voparser --mono vp       # scaffold a project, both languages
npm run new:release -- voparser 0.1.0           # a changelog entry
npm run new:doc     -- voparser architecture    # a documentation section
npm run new:cover   -- voparser --glyph code    # cover art from the icon set
```

Content lives in `src/content/`; the folder path carries the identity, so
nothing has to be repeated in frontmatter:

```
projects/<lang>/<slug>.md              the overview
docs/<lang>/<slug>/<section>.md        readme, architecture, structure, state,
                                       learned — and any section you invent
releases/<lang>/<slug>/<version>.md    one changelog entry
roadmaps/<lang>/<slug>.md              milestones
benchmarks/<lang>/<slug>.md            measured comparisons
decisions/<lang>/<slug>/<nnn>-x.md     decision records
```

Search is built with the site (Pagefind), social cards are drawn at build time
from each project's own colour, and the project index filters by status and
stack in the browser.

There is also a CMS, if you would rather fill in forms than YAML:

```bash
npm run cms          # Payload admin at http://localhost:3001/admin
npm run cms:import   # load the markdown into it, once
npm run build:cms    # build the site from the database instead
```

Payload runs locally and is never deployed — the published site stays static
HTML with no database behind it. Both sources produce identical pages, so
switching between them changes nothing a visitor can see.

Syntax reference: `src/content/_templates/`.
Everything else: [docs/WRITING.md](docs/WRITING.md).

## License

MIT — see [LICENSE](LICENSE).
