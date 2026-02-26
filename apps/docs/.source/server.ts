// @ts-nocheck
import * as __fd_glob_19 from "../content/docs/components/tooltip.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/components/textarea.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/components/tabs.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/components/switch.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/components/select.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/components/radio-group.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/components/modal.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/components/input.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/components/dropdown.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/components/combobox.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/components/checkbox.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/components/card.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/components/button.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/components/badge.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/components/accordion.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/multi-runtime.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/installation.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/index.mdx?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/components/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "components/meta.json": __fd_glob_1, }, {"index.mdx": __fd_glob_2, "installation.mdx": __fd_glob_3, "multi-runtime.mdx": __fd_glob_4, "components/accordion.mdx": __fd_glob_5, "components/badge.mdx": __fd_glob_6, "components/button.mdx": __fd_glob_7, "components/card.mdx": __fd_glob_8, "components/checkbox.mdx": __fd_glob_9, "components/combobox.mdx": __fd_glob_10, "components/dropdown.mdx": __fd_glob_11, "components/input.mdx": __fd_glob_12, "components/modal.mdx": __fd_glob_13, "components/radio-group.mdx": __fd_glob_14, "components/select.mdx": __fd_glob_15, "components/switch.mdx": __fd_glob_16, "components/tabs.mdx": __fd_glob_17, "components/textarea.mdx": __fd_glob_18, "components/tooltip.mdx": __fd_glob_19, });