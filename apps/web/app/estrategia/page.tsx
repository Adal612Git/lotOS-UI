'use client';
import '../estrategia-style.css';

export default function StrategyPage() {
    const roadmap = [
        { date: 'Feb 24 - Mar 1', title: 'HOUSEKEEPING', desc: 'Brutal README, docs, examples, starter repo, single CTA. Launch 60s Trailer.', color: 'var(--pixel-purple)' },
        { date: 'Mar 2 - Mar 8', title: 'DEMO #1: SAAS DASHBOARD', desc: 'Clean repo, deploy. Tutorial #1 (Dash) + 3 shorts on YouTube.', color: 'var(--pixel-cyan)' },
        { date: 'Mar 9 - Mar 15', title: 'DEMO #2: AUTH + SENTINEL', desc: 'Auth Flow focus. Tutorial #2 (Auth) + 3 shorts on YouTube + X.', color: 'var(--pixel-magenta)' },
        { date: 'Mar 16 - Mar 22', title: 'DX POLISHING + UDEMY', desc: 'Starter repo + DX CLI fine-tuning. FREE Udemy course launch.', color: 'var(--pixel-yellow)' },
        { date: 'Mar 23 - Mar 29', title: 'FREE TEMPLATE PACK', desc: 'Landing + Dash basics. Video: "Real Accessibility" + shorts.', color: 'var(--pixel-green)' },
        { date: 'Mar 30 - Apr 5', title: 'AI CHAT UI + MCP', desc: 'The AI-First Angle. Tutorial #3 (AI Chat) + 3 shorts.', color: 'var(--pixel-cyan)' },
        { date: 'Apr 6 - Apr 12', title: 'FOUNDERS PACK LAUNCH', desc: 'Premium templates + Private Discord + Build in Public VIP.', color: 'var(--pixel-yellow)' },
        { date: 'Apr 13 - Apr 19', title: 'PRODUCT HUNT PREP', desc: 'The big launch prep. PH trailer + asset kit.', color: 'var(--pixel-purple)' },
    ];

    return (
        <div className="strategy-page">
            <div className="pixel-background" />
            <div className="pixel-scan" />

            <div className="container">
                {/* ─── Header ─────────────────────────────────────────────────── */}
                <header style={{ textAlign: 'center', marginBottom: 80 }}>
                    <div className="font-pixel title-glow" style={{ fontSize: '32px', marginBottom: 15 }}>
                        MISSION: LOTOS UI
                    </div>
                    <div className="font-pixel" style={{ fontSize: '10px', color: 'var(--pixel-cyan)', marginBottom: 30 }}>
                        STRATEGIC SALES ROADMAP // 2026.v1
                    </div>
                    <p style={{ maxWidth: 600, margin: '0 auto', fontSize: '16px', lineHeight: 1.6, fontWeight: 300 }}>
                        "LotOS UI: componentes React listos para SaaS, con accesibilidad seria y enfoque AI-first (MCP/agent workflows), instalables en minutos."
                    </p>
                </header>

                {/* ─── The Funnel ─────────────────────────────────────────────── */}
                <section className="card card-cyan">
                    <div className="font-pixel" style={{ fontSize: '14px', marginBottom: 30 }}>
                        THE CONVERSION FUNNEL
                    </div>
                    <div className="funnel-container">
                        <div className="funnel-step" style={{ borderColor: 'var(--pixel-purple)', color: 'var(--pixel-purple)' }}>YOUTUBE / UDEMY (Evergreen)</div>
                        <div className="funnel-step" style={{ borderColor: 'var(--pixel-magenta)', color: 'var(--pixel-magenta)' }}>DOCS (Anti-hallucination)</div>
                        <div className="funnel-step" style={{ borderColor: 'var(--pixel-cyan)', color: 'var(--pixel-cyan)' }}>INSTALL (1-Line CLI)</div>
                        <div className="funnel-step" style={{ borderColor: 'var(--pixel-green)', color: 'var(--pixel-green)' }}>STARTER REPO (Deploy)</div>
                        <div className="funnel-step" style={{ borderColor: 'var(--pixel-yellow)', color: 'var(--pixel-yellow)', borderStyle: 'dashed' }}>FOUNDERS PACK (PRO TEMPLATES)</div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <span className="font-pixel" style={{ fontSize: '10px', color: 'var(--pixel-cyan)' }}>
                            1 PIECE OF CONTENT = 1 ACTION
                        </span>
                    </div>
                </section>

                {/* ─── Roadmap ────────────────────────────────────────────────── */}
                <section className="card card-purple">
                    <div className="font-pixel" style={{ fontSize: '14px', marginBottom: 30 }}>
                        MISSION DEPLOYMENT CALENDAR
                    </div>
                    <div className="timeline">
                        {roadmap.map((item, i) => (
                            <div key={i} className="timeline-item">
                                <div className="timeline-date font-pixel">{item.date}</div>
                                <div className="timeline-content" style={{ borderColor: item.color }}>
                                    <div className="font-pixel" style={{ fontSize: '12px', color: item.color, marginBottom: 5 }}>
                                        {item.title}
                                    </div>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── Strategy Pillars ───────────────────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <section className="card card-cyan">
                        <div className="font-pixel" style={{ fontSize: '12px', marginBottom: 20 }}>CONTENT MACHINE</div>
                        <ul style={{ fontSize: '13px', lineHeight: 1.8, paddingLeft: 20, color: 'var(--text-dim)' }}>
                            <li><strong>MON:</strong> Script + Checklist + Thumb</li>
                            <li><strong>TUE:</strong> Build Demo + Grab OBS (2-4h)</li>
                            <li><strong>WED:</strong> Edit Long-form + 3 Shorts</li>
                            <li><strong>THU:</strong> PUBLISH Long-form + 1 Short</li>
                            <li><strong>FRI:</strong> 2 Shorts + FB Groups</li>
                            <li><strong>SAT:</strong> Backlog / FAQ cleanup</li>
                        </ul>
                    </section>

                    <section className="card card-magenta" style={{ borderLeft: '8px solid var(--pixel-magenta)' }}>
                        <div className="font-pixel" style={{ fontSize: '12px', marginBottom: 20 }}>USP ANGLE (AB TEST)</div>
                        <div style={{ marginBottom: 15 }}>
                            <div className="tag tag-purple">SASA-READY</div>
                            <p style={{ fontSize: '12px', margin: '4px 0 10px' }}>Fast landing + dash in minutes.</p>
                        </div>
                        <div style={{ marginBottom: 15 }}>
                            <div className="tag tag-cyan">A11Y-DRIVEN</div>
                            <p style={{ fontSize: '12px', margin: '4px 0 10px' }}>Real WCAG 2.2 AAA accessibility.</p>
                        </div>
                        <div style={{ marginBottom: 15 }}>
                            <div className="tag tag-magenta">AI-FIRST (MCP)</div>
                            <p style={{ fontSize: '12px', margin: '4px 0 10px' }}>Zero hallucinations on AI generation.</p>
                        </div>
                    </section>
                </div>

                {/* ─── Monetization ────────────────────────────────────────────── */}
                <section className="card founders-pack float">
                    <div className="font-pixel animate-pulse" style={{ fontSize: '18px', color: 'var(--pixel-yellow)', marginBottom: 20 }}>
                        FOUNDERS PACK ($19–$39)
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: 20 }}>"Free product, paid acceleration."</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 30 }}>
                        <div style={{ padding: 10, background: 'rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '20px', marginBottom: 5 }}>💎</div>
                            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>2 PREMIUM TEMPLATES</div>
                        </div>
                        <div style={{ padding: 10, background: 'rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '20px', marginBottom: 5 }}>💬</div>
                            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>PRIVATE DISCORD</div>
                        </div>
                        <div style={{ padding: 10, background: 'rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '20px', marginBottom: 5 }}>🗳️</div>
                            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>ROADMAP VOTES</div>
                        </div>
                    </div>
                    <a href="#" className="pixel-btn">
                        GENERATE REVENUE
                    </a>
                </section>

                {/* ─── Risk Mitigation ────────────────────────────────────────── */}
                <section className="card card-magenta" style={{ borderColor: 'var(--pixel-red)', borderLeft: '8px solid var(--pixel-red)' }}>
                    <div className="font-pixel" style={{ fontSize: '14px', marginBottom: 20, color: 'var(--pixel-red)' }}>
                        RISK ASSESSMENT: BRAND NAME "CLAUDE-ARM"
                    </div>
                    <p style={{ fontSize: '13px', lineHeight: 1.6 }}>
                        NPM and Anthropic have policies against using registered trademarks in package names.
                    </p>
                    <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                        <div className="tag tag-magenta">STEP 1: Keep for backward compat</div>
                        <div className="tag tag-cyan">STEP 2: New alias @lotosui/ai-arm</div>
                        <div className="tag tag-purple">STEP 3: Deprecate old name gradually</div>
                    </div>
                </section>

                {/* ─── Checklist YA ────────────────────────────────────────────── */}
                <section className="card card-cyan">
                    <div className="font-pixel" style={{ fontSize: '14px', marginBottom: 30 }}>
                        START MISSION NOW (90 MIN)
                    </div>
                    <div style={{ color: 'var(--pixel-green)', fontSize: '14px', lineHeight: 2 }}>
                        <div> [ ] Set single CTA "Run the starter"</div>
                        <div> [ ] Deploy Starter Repo to Vercel</div>
                        <div> [ ] Record 60s Trailer (Installer + WOW)</div>
                        <div> [ ] Open Discord with 4 channels</div>
                        <div> [ ] Publish Trailer on YouTube/Reels/FB</div>
                    </div>
                </section>

                {/* ─── Link Source ─────────────────────────────────────────────── */}
                <footer style={{ textAlign: 'center', marginTop: 100, fontSize: '10px', color: 'var(--text-dim)' }}>
                    STRATEGY SOURCE: ESTRATEGIAFINALVENTAS.TXT // AI GENERATED MISSION CONTROL // 2026
                </footer>
            </div>
        </div>
    );
}
