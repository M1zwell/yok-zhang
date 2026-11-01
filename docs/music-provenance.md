# AI Music Play collection

The `/music` collection reuses 200 existing original synthetic instrumental
drafts: Hong Kong 100, China 50 and Japan 50. No new music was generated for
this integration. Audio and MIDI files were copied without re-rendering.

Source repository: [Jubit-AI/jubuddy-game](https://github.com/Jubit-AI/jubuddy-game),
frozen asset commit
[`f44fe154f143790789fa00990f4aa9f4c31c7427`](https://github.com/Jubit-AI/jubuddy-game/tree/f44fe154f143790789fa00990f4aa9f4c31c7427).
The source directories are `apps/web/public/audio/slop-hk`, `slop-cn` and
`slop-jp`. This integration is specifically authorized by the site owner; it
does not change the source repository's proprietary license or grant a general
license to reuse its code or assets.

The supplied per-region `catalog-audit.json` files describe the collection as
programmatically composed and synthesized originals with no external recordings
or samples. They retain the producer's SHA256 values for all 200 OGG files and
200 MIDI files, the authored decoded frame counts, source-script fingerprints,
and the original validation statement. These technical checks do not establish
human listening approval or exhaustive similarity clearance.

The separate legacy **Sunset Ink / monsoon** supplied-score-derived arrangement
and the old commercial song list are excluded. Optional MP3 previews of the
first three HK tracks are also excluded; every track here uses its original OGG
and MIDI pair.

## Runtime metadata

The normalized regional `public/audio/music/{hk,cn,jp}/playlist.json` files keep
the original ordered track IDs, bilingual titles and authored loop samples.
Paths are local to iChina. The duration is calculated from the loop frame count
at 44,100 Hz and rounded to milliseconds for display. BPM is read from each
MIDI's uniform tempo event and rounded to two decimal places. The neutral
“Original instrumental” mood label describes the format rather than asserting
an unverified genre or a listening review.

`lib/music/catalog.ts` exposes the three regional manifests to the player.
Only the selected audio should load, after a user chooses playback. Exact loop
bounds remain available to the audio engine.

## Recheck the imported collection

Run from the repository root:

```sh
node scripts/verify-music-assets.mjs
```

The verifier checks all 400 imported file hashes against the frozen audits,
the complete regional counts and ordering, the MIDI-derived BPM, OGG Vorbis
stereo/sample-rate headers, final OGG granules against authored loop lengths,
and the absence of extra audio assets. It does not audition music or test a
physical device.
