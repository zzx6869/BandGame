# BandGame 项目说明与扩展指南

（原「乐队游戏」工程；npm 包名为 `bandgame`。）

本文档概括当前实现，并标明**可改数据**、**可改逻辑**、**接口位置**，方便你自行增删事件、角色与系统。

---

## 1. 技术栈与运行方式

| 项 | 说明 |
|----|------|
| 框架 | Vue 3（`<script setup>`） |
| 状态 | Pinia（`defineStore` 组合式写法） |
| 语言 | TypeScript |
| 构建 | Vite 8 |
| 叙事（可选分支） | [Ink](https://www.inklestudios.com/ink/) + `inkjs`，源码 `src/ink/demo.ink`，构建时由 `npm run ink` 编译为 JSON |

常用命令：

```bash
npm run dev      # 开发服务器
npm run build    # 先编译 Ink，再 vue-tsc + vite build
npm run ink      # 仅编译 demo.ink → demo.ink.json
```

**主玩法**是「高中周常 + 随机事件 + NPC + 乐队」的校历模拟，状态集中在 `useSchoolGameStore`。`useBandStoryStore` 是 **Ink 周常 Demo**，与主玩法并行存在、当前 **未** 接进 `App.vue` 主导航，可按需再接。

**托管到 GitHub Pages**：见仓库根目录 **`DEPLOY_GITHUB.md`**（含 Actions 与 `VITE_BASE_URL` 说明）。

---

## 2. 目录结构总览

```
src/
├── main.ts                 # 入口：createApp、Pinia、挂载 App
├── App.vue                 # 根布局：按 phase 切换视图 + 全局弹窗
├── style.css               # 全局 CSS 变量（浅色/深色）
├── env.d.ts
├── components/game/        # 游戏 UI（见下文「界面组件」）
├── stores/
│   ├── schoolGame.ts       # 核心：周常、随机事件结算、社交、乐队、存档触发
│   ├── schoolGamePersistence.ts  # localStorage 序列化/校验
│   └── bandStory.ts        # Ink Demo 专用
├── game/
│   ├── config.ts           # 学年周数、初始数值、活动消耗、每周随机事件条数、INITIAL_NPCS
│   ├── types.ts            # Instrument、GamePhase、SongEntry、BandActivityRecord 等
│   ├── labels.ts           # 乐器中文名、学期/周标签文案
│   ├── npc/
│   │   ├── Npc.ts          # NpcSnapshot、buildNpcRoster、亲密度工具
│   │   ├── npcs.config.ts  # 【改角色主要改这里】NPC_CREATE_ENTRIES
│   │   └── index.ts        # 导出
│   └── randomEvents/
│       ├── types.ts        # 【类型契约】事件条件、效果、RandomEventDef
│       ├── engine.ts       # 条件判断、加权抽取、效果结算、结识门槛
│       ├── events.config.ts # 【改事件主要改这里】RANDOM_EVENT_DEFS
│       └── index.ts        # 对外导出
└── ink/
    ├── demo.ink
    └── demo.ink.json       # 编译产物（勿手改）
```

---

## 3. 游戏流程（`GamePhase`）

定义见 `src/game/types.ts`：

| `phase` | 含义 | 典型界面 |
|---------|------|----------|
| `intro` | 标题/说明 | `IntroView.vue` |
| `skill_select` | 选主修乐器 | `SkillSelectView.vue` |
| `playing` | 周常主体 | `GameHud.vue` + `WeekMainView.vue` |
| `graduated` | 毕业结算 | `GraduatedView.vue` |

`App.vue` 用 `storeToRefs(phase)` 分支渲染；**随机事件弹窗、事件历史、认识的人、乐队面板**始终在树中挂载（由各自 `v-if` 控制），避免逻辑拆散。

---

## 4. 核心配置：`src/game/config.ts`

这是你经常要动的「数值与设计常量」汇总处。

| 常量 / 函数 | 作用 |
|-------------|------|
| `WEEKLY_SCHOOL_YEAR`、`SCHOOL_YEARS` | 每年周数、总共几年 |
| `INITIAL_SAN`、`SAN_MAX`、`INITIAL_ACADEMICS`、`INITIAL_MAIN_SKILL` | 主角开局数值 |
| `WEEKLY_SAN_RECOVERY` | 每周初 SAN 恢复量（在 `endWeek` 里用） |
| `INVITE_FAVOR_THRESHOLD` | 邀请入队所需好感下限 |
| `ACTIVITY` | **每周行动**：`study` / `practice` / `rest` / `chat` / `invite` / `bandPractice` / `bandHangout` 的消耗与收益 |
| `STAT_MAX` | 学业/主修/好感/羁绊等上限（与 NPC 钳制共用） |
| `weeklyRandomEventCount(ctx)` | **每周随机事件条数**（当前规则：高一 1 条、高二 2、高三 3） |
| `INITIAL_NPCS` | 由 `buildNpcRoster(NPC_CREATE_ENTRIES, STAT_MAX)` 生成，**角色列表在 `npcs.config.ts`** |

改周长度、活动平衡、随机事件条数逻辑时，优先改此文件。

---

## 5. 角色（NPC）系统

### 5.1 数据放哪改

**主入口：`src/game/npc/npcs.config.ts`**

导出 `NPC_CREATE_ENTRIES: NpcCreateInput[]`。每条对应一个可参与系统的角色。

### 5.2 `NpcCreateInput` 字段（见 `src/game/npc/Npc.ts`）

| 字段 | 说明 |
|------|------|
| `id` | 全局唯一，事件里 `characterId` / `meetNpcIds` 必须与此一致 |
| `name` | 显示名 |
| `specialty` | `'guitar' \| 'vocal' \| 'bass' \| 'drums' \| 'keyboard'`（与 `Instrument` 一致） |
| `initialSpecialtySkill?` | 默认约 20 |
| `initialFavorWithPlayer?` | 默认 0 |
| `initialBonds?` | `{ targetId, value }[]`，与另一 NPC 的**双向亲密度**初始值（只配一侧即可，会同步到对方） |
| `met?` | 是否「已认识主角」。**省略则默认 `false`**（靠随机事件结识） |
| `note?` | 备注，在「认识的人」窗口展示 |

显示用的中文乐器名在 **`src/game/labels.ts` → `INSTRUMENT_LABEL`**，新增乐器类型需同时改 `game/types.ts` 的 `Instrument` 与 `INSTRUMENT_LABEL`。

### 5.3 运行时快照 `NpcSnapshot`

含 `specialtySkill`、`favorWithPlayer`、`intimacyWithOthers`、`met` 等。**不要**在业务里手写整条 roster，应用 `buildNpcRoster()` 或 `cloneNpcSnapshotList()`（同文件）。

### 5.4 亲密度工具

`syncMutualIntimacy`、`addMutualIntimacy`：改 NPC↔NPC 亲密度时用，保证双向一致。随机事件里已由 `resolveRandomEventEffects` 调用。

---

## 6. 随机事件系统（最重要扩展面）

### 6.1 列表放哪改

**`src/game/randomEvents/events.config.ts`**  
导出 `RANDOM_EVENT_DEFS: RandomEventDef[]`，**新增/改文案/权重/条件/选项几乎只动这个文件**。

### 6.2 单条事件：`RandomEventDef`（`types.ts`）

| 字段 | 说明 |
|------|------|
| `id` | 唯一；会进叙事日志 `[随机事件 · id]` |
| `weight` | 非负；同周候选内加权随机（实现见 `engine.ts`） |
| `text` | 弹窗正文，可长文 |
| `condition?` | 见下「条件」 |
| `meetNpcIds?` | **结识门槛**：与主角相关的 NPC 若尚未 `met`，其 id 必须出现在此数组中，该事件才可能进本周池（已认识的不受此限） |
| `effects?` | **无多选项时**：点「继续」后应用 |
| `choices?` | 若有且长度 ≥1，玩家必须选一；**仅应用该选项的 `effects`，根上 `effects` 忽略** |

### 6.3 条件 `RandomEventCondition`

多字段 **AND**。常用项：

- 学年/周次：`minYear`、`maxYear`、`minWeekInYear`、`maxWeekInYear`、`minAbsoluteWeek`、`maxAbsoluteWeek`
- 主角属性：`minSan`/`maxSan`、`minAcademics`、`minMainSkill`、`maxMainSkill`…
- 乐队：`bandUnlocked`、`minBandMemberCount`、`minBond`、`maxBond`
- `characterFavorMin: { characterId, min }[]`：指定 NPC 对主角好感均 ≥ `min`

**扩展新条件**：在 `types.ts` 给 `RandomEventCondition` 加字段，在 `engine.ts` 的 `matchesRandomEventCondition` 里写判断逻辑，并在抽取时使用的 `RandomEventContext` 中保证有数据（上下文由 `schoolGame` 的 `buildRandomEventContext` 组好）。

### 6.4 效果 `RandomEventEffects`

| 字段 | 显性弹窗 | 说明 |
|------|----------|------|
| `sanDelta` | ✓ | 主角 SAN |
| `academicsDelta` | ✓ | 学业 |
| `mainSkillDelta` | ✓ | 主修技能 |
| `bondDelta` | ✓（乐队已解锁时） | 羁绊 |
| `characterFavorDelta` | ✓ | `{ characterId, delta }[]`，对主角好感 |
| `npcPairIntimacyDelta` | ✗（隐性） | `{ npcIdA, npcIdB, delta }`，双向亲密度 |
| `npcSpecialtySkillDelta` | ✗（隐性） | NPC 专精技能 |

结算函数：**`src/game/randomEvents/engine.ts` → `resolveRandomEventEffects`**。  
若你要新加一种改主状态或 NPC 的增量：

1. 在 `types.ts` 的 `RandomEventEffects` 增加字段  
2. 在 `resolveRandomEventEffects` 中实现钳制与文案碎片（`visibleParts` / `hiddenParts`）  
3. 若需参与「是否认识主角」，在 `collectPlayerFacingNpcIds` 里把相关 id 纳入（见下）

### 6.5 结识（`met`）与 `meetNpcIds`

- **`collectPlayerFacingNpcIds(ev)`**：从事件的根/各选项的 `characterFavorDelta`、`npcSpecialtySkillDelta` 以及条件的 `characterFavorMin` 收集「与主角强相关」的 NPC id。  
- **`matchesRandomEventNpcGate`**：上述 id 中若有人 `met === false`，则必须在事件的 **`meetNpcIds`** 里声明，否则本周**不会**抽到该事件。  
- **`applyMetFromEffects`**：某分支结算里若对某 NPC 有**非零**的 `characterFavorDelta` 或 `npcSpecialtySkillDelta`，会把该 NPC 标为已认识（`met: true`），并可能记入「认识的人」里的随机事件履历（store 侧 `appendNpcRandomMemories`）。

**添加新事件时注意**：凡是会出现「陌生人第一次出场」的剧情，务必将对应 `characterId` 写进 **`meetNpcIds`**，否则在全员尚未认识时该事件永远不会进池。

### 6.6 抽取逻辑（`engine.ts`）

- `matchesRandomEventCondition`：单条是否满足条件 + NPC 门控  
- `pickWeeklyRandomEvent`：在候选中选一条（加权）  
- `pickWeeklyRandomEvents`：抽 `count` 条，**同周同一 `id` 不重复**；若候选不够，用内置 **`_fallback`** 事件补齐（不要在自己定义的数组里用 `_fallback` 作 id）

改「不放回」「权重算法」「兜底策略」都在这里。

### 6.7 与 Store 的衔接（`src/stores/schoolGame.ts`）

- **入队**：`enqueueWeeklyRandomEvents()` → `weeklyRandomEventCount` + `pickWeeklyRandomEvents(RANDOM_EVENT_DEFS, ctx, n)`  
- **结算**：`resolveActiveRandomEvent(choice?)` → `resolveRandomEventEffects` → `applyMetFromEffects` → 写 narrative、`randomEventVisibleOutcome`、队列 `slice`  
- **叙事**：`narrativeLines` 会追加事件全文、选项与 `summaryLine`（含隐性摘要）

---

## 7. 主存档（localStorage）

**`src/stores/schoolGamePersistence.ts`**

- Key：`band-school-game-save`（常量 `SCHOOL_GAME_STORAGE_KEY`）  
- 版本：`SCHOOL_GAME_SAVE_VERSION`（结构变更时递增，并在 `loadSchoolGamePersisted` 做兼容或拒绝旧档）

持久化的内容包含：阶段、主角数值、NPC 全量快照、乐队、叙事行、随机事件队列、显性结果层、NPC 随机事件记忆等；**不存**乐队/历史/认识的人等 UI 开关（读档后一律关闭）。

**规则摘要**：

- `phase === 'intro'` 时**不写档**并会清 key（标题状态不占用存档）。  
- 其它阶段防抖写入 + `beforeunload` 立即写入。

扩展存档时：

1. 在 `SchoolGamePersisted` 增加字段  
2. 在 `schoolGame.ts` 的 `buildPersisted` / `applyPersisted` 同步  
3. 在 `loadSchoolGamePersisted` 里做校验  
4. 视情况提升 `SCHOOL_GAME_SAVE_VERSION`

---

## 8. 界面组件（改 UI 改这里）

| 文件 | 作用 |
|------|------|
| `IntroView.vue` | 标题与「进入新的高中生活」 |
| `SkillSelectView.vue` | 选主修 + 「退出本次游戏」 |
| `GameHud.vue` | 顶栏：学期、SAN、学业、主修 |
| `WeekMainView.vue` | 学习/练习/休息、社交列表（仅 `met`）、乐队按钮、结束本周、工具栏 |
| `RandomEventModal.vue` | 随机事件 + 显性数值结果层 |
| `EventHistoryModal.vue` | `narrativeLines` 历史 |
| `UnlockedRosterModal.vue` | 已认识角色 + 与其相关的随机事件记忆 |
| `BandPanel.vue` | 乐队详情（与 `bandMemberIds`、`bond`、`songs` 等绑定） |
| `GraduatedView.vue` | 毕业总结 + 返回标题 |

全局样式变量在 **`src/style.css`**（含暗色 `prefers-color-scheme`）。

---

## 9. 周常逻辑在 Store 中的映射（便于搜代码）

在 **`schoolGame.ts`** 中：

- `study` / `practice` / `rest`：消耗与数值与 `ACTIVITY` 一致  
- `chatWith(characterId)`：仅 `met` 的 NPC  
- `invite(characterId)`：好感门槛 + `met`  
- `bandPractice` / `bandHangout`：依赖 `bandUnlocked`（至少一名队员）  
- `endWeek`：毕业判定、周进位、SAN 周初恢复、`enqueueWeeklyRandomEvents`  
- `exitToMainMenu` / `resetGame`：清档 + 回 `intro`

---

## 10. Ink Demo（`bandStory`）

- Store：`stores/bandStory.ts`  
- 编译：`src/ink/demo.ink` → `demo.ink.json`  
- 变量名同步：`syncStatsFromInk` 读取 Ink 里 `week`、`stamina`、`skill_play`、`skill_write`、`bond`

与校历主循环 **独立**；若要把 Ink 嵌进主游戏，需自行在某一 `phase` 或子路由里挂载 UI 并调用 `start` / `choose`。

---

## 11. 扩展检查清单（自测用）

新增 **NPC**：

- [ ] `npcs.config.ts` 增加条目，`id` 与全局引用一致  
- [ ] 需要初见剧情时，相关随机事件写上 `meetNpcIds`  
- [ ] 若有新随机事件只涉及此人，在 `events.config.ts` 添加并配 `weight` / `condition`

新增 **随机事件**：

- [ ] `events.config.ts` 追加对象，`id` 唯一  
- [ ] 涉及未识角色时配置 `meetNpcIds`  
- [ ] 多选项时每个 `choices[].effects` 写清楚；无选项时用根 `effects`  
- [ ] 需要新条件/新效果时同步 `types.ts` + `engine.ts`

改 **每周几条事件**：

- [ ] `config.ts` → `weeklyRandomEventCount`

改 **活动平衡**：

- [ ] `config.ts` → `ACTIVITY` 与 `STAT_MAX` 等

改 **存档结构**：

- [ ] `schoolGamePersistence.ts` + `schoolGame.ts` 的 build/apply + 版本号

---

## 12. 依赖关系简图

```
npcs.config.ts ──► buildNpcRoster ──► INITIAL_NPCS ──► schoolGame.characters
events.config.ts ──► RANDOM_EVENT_DEFS ──► engine (pick + resolve)
config.ts ──► ACTIVITY / weeklyRandomEventCount / 常数 ──► schoolGame
schoolGame ──► buildPersisted / applyPersisted ──► schoolGamePersistence (localStorage)
App.vue ──► 各 *View.vue + Modal + BandPanel
```

---

文档对应的仓库快照以你本机为准；若你后续重命名文件或拆分模块，请以实际路径为准，本文中的「接口位置」优先指向 **职责**（例如「随机事件列表 = events.config.ts」），便于迁移。
