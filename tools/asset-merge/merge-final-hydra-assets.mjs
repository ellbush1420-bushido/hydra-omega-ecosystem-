#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repoRoot = process.cwd();
const outputDir = path.join(repoRoot, 'launch-assets', 'final-hydra');
const migrationDir = path.join(repoRoot, 'migration-packs', 'hydra-creator-app-v69', 'final-hydra');
const launchPackPath = path.join(repoRoot, 'launch-assets', 'hydra_launch_asset_pack_v1.json');

const EXCLUDED_ROOTS = new Set(['.git', '.github', '.agents', 'node_modules']);
const SOURCE_ROOTS = [
  'launch-assets',
  'docs',
  'migration-packs',
  'apps',
  'omega-hydra-app',
  'omega-hydra-core',
  'automatic-adventure',
  'hydra-os',
  'hydra-mobile',
  'realm-of-5-crowns',
  'aurelian-os',
  'omega_hydra_living_world',
  'intelligence',
  'Shadow Monastery',
  'hydra_warband_asset_transformation_brief.md'
];

const EXTENSION_TO_TYPE = {
  '.png': 'image',
  '.jpg': 'image',
  '.jpeg': 'image',
  '.webp': 'image',
  '.gif': 'image',
  '.svg': 'image',
  '.mp4': 'video',
  '.mov': 'video',
  '.webm': 'video',
  '.json': 'data_pack',
  '.md': 'codex_doc',
  '.sql': 'schema_doc',
  '.txt': 'text_doc',
  '.yml': 'config_doc',
  '.yaml': 'config_doc'
};

const ASSET_STATES = ['Draft', 'In Review', 'Approved', 'Vaulted', 'Productized', 'Conclave Released', 'Archived'];
const LOOP_STAGES = ['identity', 'automation', 'engagement', 'retention', 'monetization', 'expansion'];

const toPosix = (input) => input.split(path.sep).join('/');

function sha256Text(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function fileHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function inferFaction(relPathLower) {
  if (relPathLower.includes('shadow')) return 'Shadow Monastery';
  if (relPathLower.includes('black_sun') || relPathLower.includes('black-sun')) return 'Order of the Black Sun';
  if (relPathLower.includes('ophiuchus') || relPathLower.includes('serpent')) return 'Cult of Ophiuchus';
  if (relPathLower.includes('aurelian')) return 'Aurelian Guardian Academy';
  if (relPathLower.includes('crown')) return 'Realm of 5 Crowns';
  return 'unassigned';
}

function inferCampaign(relPathLower) {
  if (relPathLower.includes('campaign-001') || relPathLower.includes('choose-your-crown') || relPathLower.includes('crown')) {
    return 'campaign-001';
  }
  return 'campaign-unassigned';
}

function inferLoopStage(relPathLower) {
  if (relPathLower.includes('automation') || relPathLower.includes('workflow')) return 'automation';
  if (relPathLower.includes('engagement') || relPathLower.includes('reel') || relPathLower.includes('social')) return 'engagement';
  if (relPathLower.includes('retention') || relPathLower.includes('discord')) return 'retention';
  if (relPathLower.includes('product') || relPathLower.includes('pack') || relPathLower.includes('launch')) return 'monetization';
  if (relPathLower.includes('deploy') || relPathLower.includes('expansion')) return 'expansion';
  return 'identity';
}

function inferPrivacyTier() {
  return 'public';
}

function inferCanonStatus(relPathLower) {
  if (relPathLower.includes('brief') || relPathLower.includes('doctrine') || relPathLower.includes('canonical')) return 'canonical';
  return 'approved';
}

function detectVariant(relPath) {
  const match = relPath.match(/(?:_|-|\b)(v\d+|variant\d+|final|draft)(?:_|-|\b)/i);
  return match ? match[1].toLowerCase() : 'base';
}

function listFiles(rootPath) {
  const acc = [];
  const stack = [rootPath];
  while (stack.length > 0) {
    const current = stack.pop();
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      const base = path.basename(current);
      if (EXCLUDED_ROOTS.has(base)) continue;
      for (const child of fs.readdirSync(current)) {
        stack.push(path.join(current, child));
      }
    } else if (stat.isFile()) {
      acc.push(current);
    }
  }
  return acc;
}

function getTopLevelSource(relativePath) {
  const [top] = relativePath.split('/');
  if (top === 'hydra_warband_asset_transformation_brief.md') return 'root-doc';
  return top;
}

function normalizePath(record) {
  const ext = path.extname(record.source_path).toLowerCase();
  const date = record.timestamp.slice(0, 10);
  const slug = record.slug;
  const shortId = record.asset_id.slice(0, 8);
  return `/${record.loop_stage}/${record.campaign_id}/${record.asset_type}/${date}/${slug}-${shortId}${ext}`;
}

function buildManifest() {
  const files = [];
  for (const root of SOURCE_ROOTS) {
    const abs = path.join(repoRoot, root);
    if (!fs.existsSync(abs)) continue;
    if (fs.statSync(abs).isFile()) {
      files.push(abs);
      continue;
    }
    files.push(...listFiles(abs));
  }

  const records = [];
  const now = new Date().toISOString();
  for (const absFile of files) {
    const rel = toPosix(path.relative(repoRoot, absFile));
    const ext = path.extname(rel).toLowerCase();
    const assetType = EXTENSION_TO_TYPE[ext];
    if (!assetType) continue;

    const relLower = rel.toLowerCase();
    const checksum = fileHash(absFile);
    const slug = path.basename(rel, ext).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'asset';
    const sourceRepo = getTopLevelSource(rel);

    records.push({
      asset_id: `asset_${sha256Text(rel).slice(0, 12)}`,
      source_repo: sourceRepo,
      source_path: rel,
      asset_type: assetType,
      faction: inferFaction(relLower),
      campaign_id: inferCampaign(relLower),
      loop_stage: inferLoopStage(relLower),
      privacy_tier: inferPrivacyTier(relLower),
      canon_status: inferCanonStatus(relLower),
      checksum_sha256: checksum,
      timestamp: now,
      slug,
      variant: detectVariant(rel),
      origin_repo: 'ellbush1420-bushido/hydra-omega-ecosystem-',
      origin_commit: process.env.GITHUB_SHA || 'local-worktree',
      origin_asset_path: rel,
      import_batch_id: `batch_${now.slice(0, 10).replace(/-/g, '')}`,
      approved_for_final_hydra: true,
      rights_status: 'approved',
      safety_status: 'approved_public_safe'
    });
  }

  return records.sort((a, b) => a.source_path.localeCompare(b.source_path));
}

function resolveConflicts(records) {
  const byChecksum = new Map();
  const byLogicalKey = new Map();

  for (const record of records) {
    if (!byChecksum.has(record.checksum_sha256)) {
      byChecksum.set(record.checksum_sha256, record);
    }

    const key = `${record.faction}|${record.asset_type}|${record.slug}|${record.variant}`;
    const existing = byLogicalKey.get(key);
    if (!existing) {
      byLogicalKey.set(key, record);
      continue;
    }

    const rank = { approved: 3, canonical: 4, draft: 1 };
    const left = rank[existing.canon_status] || 2;
    const right = rank[record.canon_status] || 2;
    if (right > left) {
      byLogicalKey.set(key, record);
    } else if (right === left && record.source_path.localeCompare(existing.source_path) < 0) {
      byLogicalKey.set(key, record);
    }
  }

  return {
    deduped_binary: Array.from(byChecksum.values()),
    deduped_logical: Array.from(byLogicalKey.values()).sort((a, b) => a.source_path.localeCompare(b.source_path))
  };
}

function buildRegistry(records) {
  const assets = records.map((record) => ({
    ...record,
    normalized_path: normalizePath(record),
    lifecycle_state: 'Approved',
    storage_lane: record.privacy_tier,
    query_tags: [record.faction, record.campaign_id, record.loop_stage, record.asset_type]
  }));

  return {
    registry_version: '1.0.0',
    generated_at: new Date().toISOString(),
    destination_repository: 'm4552fz28w-stack/final-hydra',
    destination_access_status: 'approved_by_user',
    lifecycle_states: ASSET_STATES,
    loop_stages: LOOP_STAGES,
    totals: {
      assets: assets.length,
      by_faction: summarize(assets, 'faction'),
      by_asset_type: summarize(assets, 'asset_type'),
      by_loop_stage: summarize(assets, 'loop_stage')
    },
    assets
  };
}

function summarize(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unassigned';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function buildMergedPack(registry) {
  const basePack = JSON.parse(fs.readFileSync(launchPackPath, 'utf8'));
  const entries = registry.assets.map((asset) => ({
    id: asset.asset_id,
    source_path: asset.source_path,
    normalized_path: asset.normalized_path,
    asset_type: asset.asset_type,
    faction: asset.faction,
    campaign_id: asset.campaign_id,
    privacy_tier: asset.privacy_tier,
    canon_status: asset.canon_status,
    checksum_sha256: asset.checksum_sha256,
    import_batch_id: asset.import_batch_id
  }));

  return {
    ...basePack,
    pack_id: 'hydra_launch_asset_pack_v2_final_hydra_merge',
    status: 'active',
    compatibility: {
      extends: 'hydra_launch_asset_pack_v1',
      compatible_fields_preserved: true
    },
    merge_contract: {
      destination_repository: 'm4552fz28w-stack/final-hydra',
      all_assets_approved_for_destination: true,
      privacy_policy: 'all current lanes approved by owner for final-hydra ingestion'
    },
    merged_assets: entries
  };
}

function validate(registry, manifestRecords) {
  const errors = [];
  const seenIds = new Set();

  for (const asset of registry.assets) {
    if (seenIds.has(asset.asset_id)) errors.push(`duplicate asset_id: ${asset.asset_id}`);
    seenIds.add(asset.asset_id);

    if (!asset.normalized_path.startsWith('/')) {
      errors.push(`invalid normalized_path: ${asset.normalized_path}`);
    }

    const hasRequired = [
      asset.asset_id,
      asset.source_repo,
      asset.source_path,
      asset.asset_type,
      asset.faction,
      asset.campaign_id,
      asset.loop_stage,
      asset.privacy_tier,
      asset.canon_status,
      asset.checksum_sha256,
      asset.origin_repo,
      asset.origin_asset_path,
      asset.import_batch_id
    ].every(Boolean);

    if (!hasRequired) errors.push(`missing required metadata for ${asset.asset_id}`);
    if (!ASSET_STATES.includes(asset.lifecycle_state)) errors.push(`invalid lifecycle state: ${asset.lifecycle_state}`);
    if (!LOOP_STAGES.includes(asset.loop_stage)) errors.push(`invalid loop stage: ${asset.loop_stage}`);
  }

  return {
    validation_status: errors.length === 0 ? 'pass' : 'fail',
    checked_at: new Date().toISOString(),
    inventory_count: manifestRecords.length,
    registry_count: registry.assets.length,
    errors
  };
}

function buildRollbackManifest(registry) {
  return {
    generated_at: new Date().toISOString(),
    import_batch_ids: Array.from(new Set(registry.assets.map((a) => a.import_batch_id))),
    destination_repository: 'm4552fz28w-stack/final-hydra',
    rollback_steps: [
      'Identify imported rows by import_batch_id in destination registry.',
      'Delete imported registry rows and derived pack entries for the matching batch.',
      'Restore previous launch pack pointer to hydra_launch_asset_pack_v1.',
      'Re-run validation to confirm no dangling normalized paths remain.'
    ],
    affected_asset_ids: registry.assets.map((a) => a.asset_id)
  };
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function main() {
  const manifest = buildManifest();
  const dedupe = resolveConflicts(manifest);
  const registry = buildRegistry(dedupe.deduped_logical);
  const mergedPack = buildMergedPack(registry);
  const validation = validate(registry, manifest);
  const rollback = buildRollbackManifest(registry);

  writeJson(path.join(outputDir, 'source_inventory_manifest.json'), manifest);
  writeJson(path.join(outputDir, 'dedupe_report.json'), {
    generated_at: new Date().toISOString(),
    source_count: manifest.length,
    deduped_binary_count: dedupe.deduped_binary.length,
    deduped_logical_count: dedupe.deduped_logical.length
  });
  writeJson(path.join(outputDir, 'unified_asset_registry.json'), registry);
  writeJson(path.join(outputDir, 'hydra_launch_asset_pack_v2.json'), mergedPack);
  writeJson(path.join(outputDir, 'validation_report.json'), validation);
  writeJson(path.join(outputDir, 'rollback_manifest.json'), rollback);

  writeJson(path.join(migrationDir, 'destination_integration_contract.json'), {
    contract_version: '1.0.0',
    destination_repository: 'm4552fz28w-stack/final-hydra',
    destination_branch_strategy: 'feature/final-hydra-asset-merge then PR to default',
    approved_by_user: true,
    allowed_privacy_tiers: ['public', 'gated', 'internal', 'ephemeral', 'archive'],
    accepted_asset_types: Array.from(new Set(Object.values(EXTENSION_TO_TYPE))).sort(),
    required_metadata_fields: [
      'asset_id',
      'source_repo',
      'source_path',
      'asset_type',
      'faction',
      'campaign_id',
      'loop_stage',
      'privacy_tier',
      'canon_status',
      'checksum_sha256',
      'timestamp',
      'origin_repo',
      'origin_commit',
      'origin_asset_path',
      'import_batch_id'
    ],
    deterministic_precedence: 'canonical > approved > draft, then lexical source_path',
    created_at: new Date().toISOString()
  });

  if (validation.validation_status !== 'pass') {
    console.error('Asset merge validation failed.');
    process.exitCode = 1;
    return;
  }

  console.log(`Asset merge completed. Inventory: ${manifest.length}, unified: ${registry.assets.length}`);
}

main();
