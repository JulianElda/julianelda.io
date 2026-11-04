#!/usr/bin/env bash
# Fails when an image carries any metadata beyond its own structure: EXIF (GPS,
# dates, serial numbers), XMP, IPTC, maker notes, colour profiles, comments.
# The repo is public and git history is forever, so this runs on every staged
# image (lefthook.yml) and on every photo scripts/add-photo.sh writes.
#
# It allows known-harmless groups instead of denying known-bad ones, so a tag
# nobody thought of still fails.
#
# usage: scripts/check-photo-metadata.sh [--staged] <image>...
#   --staged  check the staged blob (what the commit will contain), not the
#             working tree file

set -euo pipefail

if ! command -v exiftool >/dev/null; then
  echo "check-photo-metadata: exiftool not found; it comes from flake.nix (direnv allow)" >&2
  exit 1
fi

staged=false
if [ "${1-}" = "--staged" ]; then
  staged=true
  shift
fi

# What exiftool reports for an image with no metadata at all: file system
# details, the container's own dimensions and encoding, and values it computes.
allowed='^(ExifTool|System|File|Composite|JFIF|PNG|PNG-pHYs|RIFF|GIF)$'

status=0
for image in "$@"; do
  # -args prints one "-Group:Tag=value" line per tag.
  if $staged; then
    tags=$(git show ":$image" | exiftool -q -a -G1 -args -) || tags=""
  else
    tags=$(exiftool -q -a -G1 -args -- "$image") || tags=""
  fi
  if [ -z "$tags" ]; then
    echo "$image: exiftool could not read it" >&2
    status=1
    continue
  fi

  # Tag names only, never values: those are what must not leak.
  leaks=$(awk -F '[:=]' -v allowed="$allowed" '
    { group = substr($1, 2) }
    group !~ allowed || $2 ~ /Comment/ { print "  " group ":" $2 }
  ' <<<"$tags")
  if [ -n "$leaks" ]; then
    printf '%s carries metadata:\n%s\n' "$image" "$leaks" >&2
    status=1
  fi
done

if [ "$status" -ne 0 ]; then
  echo "Photos for /photos: scripts/add-photo.sh. Other images: vips copy <in> '<out>[keep=none]'." >&2
fi
exit "$status"
