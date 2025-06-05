# OpenNav
OpenNav powered by OpenJSW open technology
# 开源项目导航 

一个基于 Cloudflare Workers 实现的极简开源项目导航页面。无需后端，无前端依赖，自动响应式适配，代码全部在 `index.js`，只需部署即可上线。

## 部署

1. 注册并登录 [Cloudflare Workers](https://workers.cloudflare.com/)，创建新 Worker。
2. 替换默认代码为本仓库的 `index.js`，保存并部署。
3. 自定义你的项目列表（在 `PROJECTS` 数组内增加/编辑条目）。

## 增加项目

编辑 `PROJECTS` 数组即可，例如：

```js
{
  name: "xxx",
  desc: "你的描述",
  url: "https://xxx.com",
  tags: ["标签1", "标签2"]
}
