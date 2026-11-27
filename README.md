# chatgate · 私聊聊天档的工具申请通道

Aurabot 用户模块。私聊默认只给「轻工具集」（读与聊天类），她想动手时调一次 `qq_need_tools` 把要做什么说清楚，宿主当场把本会话的工具放开，并锁定到本轮结束；下一轮重新判定。

群聊不走这条：群里她开口的前提是有人 @ 她或主人说话，闸门另有一套（`turnSendersAllTools`），没有自助申请入口。

## 安装

放到 `/root/.dsh/plugins-data/aurabot/modules/chatgate/index.mjs`（目录名即模块 id）。改文件约 10 秒热重载，日志里会出现 `[modules] 模块「chatgate」文件改了，重新加载`。

## 开关

面板「模块 → 已安装 → 聊天档工具申请」：

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `enabled` | switch | 关掉后 `qq_need_tools` 不挂载，私聊只能靠用户开口授权工具 |
| `toolIntentWords` | textarea | 一行一个；用户消息里出现这些词就当场放开工具，留空用宿主内置那套 |

## 依赖的宿主接口

- `api.core.hub.requestTools(chatId, reason)` —— 存在才接通；不存在时工具仍挂载，但调用会返回「申请通道没有接通」。
- 工具只在 `chat.kind === 'private'` 时挂载。

## 版本

- `0.1.0` 初版（从工作副本收敛而来）
