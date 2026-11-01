import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const audioRoot = path.join(root, "public/audio/music");
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

/** Read the MIDI tempo contract, rather than guessing BPM from a title. */
export function midiBpm(bytes) {
  assert.equal(bytes.toString("ascii", 0, 4), "MThd", "MIDI header");
  assert.equal(bytes.readUInt32BE(4), 6, "MIDI header length");
  const tempos = new Set();
  let offset = 14;
  const readVlq = (end) => {
    let value = 0;
    for (let count = 0; count < 4; count++) {
      assert.ok(offset < end, "MIDI variable-length value is truncated");
      const byte = bytes[offset++];
      value = (value << 7) | (byte & 0x7f);
      if (!(byte & 0x80)) return value;
    }
    assert.fail("Invalid MIDI variable-length value");
  };
  for (let track = 0; track < bytes.readUInt16BE(10); track++) {
    assert.equal(bytes.toString("ascii", offset, offset + 4), "MTrk", "MIDI track header");
    const end = offset + 8 + bytes.readUInt32BE(offset + 4);
    offset += 8;
    assert.ok(end <= bytes.length, "MIDI track is truncated");
    let runningStatus = 0;
    while (offset < end) {
      readVlq(end);
      let status = bytes[offset];
      if (status & 0x80) offset++;
      else { assert.ok(runningStatus, "MIDI running status"); status = runningStatus; }
      if (status === 0xff) {
        const kind = bytes[offset++], size = readVlq(end);
        assert.ok(offset + size <= end, "MIDI meta event is truncated");
        if (kind === 0x51) {
          assert.equal(size, 3, "MIDI tempo length");
          tempos.add(bytes.readUIntBE(offset, 3));
        }
        offset += size;
      } else if (status === 0xf0 || status === 0xf7) {
        runningStatus = 0;
        const size = readVlq(end);
        offset += size;
      } else {
        assert.ok(status >= 0x80 && status <= 0xef, "MIDI channel status");
        runningStatus = status;
        offset += (status & 0xf0) === 0xc0 || (status & 0xf0) === 0xd0 ? 1 : 2;
      }
      assert.ok(offset <= end, "MIDI event is truncated");
    }
  }
  assert.equal(offset, bytes.length, "Unexpected MIDI trailing data");
  assert.equal(tempos.size, 1, "Original score must have one uniform tempo");
  const tempo = [...tempos][0];
  assert.ok(tempo > 0, "Positive MIDI tempo");
  return Math.round(60_000_000 / tempo * 100) / 100;
}

function verifyVorbis(bytes, expectedSamples) {
  let offset = 0, first = true, ended = false, serial;
  while (offset < bytes.length) {
    assert.equal(bytes.toString("ascii", offset, offset + 4), "OggS", "OGG page header");
    assert.equal(bytes[offset + 4], 0, "OGG stream version");
    const segments = bytes[offset + 26], payloadStart = offset + 27 + segments;
    let size = 0;
    for (let index = 0; index < segments; index++) size += bytes[offset + 27 + index];
    assert.ok(payloadStart + size <= bytes.length, "OGG page is truncated");
    if (first) {
      assert.equal(bytes[offset + 5] & 2, 2, "OGG beginning of stream");
      serial = bytes.readUInt32LE(offset + 14);
      assert.equal(bytes[payloadStart], 1, "Vorbis identification packet");
      assert.equal(bytes.toString("ascii", payloadStart + 1, payloadStart + 7), "vorbis", "Vorbis codec");
      assert.equal(bytes[payloadStart + 11], 2, "Stereo original");
      assert.equal(bytes.readUInt32LE(payloadStart + 12), 44100, "Original sample rate");
      first = false;
    }
    assert.equal(bytes.readUInt32LE(offset + 14), serial, "Single OGG stream");
    if (bytes[offset + 5] & 4) {
      assert.equal(Number(bytes.readBigUInt64LE(offset + 6)), expectedSamples, "OGG final granule matches authored loop");
      assert.equal(payloadStart + size, bytes.length, "OGG end of stream is final");
      ended = true;
    }
    offset = payloadStart + size;
  }
  assert.ok(ended, "OGG end of stream exists");
}

export async function verifyMusicAssets() {
  const summary = { tracks: 0, ogg: 0, midi: 0, bytes: 0, regions: {} };
  for (const [region, expectedCount] of [["hk", 100], ["cn", 50], ["jp", 50]]) {
    const directory = path.join(audioRoot, region);
    const manifest = JSON.parse(await readFile(path.join(directory, "playlist.json"), "utf8"));
    const audit = JSON.parse(await readFile(path.join(directory, "catalog-audit.json"), "utf8"));
    assert.equal(manifest.version, 1);
    assert.equal(manifest.sourceCommit, "f44fe154f143790789fa00990f4aa9f4c31c7427");
    assert.equal(manifest.region, region);
    assert.equal(manifest.count, expectedCount);
    assert.equal(manifest.tracks.length, expectedCount);
    assert.equal(audit.region, region.toUpperCase());
    assert.equal(audit.count, expectedCount);
    assert.equal(audit.tracks.length, expectedCount);
    const referenced = new Set();
    for (const [index, track] of manifest.tracks.entries()) {
      const expectedId = `${region}-${String(index + 1).padStart(3, "0")}`;
      const hashes = audit.tracks[index];
      assert.equal(track.id, expectedId);
      assert.equal(hashes.id, track.id);
      assert.ok(track.title.trim());
      assert.equal(track.loop.startSample, 0);
      assert.equal(track.loop.sampleRate, 44100);
      assert.equal(track.loop.endSampleExclusive, hashes.decodedSamples);
      assert.equal(track.durationSeconds, Math.round(hashes.decodedSamples / 44100 * 1000) / 1000);
      for (const [key, extension, expectedHash] of [["audioUrl", "ogg", hashes.oggSha256], ["midiUrl", "mid", hashes.midiSha256]]) {
        const prefix = `/audio/music/${region}/`;
        assert.ok(track[key].startsWith(prefix));
        const filename = track[key].slice(prefix.length);
        assert.match(filename, new RegExp(`^[a-z0-9-]+\\.${extension}$`));
        assert.ok(!referenced.has(filename), "Each track has its own asset");
        referenced.add(filename);
        const bytes = await readFile(path.join(directory, filename));
        assert.equal(sha256(bytes), expectedHash, `${track.id} ${extension} frozen source SHA256`);
        if (extension === "ogg") { verifyVorbis(bytes, hashes.decodedSamples); summary.ogg++; }
        else { assert.equal(track.bpm, midiBpm(bytes)); summary.midi++; }
        summary.bytes += bytes.length;
      }
      summary.tracks++;
    }
    const actualFiles = (await readdir(directory)).filter(filename => /\.(ogg|mid|midi|mp3)$/.test(filename));
    assert.deepEqual(new Set(actualFiles), referenced, "Only the selected originals ship");
    summary.regions[region] = expectedCount;
  }
  assert.equal(summary.tracks, 200);
  assert.equal(summary.ogg, 200);
  assert.equal(summary.midi, 200);
  return summary;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await verifyMusicAssets(), null, 2));
}
