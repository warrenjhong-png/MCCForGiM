# MCCForGiM

MCCForGiM（MCClient2）是以 ASP.NET MVC 5 與 .NET Framework 4.8 建立的模型建立與資料蒐集 Web 應用程式。

## 專案內容

- `MCClient2`：ASP.NET MVC 主程式
- `MCClient2.Tests`：NUnit 測試
- `INSTALL_DEPLOYMENT_SVN.md`：安裝、SVN、部署與程式流程文件
- `MCCForGiM_安裝部署_SVN與程式流程手冊.docx`：Word 版技術交接手冊

## 主要外部依賴

- .NET Framework 4.8
- Visual Studio 2019/2022 ASP.NET workload
- STDB、CDB
- BuildAPI、FileStorage
- `fst.Toolkit.dll`、`Imrc.CommonLibNet45.dll`

NuGet 套件使用舊式 `packages.config` 管理。完整安裝與部署方式請參閱交接手冊。

## 安全與資料注意事項

Repository 不包含：

- 正式環境 INI、密碼與憑證
- `App_Data/AvmModels` 的製程資料、模型與工作狀態
- 執行 logs
- NuGet/npm 還原套件與建置產物

部署前需向環境管理者取得 STDB/CDB、BuildAPI、FileStorage 與外部 DLL 的核准設定及版本。

