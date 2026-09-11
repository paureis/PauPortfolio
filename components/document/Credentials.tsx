import type { Credential, Education, Station as StationContent } from "@/content/types";
import { formatDate } from "@/lib/format";
import { Station } from "./Station";

function Dates({ credential }: { credential: Credential }) {
  if (credential.status !== "earned" || !credential.earnedOn) {
    return <span className="credential-status">In progress</span>;
  }
  return (
    <span className="credential-status">
      Earned {formatDate(credential.earnedOn)}
      {credential.expiresOn ? `, valid through ${formatDate(credential.expiresOn)}` : null}
    </span>
  );
}

function Item({ credential }: { credential: Credential }) {
  return (
    <li className={`credential credential-${credential.tier}`}>
      <span className="credential-name">{credential.name}</span>
      <span className="credential-issuer">{credential.issuer}</span>
      <Dates credential={credential} />
      {credential.verificationUrl ? (
        <span className="credential-verify">
          <a href={credential.verificationUrl} rel="noopener">
            Verify
          </a>
          {credential.verificationCode ? (
            <span className="credential-code">Code {credential.verificationCode}</span>
          ) : null}
        </span>
      ) : null}
    </li>
  );
}

// Station 4, the wall. Headline credentials first and larger; the rest
// follow in the order the content lists them. Every earned credential
// links to its verification page; an in-progress one says so and links
// nowhere. Education sits alongside.
export function Credentials({
  station,
  credentials,
  education,
}: {
  station: StationContent;
  credentials: Credential[];
  education: Education[];
}) {
  const headline = credentials.filter((c) => c.tier === "headline");
  const rest = credentials.filter((c) => c.tier !== "headline");
  return (
    <Station station={station}>
      <ul className="credentials credentials-headline">
        {headline.map((credential) => (
          <Item key={credential.id} credential={credential} />
        ))}
      </ul>
      <ul className="credentials credentials-rest">
        {rest.map((credential) => (
          <Item key={credential.id} credential={credential} />
        ))}
      </ul>
      <h3 className="entry-title">Education</h3>
      <ul className="education">
        {education.map((entry) => (
          <li key={entry.school}>
            <span className="education-degree">{entry.degree}</span>
            <span className="education-school">{entry.school}</span>
            <span className="education-when">
              {entry.when}
              {entry.detail ? ` ${entry.detail}` : null}
            </span>
          </li>
        ))}
      </ul>
    </Station>
  );
}
