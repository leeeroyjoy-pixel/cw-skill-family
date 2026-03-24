# CW Skill 方法级状态表

本表用于明确每个方法当前所处状态，方便：
- 维护者判断下一步该补什么
- 别的 agent 判断哪些能用
- 使用者判断哪些只适合 dry-run

状态分级说明：
- **S1 已确认**：文档真实接口、签名、主要字段已确认，适合进入联调
- **S2 高置信待实测**：文档基本确认，代码已替换，但未完成真实请求回归
- **S3 dry-run only**：语义层已成型，但 live 不建议放开
- **S4 不建议使用**：仍存在关键不确定项

---

## 一、cw-market-skill

| 方法 | 当前状态 | 说明 |
|---|---|---|
| get_spot_symbols | S1 已确认 | 使用 `returnSymbol`，public 已确认 |
| get_futures_symbols | S1 已确认 | 使用 `/v1/perpum/instruments`，public 已确认 |
| get_ticker(spot) | S1 已确认 | 使用 `returnTicker` |
| get_ticker(futures) | S1 已确认 | 使用 `/v1/perpumPublic/ticker` 或 `/tickers` |
| get_all_tickers(spot) | S1 已确认 | 使用 `returnTicker` |
| get_all_tickers(futures) | S1 已确认 | 使用 `/v1/perpumPublic/tickers` |
| get_klines(spot) | S1 已确认 | 使用 `returnChartData` |
| get_klines(futures) | S1 已确认 | 使用 `/v1/perpumPublic/klines` |
| get_orderbook(spot) | S1 已确认 | 使用 `returnOrderBook` |
| get_orderbook(futures) | S1 已确认 | 使用 `/v1/perpumPublic/depth` |
| get_futures_instruments | S1 已确认 | 使用 `/v1/perpum/instruments` |

### 结论
- `cw-market-skill` 是当前最适合直接开放给别的 agent 的模块。

---

## 二、cw-account-skill

| 方法 | 当前状态 | 说明 |
|---|---|---|
| get_spot_balances | S2 高置信待实测 | endpoint 和 spot 签名已确认 |
| get_futures_account | S2 高置信待实测 | 已替换为 `/v1/perpum/account/getUserAssets` |
| get_positions | S2 高置信待实测 | 已确认 `/v1/perpum/positions/all` |

### 结论
- `cw-account-skill` 可以保留为可联调模块。
- 在真实 key 下跑通前，不建议无脑开放给大量 agent 直接依赖。

---

## 三、cw-execution-skill

| 方法 | 当前状态 | 说明 |
|---|---|---|
| spot_buy_by_quote | S3 dry-run only | 已切到 `doTrade`，但真实成交字段行为仍需小额验证 |
| spot_sell_by_base | S3 dry-run only | 已切到 `doTrade`，真实卖单行为建议实测 |
| open_futures_long | S2 高置信待实测 | `/v1/perpum/order` 已确认，字段大体已对齐 |
| open_futures_short | S2 高置信待实测 | 同上 |
| close_futures_position | S2 高置信待实测 | `/v1/perpum/positions` 已确认 |
| cancel_all_orders(spot) | S2 高置信待实测 | 实际为 spot cancel-all |
| cancel_all_orders(futures) | S3 dry-run only | 当前更接近 batch cancel，不应宣称 true cancel-all |

### 结论
- execution 整体仍然不建议默认 live。
- 最稳妥方式仍然是：
  - 先 dry-run
  - 再人工确认
  - 再小额实测

---

## 四、推荐开放策略

### 对别的 agent 立即开放
- `cw-market-skill`

### 对少量可信 agent 灰度开放
- `cw-account-skill`

### 只开放 dry-run
- `cw-execution-skill`

---

## 五、当前最值得优先补的内容

1. `get_spot_balances()` 真实 key 联调
2. `get_futures_account()` 真实 key 联调
3. `get_positions()` 真实 key 联调
4. `spot_buy_by_quote()` 小额 live 验证
5. `spot_sell_by_base()` 小额 live 验证
6. futures 当前订单 / 单撤单 单独封装
7. futures batch cancel 与 true cancel-all 语义拆分

---

## 六、一句话判断

截至当前版本：
- `market`：已经进入可复用阶段
- `account`：进入高置信联调阶段
- `execution`：进入 dry-run 为主、局部待实测阶段
