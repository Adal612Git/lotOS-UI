import React from "react";
import { createRoot } from "react-dom/client";
import {
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Progress,
  Stat,
  Table,
  Tabs,
  Toast,
} from "../src/index";
import "../src/styles.css";
import "./showcase.css";

function ShowcaseApp() {
  return (
    <main className="lotos-showcase">
      <div className="lotos-showcase__shell">
        <section className="lotos-showcase__hero">
          <span className="lotos-showcase__eyebrow">LotOS UI Review Surface</span>
          <h1>Inspectable components with a real runtime surface.</h1>
          <p>
            This is the executable component gallery for LotOS UI. It gives the project a live
            review surface today and doubles as the target for structural visual regression.
          </p>
          <div className="lotos-showcase__row">
            <Badge variant="success">React Stable</Badge>
            <Badge variant="info">27 Components</Badge>
            <Badge variant="warning">CI Checked</Badge>
          </div>
        </section>

        <section className="lotos-showcase__section">
          <h2>Signals</h2>
          <p className="lotos-showcase__hint">A quick read on the data-density layer.</p>
          <div className="lotos-showcase__grid lotos-showcase__grid--stats">
            <Stat label="Queue" value="19" change="+3" tone="info" helperText="Items currently waiting." />
            <Stat label="Throughput" value="98.4%" change="+1.2%" tone="success" helperText="Successful completion rate." />
            <Stat label="Escalations" value="2" change="-1" tone="warning" helperText="Manual reviews in the last hour." />
          </div>
        </section>

        <section className="lotos-showcase__section">
          <h2>Actions and feedback</h2>
          <div className="lotos-showcase__grid lotos-showcase__grid--two">
            <div className="lotos-showcase__panel">
              <div className="lotos-showcase__row">
                <Button variant="primary">Deploy bundle</Button>
                <Button variant="secondary">Preview handoff</Button>
                <Button variant="outline">Escalate</Button>
                <Button variant="ghost">Archive</Button>
              </div>
              <Divider />
              <Progress value={72} label="Commercial hardening" />
            </div>
            <div className="lotos-showcase__panel">
              <Alert
                variant="info"
                title="Contract-safe delivery"
                description="Public packages stay MIT. Premium assets ship through private bundles."
              />
              <Toast
                title="Bundle exported"
                description="The pro layer can be staged and zipped from the workspace."
                variant="success"
              />
            </div>
          </div>
        </section>

        <section className="lotos-showcase__section">
          <h2>Data surfaces</h2>
          <div className="lotos-showcase__panel">
            <Breadcrumbs
              items={[
                { label: "Operations", href: "#" },
                { label: "Delivery", href: "#" },
                { label: "Control surface", current: true },
              ]}
            />
            <Table
              caption="Runtime delivery matrix"
              meta="Shared contracts across adapters."
              columns={[
                { key: "runtime", label: "Runtime" },
                { key: "status", label: "Status" },
                { key: "delivery", label: "Delivery" },
              ]}
              rows={[
                { runtime: "React", status: "Stable", delivery: "Public package" },
                { runtime: ".NET", status: "Adapter ready", delivery: "Runtime package" },
                { runtime: "Python desktop", status: "Demo ready", delivery: "App bundle" },
              ]}
            />
          </div>
        </section>

        <section className="lotos-showcase__section">
          <h2>Forms and panels</h2>
          <div className="lotos-showcase__grid lotos-showcase__grid--two">
            <div className="lotos-showcase__panel">
              <Form
                title="Customer handoff"
                description="Prepare a private delivery package."
                spacing="comfortable"
                actions={
                  <div className="lotos-showcase__row">
                    <Button variant="primary" type="submit">Stage bundle</Button>
                    <Button variant="secondary">Attach starter</Button>
                  </div>
                }
              >
                <div className="lotos-showcase__field">
                  <Input label="Customer" placeholder="LotOS Enterprise" helperText="Organization or buyer name." />
                </div>
                <div className="lotos-showcase__field">
                  <Input label="Delivery channel" placeholder="Private repo or ZIP link" helperText="How the asset will be delivered." />
                </div>
              </Form>
            </div>
            <div className="lotos-showcase__panel lotos-showcase__surface-card">
              <Card>
                <strong>Execution track</strong>
                <p>The same contract system feeds docs, adapters, CLI generators, and sellable pro bundles.</p>
              </Card>
              <Tabs
                label="Execution lanes"
                tabs={[
                  { value: "build", label: "Build", content: <p>Contracts, adapters, and components move first.</p> },
                  { value: "verify", label: "Verify", content: <p>CI, visual baselines, and demos reduce regression risk.</p> },
                  { value: "deliver", label: "Deliver", content: <p>Private bundles and guided setup turn the work into revenue.</p> },
                ]}
                defaultValue="verify"
                variant="pills"
              />
            </div>
          </div>
        </section>

        <p className="lotos-showcase__footer">
          This showcase runs with existing workspace dependencies and is safe to build in CI.
        </p>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ShowcaseApp />
  </React.StrictMode>
);
