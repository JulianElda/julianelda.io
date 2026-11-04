#!/usr/bin/env bash
# Adds photos to /photos: writes content/photos/<slug>.jpg for each and puts
# its entry at the top of content/photos/photos.json, which is the display
# order. Folders are read one level deep; photos go in oldest first, so the
# newest ends up on top.
#
# Each JPEG keeps nothing but pixels: rotation is applied to them, it is shrunk
# to fit 2400px and converted to sRGB, and every metadata tag is dropped, then
# scripts/check-photo-metadata.sh must pass on it before it lands.
#
# New photos get a hash of the processed image as a temporary slug and an empty
# caption and alt; scripts/name-photo.sh gives them readable ones. Running the
# same folder twice skips what is already in, whatever it was named.
#
# Camera details are read from the original and only for what the page shows:
# camera, lens with focal length (interchangeable lenses only), aperture,
# shutter and ISO. Never location, dates or serial numbers. They are written
# for cameras and left out for phones (kind in scripts/photo-gear.json);
# --meta or --no-meta overrides that for every photo given. Left out means
# absent from the public repo, not just hidden on the page.
#
# usage: scripts/add-photo.sh [--meta | --no-meta] <file or folder>...

set -euo pipefail

die() {
  echo "add-photo: $*" >&2
  exit 1
}

for tool in exiftool jq vipsthumbnail; do
  command -v "$tool" >/dev/null || die "$tool not found; it comes from flake.nix (direnv allow)"
done

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
photos_dir="$root/content/photos"
manifest="$photos_dir/photos.json"
gear="$root/scripts/photo-gear.json"

meta_flag=default
case "${1-}" in
--meta)
  meta_flag=yes
  shift
  ;;
--no-meta)
  meta_flag=no
  shift
  ;;
esac
[ $# -gt 0 ] || die "usage: scripts/add-photo.sh [--meta | --no-meta] <file or folder>..."

is_image() {
  case "${1,,}" in
  *.jpg | *.jpeg | *.png | *.webp | *.heic | *.heif | *.avif) return 0 ;;
  *) return 1 ;;
  esac
}

sources=()
for arg in "$@"; do
  if [ -d "$arg" ]; then
    for file in "$arg"/*; do
      [ -f "$file" ] || continue
      if is_image "$file"; then
        sources+=("$file")
      else
        echo "skipped ${file##*/}: not a photo the script reads (export raws to JPEG first)"
      fi
    done
  elif [ -f "$arg" ] && is_image "$arg"; then
    sources+=("$arg")
  else
    die "$arg: not a photo or a folder"
  fi
done
[ ${#sources[@]} -gt 0 ] || die "no photos found"

mkdir -p "$photos_dir"
[ -f "$manifest" ] || echo "[]" >"$manifest"

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

# Oldest first; the capture time is only used for this order, never stored.
# Photos without one go first.
mapfile -t sources < <(
  exiftool -q -json -n -DateTimeOriginal -- "${sources[@]}" |
    jq -r 'sort_by(.DateTimeOriginal // "" | tostring) | .[].SourceFile'
)

# Prints the camera details for one photo as JSON, or "null" for none.
meta_for() {
  local source=$1 exif model body show=$meta_flag
  # Only the fields the page can show are ever read out of the original.
  exif=$(exiftool -json -n -Model -LensModel -FocalLength -FNumber -ExposureTime -ISO -- "$source" | jq '.[0]')
  model=$(jq -r '.Model // empty' <<<"$exif")
  body=$(jq -c --arg model "$model" '.bodies[$model] // empty' "$gear")

  if [ -z "$body" ] && [ -n "$model" ] && [ "$show" != no ]; then
    die "${source##*/}: unknown camera \"$model\": add it to scripts/photo-gear.json"
  fi
  if [ "$show" = default ]; then
    show=no
    [ -n "$body" ] && [ "$(jq -r .kind <<<"$body")" = camera ] && show=yes
  fi
  if [ "$show" = yes ] && [ -z "$body" ]; then
    die "${source##*/}: the file records no camera model"
  fi
  if [ "$show" = no ]; then
    echo null
    return
  fi

  jq -n \
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
  ' || die "${source##*/}: could not build the camera details"
}

added=0
for source in "${sources[@]}"; do
  meta=$(meta_for "$source")

  # vipsthumbnail applies the EXIF rotation to the pixels and only ever shrinks.
  vipsthumbnail "$source" \
    --size '2400x2400>' \
    --export-profile srgb \
    -o "$work/photo.jpg[Q=85,optimize_coding,keep=none]"
  "$root/scripts/check-photo-metadata.sh" "$work/photo.jpg" ||
    die "${source##*/}: the processed file still carries metadata; it was not added"

  # The same original always processes to the same bytes, so a matching hash
  # means it is already in, whatever its slug was renamed to.
  hash=$(sha256sum "$work/photo.jpg" | cut -d' ' -f1)
  existing=""
  shopt -s nullglob
  current=("$photos_dir"/*.jpg)
  shopt -u nullglob
  if [ ${#current[@]} -gt 0 ]; then
    existing=$(sha256sum "${current[@]}" | awk -v hash="$hash" '$1 == hash { print $2 }')
  fi
  if [ -n "$existing" ]; then
    existing=${existing##*/}
    echo "skipped ${source##*/}: already added as ${existing%.jpg}"
    continue
  fi
  slug=${hash:0:10}

  mv "$work/photo.jpg" "$photos_dir/$slug.jpg"
  jq --arg slug "$slug" --argjson meta "$meta" \
    '[{slug: $slug, caption: "", alt: ""} + if $meta then {meta: $meta} else {} end] + .' \
    "$manifest" >"$work/photos.json"
  mv "$work/photos.json" "$manifest"
  added=$((added + 1))
  echo "added ${source##*/} as $slug ($(vipsheader -f width "$photos_dir/$slug.jpg")x$(vipsheader -f height "$photos_dir/$slug.jpg"))"
done

echo "$added added. Give each a slug, caption and alt text with scripts/name-photo.sh."
