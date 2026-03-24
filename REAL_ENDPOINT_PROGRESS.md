# CW Skill 真实接口替换进度

本文件记录已经从 CoinW 官方文档确认下来的真实接口与签名规则，范围聚焦 MVP1 + MVP2。

## 1. 已确认：现货 Public

### 获取交易品种信息
- Method: `GET`
- Path: `/api/v1/public?command=returnSymbol`

### 获取 24h 全市场 ticker
- Method: `GET`
- Path: `/api/v1/public?command=returnTicker`

### 获取现货 K 线
- Method: `GET`
- Path: `/api/v1/public?command=returnChartData`
- Params:
  - `currencyPair` 例如 `BTC_USDT`
  - `period` 例如 `300`
  - `start` 可选
  - `end` 可选

### 获取现货订单簿
- Method: `GET`
- Path: `/api/v1/public?command=returnOrderBook`
- Params:
  - `symbol` 例如 `BTC_USDT`
  - `size` 可选，5 / 20

---

## 2. 已确认：现货 Private

### 现货账户余额
- Method: `POST`
- Path: `/api/v1/private?command=returnBalances`

### 现货下单
- Method: `POST`
- Path: `/api/v1/private?command=doTrade`
- Core Params:
  - `symbol`
  - `type` (`0` buy / `1` sell)
  - `amount`（限价单基础货币数量；卖单可直接用）
  - `rate`（限价单价格）
  - `funds`（市价买单报价货币金额）
  - `isMarket` (`true` / `false`)
  - `out_trade_no`

### 现货取消订单
- Method: `POST`
- Path: `/api/v1/private?command=cancelOrder`
- Params:
  - `orderNumber`

### 现货取消全部订单
- Method: `POST`
- Path: `/api/v1/private?command=cancelAllOrder`
- Params:
  - `currencyPair` 可选

### 现货签名规则
根据官方代码示例：
1. 把 `api_key` 放入 params
2. 按 key 升序排序
3. 拼成 `key=value&...`
4. 末尾追加 `secret_key=YOUR_SECRET`
5. 对最终字符串做 `MD5`
6. 结果转大写
7. 请求 URL 格式：`{host}{api_url}&sign={sign}&{encoded_params_req}`

---

## 3. 已确认：合约 Public

### 获取合约交易品种信息
- Method: `GET`
- Path: `/v1/perpum/instruments`
- Param:
  - `name` 可选，例如 `BTC`

### 获取合约全市场 ticker
- Method: `GET`
- Path: `/v1/perpumPublic/tickers`

### 获取指定合约 ticker
- Method: `GET`
- Path: `/v1/perpumPublic/ticker`
- Param:
  - `instrument`

### 获取合约 K 线
- Method: `GET`
- Path: `/v1/perpumPublic/klines`
- Params:
  - `currencyCode`
  - `granularity`
  - `limit`

### 获取合约订单簿
- Method: `GET`
- Path: `/v1/perpumPublic/depth`
- Param:
  - `base`

---

## 4. 已确认：合约 Private

### 获取合约账户资产
- Method: `GET`
- Path: `/v1/perpum/account/getUserAssets`

### 获取当前持仓
- Method: `GET`
- Path: `/v1/perpum/positions/all`

### 获取当前订单
- Method: `GET`
- Path: `/v1/perpum/orders/open`
- Core Params:
  - `instrument`
  - `positionType`

### 合约下单
- Method: `POST`
- Path: `/v1/perpum/order`
- Core Params:
  - `instrument`
  - `direction` = `long|short`
  - `leverage`
  - `quantityUnit`
  - `quantity`
  - `positionModel`
  - `positionType` = `execute|plan|planTrigger`
  - `openPrice` 可选
  - `stopLossPrice` 可选
  - `stopProfitPrice` 可选
  - `triggerPrice` 可选
  - `triggerType` 可选
  - `thirdOrderId` 可选

### 合约取消单个订单
- Method: `DELETE`
- Path: `/v1/perpum/order`
- Core Params:
  - `id`

### 合约批量取消订单
- Method: `DELETE`
- Path: `/v1/perpum/batchOrders`
- Core Params:
  - `sourceIds`
  - `posType` 可选

### 合约平仓
- Method: `DELETE`
- Path: `/v1/perpum/positions`
- Core Params:
  - `id`
  - `positionType` = `execute|plan`
  - `closeNum` 或 `closeRate`
  - `orderPrice` 可选

### 合约签名规则
根据官方代码示例：
1. 生成毫秒级 `timestamp`
2. 若是 GET：待签名串为 `timestamp + METHOD + apiPath + ?queryString`
3. 若是 POST/DELETE/PUT：待签名串为 `timestamp + METHOD + apiPath + JSON.stringify(body)`
4. 用 `secret_key` 做 `HMAC-SHA256`
5. 对摘要做 `Base64`
6. 放入 header：
   - `sign`
   - `api_key`
   - `timestamp`

---

## 5. 当前代码已经替换的部分

已在代码中替换：
- `core/signer.ts`
- `core/client.ts`
- `market/index.ts`
- `account/index.ts`
- `execution/index.ts`

其中：
- spot/futures 签名方式已分开实现
- 一批 market/account/execution endpoint 已替换为真实文档路径

---

## 6. 仍待继续确认的部分

以下内容还建议进一步实测或补文档核验：
- 合约账户信息查询的精确 endpoint（当前代码先放了候选路径）
- 现货下单接口的精确参数名与市价/限价区分细节
- 合约取消全部订单的精确 endpoint
- 现货/合约错误码映射
- WebSocket 是否纳入下一阶段 skill

---

## 7. 关于个人信息

本 skill 仍然不包含任何个人：
- API Key
- Secret
- 账户标识
- 本地环境值

使用者必须自行在本地填写环境变量。
