import type { Metadata } from "next";

import { Card } from "@/components/card";

import Branch from "./content/branch.mdx";
import Configuration from "./content/configuration.mdx";
import Fetch from "./content/fetch.mdx";
import Rebase from "./content/rebase.mdx";
import Repository from "./content/repository.mdx";
import Staging from "./content/staging.mdx";
import Stash from "./content/stash.mdx";

export const metadata: Metadata = {
  description: "Git cheatsheet",
  title: "Git cheatsheet",
};

export default function GitPastaPage() {
  return (
    <div>
      <Card>
        <Configuration />
      </Card>
      <Card>
        <Repository />
      </Card>
      <Card>
        <Staging />
      </Card>
      <Card>
        <Branch />
      </Card>
      <Card>
        <Fetch />
      </Card>
      <Card>
        <Rebase />
      </Card>
      <Card>
        <Stash />
      </Card>
    </div>
  );
}
