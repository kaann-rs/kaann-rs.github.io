/**
 * Reads Obsidian Codeblock Customizer meta off the fence and puts it on <pre>.
 *
 *     ```rust title:src/main.rs ln:true
 *     ```rust file:"long name.rs" ln:5
 *
 * -> <pre data-title="src/main.rs" data-lang="rust" class="… line-numbers"
 *         style="--ln-start: 4">
 *
 * `hl:` is not handled here — remark rewrites it to `{…}` so Shiki's own
 * transformerMetaHighlight picks it up.
 */
export function transformerMeta() {
  return {
    name: 'meta-attrs',
    pre(node) {
      const raw = this.options.meta?.__raw ?? '';

      const title = /(?:^|\s)(?:title|file):(?:"([^"]+)"|(\S+))/.exec(raw);
      if (title) node.properties['data-title'] = title[1] ?? title[2];

      if (this.options.lang) node.properties['data-lang'] = this.options.lang;

      const ln = /(?:^|\s)ln:(\S+)/.exec(raw)?.[1];
      if (ln && ln !== 'false') {
        node.properties.className = [
          ...(node.properties.className ?? []),
          'line-numbers',
        ];

        // `ln:5` starts the count at 5. CSS counters increment before print,
        // so the reset value is start - 1.
        const start = Number.parseInt(ln, 10);
        if (Number.isFinite(start) && start > 1) {
          node.properties.style = `${node.properties.style ?? ''};--ln-start:${start - 1}`.replace(/^;/, '');
        }
      }
    },
  };
}
