using System;
using System.IO;

namespace MCClient2.Models.Managers
{
    internal static class PathHelper
    {
        public static string GetGuid()
        {
            return Guid.NewGuid().ToString();
        }

        public static string GetDirPath(string dirName, params string[] subDirNames)
        {
            if (subDirNames.Length == 0)
            {
                return Path.Combine(AppConstant.AppDataDirPath + "\\AvmModels", dirName);
            }

            string subDirPath = Path.Combine(subDirNames);
            return Path.Combine(AppConstant.AppDataDirPath + "\\AvmModels", dirName, subDirPath);
        }

        public static string ReplaceDirectorySeparatorChar(string path, string separatorText = @"\\")
        {
            return path.Replace($"{Path.DirectorySeparatorChar}", separatorText);
        }

        public static string GetRandomFileName()
        {
            return Path.GetRandomFileName();
        }
        public static string CreateModelFolder(string dirName)
        {
            var dir = GetDirPath(dirName);
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            return dir;
        }
    }
}