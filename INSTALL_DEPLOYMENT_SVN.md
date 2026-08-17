# MCCForGiM 安裝、部署與 SVN 操作手冊

最後更新：2026-08-17

## 1. 文件目的

本文件說明如何在新電腦上取得、建置及部署 `MCCForGiM / MCClient2`，並說明 Windows 上的 SVN Client 安裝與基本操作。

本專案是傳統 ASP.NET MVC 5 Web Application：

- Solution：`MCClient2.sln`
- 主程式：`MCClient2/MCClient2.csproj`
- 測試：`MCClient2.Tests/MCClient2.Tests.csproj`
- Target Framework：.NET Framework 4.8
- 原始 Solution 建立環境：Visual Studio 2019
- 前端：TypeScript、Vue 2、jQuery、Kendo UI、Bootstrap 3
- 套件管理：NuGet `packages.config`、npm
- 正式執行環境：Windows + IIS

## 2. 部署架構

```text
使用者瀏覽器
    |
    v
IIS / ASP.NET MVC 5 (MCClient2)
    |-- STDB：製程與原始資料
    |-- CDB：MODEL、MODEL_DETAIL 等模型資料
    |-- BuildAPI：啟動模型建立
    |-- FileStorage：上傳模型 ZIP
    `-- App_Data/AvmModels：task 中間資料、設定、結果與狀態檔
```

## 3. 需要安裝的軟體

### 3.1 開發電腦必要項目

1. Windows 10/11 x64。
2. Visual Studio 2019 或 2022。
3. Visual Studio Workload：
   - ASP.NET and web development
   - .NET desktop development（建議）
4. .NET Framework 4.8 Developer Pack。
5. NuGet Package Manager（Visual Studio Workload 通常會一併安裝）。
6. Node.js LTS 與 npm，只有修改或重新編譯 TypeScript 時需要。
7. SVN Client，建議安裝 TortoiseSVN x64。

Visual Studio 2022 通常可以開啟此專案；若遇到舊式 Web Application targets 或 TypeScript 工具問題，優先使用與 Solution 相同世代的 Visual Studio 2019。

### 3.2 IIS 伺服器必要項目

1. Windows Server 或支援 IIS 的 Windows。
2. IIS Web Server。
3. .NET Framework 4.8 Runtime。
4. IIS Role Services：
   - Web Server / Common HTTP Features / Static Content
   - Application Development / ASP.NET 4.x
   - Application Development / .NET Extensibility 4.x
   - Application Development / ISAPI Extensions
   - Application Development / ISAPI Filters
   - Management Tools / IIS Management Console
5. 可連線至 STDB、CDB、BuildAPI、FileStorage 的網路與防火牆規則。

部署伺服器不需要 Visual Studio、Node.js 或 SVN；建議在建置機 Publish，再將發布產物交付伺服器。

### 3.3 專案外部 DLL

專案除 NuGet 外還依賴：

- `MCClient2/DLL/Imrc.CommonLibNet45.dll`
- `fst.Toolkit.dll`

目前 `fst.Toolkit.dll` 的參考路徑是：

```text
..\..\PSMC.AVMKPI\fstASEKPI\fstASEKPI\dll\fst.Toolkit.dll
```

這是工作站相對路徑，新電腦未必存在。建議將核准版本放入 `MCClient2/DLL`，再把 csproj 的 HintPath 改為專案內相對路徑；在尚未調整前，必須向專案維護者取得相同版本並建立對應目錄。

## 4. SVN 安裝與取得原始碼

### 4.1 SVN Client 與 SVN Server 的差異

- 開發人員只需要 **SVN Client**，用來 Checkout、Update、Commit。
- 只有要自行架設中央 Repository 時才需要 **SVN Server**。
- 本專案已是 SVN working copy，根目錄可看到 `.svn`；通常不需要另建 Repository。

### 4.2 安裝 TortoiseSVN

1. 前往 TortoiseSVN 官方下載頁：<https://tortoisesvn.net/downloads.html>。
2. 一般 Intel/AMD 64 位元 Windows 選擇 x64 MSI。
3. 執行安裝程式，一般使用者保留預設功能即可。
4. 完成後重新啟動 Windows Explorer；若右鍵選單仍未出現，再重新登入或重開機。
5. 對任意資料夾按右鍵，確認可看到 **TortoiseSVN** 選單。Windows 11 可能要先選 **顯示其他選項**。

Apache Subversion 官方 Windows binary 清單也列有 TortoiseSVN、SlikSVN 與 VisualSVN：<https://subversion.apache.org/packages.html#windows>。

### 4.3 使用 GUI Checkout 專案

向 SVN 管理員取得：

- Repository URL
- 帳號與密碼
- 要使用的 branch/tag 或 trunk 路徑
- VPN、Proxy 或憑證需求

1. 建立一個空資料夾，例如 `C:\source\MCCForGiM`。
2. 對資料夾按右鍵，選擇 **SVN Checkout...**。
3. 在 **URL of repository** 貼上 Repository URL。
4. 確認 **Checkout directory** 是剛建立的資料夾。
5. **Checkout Depth** 選 `Fully recursive`，Revision 選 `HEAD revision`。
6. 按 **OK**，輸入 SVN 帳號密碼，等待顯示 `Completed`。
7. 開啟 `MCClient2.sln`，確認專案檔案完整。

不要在已經含有另一份 `.svn` metadata 的資料夾中再次 Checkout。

### 4.4 開始工作前：SVN Update

1. 儲存 Visual Studio 中尚未存檔的內容。
2. 對專案根目錄按右鍵，選 **SVN Update**。
3. 等待更新完成；若顯示紅色 Conflict，先不要 Commit，依 4.9 節處理。
4. 回到 Visual Studio，重新載入有變動的檔案。

### 4.5 查看變更與差異

1. 對專案根目錄按右鍵，選 **TortoiseSVN > Check for modifications**。
2. `Modified` 表示已修改，`Added` 表示準備新增，`Unversioned` 表示尚未納入 SVN。
3. 選取檔案後按 **Diff**，比較本機內容與 SVN 基準版本。
4. 確認 `bin`、`obj`、`logs`、`node_modules`、App_Data task 或機密設定沒有被誤選。

### 4.6 新增檔案

1. 在 **Check for modifications** 找到狀態為 `Unversioned` 的新檔案。
2. 勾選要納入版控的檔案，按右鍵選 **Add**。
3. 檔案會顯示 `Added`；此時尚未上傳，仍需執行 Commit。

### 4.7 Commit 提交變更

1. 先執行 **SVN Update**，解決衝突，並完成 Build 與測試。
2. 對專案根目錄按右鍵，選 **SVN Commit...**。
3. 在 Message 輸入清楚的變更說明。
4. 只勾選本次要提交的檔案；雙擊檔案可再次查看 Diff。
5. 按 **OK**；看到 `Completed` 與新 Revision number 才算提交成功。

### 4.8 放棄本機變更：Revert

> **警告：** Revert 會丟棄尚未 Commit 的本機修改，通常無法由 SVN 復原。執行前先確認或另存備份。

1. 對檔案或資料夾按右鍵，選 **TortoiseSVN > Revert...**。
2. 只勾選確定要放棄的項目，按 **OK**。
3. 若只是想查看差異，使用 Diff，不要先按 Revert。

### 4.9 處理 Conflict

1. SVN Update 後若出現 Conflict，對衝突檔案按右鍵，選 **TortoiseSVN > Edit conflicts**。
2. 在合併工具比較 `Theirs`、`Mine` 與 `Merged`，保留正確程式後儲存。
3. 重新 Build 與測試。
4. 對檔案按右鍵，選 **TortoiseSVN > Resolved**；只有確認衝突已處理才執行。
5. 再執行 SVN Commit 上傳合併結果。

### 4.10 查看歷史與還原舊版內容

1. 對檔案或資料夾按右鍵，選 **TortoiseSVN > Show log**。
2. 查看 Revision、作者、日期與 Commit Message。
3. 選取 Revision 後使用 **Compare with working copy** 查看差異。
4. 若要還原舊內容，先確認差異，再依團隊流程執行 **Revert changes from this revision**，最後 Commit。

### 4.11 Cleanup

若 SVN 操作中斷或 working copy 顯示 locked，對專案根目錄按右鍵，選 **TortoiseSVN > Clean up...**，保留預設選項先執行。Cleanup 不是刪除程式碼的工具。

### 4.12 Visual Studio SVN 整合

`MCClient2.sln` 記錄了 `AnkhSVN2019`。若使用 Visual Studio 2019 且團隊仍採用該外掛，可依公司核准來源安裝 AnkhSVN2019。

不過 Visual Studio 外掛不是必要條件。TortoiseSVN 能在 Windows Explorer 完成全部 SVN 操作，也能避免舊外掛與 Visual Studio 2022 的相容性問題。

### 4.13 若要自行架設 SVN Server

這與部署 MCClient2 無直接關係。Windows 環境可評估 VisualSVN Server；建立 Repository、使用者、權限與 HTTPS 後，再將 Repository URL 提供給開發人員。正式環境應由 IT 管理憑證、備份、權限及災難復原，不建議在 IIS 應用伺服器臨時建立檔案型 Repository。

## 5. 第一次建置

### 5.1 還原 NuGet 套件

在 Visual Studio 開啟 `MCClient2.sln`，確認：

```text
Tools > NuGet Package Manager > Package Manager Settings
Allow NuGet to download missing packages = Enabled
Automatically check for missing packages during build = Enabled
```

接著：

```text
Solution 右鍵 > Restore NuGet Packages
```

若使用命令列且已有 `nuget.exe`：

```powershell
nuget restore .\MCClient2.sln
```

本專案是舊式 `packages.config`，套件預設還原到 Solution 根目錄的 `packages`，不是使用現代 SDK-style 的 `PackageReference`。

### 5.2 還原 npm 與編譯 TypeScript

只有前端 TypeScript 需要變更時才執行：

```powershell
Set-Location .\MCClient2
npm install
npx tsc -p .\Scripts\tsconfig.json
```

編譯結果位於：

```text
MCClient2/Scripts/dist
```

注意：csproj 記錄 `TypeScriptToolsVersion=3.2`，但 `package.json` 目前安裝 TypeScript `^5.9.3`。若新版編譯結果與現有 JavaScript 不相容，需由團隊固定 Node/TypeScript 版本，不要在未驗證下任意升級。

### 5.3 Build

Visual Studio：

```text
Configuration = Debug 或 Release
Platform = Any CPU
Build > Build Solution
```

命令列可在 Visual Studio Developer PowerShell 執行：

```powershell
msbuild .\MCClient2.sln /t:Build /p:Configuration=Release /p:Platform="Any CPU"
```

若出現 `fst.Toolkit` 找不到，依第 3.3 節處理外部 DLL。

## 6. 執行前環境設定

### 6.1 必須向環境管理者取得的設定

程式使用 `FstIniEditor` 讀取下列設定，實際 INI 位置與格式由 `fst.Toolkit`／公司環境決定，不在目前 Repository 中：

| Section/名稱 | 用途 |
|---|---|
| `STDB` | 製程與原始資料庫連線 |
| `CDB` | 模型資料庫連線，含 `MODEL`、`MODEL_DETAIL` |
| `[BuildAPI] URL` | 模型建立 API Base URL |
| `[FileStorage] URL` | 模型 ZIP 上傳服務 URL |

需要向原部署環境或系統管理員取得：

- 正確 INI 檔與放置位置
- DB Server、Database、帳號及權限
- BuildAPI/FileStorage URL
- TLS 憑證、VPN、DNS 與防火牆資訊
- STDB/CDB schema 版本

不要把正式環境密碼直接提交到 SVN。

### 6.2 目錄權限

IIS Application Pool 身分至少需要：

- `MCClient2/App_Data/AvmModels`：Modify
- `MCClient2/logs`：Modify
- 模型壓縮與暫存路徑：Modify

NLog 另將 internal log 寫到 `C:\temp\nlog-internal.log`。正式環境需建立並授權 `C:\temp`，或修改 `NLog.config` 將 internal log 放到站台 logs 目錄。

避免讓 Application Pool 對整個磁碟或網站根目錄擁有不必要的 Full Control。

## 7. 本機執行

1. 完成 NuGet restore。
2. 確認外部 DLL 參考正常。
3. 放置並設定環境 INI。
4. 確認可連線 STDB、CDB、BuildAPI、FileStorage。
5. 在 Visual Studio 將 `MCClient2` 設為 Startup Project。
6. 使用 IIS Express 啟動。
7. 預設專案 URL 記錄為 `http://localhost:2303/`。
8. 預設路由會開啟 `/Avm/AvmPage`。

## 8. IIS 部署

### 8.1 建立發布產物

在 Visual Studio：

1. `MCClient2` 右鍵 > **Publish**。
2. Target 選 **Folder**。
3. Configuration 選 **Release**。
4. 發布到乾淨的 staging 目錄，例如 `C:\Deploy\MCCForGiM`。
5. 確認輸出包含 `bin`、`Views`、`Content`、`Scripts`、`Web.config`、`Global.asax`、必要 DLL 與靜態資源。

不要直接把整份 working copy（尤其 `.svn`、`.vs`、`node_modules`、測試檔及歷史 App_Data）複製到正式站台。

### 8.2 建立 IIS Application Pool

建議設定：

| 項目 | 設定 |
|---|---|
| .NET CLR Version | v4.0 |
| Managed pipeline mode | Integrated |
| Enable 32-Bit Applications | 依 `fst.Toolkit` 與原生 DLL 位元數決定 |
| Identity | 專用服務帳號或 ApplicationPoolIdentity |
| Start Mode | AlwaysRunning，可依公司政策調整 |

若 `Grpc.Core` 或專用 DLL 發生 `BadImageFormatException`，優先確認 x86/x64 與 Application Pool 的 32-bit 設定是否一致。

### 8.3 建立網站或 Application

1. IIS Manager 建立 Website 或既有站台下的 Application。
2. Physical Path 指向發布目錄。
3. 指定上一步建立的 Application Pool。
4. 設定 HTTP/HTTPS binding。
5. 對 `App_Data/AvmModels`、`logs` 授予 Application Pool 身分 Modify 權限。
6. 放置正式環境 INI／外部設定。
7. 確認防火牆與 DNS。
8. Recycle Application Pool。

### 8.4 Web.config 注意事項

- `compilation` target 是 4.8。
- `httpRuntime` 目前寫成 target 4.5，建議測試後統一為 4.8。
- `maxRequestLength="10240"` 表示 ASP.NET request 上限約 10 MB；若模型設定或上傳內容更大，需要同步檢查 IIS `requestFiltering/requestLimits`。
- Release transform 目前只移除 debug 屬性，沒有處理外部 URL、密碼或環境差異。

正式環境建議 `customErrors`、request limit、TLS、安全標頭與驗證方式由資安政策統一設定。

## 9. 部署後驗證

依序驗證：

1. 首頁或 `/Avm/AvmPage` 能開啟。
2. 瀏覽器 Console 沒有 JavaScript 404 或載入錯誤。
3. `GetFabInfo` 能連線 STDB。
4. Piece count、變數查詢及 raw data 查詢正常。
5. `App_Data/AvmModels/{taskId}` 能建立。
6. `logs/yyyy-MM-dd.log` 能寫入。
7. BuildAPI 能收到 `model/setup_avm_env`。
8. `Finish.txt`／`Error.txt` 狀態輪詢正常。
9. FileStorage 能收到模型 ZIP。
10. CDB 的 `MODEL` 與 `MODEL_DETAIL` 有正確資料。

目前 Upload 流程可能對 `MODEL_DETAIL` 寫入兩次：Controller 先呼叫 `InsertModelDetail`，`MCCImporter.UploadModel` 又呼叫 `UploadModelDetail`。正式驗收時應檢查是否產生重複明細。

## 10. 回滾方式

每次部署前：

1. 保存上一版發布目錄或 ZIP。
2. 備份正式環境設定，但不要放進公開或一般 SVN 路徑。
3. 若版本包含 DB schema 變更，準備 DBA 核准的 rollback script。

發生問題時：

1. 停止或隔離站台流量。
2. 切回上一版發布目錄。
3. 還原對應設定。
4. Recycle Application Pool。
5. 執行第 9 節的基本驗證。

不要把 `App_Data/AvmModels` 當成可任意覆蓋的程式檔；其中可能含仍在執行的 task 與模型產物。

## 11. 常見問題

### 找不到 NuGet targets

重新 Restore NuGet Packages，確認 Solution 根目錄已產生 `packages`。

### 找不到 fst.Toolkit.dll

取得公司核准 DLL，並修正 csproj HintPath 或建立原本預期的相對目錄。

### 站台可開啟但查不到資料

檢查 INI、STDB/CDB 帳號、DNS、防火牆、DB schema 與 Application Pool 身分。

### 無法寫 log 或建立模型目錄

對 `logs` 與 `App_Data/AvmModels` 授予 Application Pool 身分 Modify，而不是對整個站台給 Everyone Full Control。

### 模型一直顯示 Processing

檢查 BuildAPI log、task model 目錄、`Finish.txt`、`Error.txt`、API URL 與服務端是否能寫回共用路徑。

### SVN 右鍵選單沒有出現

確認安裝了正確 x64/x86 版本，重新啟動 Explorer 或重新登入。Windows 11 可從 **Show more options** 找到傳統右鍵選單。

## 12. 交接前仍需補齊的資訊

- [ ] 正式 SVN Repository URL 與分支規則
- [ ] 正式／測試 STDB、CDB 設定
- [ ] INI 實際檔名與搜尋位置
- [ ] BuildAPI 與 FileStorage URL
- [ ] `fst.Toolkit.dll` 核准版本與來源
- [ ] Kendo UI 授權與版本來源
- [ ] IIS 正式站台名稱、port、host name、TLS certificate
- [ ] Application Pool 服務帳號
- [ ] DB migration／schema 建立方式
- [ ] App_Data 清理與備份政策
- [ ] 正式部署、回滾與驗收負責人

## 13. 程式執行流程

### 13.1 網站啟動流程

```text
IIS / IIS Express 啟動 MCClient2
    |
    v
Global.asax -> MvcApplication.Application_Start()
    |-- UnityMvcActivator.Start()
    |-- RegisterAllAreas()
    |-- RegisterGlobalFilters()
    |-- RegisterRoutes()
    `-- RegisterBundles()
    |
    v
Default Route: /Avm/AvmPage
    |
    v
Views/Avm/AvmPage.cshtml + Shared/_Layout.cshtml
    |
    v
載入 Vue、jQuery、Kendo UI 與 Scripts/dist/*.js
```

`UnityConfig` 將 `IApiClient` 註冊為 singleton `HttpAdapter`，主要用於呼叫外部 BuildAPI。`AvmController` 則直接建立 `MCCImporter` 與 `JsonFileManager`。

### 13.2 頁面初始化

前端主要入口是：

```text
Scripts/app/AvmPage.ts
```

它建立 Vue root instance，並搭配：

- `DataCollection.ts`：資料條件、變數選取與 raw data 下載。
- `BuildModel.ts`：模型建立流程。
- `Method.ts`：AJAX 與共用方法。
- `KendoApi.ts`：Kendo Grid、Chart、DateTimePicker 等 UI。
- `struct/*.ts`：前端資料結構。

頁面初始化後，前端透過 `/Avm/*` AJAX action 讀取廠區、條件、變數及 task 狀態。

### 13.3 建立 task 工作目錄

```text
Browser
  -> GET/POST /Avm/GetGuid
  -> PathHelper.GetGuid()
  -> PathHelper.CreateModelFolder(taskId)
  -> App_Data/AvmModels/{taskId}
```

`taskId` 是一次模型建立工作的識別碼。後續 JSON、CSV、model、log、狀態檔與 ZIP 都以它串聯。

### 13.4 查詢資料條件

```text
/Avm/GetFabInfo
  -> MCCImporter.GetFabInfo()
  -> 讀取 STDB Buckets

/Avm/GetFabDetailOutput
  -> MCCImporter.GetFabDetail()
  -> 查詢 SYSSETTING

/Avm/GetPieceList
  -> MCCImporter.GetPieceList()
  -> 依時間與條件查詢 CONTEXTID

/Avm/GetPieceCount
  -> 驗證輸入與時間區間
  -> MCCImporter.GetPieceCount()
  -> 回傳符合條件的 Piece 數量

/Avm/GetVariables
  -> MCCImporter.GetVariables()
  -> 讀取 STDB VARDEF 與相關 definition table
```

`MCCImporter` 建構時使用 `FstIniEditor` 取得 STDB/CDB `DbAgent`，同時載入欄位定義與 Bucket 資訊。

### 13.5 原始資料下載

小型或既有流程可呼叫 `/Avm/DownloadRawData`；目前主要背景流程是：

```text
Browser
  -> POST /Avm/StartDownloadRawData
  -> 驗證 taskId、日期、條件、variables
  -> 建立 RawDataDownloadJob 狀態
  -> HostingEnvironment.QueueBackgroundWorkItem(...)
       |
       v
     MCCImporter.DownloadRawDataInBatches(...)
       |-- 分批查詢 STDB
       |-- 產生 CSV／raw data 檔案
       `-- 更新 task 狀態檔

Browser 定時輪詢
  -> /Avm/GetRawDataDownloadProgress?taskId=...
  -> RawDataDownloadStatusManager.Read(...)
  -> 回傳 Pending / Running / Completed / Failed 與進度
```

背景工作與進度都依賴本機檔案系統。IIS recycle、站台重啟或多機部署時，需要特別檢查工作是否中斷或狀態是否不同步。

### 13.6 資料預覽與指標計算

```text
/Avm/GetRawData
  -> MCCImporter.GetRawData(...)
  -> ChartFileReader / CSV
  -> 回傳前端圖表 series

/Avm/GetIndicators 或 /Avm/GetIndicator
  -> 依 algorithm 計算統計指標
  -> 前端使用 Kendo Chart 顯示

/Avm/GetProcessIndicatorRule
  -> 產生／保存指標規則
```

可用指標演算法與規格計算部分分散於 `AvmController` 和 `PresetMethod`。

### 13.7 建立模型設定

```text
/Avm/DCP
  -> 組合 variable groups、filter rules、indicator rules、point rules
  -> 寫入 task JSON

/Avm/BuildModuleParameter
  -> 組合 IndicatorRule、KSS、DQIy 等參數
  -> 寫入 BuildModuleParameter / ModuleInfo

/Avm/SaveFeatureTxt
  -> 寫入 feature 設定文字檔

/Avm/SaveModelConfig
  -> 建立 model 與 hyper-parameters 目錄
  -> 依 module payload 寫入模型設定

/Avm/MCS_ADAS
  -> 寫入 ADAS 設定

/Avm/MCS_AutoEncoder_CNN
  -> 寫入 AutoEncoder/CNN 設定
```

設定檔主要透過 `JsonFileManager` 寫入：

```text
App_Data/AvmModels/{taskId}/model
```

### 13.8 準備訓練資料

```text
Browser
  -> /Avm/PrepareTrainingData?taskId=...
  -> MCCImporter.PrepareTrainingData(taskId)
       |-- 檢查 task 目錄
       |-- 重建 training data 目錄
       |-- 從 rawdata_download 選取／複製檔案
       `-- 準備模型服務需要的輸入結構
```

這個步驟包含目錄刪除與重建，部署帳號必須有 Modify 權限，也必須確保 taskId 僅能指向預期的 App_Data 子目錄。

### 13.9 呼叫外部模型建立 API

```text
Browser
  -> POST /Avm/BuildModel(taskId, module_type)
  -> 建立 AvmIIITaksInfo JSON
       task_number = taskId
       model_path  = ~/App_Data/AvmModels
       config      = energy_model
       task_type   = PredictPhaseI
       module_type = 前端選擇值
  -> FstIniEditor.ReadValue("BuildAPI", "URL")
  -> HttpAdapter.PostData("model/setup_avm_env", json)
  -> 寫入 Log/api_request.txt、api_response.txt 或 api_error.txt
```

`HttpAdapter` 目前使用同步 `.Result` 等待 HTTP response。BuildAPI 必須能從 `model_path` 找到 task 工作目錄；若 BuildAPI 在另一台機器，路徑需是雙方都能存取且語意一致的共享儲存區。

### 13.10 模型狀態輪詢

```text
Browser 定時呼叫 /Avm/ModelProcessInfo?taskId=...
    |
    |-- model/Finish.txt 存在 -> "OK!"
    |-- model/Error.txt  存在 -> "Error"
    `-- 都不存在              -> "Processing..."
```

若發生錯誤，前端可再呼叫 `/Avm/ReadErrorInfo` 讀取錯誤內容。

因此外部模型服務完成後，除了產生模型檔案，也必須依約定建立 `Finish.txt`；失敗時建立 `Error.txt`。

### 13.11 上傳模型與寫入 CDB

```text
Browser
  -> /Avm/UploadModel(taskId, modelName, indicatorRule)
  -> AvmController.GetModelId(taskId)
  -> AvmController.GetModelDetails(...)
  -> MCCImporter.InsertModelDetail(modelDetails)
       `-- INSERT INTO CDB.MODEL_DETAIL
  -> MCCImporter.UploadModel(...)
       |-- CreateModelZip()
       |    `-- 將 task model 目錄壓縮為 {modelId}.zip
       |-- UploadModelZipToFileStorage()
       |    `-- ApiFileStorage.UploadModel(...)
       |-- UploadModelDetail()
       |    `-- 再次寫入 CDB.MODEL_DETAIL
       `-- UploadModelInfo()
            `-- INSERT INTO CDB.MODEL
```

`MODEL` 寫入欄位：

```text
CREATE_TIME   = GETDATE()
MODEL_ID      = modelId
MODEL_NAME    = 使用者輸入名稱
ROOT          = 1
ROOT_MODEL_ID = modelId
```

重要：目前 Controller 的 `InsertModelDetail` 與 `UploadModel` 內的 `UploadModelDetail` 都會寫 `MODEL_DETAIL`，同一次上傳可能產生兩份明細。建議修正為單一寫入點，並用 DB transaction 包住 FileStorage/CDB 所需的一致性處理。

### 13.12 完整使用者流程摘要

```text
1. 開啟 AvmPage
2. 建立 taskId
3. 選擇時間、廠區與製程條件
4. 查詢 Piece 數量／清單
5. 選擇變數
6. 啟動 raw data 背景下載
7. 輪詢下載進度
8. 預覽資料與設定指標規則
9. 產生 DCP、Module、Feature、ADAS、AutoEncoder 設定
10. PrepareTrainingData
11. 呼叫 BuildAPI 建立模型
12. 輪詢 Finish.txt / Error.txt
13. 壓縮並上傳模型 ZIP
14. 寫入 CDB.MODEL_DETAIL
15. 寫入 CDB.MODEL
```

### 13.13 主要檔案對照

| 檔案 | 職責 |
|---|---|
| `Global.asax.cs` | ASP.NET Application 啟動 |
| `App_Start/RouteConfig.cs` | MVC 路由 |
| `App_Start/UnityConfig.cs` | DI 註冊 |
| `Controllers/AvmController.cs` | 前端 API 與模型流程協調 |
| `Models/MCCImporter.cs` | STDB/CDB、CSV、模型壓縮、上傳與外部程序 |
| `Models/HttpAdapter.cs` | BuildAPI HTTP Client |
| `Models/Managers/JsonFileManager.cs` | task JSON 讀寫 |
| `Models/Managers/RawDataDownloadStatusManager.cs` | raw data 下載狀態檔 |
| `Models/Managers/PathHelper.cs` | task 與 model 目錄 |
| `Views/Avm/AvmPage.cshtml` | 主要畫面 |
| `Scripts/app/AvmPage.ts` | Vue 頁面狀態與主要互動 |
| `Scripts/app/DataCollection.ts` | 資料蒐集與下載流程 |
| `Scripts/app/BuildModel.ts` | 模型建立前端流程 |
