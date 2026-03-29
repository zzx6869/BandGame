# 托管到 GitHub Pages：思路与操作

## 思路

1. 代码在 **GitHub 仓库**里；**不要**把 `dist` 提交进 Git（已在 `.gitignore`）。
2. 用 **GitHub Actions** 在云端执行 `npm ci` + `npm run build`，得到 `dist`。
3. 通过官方 **upload-pages-artifact** + **deploy-pages** 把 `dist` 推到 **GitHub Pages**。
4. Vite 打包的 JS/CSS 路径默认从网站**根路径** `/` 开始；而 GitHub 的**项目站**地址是  
   `https://用户名.github.io/仓库名/`，多了一层子路径，必须在构建时设置  
   **`base: /仓库名/`**，否则打开页面会 404。  
   本仓库已在 `vite.config.ts` 里用环境变量 `VITE_BASE_URL` 处理；Workflow 里已写好。

## 你需要做的

### 1. 推送代码

确保 **`main`** 分支包含：

- `vite.config.ts`（含 `base`）
- `.github/workflows/deploy-github-pages.yml`
- `package-lock.json`（与 `package.json` 一致，供 `npm ci`）

### 2. 打开 GitHub Pages

1. 打开仓库 **Settings → Pages**。  
2. **Build and deployment** 里，**Source** 选 **GitHub Actions**（不要选 Deploy from a branch 的旧方式，除非你自己改脚本）。

### 3. 触发部署

推送到 `main`（或 Actions 里手动 **Run workflow**）。  
完成后在 **Actions** 标签页看到绿色对勾，再在 **Settings → Pages** 里会显示站点 URL。

### 4. 访问地址

- **普通仓库**（例如仓库名 `BandGame`）：  
  `https://<用户名>.github.io/BandGame/`  
  （若仓库名含编码，以 GitHub 显示的 Pages URL 为准。）
- **用户/组织主页仓库**（仓库名严格为 `<用户名>.github.io`）：站点在域名根  
  `https://<用户名>.github.io/`，此时应把 Workflow 里 `npm run build` 的  
  `env: VITE_BASE_URL: /${{ github.event.repository.name }}/` **删掉或改为**  
  `VITE_BASE_URL: /`，并重新部署。

## 本地如何模拟「子路径」构建

```bash
VITE_BASE_URL=/你的仓库名/ npm run build
npm run preview -- --base /你的仓库名/
```

（若预览仍不便，可直接信任 CI 构建结果。）

## 常见问题

| 现象 | 可能原因 |
|------|----------|
| 白屏、控制台一堆 404 | `base` 与真实 Pages 路径不一致（仓库改名后忘记改 Workflow 或改 `VITE_BASE_URL`） |
| Actions 失败 `npm ci` | 缺少或未提交 `package-lock.json`，或本地改过依赖未同步 lock |
| Ink 编译失败 | `prebuild` 会跑 `inkjs-compiler`；确保 `src/ink/demo.ink` 可编译 |

## 与 PROJECT_GUIDE 的关系

玩法与存档逻辑见 `PROJECT_GUIDE.md`；线上存档仍在访问者浏览器的 **localStorage**，换浏览器或清空站点数据会清空进度。
