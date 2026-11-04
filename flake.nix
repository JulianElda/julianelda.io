{
  description = "julianelda.io development environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = f:
        nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            bun # package manager and runtime
            nodejs # node_modules/.bin/{lefthook,nano-staged,playwright,playwright-cli} are #!/usr/bin/env node
            exiftool # scripts/add-photo.sh reads originals; scripts/check-photo-metadata.sh guards commits
            vips # scripts/add-photo.sh: vipsthumbnail rotates, resizes, converts to sRGB and drops metadata
            jq # scripts/add-photo.sh builds the photos.json entry
          ];

          # Playwright cannot use its own downloaded browsers here: the Chrome it
          # fetches dies on `libglib-2.0.so.0: cannot open shared object file`.
          # So the browsers come from this pin, for `bun run test:e2e`, the
          # vitest browser project and `bunx playwright-cli` alike.
          PLAYWRIGHT_BROWSERS_PATH = pkgs.playwright-driver.browsers;
          PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";

          # playwright-cli otherwise defaults to the branded `chrome` channel at
          # /opt/google/chrome, which the pin above does not provide.
          PLAYWRIGHT_MCP_BROWSER = "chromium";

          # The locked versions, readable with `nix eval` once the flake moves.
          PLAYWRIGHT_DRIVER_VERSION = pkgs.playwright-driver.version;
          BUN_VERSION = pkgs.bun.version;

          # Those browsers only satisfy the npm playwright of the same version,
          # so the two have to move together. direnv loads .envrc from the repo
          # root, which is what the relative path resolves against.
          shellHook = ''
            pinned=${pkgs.playwright-driver.version}
            manifest=node_modules/playwright/package.json
            if [ -f "$manifest" ]; then
              installed=$(grep -m1 '"version"' "$manifest" | cut -d'"' -f4)
              if [ "$installed" != "$pinned" ]; then
                echo "julianelda.io: playwright $installed does not match the pinned browsers ($pinned)" >&2
                echo "               run: bun add -d -E playwright@$pinned @playwright/test@$pinned" >&2
              fi
            fi
          '';
        };
      });
    };
}
