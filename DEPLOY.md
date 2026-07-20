# 部署指南

## 上傳到 GitHub

### 1. 初始化 Git 倉庫

如果您的專案還沒有初始化 Git，請執行以下命令：

```bash
git init
```

### 2. 建立 .gitignore（已存在）

專案已包含 `.gitignore` 檔案，會自動忽略以下內容：
- `node_modules/`
- `dist/`
- `.env` 等敏感檔案

### 3. 提交變更

```bash
git add .
git commit -m "Initial commit: 大樂透 AI 助手"
```

### 4. 在 GitHub 建立新倉庫

1. 前往 [GitHub](https://github.com) 並登入
2. 點擊右上角的「+」→「New repository」
3. 輸入倉庫名稱（例如：`lottery-ai-assistant`）
4. 選擇「Public」或「Private」
5. **不要**勾選「Initialize this repository with a README」
6. 點擊「Create repository」

### 5. 連接並推送

```bash
# 替換為您的 GitHub 使用者名稱和倉庫名稱
git remote add origin https://github.com/你的使用者名稱/lottery-ai-assistant.git
git branch -M main
git push -u origin main
```

## 部署到 Vercel

### 方法一：透過 Vercel 網站（推薦）

1. 前往 [Vercel](https://vercel.com) 並登入（建議使用 GitHub 帳號）
2. 點擊「Add New...」→「Project」
3. 選擇您剛才上傳的 GitHub 倉庫
4. 設定：
   - **Project Name**: `lottery-ai-assistant`（或您喜歡的名稱）
   - **Framework Preset**: Vite（會自動偵測）
   - **Root Directory**: 保持預設
   - **Build Command**: `npm run build`（自動設定）
   - **Output Directory**: `dist`（自動設定）
5. 點擊「Deploy」
6. 等待幾分鐘，部署完成後您會獲得一個網址（例如：`https://lottery-ai-assistant.vercel.app`）

### 方法二：透過 Vercel CLI

1. 安裝 Vercel CLI：

```bash
npm i -g vercel
```

2. 登入並部署：

```bash
vercel
```

3. 按照提示操作：
   - 設定您的電子郵件（若尚未登入）
   - 選擇「Set up and deploy」
   - 選擇您的團隊（或個人帳號）
   - 確認連結的 GitHub 倉庫
   - 確認設定（使用預設值即可）
   - 等待部署完成

4. 部署到生產環境：

```bash
vercel --prod
```

## 自動部署

一旦您的 GitHub 倉庫與 Vercel 連結，每當您推送程式碼到 `main` 分支時，Vercel 都會自動重新部署。

## 自訂網域名稱

1. 在 Vercel 專案頁面，點擊「Settings」→「Domains」
2. 輸入您的網域名稱
3. 按照說明設定 DNS 記錄

## 其他部署選項

### Netlify

1. 前往 [Netlify](https://www.netlify.com) 並登入
2. 點擊「Add new site」→「Import an existing project」
3. 選擇 GitHub，並選擇您的倉庫
4. 確認建置設定：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. 點擊「Deploy site」

### GitHub Pages

1. 在 `vite.config.ts` 中設定 `base`（如果您的倉庫名稱不是使用者名稱）：

```typescript
export default defineConfig({
  base: '/lottery-ai-assistant/', // 替換為您的倉庫名稱
  // ...
})
```

2. 安裝 `gh-pages`：

```bash
npm install -D gh-pages
```

3. 在 `package.json` 新增指令：

```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

4. 建置並部署：

```bash
npm run build
npm run deploy
```

## 注意事項

- 確保所有依賴都已正確安裝
- 在建置前確認 `npm run build` 可以成功執行
- 檢查 `.gitignore` 確保不需要上傳的檔案已被忽略
