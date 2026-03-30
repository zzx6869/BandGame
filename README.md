# BandGame

基于 Vue 3 + Pinia + TypeScript 的文本互动育成游戏。

## 本地运行

```bash
npm install
npm run dev
```

构建生产包：

```bash
npm run build
```

## 事件系统结构（迁移后）

事件系统已经按“定义 / 实现”拆分到 `src/game/events`：

```text
src/game/events/
  index.ts                     # 统一导出入口
  runtime/
    types.ts                   # 事件类型定义（RandomEventDef 等）
    engine.ts                  # 条件判断、抽取、结算等运行时逻辑
    index.ts                   # runtime 子模块导出
  definitions/
    weeklyRandomEvents.config.ts
    followupEvents.config.ts
    characterMeetEvents.config.ts
    studySpecialEvents.config.ts
    practiceSpecialEvents.config.ts
    restSpecialEvents.config.ts
    bandHangoutEvents.config.ts
    bandRehearsalEvents.config.ts
    index.ts                   # definitions 子模块导出
```

### 分层规则

- `runtime` 只放规则和机制（类型、引擎），不写具体剧情数据。
- `definitions` 只放事件内容（文本、选项、效果、触发条件）。
- 业务侧（如 `schoolGame`）优先从 `@/game/events` 统一导入。

## 如何新增事件

### 1) 选择事件池文件

- 每周随机事件：`src/game/events/definitions/weeklyRandomEvents.config.ts`
- 连锁后续事件：`src/game/events/definitions/followupEvents.config.ts`
- 学习/练习/休息特殊池：对应 `study/practice/restSpecialEvents.config.ts`
- 乐队排练/团建池：`bandRehearsalEvents.config.ts`、`bandHangoutEvents.config.ts`
- 相识事件池：`characterMeetEvents.config.ts`

### 2) 按 `RandomEventDef` 结构添加条目

常用字段：

- `id`: 唯一事件 ID（建议用语义化前缀）
- `weight`: 抽取权重
- `text`: 事件叙事文本
- `choices`: 可选，存在时玩家必须选择其一
- `effects`: 无 `choices` 时的直接效果
- `condition`: 条件门槛（年级、周数、属性、羁绊等）
- `mainInstrumentGate`: 按主角主修乐器筛选
- `meetNpcIds`: 允许在该事件中首次相识的角色
- `followupEventIds` / `probabilisticFollowups`: 事件链
- `cooldownWeeks`: 单事件冷却周数
- `spawnChance` / `spawnChanceByStats`: 事件出现概率控制

### 3) 选项与纯结果的建议比例

- 建议保持“需要选择的事件更多，但不是全部”。
- 高频事件优先做多分支，低频事件可保留纯叙事结果，避免操作疲劳。

### 4) 完成后验证

```bash
npm run build
```

## 开发约定（事件内容）

- 事件文本尽量给出明确情景和情绪动机，避免只写结果。
- 选项文案要体现策略差异（稳健 / 激进 / 折中），而不是数值同义替换。
- 显性属性变化（SAN/学业/主修/羁绊/角色好感）会在结算弹窗提示。
- 隐性变化（NPC 互相亲密度、NPC 专精）不弹窗，但会写入事件历史。
