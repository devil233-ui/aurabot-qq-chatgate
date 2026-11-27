/**
 * 「聊天档工具申请」模块
 *
 * 私聊默认走轻工具集，她想调用工具时不强制让用户授权——可以先用 qq_need_tools 申请，
 * hub 当场放开该会话的工具组，并锁定到本轮结束：本轮剩下的步骤都能用，下一轮重新判定。
 * 群聊本来就有 @ 触发兜底，这里只对私聊生效。
 */
export default {
  id: 'chatgate',
  name: '聊天档工具申请',
  version: '0.1.0',
  api: 1,
  description: '私聊聊天档里，她想调用工具时主动申请，工具立刻就放开，下一步就能查',
  defaults: { enabled: true },
  settings: [
    {
      key: 'enabled',
      label: '申请通道',
      type: 'switch',
      hint: '关掉后 qq_need_tools 不挂载，私聊只能靠用户开口授权工具',
    },
    {
      key: 'toolIntentWords',
      label: '主动授权她调用工具时用的词',
      type: 'textarea',
      placeholder: '查一下\n搜一下\n帮我看看',
      hint: '一行一个；用户消息里出现这些词就当场放开工具。留空 = 用内置那套',
    },
  ],
  setup(api) {
    const { hub } = api.core

    api.tool(({ chat }) => {
      const chatId = chat?.chatId || ''
      if (chat.kind !== 'private') return []
      if (api.settings().enabled === false) return []
      return [
        api.defineTool({
          name: 'qq_need_tools',
          description:
            '现在手里的工具不够用、需要查资料或动文件时，先调这个把她要做什么说清楚。' +
            '调用后不用等下一轮，下一步工具就放开；不要静默猜测，也不要重复申请。',
          parameters: {
            type: 'object',
            properties: {
              need: {
                type: 'string',
                description: '你想做什么、需要哪类能力，一句话，用户看得懂',
              },
            },
            required: ['need'],
          },
          async execute(input) {
            if (typeof hub?.requestTools !== 'function') {
              return { ok: false, content: '申请通道没有接通，这一轮先按聊天回。' }
            }
            const r = hub.requestTools(chatId, String(input?.need ?? ''))
            return {
              ok: r?.ok === true,
              content: r?.ok
                ? `申请已记下：${r.need}。工具已经放开，下一步就能查。`
                : `申请没记下：${r?.error ?? '未知原因'}`,
            }
          },
        }),
      ]
    })
  },
}
