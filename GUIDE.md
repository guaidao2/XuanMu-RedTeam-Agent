# XuanMu Red-Team Agent — Getting Started Guide

> Version: v0.2.1 (Blackboard Edition)

---

## Table of Contents

1. [Quick Install](#1-quick-install)
2. [Configure LLM](#2-configure-llm)
3. [Start & Login](#3-start--login)
4. [Create Your First Project](#4-create-your-first-project)
5. [Using the Playground](#5-using-the-playground)
6. [Meet the Agent Team](#6-meet-the-agent-team)
7. [Using the Blackboard](#7-using-the-blackboard)
8. [Custom Skills](#8-custom-skills)
9. [Understanding the Evidence Plane](#9-understanding-the-evidence-plane)
10. [FAQ](#10-faq)

---

## 1. Quick Install

### Requirements

| Item | Requirement |
|------|-------------|
| OS | **Linux** (Kali Linux / Debian 12 recommended) |
| Python | ≥ 3.12 |
| Node.js | ≥ 18 (for frontend build) |
| PostgreSQL | Installed automatically by setup script |
| Disk | At least 2GB free space |

### One-Command Setup

```bash
git clone https://github.com/guaidao2/XuanMu-RedTeam-Agent.git
cd XuanMu-RedTeam-Agent
bash setup.sh
```

The setup takes 3–10 minutes and will:

1. Install system dependencies (PostgreSQL, Node.js)
2. Create PostgreSQL database and user
3. Create Python virtual environment and install backend deps
4. Build the frontend
5. Verify the installation
6. Create `start.sh` and `stop.sh` convenience scripts

> ⚠️ The setup script requires `sudo` privileges for system packages and PostgreSQL.
> Run it on a **clean VM or dedicated machine**.

You'll see this on success:

```
[✓] Setup complete
[~] Creating convenience scripts...
[✓] Convenience scripts created
```

---

## 2. Configure LLM

### Option A: Interactive Config (Recommended)

```bash
bash config-tool.sh
```

Follow the prompts to:
1. Select a role (or "set all roles at once")
2. Enter your API Key
3. Enter the API base URL (default: `https://api.deepseek.com/v1`)
4. Enter the model name (default: `deepseek-chat`)

### Option B: Manual JSON Edit

```bash
vi .xuanmu/config.json
```

The config structure:

```json
{
  "agents": {
    "cso": {
      "name": "XuanMu",
      "base_url": "https://api.deepseek.com/v1",
      "api_key": "sk-your-api-key",
      "model": "deepseek-chat"
    },
    "cae": { "...same structure..." },
    "cie": { "...same structure..." },
    "cpe": { "...same structure..." },
    "cre": { "...same structure..." },
    "cce": { "...same structure..." }
  }
}
```

> 💡 **Tip**: All roles can share the same API key and model, or you can use different models per role.

### Supported Providers

| Provider | API Base URL | Recommended Model |
|----------|-------------|-------------------|
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o` |
| Anthropic | `https://api.anthropic.com` | `claude-sonnet-4-20250514` |
| Any OpenAI-compatible | your provider's URL | your model |

---

## 3. Start & Login

### Start

```bash
bash start.sh
```

Successful startup shows:

```
Backend started on http://localhost:8000
Frontend built
```

### Login

Open **http://localhost:8000** in your browser.

Default admin credentials:

| Field | Value |
|-------|-------|
| Email | `admin@admin.com` |
| Password | `admin123` |

> ⚠️ **Change the default password immediately!**
> Go to System → User Management.

### Stop

```bash
bash stop.sh
```

---

## 4. Create Your First Project

A WorkProject is XuanMu's core organizational unit — all assets, findings, and reasoning traces belong to a project.

### Steps

1. Click **"Projects"** in the left sidebar
2. Click **"Create Project"** in the top-right
3. Fill in the details:

| Field | Description | Example |
|-------|-------------|---------|
| Name | Short identifier | `Internal Pentest` |
| Description | Scope & objectives | `Penetration test on 10.0.0.0/24` |
| Type | `penetration_test` or `source_code_audit` | penetration_test |
| Assets | Initial targets (can add more later) | `10.0.0.1`, `10.0.0.2` |

4. Click **"Create"**

### Project States

| State | Meaning |
|-------|---------|
| `working` | In progress — agents are actively working |
| `completed` | Done — objectives achieved |
| `canceled` | Manually aborted |

---

## 5. Using the Playground

The Playground is your main interface for interacting with the agent team.

### Starting a Session

1. Click **"Playground"** in the left sidebar
2. Select or create a WorkProject at the top (required for Blackboard)
3. Type your task into the input box

### Example Commands

```
# Start a pentest
"Port scan and vulnerability detection on 10.0.0.1"

# Inject a Blackboard Hint
"Note: the target may have a WAF, use slow scanning"

# Check progress
"What's the current status?"

# Get findings
"Report all discovered vulnerabilities"
```

### Response Structure

Each agent reply includes:
- **CSO's reasoning** — analysis and decisions
- **Delegation records** — which expert was assigned what
- **Tool calls** — what commands were executed
- **Blackboard updates** — what Facts/Intents were recorded

### Session Management

- View past sessions in the left panel
- Each session is independent
- Sessions bound to the same project share all project data

---

## 6. Meet the Agent Team

### Roles

| Code | Name | Specialty |
|------|------|-----------|
| **CSO** | XuanMu | Security Lead — task decomposition, coordination, final decisions |
| **CAE** | ShouZhuo | Code Audit — source code security review, vulnerability pattern detection |
| **CIE** | GuanXing | Intelligence & Recon — information gathering, asset discovery, subdomain enumeration |
| **CPE** | PoJun | Penetration Testing — port scanning, vulnerability exploitation, lateral movement |
| **CRE** | SuYuan | Reverse Engineering — binary analysis, debugging, deobfuscation |
| **CCE** | PoZhen | Cryptography — crypto protocol analysis, weak password detection |

### Collaboration Flow

1. **You send a task** → CSO receives it
2. **CSO analyzes** → reads the Blackboard to understand current state
3. **CSO delegates** → assigns the right expert(s)
4. **Expert executes** → uses tools, records Facts to the Blackboard
5. **CSO summarizes** → reads the Blackboard, evaluates progress, decides next steps
6. **Replies to you** → reports results

Throughout the process, all agents coordinate through the **shared Blackboard** — no one interrupts each other.

---

## 7. Using the Blackboard

The Blackboard is the platform's core feature, recording the agents' complete reasoning process.

### Viewing the Blackboard

**Method 1: From the Project Workspace**

1. Go to "Projects"
2. Click a project name to enter its workspace
3. Switch to the **Blackboard** tab

**Method 2: From the Playground**

1. In the Playground, click the project info button in the top-right corner
2. Switch to the **Blackboard** tab

### Node Types

| Color | Type | Meaning | Lifecycle |
|-------|------|---------|-----------|
| 🟢 | **Fact** | A confirmed, objective finding | proposed → confirmed / rejected |
| 🔵 | **Intent** | A declared exploration direction | proposed → in_progress → confirmed / rejected |
| 🟠 | **Hint** | Human or agent guidance | persisted |

### Node States

| State | Meaning |
|-------|---------|
| `proposed` | Just declared, not yet started |
| `in_progress` | Currently being worked on |
| `confirmed` | Verified (Fact has evidence, Intent completed) |
| `rejected` | Dead end (prevents repeated work) |
| `superseded` | Replaced by a better node |

### Typical Blackboard Evolution

A penetration test might evolve on the Blackboard like this:

```
Phase 1: Recon
  Intent: "Scan open ports on 10.0.0.1"
  Fact: "Found ports 22 (SSH), 80 (HTTP), 443 (HTTPS)"

Phase 2: Web Probing
  Intent: "Identify web service on port 80"
  Fact: "nginx 1.2.3, CVE-2024-xxx identified"
  Intent: "Attempt CVE-2024-xxx exploitation"

Phase 3: Results
  Fact: "CVE-2024-xxx exploitation failed — target is patched"  (rejected)
  Intent: "Try SSH brute force"
  Fact: "SSH root/toor login successful"  (confirmed)

Phase 4: Lateral Movement
  Intent: "Move laterally from 10.0.0.1 to 10.0.0.2"
  ...
```

You can inject Hints anytime to guide direction:

```
In a conversation say: "Spend more time on port 80, skip SSH for now"
→ CSO writes a Hint node to the Blackboard, visible to all experts
```

### Why the Blackboard Matters

| Scenario | Without Blackboard | With Blackboard |
|----------|-------------------|-----------------|
| Expert A tried a direction and failed | Expert B might try it again | B sees `rejected`, skips it |
| You want to give mid-task guidance | Have to repeat yourself | Write one Hint, all agents see it |
| Agent times out | Progress is lost | Returns, reads Blackboard, resumes |
| Post-assessment review | Scroll through chat history | Trace Fact→Intent graph |
| Compare multiple projects | Go by memory | Compare Blackboard patterns |

---

## 8. Custom Skills

### What Are Skills

Skills are **domain knowledge modules** that agents can load dynamically. Each Skill corresponds to a tool or methodology. Agents use `load_skill` to fetch usage instructions before operating the tool.

XuanMu comes with built-in skills (nmap, sqlmap, httpx, binwalk, jadx, etc.), primarily used in sandbox container mode.

### Adding Your Own Skill (Local Mode)

Drop a skill directory under `.agents/skills/` — no code changes needed:

```bash
mkdir -p .agents/skills/my-tool
```

Each skill directory structure:

```
.agents/skills/
└── my-tool/
    ├── SKILL.md        ← required: skill instructions (with YAML frontmatter)
    ├── script.sh       ← optional: helper scripts
    └── data/           ← optional: data files
```

### SKILL.md Format

````markdown
---
name: my-tool
description: A concise description of what this skill does.
---

# My Tool

Command format and notes for using `my-tool`...

## Help First

Always run the help command first for real options:

```sh
my-tool --help
```

## Output

- Report what was done and what the results are
````

### How Agents Use Skills

1. **`list_skills`** — Agent checks what skills are available
2. **`load_skill("my-tool")`** — Agent loads the full SKILL.md into context
3. Agent follows the SKILL.md guidance to execute commands
4. If the skill directory has helper scripts, the agent can reference their paths

### Built-in Skills

| Skill | Purpose |
|-------|---------|
| `nmap` | Port scanning, service detection, NSE scripts |
| `sqlmap` | Automated SQL injection detection & exploitation |
| `httpx` | HTTP probing, tech stack fingerprinting |
| `binwalk` | Firmware analysis, file extraction |
| `jadx` | APK/DEX decompilation |
| `apktool` | APK unpack/repack |
| `ghidra` | Binary reverse analysis |
| `openssl` | Certificate analysis, TLS diagnostics |
| `dns-whois` | DNS queries, WHOIS information gathering |
| `observer-ward` | Web fingerprinting |
| `archive-file-triage` | Archive classification & unpacking |
| `sandbox-shell` | Basic sandbox shell operations |

> These skills are primarily used in **sandbox container mode**. In local mode (no Docker), only custom skills under `.agents/skills/` are loaded.

---

## 9. Understanding the Evidence Plane

The Evidence Plane is the project's structured data layer, complementing the Blackboard:

```
Blackboard (process layer): why we looked → what we found → what's next
Evidence Plane (result layer): asset list → findings → graph → attack paths
```

### Tab Reference

| Tab | Content | Who Uses It |
|-----|---------|-------------|
| **Assets** | Asset inventory (IPs, domains, services) | Everyone |
| **Findings** | Vulnerability findings (title, severity, status) | Report writers |
| **Attack Paths** | Attack chains (entry point to objective) | Pentest reporting |
| **Graph** | Asset relationship graph (visual network topology) | Overview |
| **Blackboard** | Reasoning process graph (agent's thought chain) | Review & audit |

### Relationship with the Blackboard

```
On the Blackboard:
  Fact: "10.0.0.1:80 is nginx 1.2.3"
  Fact: "CVE-2024-xxx exists"
  Fact: "Exploitation failed (patched)"

On the Evidence Plane:
  Asset: 10.0.0.1:80  (service)
  Finding: "nginx 1.2.3 patched" (info)
```

The Blackboard records "we tried and failed" — that's the reasoning process.
The Evidence Plane only records "what exists, what was confirmed" — that's the final result.

---

## 10. FAQ

### Q: Agents aren't working as expected?

1. Check that the API key in `.xuanmu/config.json` is correct
2. Verify your model supports Function Calling / tool use
3. Try giving more specific instructions in the conversation
4. Check the Blackboard to see the agents' current reasoning state

### Q: How do I reset a project?

Delete the project and recreate it. Deleting a project removes all associated data (assets, findings, Blackboard nodes, etc.).

### Q: What if the Blackboard gets too large?

The Blackboard is append-only, but project-level boards rarely grow too large. If needed, delete and recreate the project.

### Q: How do I switch LLM models?

Re-run `bash config-tool.sh` or edit `base_url` and `model` fields in `.xuanmu/config.json` for each role.

### Q: I forgot the admin password?

Reset via command line:

```bash
source .venv/bin/activate
python << 'EOF'
from database import get_sync_session
from model.system.users import SystemUser
from passlib.hash import bcrypt
with get_sync_session() as s:
    user = s.query(SystemUser).filter(SystemUser.email == "admin@admin.com").first()
    user.password = bcrypt.hash("admin123")
    s.commit()
EOF
```

### Q: How do I upgrade?

```bash
git pull
source .venv/bin/activate
pip install -r requirements.txt
cd web && npm install && npm run build && cd ..
```
