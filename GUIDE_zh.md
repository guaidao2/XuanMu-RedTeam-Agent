# 玄幕红队智能体 — 使用入门手册

> 版本：v0.2.1（黑板架构版）

---

## 目录

1. [快速安装](#quick-install)
2. [配置 LLM](#configure-llm)
3. [启动与登录](#start--login)
4. [创建你的第一个项目](#create-project)
5. [使用 Playground 对话](#playground)
6. [理解智能体团队](#agent-team)
7. [使用黑板（Blackboard）](#blackboard)
8. [使用自定义技能（Skills）](#custom-skills)
9. [理解证据平面](#evidence-plane)
10. [常见问题](#faq)

---

<a id="quick-install"></a>
## 1. 快速安装 / Quick Install

### 环境要求

| 项目 | 要求 |
|------|------|
| 操作系统 | **Linux**（推荐 Kali Linux / Debian 12） |
| Python | ≥ 3.12 |
| Node.js | ≥ 18（前端构建需要） |
| PostgreSQL | 安装脚本会自动安装 |
| 硬盘 | 至少 2GB 可用空间 |

### 一键安装

```bash
# 克隆仓库
git clone https://github.com/guaidao2/XuanMu-RedTeam-Agent.git
cd XuanMu-RedTeam-Agent

# 运行安装脚本
bash setup.sh
```

安装过程大约 3-10 分钟（取决于网络速度），脚本会自动：

1. 安装系统依赖（包括 PostgreSQL、Node.js）
2. 创建 PostgreSQL 数据库和用户
3. 创建 Python 虚拟环境并安装后端依赖
4. 构建前端界面
5. 检查安装结果
6. 创建便捷的 `start.sh` 和 `stop.sh` 脚本

> ⚠️ 安装脚本需要 `sudo` 权限来安装系统包和配置 PostgreSQL。
> 建议在**干净的虚拟机或专用机器**上运行。

安装成功后你会看到：

```
[✓] 安装完成
[~] 创建便捷脚本...
[✓] 便捷脚本已创建
```

---

<a id="configure-llm"></a>
## 2. 配置 LLM / Configure LLM

安装完成后，需要配置 LLM API 才能让智能体工作。

### 方式一：交互式配置（推荐）

```bash
bash config-tool.sh
```

按照提示一步步输入：
1. 选择要配置的角色（或「全部角色统一设置」）
2. 输入 API Key
3. 输入 API 地址（默认 `https://api.deepseek.com/v1`）
4. 输入模型名（默认 `deepseek-chat`）

### 方式二：手动编辑 JSON

```bash
vi .xuanmu/config.json
```

配置文件结构如下：

```json
{
  "agents": {
    "cso": {
      "name": "XuanMu",
      "base_url": "https://api.deepseek.com/v1",
      "api_key": "sk-你的API密钥",
      "model": "deepseek-chat"
    },
    "cae": { "...相同结构..." },
    "cie": { "...相同结构..." },
    "cpe": { "...相同结构..." },
    "cre": { "...相同结构..." },
    "cce": { "...相同结构..." }
  }
}
```

> 💡 **提示**：
> - 所有角色可以用同一个 API Key 和模型
> - 也可以为不同角色配置不同的模型
> - 支持任何 OpenAI 兼容的 API（DeepSeek / Qwen / GLM / Kimi 等）

### 支持的服务商

| 服务商 | API 地址 | 推荐模型 |
|--------|----------|----------|
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` |
| 阿里通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-plus` |
| 智谱 GLM | `https://open.bigmodel.cn/api/paas/v4` | `glm-4-plus` |
| 月之暗面 Kimi | `https://api.moonshot.cn/v1` | `moonshot-v1-8k` |

---

<a id="start--login"></a>
## 3. 启动与登录 / Start & Login

### 启动

```bash
bash start.sh
```

启动成功后会显示：

```
Backend started on http://localhost:8000
Frontend built
```

### 登录

打开浏览器访问 **http://localhost:8000**

默认管理员账号：

| 字段 | 值 |
|------|-----|
| 邮箱 | `admin@admin.com` |
| 密码 | `admin123` |

> ⚠️ **首次使用请立即修改默认密码！**
> 点击左侧「系统管理」→「用户管理」修改密码。

### 停止

```bash
bash stop.sh
```

---

<a id="create-project"></a>
## 4. 创建你的第一个项目 / Create Project

项目（WorkProject）是 XuanMu 的核心组织单位——所有资产、发现、推理过程都归属于一个项目。

### 操作步骤

1. 登录后在左侧导航栏点击 **「项目管理」**
2. 点击右上角 **「创建项目」**
3. 填写项目信息：

| 字段 | 说明 | 示例 |
|------|------|------|
| 项目名称 | 简短标识 | `内部渗透测试` |
| 项目描述 | 目标范围说明 | `对 10.0.0.0/24 内网进行渗透测试` |
| 项目类型 | `渗透测试` 或 `代码审计` | 渗透测试 |
| 资产列表 | 初始目标（可后续添加） | `10.0.0.1`, `10.0.0.2` |

4. 点击 **「创建」**

### 项目状态

| 状态 | 含义 |
|------|------|
| `working` | 进行中 — 智能体正在工作 |
| `completed` | 已完成 — 目标达成 |
| `canceled` | 已取消 — 手动中止 |

---

<a id="playground"></a>
## 5. 使用 Playground 对话 / Playground

Playground 是你与智能体团队交互的主要界面。

### 开始对话

1. 点击左侧 **「Playground」**
2. 在页面顶部选择或创建一个 WorkProject（必须绑定项目才能使用黑板）
3. 在输入框中输入你的任务

### 常用指令示例

```
# 启动渗透测试
"对 10.0.0.1 进行端口扫描和漏洞探测"

# 注入黑板 Hint
"注意：目标可能有 WAF，建议用慢速扫描"

# 查看当前进度
"当前进度如何？"

# 查询发现
"报告发现的漏洞"
```

### 智能体回复结构

每个回复包含：
- **主管的思考** — CSO 的分析和决策
- **委派记录** — 哪些专家被分派了什么任务
- **工具调用** — 执行了哪些命令
- **黑板更新** — 记录了哪些 Fact/Intent

### 会话管理

- 左侧可以查看历史会话列表
- 每个会话独立，互不干扰
- 会话绑定项目后，所有写入该项目的数据共享

---

<a id="agent-team"></a>
## 6. 理解智能体团队 / Agent Team

### 角色分工

| 代号 | 名称 | 专长 |
|------|------|------|
| **CSO** | 玄幕 | 安全主管 — 任务分解、团队协调、最终决策 |
| **CAE** | 守拙 | 代码审计 — 源码安全审查、漏洞模式识别 |
| **CIE** | 观星 | 情报侦察 — 信息收集、资产发现、子域名枚举 |
| **CPE** | 破军 | 渗透测试 — 端口扫描、漏洞利用、内网横向 |
| **CRE** | 溯源 | 逆向分析 — 二进制分析、调试、反混淆 |
| **CCE** | 破阵 | 密码分析 — 加密协议分析、弱口令检测 |

### 协作方式

1. **你发出任务** → CSO 接收
2. **CSO 分析** → 读取黑板，了解当前状态
3. **CSO 委派** → 分配合适的专家
4. **专家执行** → 使用工具，记录 Fact 到黑板
5. **CSO 汇总** → 读取黑板，总结进展，决定下一步
6. **回复你** → 汇报结果

整个过程中，所有智能体通过**共享黑板**协调，不互相打断。

---

<a id="blackboard"></a>
## 7. 使用黑板（Blackboard） / Blackboard

黑板是本平台的核心特色，记录智能体的完整推理过程。

### 查看黑板

**方式一：在项目工作区查看**

1. 进入「项目管理」
2. 点击项目名称进入工作区
3. 切换到 **Blackboard** 标签页

**方式二：在对话中查看**

1. 在 Playground 右上角点击项目信息按钮
2. 切换到 **Blackboard** 标签页

### 黑板节点类型

| 图标 | 类型 | 含义 | 生命周期 |
|------|------|------|---------|
| 🟢 | **Fact** | 已确认的客观发现 | proposed → confirmed / rejected |
| 🔵 | **Intent** | 声明的探索方向 | proposed → in_progress → confirmed / rejected |
| 🟠 | **Hint** | 人类或AI注入的指引 | 持久存在 |

### 节点状态

| 状态 | 含义 |
|------|------|
| `proposed` | 刚提出，尚未开始 |
| `in_progress` | 正在执行中 |
| `confirmed` | 已确认（Fact 有证据，Intent 已完成） |
| `rejected` | 此路不通（避免重复劳动） |
| `superseded` | 被更好的节点替代 |

### 典型黑板演进过程

以一个渗透测试为例，黑板会这样演进：

```
阶段 1：侦察
  Intent: "扫描 10.0.0.1 的开放端口"
  Fact: "发现端口 22 (SSH), 80 (HTTP), 443 (HTTPS)"

阶段 2：Web 探测
  Intent: "识别 80 端口 Web 服务"
  Fact: "nginx 1.2.3，存在 CVE-2024-xxx"
  Intent: "尝试 CVE-2024-xxx 利用"

阶段 3：尝试与结果
  Fact: "CVE-2024-xxx 利用失败 — 目标已修补"  (rejected)
  Intent: "转向 SSH 弱口令爆破"
  Fact: "SSH root/toor 登录成功"  (confirmed)

阶段 4：内网横向
  Intent: "从 10.0.0.1 横向移动到 10.0.0.2"
  ...
```

你可以随时在黑板中注入 Hint 来引导方向：

```
在对话中说："先在 80 端口上多花点时间，不急着扫 SSH"
→ CSO 会自动写入一个 Hint 节点，所有专家都能看到
```

### 黑板的价值

| 场景 | 没有黑板 | 有黑板 |
|------|---------|--------|
| 专家 A 试过某方向失败 | 专家 B 可能再试一次 | B 看到 `rejected` 直接跳过 |
| 你想给中间指引 | 只能重复说 | 写一个 Hint，全员可见 |
| Agent 超时退出 | 进度全丢 | 回来读黑板，从断点继续 |
| 复盘整个过程 | 翻对话历史 | 沿着 Fact→Intent 回溯 |
| 多个项目对比 | 凭记忆 | 看黑板图的模式和差异 |

---

<a id="custom-skills"></a>
## 8. 使用自定义技能（Skills） / Custom Skills

### 什么是 Skill

Skill 是 Agent 可以动态加载的**领域知识模块**。每个 Skill 对应一个工具或方法论，Agent 在执行任务时通过 `load_skill` 获取用法说明，然后按照说明操作。

XuanMu 内置了多个 Skill（nmap、sqlmap、httpx、binwalk、jadx 等），主要在沙箱容器中使用。

### 自定义 Skill（本地模式）

你可以在本地 `.agents/skills/` 目录下添加自己的 Skill，无需改代码：

```bash
mkdir -p .agents/skills/my-tool
```

每个 Skill 目录结构：

```
.agents/skills/
└── my-tool/
    ├── SKILL.md        ← 必需：技能说明（含 YAML 头）
    ├── script.sh       ← 可选：辅助脚本
    └── data/           ← 可选：数据文件
```

### SKILL.md 格式

```markdown
---
name: my-tool
description: 用 my-tool 做某事的简明说明。
---

# My Tool

使用 `my-tool` 的命令格式和注意事项...

## 帮助优先

先执行帮助命令获取真实选项：

```sh
my-tool --help
```

## 输出规范

- 报告做了什么、结果是什么
```

### Agent 如何使用 Skill

1. **`list_skills`** — Agent 查看有哪些可用技能
2. **`load_skill("my-tool")`** — Agent 加载 SKILL.md 全文到上下文
3. Agent 按照 SKILL.md 的指引执行命令
4. 如果 Skill 目录下有辅助脚本，Agent 可以读取路径后引用

### 内置 Skill 清单

| Skill | 用途 |
|-------|------|
| `nmap` | 端口扫描、服务识别、NSE 脚本 |
| `sqlmap` | SQL 注入自动检测与利用 |
| `httpx` | HTTP 探测、技术栈指纹 |
| `binwalk` | 固件分析、文件提取 |
| `jadx` | APK/DEX 反编译 |
| `apktool` | APK 解包/重打包 |
| `ghidra` | 二进制逆向分析 |
| `openssl` | 证书分析、TLS 诊断 |
| `dns-whois` | DNS 查询、WHOIS 信息收集 |
| `observer-ward` | Web 指纹识别 |
| `archive-file-triage` | 压缩包分类与解包 |
| `sandbox-shell` | 沙箱环境基础 Shell 操作 |

> 这些 Skill 主要在**沙箱容器模式**下使用。本地模式（无需 Docker）下只加载 `.agents/skills/` 中的自定义 Skill。

---

<a id="evidence-plane"></a>
## 9. 理解证据平面 / Evidence Plane

证据平面（Evidence Plane）是项目的结构化数据层，与黑板互补：

```
黑板（过程层）：为什么查 → 查到什么 → 下一步查什么
证据平面（结果层）：资产清单 → 漏洞发现 → 关系图 → 攻击路径
```

### 标签页说明

| 标签 | 内容 | 谁在用 |
|------|------|--------|
| **Assets** | 资产清单（IP、域名、服务等） | 所有人 |
| **Findings** | 漏洞发现（标题、严重等级、状态） | 报告编写者 |
| **Attack Paths** | 攻击链（从入口到目标的完整路径） | 渗透测试报告 |
| **Graph** | 资产关系图（可视化网络拓扑） | 全局视图 |
| **Blackboard** | 推理过程图（AI 的思考链路） | 审计与复盘 |

### 与黑板的关系

```
黑板上：
  Fact: "10.0.0.1:80 是 nginx 1.2.3"
  Fact: "存在 CVE-2024-xxx"
  Fact: "利用失败（已修补）"

证据平面上：
  Asset: 10.0.0.1:80  (service)
  Finding: "nginx 1.2.3 已修补" (info)
```

黑板记录的是「尝试过、失败了」——这是推理过程。
证据平面只记录「存在什么、确认了什么」——这是最终结果。

---

<a id="faq"></a>
## 10. 常见问题 / FAQ

### Q: 智能体不按预期工作怎么办？

1. 检查 `.xuanmu/config.json` 中 API Key 是否正确
2. 检查模型是否支持工具调用（Function Calling）
3. 尝试在对话中给出更具体的指令
4. 查看黑板了解智能体当前的推理状态

### Q: 如何重置项目？

删除项目后重新创建即可。删除项目会同时清理所有关联数据（资产、发现、黑板节点等）。

### Q: 黑板数据太多怎么办？

黑板是 append-only 的，但项目级别的黑板通常不会太大。如果需要清理，可以删除项目重建。

### Q: 如何更换 LLM 模型？

重新运行 `bash config-tool.sh` 或在 `.xuanmu/config.json` 中修改对应角色的 `base_url` 和 `model` 字段。

### Q: 忘记管理员密码怎么办？

通过命令行重置：

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

### Q: 如何升级到最新版本？

```bash
git pull
source .venv/bin/activate
pip install -r requirements.txt
cd web && npm install && npm run build && cd ..
```
