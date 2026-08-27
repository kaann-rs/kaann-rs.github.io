import { visit } from 'unist-util-visit';

/** Wraps tables in a horizontally scrollable container. */
export default function rehypeTableWrap() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === null) return;
      const cls = parent.properties?.className;
      if (Array.isArray(cls) && cls.includes('table-scroll')) return;

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'] },
        children: [node],
      };
    });
  };
}
