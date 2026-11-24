<div align="center">

# Endfield Hexo Starter

**Fork 即用的终末地风格 Hexo 博客**

集成了 [Endfield 主题](https://github.com/longking2012/Endfield-hexo-Theme) 的完整 Hexo 站点，Fork 后无需配置，启用 Actions 即可自动上线。

[![Deploy](https://img.shields.io/badge/Deploy-GitHub_Pages-fffa00)](#部署到-github-pages)
[![Hexo](https://img.shields.io/badge/Hexo-8-blue)](https://hexo.io/)

[在线示例](https://xn--i9q515a7uj4zw.work/)

</div>

---

## 这是什么

这是一个**开箱即用**的 Hexo 博客站点模板，已经集成：

- ✅ [Endfield 主题](https://github.com/longking2012/Endfield-hexo-Theme)（终末地风格）
- ✅ 完整的 Hexo 框架与依赖
- ✅ GitHub Actions 自动部署配置
- ✅ 示例文章与基础结构

**你不需要手动安装 Hexo，Fork 后按下面步骤操作即可上线。**

## 快速开始

### 1. Fork 本仓库

点击右上角的 **Fork** 按钮，将本仓库复制到你的 GitHub 账号下。

### 2. 创建部署配置文件

由于安全限制，Fork 后需要手动创建一个部署配置文件（只需一次）：

1. 在你 Fork 的仓库中，进入 `.github/` 目录
2. 新建文件夹 `workflows`，在其中新建文件 `deploy.yml`
3. 把下面的内容完整复制进去，保存：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: |
          npm install -g hexo-cli
          npm install

      - name: Build
        run: hexo generate

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. 启用 GitHub Pages

进入你 Fork 后的仓库：

1. 打开 **Settings** → **Pages**
2. 在 **Source** 下拉框中，选择 **GitHub Actions**
3. 保存

### 4. 触发部署

进入 **Actions** 标签页：

- 如果有失败的 workflow，点击进去重新运行（Enable and rerun）
- 或者随便改一下 `source/_posts/hello-world.md` 并提交，自动触发部署

等待 1~2 分钟，访问 `https://你的用户名.github.io/仓库名/` 即可看到博客上线！

## 本地预览（可选）

如果你想在自己的电脑上预览和写作：

```bash
# 克隆你 Fork 的仓库
git clone https://github.com/你的用户名/hexo-endfield-starter.git
cd hexo-endfield-starter

# 安装依赖（需要 Node.js 20+）
npm install

# 启动本地预览
npx hexo server
```

访问 `http://localhost:4000` 即可预览。

## 开始写作

### 新建文章

在本地执行：

```bash
npx hexo new "我的第一篇文章"
```

会在 `source/_posts/` 生成一个 Markdown 文件，用任意编辑器打开写作即可。

### 修改站点信息

编辑根目录的 `_config.yml`，修改：

- `title`：站点标题
- `author`：你的名字
- `url`：你的博客地址（GitHub Pages 为 `https://用户名.github.io/仓库名/`）

### 发布更新

写作完成后，提交并推送到 GitHub，Actions 会自动重新部署：

```bash
git add .
git commit -m "新增文章"
git push
```

## 自定义主题

主题的详细配置说明请查看 [Endfield 主题文档](https://github.com/longking2012/Endfield-hexo-Theme)。

常用自定义：

- **站点标题**：修改 `_config.yml` 的 `title`
- **导航菜单**：修改 `_config.yml` 的 `menu`
- **主题配置**：修改 `themes/endfield/_config.yml`
- **音乐播放器**：把音乐文件放到 `themes/endfield/source/music/`，编辑 `themes/endfield/source/js/main.js` 的 `PLAYLIST`

## 目录结构

```
.
├── _config.yml            # Hexo 站点配置（修改这里）
├── package.json           # 依赖与脚本
├── source/
│   └── _posts/            # 你的文章（Markdown）
├── themes/endfield/       # Endfield 主题
└── .github/workflows/     # GitHub Actions 自动部署
```

## 常见问题

**Q: Actions 部署失败怎么办？**
A: 检查 Settings → Actions → General，确保 Workflow permissions 设置为 "Read and write permissions"。

**Q: 访问地址是什么？**
A: 如果仓库名是 `用户名.github.io`，访问 `https://用户名.github.io`；否则访问 `https://用户名.github.io/仓库名/`。

**Q: 怎么换域名？**
A: 修改 `_config.yml` 的 `url` 为你的域名，并在仓库 Settings → Pages 配置自定义域名。

## 许可证

本模板的代码部分基于 [MIT License](LICENSE) 开源。

**版权声明**：主题中涉及的所有《明日方舟：终末地》相关素材，其知识产权均归 **[鹰角网络（Hypergryph）](https://www.hypergryph.com/)** 所有。本项目为非商业的开源模板，与鹰角网络无任何隶属或合作关系。

<!-- 325 Longking Lovely 2550360 -->
