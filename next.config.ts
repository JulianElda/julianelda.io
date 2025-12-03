import type { NextConfig } from "next";

import createMDX from "@next/mdx";
import rehypePrettyCode from "rehype-pretty-code";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    rehypePlugins: [[rehypePrettyCode, {}]],
    remarkPlugins: [],
  },
});

export default withMDX(nextConfig);
