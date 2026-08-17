using fst.Toolkit;
using System;
using System.IO;
using System.Web.Hosting;
using NLog;
using Logger = NLog.Logger;

namespace MCClient2.Models
{
    internal static class AppConstant
    {
        public static string AppRootPath
        {
            //get { return HostingEnvironment.MapPath("~/"); }
            //get { return AppDomain.CurrentDomain.GetData("DataDirectory").ToString(); }
            get { return AppDomain.CurrentDomain.BaseDirectory; }
        }

        public static string AppDataDirPath
        {
            get { return Path.Combine(AppRootPath, "App_Data"); }
        }

        public static string AvmModelDirPath
        {
            get { return Path.Combine(AppDataDirPath, "AvmModels"); }
        }

        public static Logger Logger = LogManager.GetCurrentClassLogger();
    }
}