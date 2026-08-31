import { visit } from 'unist-util-visit';

/*
 * Turns `:::name[Title]` containers into meaningful HTML.
 *
 *   :::theorem[Inscribed angle theorem]
 *   An inscribed angle is half the central angle subtending the same arc.
 *   :::
 *
 *   :::proof
 *   ...
 *   :::                      -> ends with □
 *
 *   :::tree                  -> indented list, tree drawn by CSS
 *   - Program
 *     - FunctionDecl
 *   :::
 *
 *   :::figure[Caption]       -> numbered figure
 *   ![](/diagram.svg)
 *   :::
 *
 * Numbering runs per file and per kind (Theorem 1, Theorem 2, Lemma 1).
 * The label word is written as data attributes and chosen by CSS from
 * <html lang>, not baked into the markup. Rendering therefore does not depend
 * on frontmatter reaching the plugin — which it does not when a body comes
 * from the CMS rather than from a file.
 */

const NODE = 'container';

const h = (hName, hProperties, children = []) => ({
  type: NODE,
  data: { hName, hProperties },
  children,
});

const text = (value) => ({ type: 'text', value });

/** [kind]: [label_en, label_tr, numbered?] */
const KINDS = {
  theorem:     ['Theorem', 'Teorem', true],
  lemma:       ['Lemma', 'Lemma', true],
  proposition: ['Proposition', 'Önerme', true],
  corollary:   ['Corollary', 'Sonuç', true],
  definition:  ['Definition', 'Tanım', true],
  example:     ['Example', 'Örnek', true],
  remark:      ['Remark', 'Not', true],
  proof:       ['Proof', 'İspat', false],
  note:        ['Note', 'Not', false],
  warning:     ['Warning', 'Uyarı', false],
  tip:         ['Tip', 'İpucu', false],
};

const FIGURE = ['Figure', 'Şekil'];

export default function remarkContainers() {
  return (tree, file) => {
    const lang = file?.data?.astro?.frontmatter?.lang === 'tr' ? 'tr' : 'en';
    const counters = new Map();

    const next = (kind) => {
      const n = (counters.get(kind) ?? 0) + 1;
      counters.set(kind, n);
      return n;
    };

    visit(tree, 'containerDirective', (node, index, parent) => {
      if (!parent || index === null) return;

      const name = node.name;

      // `:::name[Title]` -> the first child is the label paragraph
      let label = null;
      if (node.children[0]?.data?.directiveLabel) {
        label = node.children.shift();
      }

      let replacement = null;

      if (name === 'tree') {
        replacement = buildTree(node);
      } else if (name === 'figure') {
        replacement = buildFigure(node, label, next('figure'), lang);
      } else if (KINDS[name]) {
        replacement = buildCallout(node, name, label, next, lang);
      }

      if (replacement) parent.children[index] = replacement;
    });
  };
}

function buildCallout(node, kind, label, next, lang) {
  const [en, tr, numbered] = KINDS[kind];

  const heading = [
    h(
      'span',
      {
        className: ['callout__kind'],
        'data-en': en,
        'data-tr': tr,
        ...(numbered ? { 'data-n': String(next(kind)) } : {}),
      },
      []
    ),
  ];

  if (label) {
    heading.push(
      h('span', { className: ['callout__name'] }, [text(' — '), ...label.children])
    );
  }

  const body = h('div', { className: ['callout__body'] }, node.children);

  // Tombstone at the end of a proof
  if (kind === 'proof') {
    body.children = [...body.children, h('span', { className: ['qed'], 'aria-hidden': 'true' }, [])];
  }

  return h(
    'aside',
    { className: ['callout', `callout--${kind}`] },
    [h('p', { className: ['callout__head'] }, heading), body]
  );
}

function buildFigure(node, label, n, lang) {
  const children = [...node.children];

  if (label) {
    children.push(
      h('figcaption', {}, [
        h(
          'span',
          { className: ['figure__label'], 'data-en': FIGURE[0], 'data-tr': FIGURE[1], 'data-n': String(n) },
          []
        ),
        text(' — '),
        ...label.children,
      ])
    );
  }

  return h('figure', { className: ['figure'], id: `fig-${n}` }, children);
}

function buildTree(node) {
  // The indented markdown list stays as is; CSS draws the connector lines.
  // Semantically a real <ul> — screen readers and copying behave properly.
  return h('div', { className: ['tree'] }, node.children);
}
