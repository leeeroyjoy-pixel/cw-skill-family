# CW Skill 待补项 / 风险跟踪表

本表用于明确：
- 哪些部分已经确认
- 哪些部分高置信但未实测
- 哪些部分仍不确定，不能直接拿去 live

---

## A. 已确认

### 1. 文档模块结构
已确认有：
- common
- spot-trading
- futures-trading
- sub-account
- changelog

### 2. 现货 public 核心接口
已确认：
- `returnSymbol`
- `returnTicker`
- `returnChartData`
- `returnOrderBook`

### 3. 现货 private 核心接口
已确认：
- `returnBalances`
- `cancelOrder`
- `cancelAllOrder`

### 4. 现货 private 签名规则
已确认：
- `api_key` 入参
- 升序排序
- `secret_key` 拼接
- `MD5 uppercase`

### 5. 合约 public 核心接口
已确认：
- `/v1/perpum/instruments`
- `/v1/perpumPublic/tickers`
- `/v1/perpumPublic/ticker`
- `/v1/perpumPublic/klines`
- `/v1/perpumPublic/depth`

### 6. 合约 private 核心接口
已确认：
- `/v1/perpum/order`
- `/v1/perpum/positions`
- `/v1/perpum/positions/all`

### 7. 合约 private 签名规则
已确认：
- `timestamp + METHOD + apiPath (+query or body)`
- `HMAC-SHA256`
- `Base64`
- headers: `sign`, `api_key`, `timestamp`

---

## B. 高置信但待实测

### 1. market/index.ts 当前映射
状态：
- 文档已确认
- 代码已替换
- 尚未在真实 key / 真实请求下完整回归

影响：
- 可用于联调
- 仍建议保守标注为“待验证”

### 2. get_positions()
状态：
- endpoint 已确认
- 签名规则已确认
- 仍需实测请求成功率

### 3. futures 下单封装
状态：
- 核心 endpoint 已确认
- 核心参数字段已从文档提取
- 还需实测执行逻辑与下单类型细节

### 4. futures 平仓封装
状态：
- endpoint 已确认
- closeNum / closeRate 规则已确认
- 仍需实测字段组合是否完全匹配官方行为

---

## C. 不确定 / 不能直接 live 的项

### 1. `get_futures_account()` 的精确 endpoint
当前状态：
- 已确认真实 endpoint：`/v1/perpum/account/getUserAssets`
- 代码已更新
- 仍待真实请求实测

风险：
- 主要风险从“路径不确定”降为“签名/权限/账号状态”

结论：
- 进入高置信待实测状态

### 2. 现货买卖下单的最终 command 适配
当前状态：
- 文档已确认 `doTrade`
- 代码已替换为 `doTrade`
- 已按文档适配 `symbol/type/amount/rate/funds/isMarket/out_trade_no`

风险：
- 市价买 / 市价卖 / 限价买 的数量字段在真实交易行为上仍建议实测

结论：
- dry-run 可用性提高
- live 仍建议小额实测后再放开

### 3. futures cancel-all 的精确 endpoint
当前状态：
- 已确认单个撤单：`/v1/perpum/order`
- 已确认批量撤单：`/v1/perpum/batchOrders`
- 代码当前已改为基于批量撤单接口处理 order_ids

风险：
- 它更准确地说是“批量撤单”而非真正无条件 cancel-all
- 若未传 `order_ids`，不应视为完整等价的全撤语义

结论：
- 需要继续区分“cancel batch”与“true cancel-all”
- 当前 live 不建议宣称为完整全撤

### 4. 错误码标准化
当前状态：
- 仅有基础 normalize
- 未完成 CoinW 专用错误码映射

风险：
- agent 难以基于错误自动恢复

结论：
- 这是生产可用前必须补的一项

### 5. execution 的 live 风险控制闭环
当前状态：
- 有 dry-run / confirm / allowlist / size cap / leverage cap
- 但还没加真实审计日志和请求回放能力

风险：
- 出现异常时排错困难

结论：
- 在给别的 agent 大规模使用前应补齐

---

## D. 面向别的 agent 的当前可用性结论

### 可以给别的 agent 使用的部分
1. `cw-market-skill`：适合作为只读数据源
2. `cw-account-skill`：可以作为候选只读私有层，但需先联调
3. `cw-execution-skill`：目前更适合作为 dry-run 执行语义层

### 还不建议直接给别的 agent live 的部分
1. 现货 live 下单
2. 合约 live 下单
3. 合约 live 平仓
4. futures cancel-all live

---

## E. 最小生产化前置条件

在把 `cw` skill 标成“可给别的 agent 稳定使用”之前，至少完成：

1. market 全部 public 接口实测通过
2. spot private 签名实测通过
3. futures private 签名实测通过
4. futures account endpoint 确认
5. spot live 下单字段确认
6. futures cancel-all endpoint 确认
7. 错误码映射补齐
8. execution 审计日志补齐
