import type {Locale} from '@/lib/types';

// Legal copy is held as data rather than as markup so that four languages stay
// structurally identical. A translation that quietly gains or loses a clause is a
// different contract, not a different wording, and this shape makes that impossible to
// do by accident: every locale fills the same sections in the same order.
export type Block=
  |{p:string}
  |{h3:string}
  |{ul:string[]}
  |{table:{head:string[];rows:string[][]}}
  |{note:string};

export type Section={id:string;heading:string;blocks:Block[]};

export type LegalDocContent={
  title:string;
  /** One paragraph a reader can act on without reading the rest. */
  summary:string;
  sections:Section[];
};

export type LegalDoc={
  slug:string;
  version:string;
  /** ISO date. Same across every language: one document, one effective date. */
  effective:string;
  updated:string;
  /**
   * True when the document cannot be honest without naming the legal entity -- anything
   * that binds someone or names a data controller. Those stay noindex and carry a visible
   * pending-review notice until the company details exist.
   */
  requiresEntity:boolean;
  content:Record<Locale,LegalDocContent>;
};
