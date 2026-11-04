#!/usr/bin/env bash
# Adds a photo to /photos: writes content/photos/<slug>.jpg and puts its entry
# at the top of content/photos/photos.json, which is the display order.
#
# The JPEG keeps nothing but pixels: rotation is applied to them, it is shrunk
# to fit 2400px and converted to sRGB, and every metadata tag is dropped, then
# scripts/check-photo-metadata.sh must pass on it before it lands.
#
# Camera details are read from the original and only for what the page shows:
# camera, lens with focal length (interchangeable lenses only), aperture,
# shutter and ISO. Never location, dates or serial numbers. They are written
# for cameras and left out for phones (kind in scripts/photo-gear.json);
# --meta or --no-meta overrides that. Left out means absent from the public
# repo, not just hidden on the page.
#
# usage: scripts/add-photo.sh [--meta | --no-meta] <source> <slug> <caption> <alt>

set -euo pipefail

die() {
  echo "add-photo: $*" >&2
  exit 1
}

usage() {
  die "usage: scripts/add-photo.sh [--meta | --no-meta] <source> <slug> <caption> <alt>"
}

for tool in exiftool jq vipsthumbnail; do
  command -v "$tool" >/dev/null || die "$tool not found; it comes from flake.nix (direnv allow)"
done

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
photos_dir="$root/content/photos"
manifest="$photos_dir/photos.json"
gear="$root/scripts/photo-gear.json"

meta=default
case "${1-}" in
--meta)
  meta=yes
  shift
  ;;
--no-meta)
  meta=no
  shift
  ;;
esac
[ $# -eq 4 ] || usage
source=$1 slug=$2 caption=$3 alt=$4

[ -f "$source" ] || die "$source: no such file"
[[ $slug =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || die "slug must be lowercase words joined by hyphens: $slug"
dest="$photos_dir/$slug.jpg"
[ ! -e "$dest" ] || die "$dest already exists"
mkdir -p "$photos_dir"
[ -f "$manifest" ] || echo "[]" >"$manifest"
if jq -e --arg slug "$slug" 'any(.[]; .slug == $slug)' "$manifest" >/dev/null; then
  die "photos.json already has $slug"
fi

# Only the fields the page can show are ever read out of the original.
exif=$(exiftool -json -n -Model -LensModel -FocalLength -FNumber -ExposureTime -ISO -- "$source" | jq '.[0]')
model=$(jq -r '.Model // empty' <<<"$exif")
body=$(jq -c --arg model "$model" '.bodies[$model] // empty' "$gear")

if [ "$meta" = default ]; then
  if [ -n "$body" ] && [ "$(jq -r .kind <<<"$body")" = camera ]; then
    meta=yes
  elif [ -z "$body" ] && [ -n "$model" ]; then
    die "unknown camera \"$model\": add it to scripts/photo-gear.json"
  else
    meta=no
  fi
fi
if [ "$meta" = yes ] && [ -z "$body" ]; then
  die "no camera details: ${model:-the file records no camera model}${model:+ is not in scripts/photo-gear.json}"
fi

if [ "$meta" = yes ]; then
  meta_json=$(jq -n \
    --argjson exif "$exif" \
    --argjson body "$body" \
    --argjson lenses "$(jq .lenses "$gear")" '
    def round1: . * 10 | round / 10;
    # As recorded: 1/2273 stays 1/2273; whole seconds and up stay plain.
    def shutter: if . < 1 then "1/\(1 / . | round)" else "\(round1)" end;
    {camera: $body.name}
    + if $body.interchangeableLens and ($exif.LensModel // "") != "" then
        {lens: ({name: ($lenses[$exif.LensModel]
                  // error("unknown lens \"\($exif.LensModel)\": add it to scripts/photo-gear.json"))}
                + if $exif.FocalLength then {focalLength: ($exif.FocalLength | round1)} else {} end)}
      else {} end
    + if $exif.FNumber then {aperture: ($exif.FNumber | round1)} else {} end
    + if $exif.ExposureTime then {shutter: ($exif.ExposureTime | shutter)} else {} end
    + if $exif.ISO then {iso: $exif.ISO} else {} end
  ') || die "could not build the camera details"
else
  meta_json=null
fi

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

# vipsthumbnail applies the EXIF rotation to the pixels and only ever shrinks.
vipsthumbnail "$source" \
  --size '2400x2400>' \
  --export-profile srgb \
  -o "$work/$slug.jpg[Q=85,optimize_coding,keep=none]"
"$root/scripts/check-photo-metadata.sh" "$work/$slug.jpg" ||
  die "the processed file still carries metadata; nothing was added"

entry=$(jq -n \
  --arg slug "$slug" \
  --arg caption "$caption" \
  --arg alt "$alt" \
  --argjson meta "$meta_json" \
  '{slug: $slug, caption: $caption, alt: $alt} + if $meta then {meta: $meta} else {} end')

mv "$work/$slug.jpg" "$dest"
jq --argjson entry "$entry" '[$entry] + .' "$manifest" >"$work/photos.json"
mv "$work/photos.json" "$manifest"

echo "added content/photos/$slug.jpg ($(vipsheader -f width "$dest")x$(vipsheader -f height "$dest"))"
jq . <<<"$entry"
