# CW Skill 给别的 Agent 使用指南

本文件用于告诉别的 agent：
- 这套 `cw` skill 是干什么的
- 哪些能力可以调用
- 哪些能力只能 dry-run
- 哪些部分还不应直接 live

---

## 1. skill family 组成

### `cw-market-skill`
用途：
- 获取 CoinW 现货 / 合约市场数据
- 适合研究、监控、报告类 agent

### `cw-account-skill`
用途：
- 获取 CoinW 账户、余额、持仓信息
- 适合组合监控、风控、账户观察类 agent

### `cw-execution-skill`
用途：
- 提供半自动执行动作
- 适合执行型 agent

---

## 2. 推荐权限边界

### 研究 / 报告 / 选币 agent
只允许调用：
- `cw-market-skill`

### 风控 / 账户观察 agent
允许调用：
- `cw-market-skill`
- `cw-account-skill`

### 执行 agent
允许调用：
- `cw-market-skill`
- `cw-account-skill`
- `cw-execution-skill`

但 execution 默认必须：
- `dry_run=true`
- `confirm=false`

---

## 3. 当前推荐使用级别

### A. 可优先使用
#### `cw-market-skill`
推荐方法：
- `get_spot_symbols`
- `get_all_tickers`
- `get_klines`
- `get_orderbook`
- `get_futures_instruments`

使用级别：
- 高优先级可用
- 适合作为别的 agent 的只读输入层

### B. 需先联调再使用
#### `cw-account-skill`
推荐方法：
- `get_spot_balances`
- `get_positions`
- `get_futures_account`

使用级别：
- 先本地测试
- 再开放给别的 agent

### C. 当前只建议 dry-run
#### `cw-execution-skill`
推荐方法：
- `spot_buy_by_quote`
- `spot_sell_by_base`
- `open_futures_long`
- `open_futures_short`
- `close_futures_position`
- `cancel_all_orders`

使用级别：
- dry-run only
- 不建议直接 live

---

## 4. 标准调用方式

### 市场数据调用示例
```json
{
  "tool": "cw-market-skill.get_klines",
  "input": {
    "symbol": "BTCUSDT",
    "market": "spot",
    "interval": "5m",
    "limit": 100
  }
}
```

### 账户查询调用示例
```json
{
  "tool": "cw-account-skill.get_spot_balances",
  "input": {}
}
```

### 执行层 dry-run 调用示例
```json
{
  "tool": "cw-execution-skill.open_futures_long",
  "input": {
    "symbol": "BTCUSDT",
    "margin_usdt": 50,
    "leverage": 2,
    "dry_run": true,
    "confirm": false
  }
}
```

---

## 5. 别的 agent 必须知道的限制

1. 本 skill 不包含任何个人 API key / secret
2. 使用者必须自行在本地填写环境变量
3. execution 不是默认 live
4. 当前版本并非所有 live 接口都已实测
5. 所有交易行为必须先走 dry-run

---

## 6. 不要让别的 agent 做的事

不要让别的 agent：
- 自动把 `confirm` 改成 `true`
- 自动扩大白名单 symbol
- 自动放大杠杆
- 在未联调验证前直接执行 live 交易
- 把本地环境变量写回仓库

---

## 7. 当前最适合的使用方式

### 方式一：只读数据源
让别的 agent 把 `cw-market-skill` 当成行情数据输入层。

### 方式二：账户观察层
让风控 agent 用 `cw-account-skill` 看余额和持仓。

### 方式三：执行模拟层
让执行 agent 只调用 `cw-execution-skill` 的 dry-run，先输出预执行结果，再由人工或上游 agent 确认。

---

## 8. 当前结论

截至当前版本，最适合对外开放给别的 agent 的部分是：
- `cw-market-skill`

其次是：
- `cw-account-skill`（先联调）

最保守使用方式是：
- `cw-execution-skill` 只做 dry-run，不做 live
