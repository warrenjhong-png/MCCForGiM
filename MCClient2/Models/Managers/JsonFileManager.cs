using MCClient2.Models.Structures;
using Newtonsoft.Json;
using System;
using System.IO;

namespace MCClient2.Models.Managers
{
    internal enum AvmConfigs { TaskInfo, ModuleInfo, AutoEncoderInfo, McsAdasInfo, ModelDetail,ModelMetadata}

    internal class JsonFileManager
    {
        /// <summary>
        /// 預設範本資料夾
        /// </summary>
        /// <remarks>
        /// 每個資料夾內, 又區分 model 和 rawdata 兩個資料夾
        /// </remarks>
        private const string DefaultDirName = "base";
        public const string SubModelDirName = "model";
        public const string SubRawdataDirName = "rawdata";

        public AvmTaskInfo ReadAvmTaskInfo(string dirName = DefaultDirName)
        {
            if (string.IsNullOrEmpty(dirName))
            {
                dirName = DefaultDirName;
            }

            string json = Read(dirName, AvmConfigs.TaskInfo);
            return JsonConvert.DeserializeObject<AvmTaskInfo>(json);
        }

        public AvmModuleInfo ReadAvmModuleInfo(string dirName = DefaultDirName)
        {
            if (string.IsNullOrEmpty(dirName))
            {
                dirName = DefaultDirName;
            }

            string json = Read(dirName, AvmConfigs.ModuleInfo);
            return JsonConvert.DeserializeObject<AvmModuleInfo>(json);
        }

        public AvmAutoEncoderInfo ReadAvmAutoEncoderInfo(string dirName = DefaultDirName)
        {
            if (string.IsNullOrEmpty(dirName))
            {
                dirName = DefaultDirName;
            }

            string json = Read(dirName, AvmConfigs.AutoEncoderInfo);
            return JsonConvert.DeserializeObject<AvmAutoEncoderInfo>(json);
        }

        public AvmMcsAdasInfo ReadAvmMcsAdasInfo(string dirName = DefaultDirName)
        {
            if (string.IsNullOrEmpty(dirName))
            {
                dirName = DefaultDirName;
            }

            string json = Read(dirName, AvmConfigs.McsAdasInfo);
            return JsonConvert.DeserializeObject<AvmMcsAdasInfo>(json);
        }

        public ModelMetadata ReadModelMetadata(string dirName = DefaultDirName)
        {
            if (string.IsNullOrEmpty(dirName))
            {
                dirName = DefaultDirName;
            }

            string json = Read(dirName, AvmConfigs.ModelMetadata);
            return JsonConvert.DeserializeObject<ModelMetadata>(json);
        }
        public void Write(string dirName, AvmConfigs config, object obj)
        {
            if ("base".Equals(dirName, StringComparison.OrdinalIgnoreCase))
            {
                throw new ArgumentException("The directory name can not be 'base'.", nameof(dirName));
            }

            string dirPath = $@"{AppConstant.AvmModelDirPath}\{dirName}\{SubModelDirName}\";
            Directory.CreateDirectory(dirPath);

            string fileName = GetFileName(config);
            
            string json = JsonConvert.SerializeObject(obj);
            File.WriteAllText($@"{dirPath}\{fileName}", json);
            if(config == AvmConfigs.AutoEncoderInfo)
            {
                string[] _fileName = fileName.Split('_');
                File.WriteAllText($@"{dirPath}\{_fileName[0] + "_" + _fileName[1] + ".json"}", json);
            }
        }

        private string Read(string dirName, AvmConfigs config)
        {
            if (string.IsNullOrEmpty(dirName))
            {
                throw new ArgumentNullException("The directory name is empty or null.", nameof(dirName));
            }

            string fileName = GetFileName(config);
            string filePath = $@"{AppConstant.AvmModelDirPath}\{dirName}\{SubModelDirName}\{fileName}";
            if (File.Exists(filePath) == false)
            {
                throw new FileNotFoundException("The file is not exists.", filePath);
            }

            return File.ReadAllText(filePath);
        }

        private static string GetFileName(AvmConfigs config)
        {
            switch (config)
            {
                case AvmConfigs.ModelDetail:
                    return "ModelDetail.json";
                case AvmConfigs.ModuleInfo:
                    return "BuildModuleParameter.json";
                case AvmConfigs.AutoEncoderInfo:
                    return "MCS_AutoEncoder_CNN.json";
                case AvmConfigs.McsAdasInfo:
                    return "MCS_ADAS.json";
                case AvmConfigs.ModelMetadata:
                    return "ModelMetadata.json";
                case AvmConfigs.TaskInfo:
                default:
                    return "DCP.json";
            }
        }
    }
}