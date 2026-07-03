import { useState } from "react";
import axios from "axios";
import { FaShieldAlt, FaSearch, FaLock, FaGlobe, FaCode } from "react-icons/fa";

type AuditResult = {
  ip: string[];
  ssl: { grade: string; expiry: string } | null;
  headers: Record<string, string>;
  tech: string[];
};

export default function App() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");

  const cleanDomain = (d: string) => d.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();

  const handleAudit = async () => {
    const d = cleanDomain(domain);
    if (!d) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const [dnsRes, sslRes, headersRes] = await Promise.all([
        axios.get(`https://dns.google/resolve?name=${d}&type=A`),
        axios.get(`https://api.ssllabs.com/api/v3/analyze?host=${d}&publish=off&fromCache=on&all=done`),
        axios.get(`https://api.allorigins.win/raw?url=https://${d}`).catch(() => ({ headers: {} }))
      ]);

      const ips = dnsRes.data.Answer?.map((a: any) => a.data) || ["N/A"];
      const sslData = sslRes.data.endpoints?.[0];
      const ssl = sslData? {
        grade: sslData.grade || "T",
        expiry: new Date(sslData.details?.cert?.notAfter * 1000).toLocaleDateString("it-IT")
      } : null;

      const h = headersRes.headers || {};
      const headers = {
        "Strict-Transport-Security": h["strict-transport-security"] || "Manca",
        "Content-Security-Policy": h["content-security-policy"]? "Presente" : "Manca",
        "X-Frame-Options": h["x-frame-options"] || "Manca",
      };
      const tech = [h["server"] || "Sconosciuto"];

      setResult({ ip: ips, ssl, headers, tech });
    } catch (err: any) {
      setError("Dominio non raggiungibile o API rate-limit. Riprova tra 30s.");
    } finally { setLoading(false); }
  };

  const Card = ({ title, icon, children }: any) => (
    <div className="bg-zinc-800/60 border-zinc-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3 text-emerald-400 font-semibold">{icon} {title}</div>
      <div className="space-y-1 text-sm text-zinc-300">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 flex justify-center">
      <div className="w-full max-w-2xl space-y-5">
        <div className="flex items-center gap-3 pt-4">
          <FaShieldAlt className="text-emerald-400 text-2xl" />
          <h1 className="text-2xl font-bold">Site Audit OSINT</h1>
        </div>
        <p className="text-sm text-zinc-400">Solo dati pubblici. Niente scan porte. Usa solo per domini tuoi.</p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="es: google.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-emerald-500"
          />
          <button onClick={handleAudit} disabled={loading}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 rounded-lg flex items-center gap-2 font-semibold">
            <FaSearch /> {loading? "Scan..." : "Analizza"}
          </button>
        </div>

        {error && <div className="bg-red-900/40 border-red-700 p-3 rounded-lg text-sm">{error}</div>}

        {result && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card title="DNS / IP" icon={<FaGlobe />}>{result.ip.map((ip) => <div key={ip} className="font-mono">{ip}</div>)}</Card>
            <Card title="SSL Certificate" icon={<FaLock />}><div>Grade: <span className="font-bold">{result.ssl?.grade || "N/A"}</span></div><div>Scade: {result.ssl?.expiry || "N/A"}</div></Card>
            <Card title="Security Headers" icon={<FaShieldAlt />}>{Object.entries(result.headers).map(([k, v]) => <div key={k} className="flex justify-between"><span>{k}</span><span className={v === "Manca"? "text-red-400" : "text-emerald-400"}>{v}</span></div>)}</Card>
            <Card title="Tech Stack" icon={<FaCode />}>{result.tech.map((t) => <div key={t}>{t}</div>)}</Card>
          </div>
        )}
      </div>
    </div>
  );
    }      const headersRes = await axios.get(`https://api.allorigins.win/raw?url=https://${domain}`);
      const headersRaw = headersRes.headers;
      const headers = {
        "Strict-Transport-Security": headersRaw["strict-transport-security"] || "Manca",
        "Content-Security-Policy": headersRaw["content-security-policy"]? "Presente" : "Manca",
        "X-Frame-Options": headersRaw["x-frame-options"] || "Manca",
      };

      // 4. Tech Stack base - dal server header
      const tech = [headersRaw["server"] || "Sconosciuto"];

      setResult({ ip: ips, ssl, headers, tech });
    } catch (err: any) {
      setError("Dominio non raggiungibile o API rate-limit. Riprova tra 30s.");
    } finally {
      setLoading(false);
    }
  };

  const Card = ({ title, icon, children }: any) => (
    <div className="bg-zinc-800/60 border-zinc-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3 text-emerald-400 font-semibold">
        {icon} {title}
      </div>
      <div className="space-y-1 text-sm text-zinc-300">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 flex justify-center">
      <div className="w-full max-w-2xl space-y-5">
        <div className="flex items-center gap-3 pt-4">
          <FaShieldAlt className="text-emerald-400 text-2xl" />
          <h1 className="text-2xl font-bold">Site Audit OSINT</h1>
        </div>
        <p className="text-sm text-zinc-400">Solo dati pubblici. Niente scan porte. Usa solo per domini tuoi.</p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="es: google.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value.replace("https://", "").replace("http://", "").replace("/", ""))}
            className="flex-1 bg-zinc-900 border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleAudit}
            disabled={loading}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 rounded-lg flex items-center gap-2 font-semibold"
          >
            <FaSearch /> {loading? "Scan..." : "Analizza"}
          </button>
        </div>

        {error && <div className="bg-red-900/40 border-red-700 p-3 rounded-lg text-sm">{error}</div>}

        {result && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card title="DNS / IP" icon={<FaGlobe />}>
              {result.ip.map((ip) => <div key={ip} className="font-mono">{ip}</div>)}
            </Card>

            <Card title="SSL Certificate" icon={<FaLock />}>
              <div>Grade: <span className="font-bold">{result.ssl?.grade || "N/A"}</span></div>
              <div>Scade: {result.ssl?.expiry || "N/A"}</div>
            </Card>

            <Card title="Security Headers" icon={<FaShieldAlt />}>
              {Object.entries(result.headers).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span>{k}</span>
                  <span className={v === "Manca"? "text-red-400" : "text-emerald-400"}>{v}</span>
                </div>
              ))}
            </Card>

            <Card title="Tech Stack" icon={<FaCode />}>
              {result.tech.map((t) => <div key={t}>{t}</div>)}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
  }
