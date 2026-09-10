// The typed content source. Issue 2 grows this into the full model
// (work, how I work, credentials, off the clock, contact) and adds
// validation. For now it carries what the placeholder page needs.

export interface Profile {
  name: string;
  shortName: string;
  location: string;
  positioning: string;
  supporting: string;
}

export const profile: Profile = {
  name: "Alvaro Reis",
  shortName: "Pau",
  location: "Miramar, Florida",
  positioning:
    "AI engineer. I build agentic systems that ship to production, usually from this desk.",
  supporting:
    "Sole engineer on a multi-tenant recruiting platform used by two healthcare organizations.",
};
