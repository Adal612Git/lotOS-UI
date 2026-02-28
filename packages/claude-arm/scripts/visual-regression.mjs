import React from "react";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Form,
  Input,
  Progress,
  Stat,
  Table,
  Toast,
} from "../dist/index.js";

const packageRoot = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const baselineDir = join(packageRoot, "visual-baselines");
const diffDir = join(packageRoot, ".visual-regression");
const css = readFileSync(join(packageRoot, "src", "styles.css"), "utf8");

const extraCss = `
body{margin:0;padding:24px;background:#091425;color:#e8eefc;font-family:Segoe UI,sans-serif}
.vr-shell{display:grid;gap:20px;max-width:1100px;margin:0 auto}
.vr-card{border:1px solid rgba(120,155,220,.18);border-radius:20px;padding:20px;background:rgba(7,17,31,.85)}
.vr-row{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.vr-grid{display:grid;gap:16px}
.vr-grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}
.vr-grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}
h1,h2{margin:0}
p{margin:0;color:#9fb0d2;line-height:1.6}
@media (max-width: 920px){.vr-grid-3,.vr-grid-2{grid-template-columns:1fr}}
`;

const writeMode = process.argv.includes("--write");

const scenes = [
  {
    id: "signals",
    title: "Signals",
    element: React.createElement("main", { className: "vr-shell" },
      React.createElement("section", { className: "vr-card" },
        React.createElement("div", { className: "vr-row" },
          React.createElement(Badge, { variant: "success" }, "React stable"),
          React.createElement(Badge, { variant: "info" }, "30 components"),
          React.createElement(Badge, { variant: "warning" }, "Visual checked")
        ),
        React.createElement("div", { className: "vr-grid vr-grid-3", style: { marginTop: "16px" } },
          React.createElement(Stat, { label: "Queue", value: "19", change: "+3", tone: "info", helperText: "Current work queue." }),
          React.createElement(Stat, { label: "Throughput", value: "98.4%", change: "+1.2%", tone: "success", helperText: "Successful completion rate." }),
          React.createElement(Stat, { label: "Escalations", value: "2", change: "-1", tone: "warning", helperText: "Manual reviews pending." })
        )
      )
    )
  },
  {
    id: "control-surface",
    title: "Control surface",
    element: React.createElement("main", { className: "vr-shell" },
      React.createElement("section", { className: "vr-card" },
        React.createElement(Alert, {
          variant: "info",
          title: "Contract-safe delivery",
          description: "Public packages stay MIT. Premium assets move through private bundles."
        }),
        React.createElement("div", { className: "vr-row", style: { marginTop: "16px" } },
          React.createElement(Button, { variant: "primary" }, "Stage bundle"),
          React.createElement(Button, { variant: "secondary" }, "Attach starter"),
          React.createElement(Button, { variant: "outline" }, "Export preview")
        ),
        React.createElement("div", { style: { marginTop: "16px" } },
          React.createElement(Progress, { value: 74, label: "Project completion" })
        ),
        React.createElement("div", { style: { marginTop: "16px" } },
          React.createElement(Toast, {
            title: "Bundle exported",
            description: "The pro payload is staged and ready for private delivery.",
            tone: "success"
          })
        )
      )
    )
  },
  {
    id: "delivery-panel",
    title: "Delivery panel",
    element: React.createElement("main", { className: "vr-shell" },
      React.createElement("section", { className: "vr-card vr-grid vr-grid-2" },
        React.createElement("div", null,
          React.createElement(Breadcrumbs, {
            items: [
              { label: "Commercial", href: "#" },
              { label: "Delivery", href: "#" },
              { label: "Private bundle", current: true }
            ]
          }),
          React.createElement("div", { style: { marginTop: "16px" } },
            React.createElement(Table, {
              caption: "Runtime delivery matrix",
              meta: "Shared contracts across the public layer.",
              columns: [
                { key: "runtime", label: "Runtime" },
                { key: "status", label: "Status" },
                { key: "delivery", label: "Delivery" }
              ],
              rows: [
                { runtime: "React", status: "Stable", delivery: "Public package" },
                { runtime: "Go", status: "Adapter ready", delivery: "Runtime package" },
                { runtime: ".NET", status: "Adapter ready", delivery: "Runtime package" }
              ]
            })
          )
        ),
        React.createElement("div", null,
          React.createElement(Form, {
            title: "Customer handoff",
            description: "Prepare the paid delivery payload.",
            actions: React.createElement("div", { className: "vr-row" },
              React.createElement(Button, { variant: "primary", type: "submit" }, "Confirm handoff"),
              React.createElement(Button, { variant: "secondary" }, "Send preview")
            )
          },
            React.createElement(Input, {
              label: "Customer",
              placeholder: "LotOS Enterprise",
              helperText: "Organization receiving the bundle."
            }),
            React.createElement(Input, {
              label: "Delivery channel",
              placeholder: "Private repo or ZIP link",
              helperText: "The final private destination."
            })
          ),
          React.createElement("div", { style: { marginTop: "16px" } },
            React.createElement(Card, null,
              React.createElement("strong", null, "Paid layer note"),
              React.createElement("p", null, "Sell implementation and proprietary packs, not the MIT surface itself.")
            )
          )
        )
      )
    )
  }
];

const documentFor = (title, element) => {
  const body = renderToStaticMarkup(element);
  return [
    "<!DOCTYPE html>",
    "<html lang=\"en\">",
    "<head>",
    "  <meta charset=\"utf-8\" />",
    "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />",
    `  <title>${title}</title>`,
    `  <style>${css}\n${extraCss}</style>`,
    "</head>",
    `<body>${body}</body>`,
    "</html>",
  ].join("\n");
};

mkdirSync(baselineDir, { recursive: true });
rmSync(diffDir, { recursive: true, force: true });
mkdirSync(diffDir, { recursive: true });

let failures = 0;

for (const scene of scenes) {
  const output = documentFor(scene.title, scene.element);
  const baselinePath = join(baselineDir, `${scene.id}.html`);
  const diffPath = join(diffDir, `${scene.id}.html`);

  if (writeMode) {
    writeFileSync(baselinePath, output);
    console.log(`Wrote baseline: ${scene.id}`);
    continue;
  }

  const baseline = readFileSync(baselinePath, "utf8");
  if (baseline !== output) {
    failures += 1;
    writeFileSync(diffPath, output);
    console.error(`Mismatch detected: ${scene.id}`);
  } else {
    console.log(`Baseline OK: ${scene.id}`);
  }
}

if (!writeMode && failures > 0) {
  console.error(`Visual regression failed: ${failures} scene(s) changed.`);
  process.exit(1);
}

console.log(writeMode ? "Visual baselines updated." : "Visual regression passed.");
