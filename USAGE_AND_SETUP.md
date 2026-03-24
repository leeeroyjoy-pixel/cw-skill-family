# CW Skill 使用与配置说明

这套 `cw` skill 面向 **别的 agent 调用**，当前范围为 MVP1 + MVP2：

- MVP1：行情查询、账户查询、持仓查询
- MVP2：半自动现货/合约执行（默认 dry-run）

## 重要说明

本 skill **不内置任何个人信息、个人 API Key、个人 Secret、个人账户配置**。

使用者必须自行填写以下信息：

- `COINW_API_KEY`
- `COINW_API_SECRET`
- `COINW_BASE_URL`

这些值不应提交到仓库，也不应写死在代码中。

---

## 1. 环境变量

请由使用者自行在本地环境中配置：

```bash
export COINW_API_KEY='your_coinw_api_key'
export COINW_API_SECRET='your_coinw_api_secret'
export COINW_BASE_URL='https://api.coinw.com'
```

如果使用 `.env`，也建议只在本地使用，不要提交：

```env
COINW_API_KEY=your_coinw_api_key
COINW_API_SECRET=your_coinw_api_secret
COINW_BASE_URL=https://api.coinw.com
```

---

## 2. 风控要求

默认策略：

- `dry_run_default = true`
- `require_confirm_for_live = true`
- 仅允许白名单 symbol
- 限制单笔额度
- 限制杠杆

建议每个调用者都先走 dry-run：

```json
{
  "symbol": "BTCUSDT",
  "margin_usdt": 50,
  "leverage": 2,
  "dry_run": true,
  "confirm": false
}
```

确认无误后，再 live：

```json
{
  "symbol": "BTCUSDT",
  "margin_usdt": 50,
  "leverage": 2,
  "dry_run": false,
  "confirm": true
}
```

---

## 3. 当前实现状态

当前目录下的 `cw` skill 已提供：

- 统一目录结构
- market/account/execution 三层 skill
- 统一 JSON 输入输出
- 风控框架
- dry-run / confirm 模型

但以下部分仍需要按 CoinW 官方文档由使用者或后续维护者补全：

- 真实 endpoint path
- 真实签名算法
- 真实 header 名称
- 真实下单参数字段
- 真实账户字段

因此，当前版本更准确地说是：

> **可交付给别的 agent 使用的 `cw` skill 工程骨架 + 配置说明 + 调用协议**

而不是已经内嵌你个人凭证的实盘版本。

---

## 4. 建议的使用方式

### 只读 agent
只允许调用：
- `cw-market-skill`
- `cw-account-skill`

### 执行 agent
允许调用：
- `cw-execution-skill`

但必须配合：
- dry-run 默认
- confirm 审批
- 小额度测试

---

## 5. 不建议的做法

不要：

- 把 API Key 写入代码
- 把 Secret 写入 skill README
- 把个人账户 ID 提交到仓库
- 让研究 agent 默认拥有交易权限

---

## 6. 推荐后续动作

1. 使用者自行补入本地环境变量
2. 用受限 API Key 做只读联调
3. 验证 market/account 接口
4. 再验证 execution 的 dry-run -> live 闭环
5. 最后再放给别的 agent 正式调用
