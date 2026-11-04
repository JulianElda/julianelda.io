#!/usr/bin/env bash
# Gives a photo its readable slug, caption and alt text: renames
# content/photos/<slug>.jpg and updates its photos.json entry together, so the
# two never disagree. scripts/add-photo.sh leaves new photos with a hash slug
# and empty text; this is the step after it.
#
# usage: scripts/name-photo.sh <slug> <new-slug> <caption> <alt>

set -euo pipefail

die() {
  echo "name-photo: $*" >&2
  exit 1
}

command -v jq >/dev/null || die "jq not found; it comes from flake.nix (direnv allow)"

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
photos_dir="$root/content/photos"
manifest="$photos_dir/photos.json"

[ $# -eq 4 ] || die "usage: scripts/name-photo.sh <slug> <new-slug> <caption> <alt>"
old=$1 new=$2 caption=$3 alt=$4

[[ $new =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || die "slug must be lowercase words joined by hyphens: $new"
[ -f "$photos_dir/$old.jpg" ] || die "no content/photos/$old.jpg"
jq -e --arg slug "$old" 'any(.[]; .slug == $slug)' "$manifest" >/dev/null ||
  die "photos.json has no $old"
if [ "$new" != "$old" ]; then
  [ ! -e "$photos_dir/$new.jpg" ] || die "content/photos/$new.jpg already exists"
  if jq -e --arg slug "$new" 'any(.[]; .slug == $slug)' "$manifest" >/dev/null; then
    die "photos.json already has $new"
  fi
fi

work=$(mktemp)
trap 'rm -f "$work"' EXIT

jq --arg old "$old" --arg new "$new" --arg caption "$caption" --arg alt "$alt" '
  map(if .slug == $old then .slug = $new | .caption = $caption | .alt = $alt else . end)
' "$manifest" >"$work"
if [ "$new" != "$old" ]; then
  mv "$photos_dir/$old.jpg" "$photos_dir/$new.jpg"
fi
mv "$work" "$manifest"

echo "named $old as $new: $caption"
