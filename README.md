# WebNav Hub

[English](#english) | [中文](#中文)

<div align="center">
  <img src="favicon.svg" alt="WebNav Hub" width="96">
</div>

<a name="english"></a>

## 🎨 Design Inspiration

This project's UI design and color scheme is directly inspired by Pornhub's iconic black and orange theme. The choice was deliberate, leveraging the instantly recognizable color palette that has become a cultural phenomenon and internet meme, often referenced in various UI design discussions and parodies.

- Primary Theme Color: `#ff9000` (Pornhub Orange)
- Background: `#0d0d0d` (Dark Black)
- Card Background: `#1a1a1a`
- Text: `#ffffff` (White)

## 🌟 Features

### Modern Design

- Responsive grid layout with beautiful cards
- Smooth animations and transitions
- Dark theme with modern color scheme
- Optimized for both desktop and mobile devices

### Content

- **160 link cards** across 6 categories on the home page
- **29 domain / DNS links** on a dedicated sub-page
- Every external link opens in a new tab with `rel="noopener noreferrer"`

### Technical Improvements

- Separated stylesheet (`style.css`) and script (`main.js`) shared by both pages
- CSS custom properties for the color palette
- Four responsive breakpoints (1200px / 768px / 480px / 360px)
- Smooth anchor navigation with `history.pushState` and hash sync
- Custom SVG favicon, no image assets required
- Accessible cards: every anchor gets an `aria-label` from its heading

## 📂 Project Structure

```
├── index.html      # Home page — 6 categories, 160 cards
├── domains.html    # Free domain / DNS sub-page — 29 cards
├── style.css       # Shared stylesheet for both pages
├── main.js         # Shared behaviour: year, aria-labels, anchor nav
├── favicon.svg     # Site icon
└── README.md
```

## 🗂 Categories

| Category | ID | Cards |
| --- | --- | --- |
| Ai搜索 | `ai-search` | 54 |
| 托管社交 | `social` | 22 |
| 实用工具 | `tools` | 60 |
| 科技资讯 | `tech-news` | 9 |
| 云存储 | `cloud-storage` | 7 |
| 电子邮箱 | `email` | 8 |

The 实用工具 grid contains one internal card that links to `domains.html`. The sub-page itself is a single flat grid with no category headings.

## 🚀 Deployment Options

### GitHub Pages Deployment

1. Fork this repository
2. Go to repository Settings > Pages
3. Select main branch as source
4. Your site will be available at `https://[username].github.io/[repo-name]`

### Cloudflare Pages Deployment

1. Connect your GitHub repository to Cloudflare Pages
2. Set build settings:
   - Build command: `N/A` (static site)
   - Build output directory: `/`
3. Deploy and access via Cloudflare's URL

### Custom Domain Setup

1. Register at [dynv6](https://dynv6.com)
2. Add a new domain and configure DNS settings
3. Point domain to your deployment URL
4. Update DNS settings in your deployment platform

## 🛠 Customization

### Adding a New Link

Cards use a wrapper `div` with the link as an absolutely positioned overlay, so the whole card is clickable:

```html
<div class="link-card">
  <a href="[URL]" target="_blank" rel="noopener noreferrer"></a>
  <i class="[ICON-CLASS]"></i>
  <h3>[TITLE]</h3>
</div>
```

The `<a>` is empty on purpose — its text is set at runtime for screen readers from the `<h3>`.

### Adding a New Category

Add a section to `index.html` and a matching nav entry:

```html
<section id="[CATEGORY-ID]">
  <h2 class="category-title">[CATEGORY-NAME]</h2>
  <div class="link-grid">
    <!-- link-card elements -->
  </div>
</section>
```

```html
<li><a href="#[CATEGORY-ID]">[CATEGORY-NAME]</a></li>
```

`main.js` picks up any `nav a` whose `href` contains `#` and wires up smooth scroll and active-state highlighting automatically.

### Changing Colors

All colors live in the `:root` block at the top of `style.css`:

```css
:root {
  --primary-color: #ff9000;
  --bg-color: #0d0d0d;
  --card-bg-color: #1a1a1a;
  --text-color: #fff;
}
```

## 📱 Browser Support

- Modern browsers with CSS Grid support
- Responsive down to 360px viewport width
- Progressive enhancement: content is fully readable without JavaScript

## 🔒 Security

All external links include security attributes:

- `rel="noopener"`: Prevents `window.opener` exploitation
- `rel="noreferrer"`: Prevents referrer information leakage

## 📄 License

This project is open-source and available under the MIT License.

---

<a name="中文"></a>

## 🎨 设计灵感

本项目的界面设计和配色方案直接借鉴自 Pornhub 的标志性黑橙配色。这是一个刻意的设计选择，利用了这个已成为文化现象和网络模因的即时可识别配色方案，经常在各种 UI 设计讨论和模仿作品中被引用。

- 主题主色：`#ff9000`（Pornhub 橙）
- 背景色：`#0d0d0d`（深黑色）
- 卡片背景：`#1a1a1a`
- 文字颜色：`#ffffff`（白色）

## 🌟 功能特点

### 现代设计

- 响应式网格布局，精美卡片设计
- 流畅的动画和过渡效果
- 现代深色主题配色
- 同时优化桌面和移动设备体验

### 内容规模

- 首页 **6 个分类、160 张链接卡片**
- 独立子页收录 **29 个域名 / DNS 相关链接**
- 所有外部链接均在新标签页打开，并带 `rel="noopener noreferrer"`

### 技术改进

- 样式与脚本已分离为 `style.css` 和 `main.js`，两个页面共用
- 使用 CSS 自定义属性管理配色
- 四档响应式断点（1200px / 768px / 480px / 360px）
- 锚点导航平滑滚动，配合 `history.pushState` 同步地址栏
- 自绘 SVG 图标，不依赖任何图片资源
- 卡片可访问性：每个链接的 `aria-label` 自动取自对应标题

## 📂 项目结构

```
├── index.html      # 首页 — 6 个分类，160 张卡片
├── domains.html    # 免费域名 / DNS 子页 — 29 张卡片
├── style.css       # 两个页面共用的样式表
├── main.js         # 共用行为：年份、aria-label、锚点导航
├── favicon.svg     # 站点图标
└── README.md
```

## 🗂 分类一览

| 分类 | ID | 卡片数 |
| --- | --- | --- |
| Ai搜索 | `ai-search` | 54 |
| 托管社交 | `social` | 22 |
| 实用工具 | `tools` | 60 |
| 科技资讯 | `tech-news` | 9 |
| 云存储 | `cloud-storage` | 7 |
| 电子邮箱 | `email` | 8 |

实用工具网格中有一张内部卡片指向 `domains.html`。该子页是单一平铺网格，不含分类标题。

## 🚀 部署选项

### GitHub Pages 部署

1. Fork 本仓库
2. 进入仓库设置 > Pages
3. 选择 main 分支作为源
4. 您的站点将在 `https://[用户名].github.io/[仓库名]` 可用

### Cloudflare Pages 部署

1. 将您的 GitHub 仓库连接到 Cloudflare Pages
2. 设置构建选项：
   - 构建命令：`N/A`（静态站点）
   - 构建输出目录：`/`
3. 部署并通过 Cloudflare 提供的 URL 访问

### 自定义域名设置

1. 在 [dynv6](https://dynv6.com) 注册
2. 添加新域名并配置 DNS 设置
3. 将域名指向您的部署 URL
4. 在部署平台更新 DNS 设置

## 🛠 自定义设置

### 添加新链接

卡片采用「外层 `div` + 绝对定位链接覆盖」的结构，因此整张卡片都可点击：

```html
<div class="link-card">
  <a href="[URL]" target="_blank" rel="noopener noreferrer"></a>
  <i class="[图标类名]"></i>
  <h3>[标题]</h3>
</div>
```

`<a>` 标签内部刻意留空，其文字由脚本在运行时从 `<h3>` 读取并写入，供读屏软件使用。

### 添加新分类

在 `index.html` 中新增一个 section，并在导航中加一条对应项：

```html
<section id="[分类ID]">
  <h2 class="category-title">[分类名称]</h2>
  <div class="link-grid">
    <!-- link-card 元素 -->
  </div>
</section>
```

```html
<li><a href="#[分类ID]">[分类名称]</a></li>
```

`main.js` 会自动识别所有 `href` 含 `#` 的 `nav a`，绑定平滑滚动与高亮状态，无需额外配置。

### 修改配色

所有颜色集中在 `style.css` 顶部的 `:root` 中：

```css
:root {
  --primary-color: #ff9000;
  --bg-color: #0d0d0d;
  --card-bg-color: #1a1a1a;
  --text-color: #fff;
}
```

## 📱 浏览器支持

- 支持具有 CSS Grid 功能的现代浏览器
- 响应式适配至 360px 视口宽度
- 渐进增强：关闭 JavaScript 后内容仍可正常阅读

## 🔒 安全性

所有外部链接都包含安全属性：

- `rel="noopener"`：防止 `window.opener` 漏洞利用
- `rel="noreferrer"`：防止泄露引用来源信息

## 📄 许可证

本项目采用 MIT 许可证开源。

---

Created with ❤️ by AI, enhanced by humans
由 AI 创建，人类优化
