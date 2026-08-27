import { visit } from 'unist-util-visit';
import { iconSvg } from './icons.mjs';

/*
 * Wraps code blocks so they get a file-name bar and a copy button, and
 * normalises the fence meta for Shiki.
 *
 * The syntax is Obsidian's Codeblock Customizer syntax, deliberately:
 *
 *     ```rust title:src/main.rs
 *     ```rust file:"long name.rs" hl:2,5-7 ln:true
 *
 * so the SAME fence renders in Obsidian (via the plugin) and on the site.
 * Shiki wants line ranges as `{2,5-7}`, so `hl:` is translated below before
 * the highlighter runs.
 *
 * Astro runs syntax highlighting in the remark phase, which is why this is a
 * remark plugin and not a rehype one — at rehype time the code is already
 * raw HTML.
 */

const NODE = 'codeWrapper';

const h = (hName, hProperties, children = []) => ({
  type: NODE,
  data: { hName, hProperties },
  children,
});

const text = (value) => ({ type: 'text', value });

/** `title:x` · `file:x` · `title:"x y"` — the plugin accepts both keys. */
const TITLE = /(?:^|\s)(?:title|file):(?:"([^"]+)"|(\S+))/;
/** `hl:1,3,4-6` */
const HL = /(?:^|\s)hl:(\S+)/;
/** `ln:true` · `ln:false` · `ln:5` (offset) */
const LN = /(?:^|\s)ln:(\S+)/;

function parseMeta(meta) {
  const m = meta ?? '';
  const t = TITLE.exec(m);
  return {
    title: t ? (t[1] ?? t[2]) : null,
    hl: HL.exec(m)?.[1] ?? null,
    ln: LN.exec(m)?.[1] ?? null,
  };
}

/**
 * Shiki's meta-highlight transformer reads `{2,5-7}`; the plugin writes
 * `hl:2,5-7`. Translate so one fence satisfies both.
 */
function normaliseMeta(meta, parsed) {
  let out = meta ?? '';
  if (parsed.hl) out = out.replace(HL, ` {${parsed.hl}}`);
  return out.trim();
}

/**
 * Language icon. `strict` means unknown languages print nothing rather than a
 * meaningless `#`. Raw SVG rides along as an mdast `html` node.
 */
const langIcon = (lang) => {
  const svg = iconSvg(lang, { size: 12, className: 'code-icon', strict: true });
  return svg ? [{ type: 'html', value: svg }] : [];
};

/** Body filled in by the client script, so it stays hidden without JS. */
const copyBtn = () =>
  h('button', { type: 'button', className: ['code-copy'], 'data-copy': '' }, []);

export default function remarkCodeBlocks() {
  return (tree) => {
    const process = (node) => {
      if (!Array.isArray(node.children) || node.children.length === 0) return;

      node.children = node.children.map((child) => {
        if (child.type !== 'code') return child;

        // ```mermaid is carried through untouched; the client renders it
        // only on pages that actually contain a diagram.
        if (child.lang === 'mermaid') {
          return h('div', { className: ['mermaid-graph'], 'data-mermaid': '' }, [
            h('pre', { className: ['mermaid-graph__src'] }, [text(child.value)]),
          ]);
        }

        const meta = parseMeta(child.meta);
        child.meta = normaliseMeta(child.meta, meta);

        if (!meta.title) {
          return h('div', { className: ['code-block', 'code-block--bare'] }, [
            copyBtn(),
            child,
          ]);
        }

        return h('figure', { className: ['code-block'] }, [
          h('figcaption', { className: ['code-block__bar'] }, [
            ...langIcon(child.lang),
            h('span', { className: ['code-block__name'] }, [text(meta.title)]),
            copyBtn(),
          ]),
          child,
        ]);
      });
    };

    visit(tree, (node) => {
      if (node.type === NODE) return; // don't reprocess our own output
      process(node);
    });
  };
}
