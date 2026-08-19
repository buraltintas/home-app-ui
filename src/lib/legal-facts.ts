// The single source of truth for company and contact facts used by the legal and trust
// pages. Every value here is either verified or explicitly null.
//
// A null is not a gap to be filled with a plausible-looking string. Turkish data
// protection law (KVKK art. 10) makes the identity of the data controller a mandatory
// element of a privacy disclosure, and a document that names the wrong controller is
// worse than one that admits it does not know yet. Nothing in either repository
// establishes a legal entity, so nothing here invents one.
//
// When these values arrive, fill them in here and nowhere else: the pages read from this
// module, and `legalDocumentsArePublishable` flips on its own once the required set is
// complete.

export type LegalFacts={
  /** The product name. Not the legal entity, and never used as one. */
  brandName:string;
  /** The controller's own site, so the person named can be identified independently. */
  controllerWebsite:string|null;
  /** Registered company name. LEGAL / BUSINESS INPUT REQUIRED. */
  legalEntityName:string|null;
  /** Company form, e.g. limited şirket, anonim şirket. LEGAL / BUSINESS INPUT REQUIRED. */
  legalEntityForm:string|null;
  /** Trade registry number. LEGAL / BUSINESS INPUT REQUIRED. */
  registrationNumber:string|null;
  /** MERSIS number. LEGAL / BUSINESS INPUT REQUIRED. */
  mersisNumber:string|null;
  /** Tax office and number. LEGAL / BUSINESS INPUT REQUIRED. */
  taxOffice:string|null;
  taxNumber:string|null;
  /** Postal address. Recommended, not required to publish -- see requiredForPublication. */
  registeredAddress:string|null;
  phone:string|null;
  /** Whether a KVKK data controller registry entry applies. LEGAL INPUT REQUIRED. */
  verbisRegistration:string|null;
  /** Contact addresses. Null until a real, monitored mailbox exists. */
  supportEmail:string|null;
  privacyEmail:string|null;
  legalEmail:string|null;
  securityEmail:string|null;
  copyrightEmail:string|null;
  contentReportEmail:string|null;
  storeCorrectionEmail:string|null;
  /** Minimum age to hold an account. Decided by the controller; the code does not enforce it. */
  minimumAge:number|null;
  /** Where the database and object storage physically run. LEGAL / BUSINESS INPUT REQUIRED. */
  hostingRegion:string|null;
};

export const legalFacts:LegalFacts={
  brandName:'Boşa Gezme!',
  controllerWebsite:'https://burak-altintas.com',
  legalEntityName:'Burak Altıntaş',
  legalEntityForm:'gerçek kişi',
  registrationNumber:null,
  mersisNumber:null,
  taxOffice:null,
  taxNumber:null,
  registeredAddress:null,
  phone:null,
  verbisRegistration:null,
  // One monitored mailbox handles every channel for now. Publishing seven addresses that
  // all forward to the same place, or worse that nobody reads, is not more transparent.
  supportEmail:'info@bosagezme.com',
  privacyEmail:'info@bosagezme.com',
  legalEmail:'info@bosagezme.com',
  securityEmail:'info@bosagezme.com',
  copyrightEmail:'info@bosagezme.com',
  contentReportEmail:'info@bosagezme.com',
  storeCorrectionEmail:'info@bosagezme.com',
  minimumAge:16,
  hostingRegion:null,
};

// A binding document has to name who is bound by it and how they can be reached.
//
// The postal address is deliberately not in this list. Under the KVKK application
// communiqué a data subject may apply through an email address the controller has already
// notified, so a published application mailbox is a working channel on its own. A postal
// address is still worth having and is tracked as missing below; it is not what blocks
// publication.
//
// Note for the controller: he is a natural person here, so any address published becomes
// his personal address. That is a decision worth making deliberately rather than by
// filling in a field.
export const requiredForPublication=['legalEntityName','privacyEmail','legalEmail'] as const;

export const missingLegalFacts:string[]=Object.entries(legalFacts)
  .filter(([,value])=>value===null)
  .map(([key])=>key);

export const legalDocumentsArePublishable=requiredForPublication
  .every(key=>legalFacts[key]!==null);

// Pages describing only how the product behaves -- what it stores, what it sends where,
// how to delete an account -- are verifiable from the code alone and are publishable
// whether or not the company details have arrived.
export const productFactsArePublishable=true;
