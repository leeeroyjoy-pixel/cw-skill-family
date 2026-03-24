# CW Skill 联调验证清单

本清单面向两类人：
1. 维护 `cw` skill 的开发者
2. 需要调用 `cw` skill 的别的 agent / 使用者

目标：
- 先验证只读能力
- 再验证私有只读能力
- 最后验证 execution 的 dry-run
- 最后才考虑 live

---

## 一、验证前准备

### 1. 本地填写环境变量
由使用者自行填写，不允许写入仓库：

```bash
export COINW_API_KEY='your_coinw_api_key'
export COINW_API_SECRET='your_coinw_api_secret'
export COINW_BASE_URL='https://api.coinw.com'
```

### 2. 建议准备两套 key
- 一套：只读权限 key
- 一套：交易权限 key（仅联调 execution 时使用）

### 3. 默认原则
- 所有 execution 先 dry-run
- 所有 live 需要 `confirm=true`
- 先小额，后放开

---

## 二、MVP1：只读验证

### A. `cw-market-skill`

#### 1. `get_spot_symbols`
- 目标：确认现货交易对列表可拉取
- 文档状态：已确认真实 endpoint
- 预期：返回 `returnSymbol` 数据
- 风险：低
- 是否需要 key：否
- 结果判定：
  - 成功：返回交易对数组/对象
  - 失败：检查 base URL / public path

#### 2. `get_all_tickers(market='spot')`
- 目标：确认 spot 全市场 ticker 可拉取
- 文档状态：已确认真实 endpoint
- 是否需要 key：否
- 结果判定：返回 `BTC_USDT` / `ETH_USDT` 等 ticker 数据

#### 3. `get_klines(symbol='BTCUSDT', market='spot', interval='5m')`
- 目标：确认现货 K 线可拉取
- 文档状态：已确认真实 endpoint
- 注意：内部会做 `BTCUSDT -> BTC_USDT` 映射
- 是否需要 key：否

#### 4. `get_orderbook(symbol='BTCUSDT', market='spot')`
- 目标：确认现货深度可拉取
- 文档状态：已确认真实 endpoint
- 是否需要 key：否

#### 5. `get_futures_instruments()`
- 目标：确认合约品种信息可拉取
- 文档状态：已确认真实 endpoint
- 是否需要 key：否

#### 6. `get_all_tickers(market='futures')`
- 目标：确认 futures ticker 可拉取
- 文档状态：已确认真实 endpoint
- 是否需要 key：否

#### 7. `get_klines(symbol='BTCUSDT', market='futures', interval='5m')`
- 目标：确认合约 K 线可拉取
- 文档状态：已确认真实 endpoint
- 注意：内部会做 `BTCUSDT -> BTC` 映射
- 是否需要 key：否

#### 8. `get_orderbook(symbol='BTCUSDT', market='futures')`
- 目标：确认合约深度可拉取
- 文档状态：已确认真实 endpoint
- 是否需要 key：否

---

### B. `cw-account-skill`

#### 9. `get_spot_balances()`
- 目标：确认现货私有签名与余额查询可用
- 文档状态：已确认真实 endpoint + spot 私有签名规则
- 是否需要 key：是
- 判定：返回持仓对象，如 `USDT/BTC/ETH`

#### 10. `get_positions()`
- 目标：确认 futures 私有签名与当前持仓接口可用
- 文档状态：已确认真实 endpoint + futures 私有签名规则
- 是否需要 key：是
- 判定：返回当前持仓数组

#### 11. `get_futures_account()`
- 目标：确认 futures 账户查询可用
- 文档状态：候选 endpoint，需继续确认
- 是否需要 key：是
- 判定：
  - 成功：说明候选路径正确
  - 失败：需替换 endpoint

---

## 三、MVP2：execution dry-run 验证

### 重要原则
execution 第一轮只验证：
- 参数拼装
- 风控
- dry-run 结果

此阶段**不要求真实下单**。

### C. `cw-execution-skill`

#### 12. `spot_buy_by_quote(..., dry_run=true, confirm=false)`
- 目标：确认 symbol 白名单、额度限制、dry-run 逻辑正确
- 是否需要交易 key：否（dry-run 不应真正出单）
- 文档状态：spot 下单路径仍需继续核验精确字段细节
- 当前用途：高层执行语义验证

#### 13. `spot_sell_by_base(..., dry_run=true, confirm=false)`
- 验证点同上

#### 14. `open_futures_long(..., dry_run=true, confirm=false)`
- 目标：确认 futures 下单参数封装、风控检查、名义价值估算
- 文档状态：主路径 `/v1/perpum/order` 已确认
- 当前用途：dry-run 可用性验证

#### 15. `open_futures_short(..., dry_run=true, confirm=false)`
- 验证点同上

#### 16. `close_futures_position(..., dry_run=true, confirm=false)`
- 目标：确认平仓参数结构正确
- 文档状态：主路径 `/v1/perpum/positions` 已确认
- 当前用途：dry-run 验证

#### 17. `cancel_all_orders(..., dry_run=true, confirm=false)`
- 目标：确认撤单语义层和风控层
- 注意：spot cancel-all 已确认，futures cancel-all 仍待确认精确路径

---

## 四、live 前必须完成的检查

在任何 live 执行前，至少确认以下 6 项：

1. spot 私有签名已实测成功
2. futures 私有签名已实测成功
3. `get_spot_balances()` 成功
4. `get_positions()` 成功
5. execution dry-run 全部成功
6. API key 权限范围已确认最小化

---

## 五、建议的测试顺序

### Phase 1：Public only
1. get_spot_symbols
2. get_all_tickers(spot)
3. get_klines(spot)
4. get_orderbook(spot)
5. get_futures_instruments
6. get_all_tickers(futures)
7. get_klines(futures)
8. get_orderbook(futures)

### Phase 2：Private readonly
9. get_spot_balances
10. get_positions
11. get_futures_account

### Phase 3：Execution dry-run
12. spot_buy_by_quote
13. spot_sell_by_base
14. open_futures_long
15. open_futures_short
16. close_futures_position
17. cancel_all_orders

### Phase 4：Live（可选，最后才做）
- 必须小额
- 必须单 symbol
- 必须 confirm=true
- 必须完整记录日志

---

## 六、调用结果记录建议

每次验证建议记录：
- 时间
- skill
- method
- 输入参数
- 是否 dry-run
- 是否成功
- 原始返回
- 结论
- 是否需继续修正

---

## 七、当前阶段结论

截至当前版本：
- market 大部分接口已经进入“高置信可联调”状态
- spot private 签名规则已明确
- futures private 签名规则已明确
- account / execution 已从纯 skeleton 进入“部分真实接口替换版”
- 还不能声称“全部可实盘直接使用”
