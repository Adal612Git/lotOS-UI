// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "installation.mdx": () => import("../content/docs/installation.mdx?collection=docs"), "multi-runtime.mdx": () => import("../content/docs/multi-runtime.mdx?collection=docs"), "components/accordion.mdx": () => import("../content/docs/components/accordion.mdx?collection=docs"), "components/badge.mdx": () => import("../content/docs/components/badge.mdx?collection=docs"), "components/button.mdx": () => import("../content/docs/components/button.mdx?collection=docs"), "components/card.mdx": () => import("../content/docs/components/card.mdx?collection=docs"), "components/checkbox.mdx": () => import("../content/docs/components/checkbox.mdx?collection=docs"), "components/combobox.mdx": () => import("../content/docs/components/combobox.mdx?collection=docs"), "components/dropdown.mdx": () => import("../content/docs/components/dropdown.mdx?collection=docs"), "components/input.mdx": () => import("../content/docs/components/input.mdx?collection=docs"), "components/modal.mdx": () => import("../content/docs/components/modal.mdx?collection=docs"), "components/radio-group.mdx": () => import("../content/docs/components/radio-group.mdx?collection=docs"), "components/select.mdx": () => import("../content/docs/components/select.mdx?collection=docs"), "components/switch.mdx": () => import("../content/docs/components/switch.mdx?collection=docs"), "components/tabs.mdx": () => import("../content/docs/components/tabs.mdx?collection=docs"), "components/textarea.mdx": () => import("../content/docs/components/textarea.mdx?collection=docs"), "components/tooltip.mdx": () => import("../content/docs/components/tooltip.mdx?collection=docs"), }),
};
export default browserCollections;