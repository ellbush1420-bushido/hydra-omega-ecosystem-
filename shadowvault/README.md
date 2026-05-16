# ShadowVault Hydra Build — Warp.dev + Python

This repository scaffold turns the merged Omega Hydra stack into a runnable Python command center:

- **ShadowVault shell** for local generation, lore, doctrine, and campaign packaging
- **Hydra Creator Bridge** for ComfyUI API queue integration
- **Wan 2.2 workflow slots** for video workflow payloads
- **Lore + Doctrine engines** for Shadow Monastery / Realm of 5 Crowns / creative martial-arts codex content
- **Tracking Matrix** with compliant redirect-link generation and analytics metadata
- **Warp.dev command spine** with reusable workflows and terminal runbooks

## Run locally

```bash
cd shadowvault
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
# macOS/Linux
# source .venv/bin/activate
pip install -e .
cp .env.example .env  # macOS/Linux
# copy .env.example .env  # Windows
hydra doctor
hydra serve
```

API will start at `http://127.0.0.1:5055`.

## Primary commands

```bash
hydra doctor
hydra doctrine seed
hydra lore seed
hydra campaign batch --days 30
hydra creator queue-image --character den_mother --prompt "wuxia obsidian cathedral portrait"
hydra tracker link OH-C001-DENMOTHER-WUXIA-A --path velvet
hydra investor report
```

## Safety boundary

The build keeps public outputs **fictional, cinematic, and non-explicit**. Mature Velvet Vault routing is modeled as age-gated metadata and review status, not as an explicit generation system. Tracking is designed for compliant analytics and server-side attribution, not deceptive cloaking.
