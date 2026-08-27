/**
 * KaTeX macros — shorthands for the things typed most often.
 * Writing `$\R$` in a post is shorter and more consistent than `$\mathbb{R}$`.
 *
 * To add a macro: one line here. Immediately usable in posts.
 */
export const KATEX_MACROS = {
  // Number sets
  '\\R': '\\mathbb{R}',
  '\\N': '\\mathbb{N}',
  '\\Z': '\\mathbb{Z}',
  '\\Q': '\\mathbb{Q}',
  '\\C': '\\mathbb{C}',
  '\\F': '\\mathbb{F}',

  // Frequently used operators
  '\\eps': '\\varepsilon',
  '\\iff': '\\Longleftrightarrow',
  '\\implies': '\\Longrightarrow',
  '\\compose': '\\circ',
  '\\abs': '\\left|#1\\right|',
  '\\norm': '\\left\\lVert#1\\right\\rVert',
  '\\set': '\\left\\{#1\\right\\}',
  '\\floor': '\\left\\lfloor#1\\right\\rfloor',
  '\\ceil': '\\left\\lceil#1\\right\\rceil',

  // Compilers / formal languages
  '\\derives': '\\Rightarrow',
  '\\derivesStar': '\\Rightarrow^{*}',
  '\\emptystr': '\\varepsilon',
  '\\concat': '\\cdot',
  '\\lang': '\\mathcal{L}',
  '\\grammar': '\\mathcal{G}',
  // Type judgement:  \judge{\Gamma}{e}{\tau}  ->  Γ ⊢ e : τ
  '\\judge': '#1 \\vdash #2 : #3',
  '\\evalsto': '\\Downarrow',
  '\\steps': '\\longrightarrow',
  '\\stepsStar': '\\longrightarrow^{*}',

  // Geometry
  '\\angleOf': '\\angle #1',
  '\\tri': '\\triangle #1',
  '\\deg': '^{\\circ}',
};
