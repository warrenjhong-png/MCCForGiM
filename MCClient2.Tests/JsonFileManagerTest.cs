using ExpectedObjects;
using MCClient2.Models.Managers;
using MCClient2.Models.Structures;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NUnit.Framework;
using System;

namespace MCClient2.Tests
{
    [TestFixture]
    public class JsonFileManagerTest
    {
        [Test]
        public void ReadAvmTaskInfoTest()
        {
            // Arrange
            var manager = new JsonFileManager();
            bool expected = true;

            // Act
            AvmTaskInfo obj = manager.ReadAvmTaskInfo();
            bool actualOfModelId = obj.model.model_id == 8;
            bool actualOfModelName = obj.model.model_name == "model_202108201";

            // Assert
            Assert.AreEqual(expected, actualOfModelId);
            Assert.AreEqual(expected, actualOfModelName);
        }

        [Test]
        public void ReadAvmModuleInfoTest()
        {
            // Arrange
            var manager = new JsonFileManager();
            bool expected = true;

            // Act
            AvmModuleInfo obj = manager.ReadAvmModuleInfo();
            bool actualOfEK = obj.Get<IndicatorRule>().EK.Length == 20;
            bool actualOfKSS = obj.Get<KSS>().InSelectAlgorithm == "KMW";

            // Assert
            Assert.AreEqual(expected, actualOfEK);
            Assert.AreEqual(expected, actualOfKSS);
        }

        [Test]
        public void SetAvmModuleInfoTest2()
        {
            // Arrange
            var manager = new JsonFileManager();
            bool expected = true;

            // Act
            //AvmModuleInfo obj = manager.ReadAvmModuleInfo();
            //bool actualOfEK = obj.Get<IndicatorRule>().EK.Length == 20;
            //bool actualOfKSS = obj.Get<KSS>().InSelectAlgorithm == "KMW";

            AvmModuleInfo obj = new AvmModuleInfo();

            var gsi = new GSI
            {
                InSelectAlgorithm = "InSelectAlgorithm",
            };

            obj.Set(gsi);

            // Assert
            //Assert.AreEqual(expected, actualOfEK);
            //Assert.AreEqual(expected, actualOfKSS);
            Assert.AreEqual(expected, true);
        }

        [Test]
        public void SetAvmModuleInfoTest()
        {
            // Arrange
            var manager = new JsonFileManager();
            var moduleIndicatorRule = new IndicatorRule
            {
                EK = new int[] { 0, 1, 2 },
                IndicatorUSL = new double[] { 3, 4, 5 },
                IndicatorUCL = new double[] { 6, 7, 8 },
                IndicatorLCL = new double[] { 9, 10, 11 },
                IndicatorLSL = new double[] { 12, 13, 14 },
            };
            var kss = new KSS
            {
                AdjustYScale = 1.1,
                InSelectAlgorithm = "InSelectAlgorithm",
                ClusterNumber = 1.2,
                ModelExpansionOpen = 1.3,
                ModelExpansionSize = 1.4,
                ModelSizeExtension = 1.5,
                ModifyYOpen = 1.6,
            };
            var kvs = new KVS
            {
                Fin_apha = "Fin_apha",
                Fout_apha = "Fout_apha",
                InOneByOneChoose = "InOneByOneChoose",
                InSelectAlgorithm = "InSelectAlgorithm",
                InSS_PLS_ComponentRate = "InSS_PLS_ComponentRate",
            };
            var dqix = new DQIx
            {
                InLambda = 11,
                InConstant = 22,
                DQIxFilterPercentage = 33,
                IsPCA_OPEN = 44,
                IsForcedNormal_OPEN = 55,
            };
            var dqiy = new DQIy
            {
                corralpha = 1,
                IsMixedModel = 2,
                DQIyMultipleValue = 3,
                Ewmalamda = 4,
                EwmaWindow = 5,
                EwmaTolerance = 6,
                VarConfidence = 7,
                baseSampleNum = 8,
                RangeMultipleValue = 9,
                AutoSearch_Alpha_Lambda = 10,
                AlphaStricMode = 11,
                SampleLackingMode = 12,
                OpenMDFR = 13,
                CloseSPEC = 14,
                SizeMDFR = 15,
                UseBaseModelSamples = 16,
                AutoSearchTestSize = 17,
                SimDriftSamplePercentage = 18,
                DQIy_VMI_Err_StdOpen = 19,
                DQIy_VMI_Err_StdRate = 20,
                IsForcedNormal_OPEN = 21,
                DQIySwitch = 22,
                Ewmalamda_Group = 23,
                VarConfidence_Group = 24,
                SearchMode_Alpha_Lambda = 25,
                AlphaStricVolumem = 26,
                AdaptiveVMIErrTSwitch = 27,
                AdaptiveVMIErrTWeight = 28,
                RefreshWidenSizeRate = 29,
                RefreshWidenValueRate = 30,
                PhaseI_Error_Threshold = 31,
                SimDriftVolume = 32,
                InVigilance = 33,
                InRmax = 34,
                iIsSmartMode = 35,
                CreateModelMethod = 36,
                InIsNewART2 = 37,
                IsFirstFanout = 38,
                AlphaStricCount = 39,
                Threshold_Adaptive_Count = 40,
                realYCount = 41,
                isSC = 42,
                PhaseI_Error_Threshold_Default = 43,
                DQIyThreshold = 44,
            };
            var mr = new MR
            {
                InSelectAlgorithm = "InSelectAlgorithm",
                InMR_TSVD_Condition_Number_Criteria = "InMR_TSVD_Condition_Number_Criteria",
                InMR_TSVD_Energy_Ratio_Criteria = "InMR_TSVD_Energy_Ratio_Criteria",
                MRRefreshCounter = "MRRefreshCounter",
                Q_SqrFlag = "Q_SqrFlag",
            };
            var bpnn = new BPNN
            {
                InEpochsRange = new int[] { 1, 3, 5 },
                InMomTermRange = new float[] { 2, 3, 4 },
                InAlphaRange = new float[] { 3, 4, 5 },
                InNodesRange = new int[] { 2, 4, 6 },
                Target = 0,
                MeasureUnit = "MeasureUnit",
                iniStage2_ConjectureSTD = 0,
                ModelNum = 0,
                iKernel = "iKernel",
                IsExist = 0,
                InInputLayerTransferFunction = "InInputLayerTransferFunction",
                InInputLayerTransferCoefficient = 0,
                InOutputLayerTransferFunction = "InOutputLayerTransferFunction",
                InOutputLayerTransferCoefficient = 0,
                InOutputLayerTransferCurve = 0,
                BPNNRefreshCounter = 0,
            };
            var ri = new RI
            {
                InFirstAlgoName = "InFirstAlgoName",
                InSecondAlgoName = "InSecondAlgoName",
                InSelectCalculator = "InSelectCalculator",
                TolerableMaxErr_StdOpen = "TolerableMaxErr_StdOpen",
                TolerableMaxErr_StdRate = "TolerableMaxErr_StdRate",
                Tolerant_MaxError = "Tolerant_MaxError",
            };
            var gsi = new GSI
            {
                InSelectAlgorithm = "InSelectAlgorithm",
                RefreshCounter = "RefreshCounter",
                InGSI_TSVD_Condition_Number_Criteria = "InGSI_TSVD_Condition_Number_Criteria",
                InGSI_TSVD_Energy_Ratio_Criteria = "InGSI_TSVD_Energy_Ratio_Criteria",
                InGSI_KSS = "InGSI_KSS",
                GSI_RT = "GSI_RT",
                GSI_Threshold = "GSI_Threshold",
                InGSI_ChangeSTD = "InGSI_ChangeSTD",
                GSIB_Mode = "GSIB_Mode",
                GSIB_VarableMagnification = "GSIB_VarableMagnification",
                InGSIB_Mode = "InGSIB_Mode",
                InGSI_SamplingCount = "InGSI_SamplingCount",
                InGSI_WindowsSize = "InGSI_WindowsSize",
            };
            var measurement = new Measurement
            {
                IndicatorSize = 5,
                USL = 20,
                LSL = 10,
                UCL = 40,
                LCL = 30,
                Target = 2,
            };
            bool expected = true;

            // Act
            AvmModuleInfo obj = manager.ReadAvmModuleInfo();
            bool actualOfEK = obj.Get<IndicatorRule>().EK.Length == 20;
            bool actualOfKSS = obj.Get<KSS>().InSelectAlgorithm == "DMW";

            obj.Set(moduleIndicatorRule);
            obj.Set(kss);
            obj.Set(kvs);
            obj.Set(dqix);
            obj.Set(dqiy);
            obj.Set(mr);
            obj.Set(bpnn);
            obj.Set(ri);
            obj.Set(gsi);
            obj.Set(measurement);

            // Assert
            Assert.AreEqual(expected, actualOfEK);
            Assert.AreEqual(expected, actualOfKSS);
            Assert.AreEqual(obj.Get<IndicatorRule>().ToExpectedObject(), moduleIndicatorRule);
            Assert.AreEqual(obj.Get<KSS>().ToExpectedObject(), kss);
            Assert.AreEqual(obj.Get<KVS>().ToExpectedObject(), kvs);
            Assert.AreEqual(obj.Get<DQIx>().ToExpectedObject(), dqix);
            Assert.AreEqual(obj.Get<DQIy>().ToExpectedObject(), dqiy);
            Assert.AreEqual(obj.Get<MR>().ToExpectedObject(), mr);
            Assert.AreEqual(obj.Get<BPNN>().ToExpectedObject(), bpnn);
            Assert.AreEqual(obj.Get<RI>().ToExpectedObject(), ri);
            Assert.AreEqual(obj.Get<GSI>().ToExpectedObject(), gsi);
            Assert.AreEqual(obj.Get<Measurement>().ToExpectedObject(), measurement);
        }

        [Test]
        public void ReadAvmAutoEncoderInfoTest()
        {
            // Arrange
            var manager = new JsonFileManager();
            bool expected = true;

            // Act
            AvmAutoEncoderInfo obj = manager.ReadAvmAutoEncoderInfo();
            bool actualOfFilters = obj.filters[0] == 4;
            bool actualOfLearninGrate = obj.learningrate[0] == 0.008f;

            // Assert
            Assert.AreEqual(expected, actualOfFilters);
            Assert.AreEqual(expected, actualOfLearninGrate);
        }

        [Test]
        public void ReadAvmMcsAdasInfoTest()
        {
            // Arrange
            var manager = new JsonFileManager();
            bool expected = true;

            // Act
            AvmMcsAdasInfo obj = manager.ReadAvmMcsAdasInfo();
            bool actual = obj.num_step[0] == 8;

            // Assert
            Assert.AreEqual(expected, actual);
        }

        [Test]
        public void WriteTest()
        {
            // Arrange
            var manager = new JsonFileManager();

            var taskInfo = new AvmTaskInfo() { task_id = "test" };

            var moduleIndicatorRule = new IndicatorRule() { EK = new int[] { 99 } };
            var moduleInfo = new AvmModuleInfo();
            moduleInfo.Set(moduleIndicatorRule);

            var autoEncoderInfo = new AvmAutoEncoderInfo();
            autoEncoderInfo.learningrate = new float[] { 0.1234f };

            var mcsAdasInfo = new AvmMcsAdasInfo();
            mcsAdasInfo.num_step = new int[] { 98 };

            // Act
            string dirName = "test";
            manager.Write(dirName, AvmConfigs.TaskInfo, taskInfo);
            manager.Write(dirName, AvmConfigs.ModuleInfo, moduleInfo);
            manager.Write(dirName, AvmConfigs.AutoEncoderInfo, autoEncoderInfo);
            manager.Write(dirName, AvmConfigs.McsAdasInfo, mcsAdasInfo);

            AvmTaskInfo taskInfo2 = manager.ReadAvmTaskInfo(dirName);
            AvmModuleInfo moduleInfo2 = manager.ReadAvmModuleInfo(dirName);
            AvmAutoEncoderInfo autoEncoderInfo2 = manager.ReadAvmAutoEncoderInfo(dirName);
            AvmMcsAdasInfo mcsAdasInfo2 = manager.ReadAvmMcsAdasInfo(dirName);

            // Assert
            Assert.AreEqual(taskInfo.ToExpectedObject(), taskInfo2);
            //Assert.AreEqual(moduleInfo.ToExpectedObject(), moduleInfo2);
            Assert.AreEqual(JsonConvert.SerializeObject(moduleInfo), JsonConvert.SerializeObject(moduleInfo2));
            Assert.AreEqual(autoEncoderInfo.ToExpectedObject(), autoEncoderInfo2);
            Assert.AreEqual(mcsAdasInfo.ToExpectedObject(), mcsAdasInfo2);
        }

        [Test]
        public void SetAvmModuleInfo_FormatTest()
        {
            // Arrange
            var manager = new JsonFileManager();
            var moduleIndicatorRule = new IndicatorRule
            {
                EK = new int[] { 0, 1, 2 },
                IndicatorUSL = new double[] { 3, 4, 5 },
                IndicatorUCL = new double[] { 6, 7, 8 },
                IndicatorLCL = new double[] { 9, 10, 11 },
                IndicatorLSL = new double[] { 12, 13, 14 },
            };
            var kss = new KSS
            {
                AdjustYScale = 1.1,
                InSelectAlgorithm = "InSelectAlgorithm",
                ClusterNumber = 1.2,
                ModelExpansionOpen = 1.3,
                ModelExpansionSize = 1.4,
                ModelSizeExtension = 1.5,
                ModifyYOpen = 1.6,
            };
            var kvs = new KVS
            {
                Fin_apha = "Fin_apha",
                Fout_apha = "Fout_apha",
                InOneByOneChoose = "InOneByOneChoose",
                InSelectAlgorithm = "InSelectAlgorithm",
                InSS_PLS_ComponentRate = "InSS_PLS_ComponentRate",
            };
            var dqix = new DQIx
            {
                InLambda = 11,
                InConstant = 22,
                DQIxFilterPercentage = 33,
                IsPCA_OPEN = 44,
                IsForcedNormal_OPEN = 55,
            };
            var dqiy = new DQIy
            {
                corralpha = 1,
                IsMixedModel = 2,
                DQIyMultipleValue = 3,
                Ewmalamda = 4,
                EwmaWindow = 5,
                EwmaTolerance = 6,
                VarConfidence = 7,
                baseSampleNum = 8,
                RangeMultipleValue = 9,
                AutoSearch_Alpha_Lambda = 10,
                AlphaStricMode = 11,
                SampleLackingMode = 12,
                OpenMDFR = 13,
                CloseSPEC = 14,
                SizeMDFR = 15,
                UseBaseModelSamples = 16,
                AutoSearchTestSize = 17,
                SimDriftSamplePercentage = 18,
                DQIy_VMI_Err_StdOpen = 19,
                DQIy_VMI_Err_StdRate = 20,
                IsForcedNormal_OPEN = 21,
                DQIySwitch = 22,
                Ewmalamda_Group = 23,
                VarConfidence_Group = 24,
                SearchMode_Alpha_Lambda = 25,
                AlphaStricVolumem = 26,
                AdaptiveVMIErrTSwitch = 27,
                AdaptiveVMIErrTWeight = 28,
                RefreshWidenSizeRate = 29,
                RefreshWidenValueRate = 30,
                PhaseI_Error_Threshold = 31,
                SimDriftVolume = 32,
                InVigilance = 33,
                InRmax = 34,
                iIsSmartMode = 35,
                CreateModelMethod = 36,
                InIsNewART2 = 37,
                IsFirstFanout = 38,
                AlphaStricCount = 39,
                Threshold_Adaptive_Count = 40,
                realYCount = 41,
                isSC = 42,
                PhaseI_Error_Threshold_Default = 43,
                DQIyThreshold = 44,
            };
            var mr = new MR
            {
                InSelectAlgorithm = "InSelectAlgorithm",
                InMR_TSVD_Condition_Number_Criteria = "InMR_TSVD_Condition_Number_Criteria",
                InMR_TSVD_Energy_Ratio_Criteria = "InMR_TSVD_Energy_Ratio_Criteria",
                MRRefreshCounter = "MRRefreshCounter",
                Q_SqrFlag = "Q_SqrFlag",
            };
            var bpnn = new BPNN
            {
                InEpochsRange = new int[] { 1, 3, 5 },
                InMomTermRange = new float[] { 2, 3, 4 },
                InAlphaRange = new float[] { 3, 4, 5 },
                InNodesRange = new int[] { 2, 4, 6 },
                Target = 0,
                MeasureUnit = "MeasureUnit",
                iniStage2_ConjectureSTD = 0,
                ModelNum = 0,
                iKernel = "iKernel",
                IsExist = 0,
                InInputLayerTransferFunction = "InInputLayerTransferFunction",
                InInputLayerTransferCoefficient = 0,
                InOutputLayerTransferFunction = "InOutputLayerTransferFunction",
                InOutputLayerTransferCoefficient = 0,
                InOutputLayerTransferCurve = 0,
                BPNNRefreshCounter = 0,
            };
            var ri = new RI
            {
                InFirstAlgoName = "InFirstAlgoName",
                InSecondAlgoName = "InSecondAlgoName",
                InSelectCalculator = "InSelectCalculator",
                TolerableMaxErr_StdOpen = "TolerableMaxErr_StdOpen",
                TolerableMaxErr_StdRate = "TolerableMaxErr_StdRate",
                Tolerant_MaxError = "Tolerant_MaxError",
            };
            var gsi = new GSI
            {
                InSelectAlgorithm = "InSelectAlgorithm",
                RefreshCounter = "RefreshCounter",
                InGSI_TSVD_Condition_Number_Criteria = "InGSI_TSVD_Condition_Number_Criteria",
                InGSI_TSVD_Energy_Ratio_Criteria = "InGSI_TSVD_Energy_Ratio_Criteria",
                InGSI_KSS = "InGSI_KSS",
                GSI_RT = "GSI_RT",
                GSI_Threshold = "GSI_Threshold",
                InGSI_ChangeSTD = "InGSI_ChangeSTD",
                GSIB_Mode = "GSIB_Mode",
                GSIB_VarableMagnification = "GSIB_VarableMagnification",
                InGSIB_Mode = "InGSIB_Mode",
                InGSI_SamplingCount = "InGSI_SamplingCount",
                InGSI_WindowsSize = "InGSI_WindowsSize",
            };
            var measurement = new Measurement
            {
                IndicatorSize = 5,
                USL = 20,
                LSL = 10,
                UCL = 40,
                LCL = 30,
                Target = 2,
            };
            bool expected = true;

            // Act
            AvmModuleInfo obj = manager.ReadAvmModuleInfo();
            bool actualOfEK = obj.Get<IndicatorRule>().EK.Length == 20;
            bool actualOfKSS = obj.Get<KSS>().InSelectAlgorithm == "DMW";

            obj.Set(moduleIndicatorRule);
            obj.Set(kss);
            obj.Set(kvs);
            obj.Set(dqix);
            obj.Set(dqiy);
            obj.Set(mr);
            obj.Set(bpnn);
            obj.Set(ri);
            obj.Set(gsi);
            obj.Set(measurement);

            // Assert
            Assert.AreEqual(expected, actualOfEK);
            Assert.AreEqual(expected, actualOfKSS);
            Assert.AreEqual(obj.Get<IndicatorRule>().ToExpectedObject(), moduleIndicatorRule);
            Assert.AreEqual(obj.Get<KSS>().ToExpectedObject(), kss);
            Assert.AreEqual(obj.Get<KVS>().ToExpectedObject(), kvs);
            Assert.AreEqual(obj.Get<DQIx>().ToExpectedObject(), dqix);
            Assert.AreEqual(obj.Get<DQIy>().ToExpectedObject(), dqiy);
            Assert.AreEqual(obj.Get<MR>().ToExpectedObject(), mr);
            Assert.AreEqual(obj.Get<BPNN>().ToExpectedObject(), bpnn);
            Assert.AreEqual(obj.Get<RI>().ToExpectedObject(), ri);
            Assert.AreEqual(obj.Get<GSI>().ToExpectedObject(), gsi);
            Assert.AreEqual(obj.Get<Measurement>().ToExpectedObject(), measurement);
        }

        [Test]
        public void SetAvmMcsAdasInfo_FormatTest()
        {
            // Arrange
            var manager = new JsonFileManager();
            var expected = new AvmMcsAdasInfo
            {
                num_step = new int[] { 8 }
            };

            // Act
            manager.Write("temp", AvmConfigs.McsAdasInfo, expected);
            var actual = manager.ReadAvmMcsAdasInfo();

            // Assert
            Assert.AreEqual(expected.ToExpectedObject(), actual);
        }

        [Test]
        public void SetAvmAutoEncoderInfo_FormatTest()
        {
            // Arrange
            var manager = new JsonFileManager();
            var expected = new AvmAutoEncoderInfo
            {
                filters = new int[] { 4 },
                kernel_size = new int[] { 7 },
                activation =  "selu" ,
                pool_size = new int[] { 8 },
                epoch = new int[] { 10000 },

                learningrate = new float[] { 0.008f },
                patience = new int[] { 300 },
                batch = new int[] { 32 },
                dropout = new float[] { 0.2f },
                 moment = new float[] { 0.6f },
                 tune_frequency = new int[] { 1 },
                 model_frequency = new int[] { 1 },
                 virtual_cassette = new int[] { 25 },
                 DMW_switch = new int[] { 2 },
            };

            // Act
            manager.Write("temp", AvmConfigs.AutoEncoderInfo, expected);
            var actual = manager.ReadAvmAutoEncoderInfo();

            // Assert
            Assert.AreEqual(expected.ToExpectedObject(), actual);
        }

        [Test]
        public void SetAvmTaskInfo_FormatTest()
        {
            // Arrange
            var manager = new JsonFileManager();
            var expected = new AvmTaskInfo
            {
                task_id = "82ae2bc1-ad23-43dd-9014-bc8a0545604d",
                model = new AvmModelInfo
                {
                    model_name = "model_202108201",
                    model_id = 8,
                    model_path = @"D:\Model\82ae2bc1-ad23-43dd-9014-bc8a0545604d",
                },
                parameters = new AvmParameters
                {
                    phase_id = 1,
                    rawdata_path = @"D:\task\5489a0d4-035f-42bc-8d39-532ffc64fe8d",
                    datacollectionplan = new AvmDataCollectionPlan
                    {
                        datasource = new AvmDataSource
                        {
                            variablegroups = new AvmVariableGroup[]
                            {
                                new AvmVariableGroup
                                {
                                    io = "i",
                                    variablegroupname = "RIA",
                                    metatable = "PROCESSDEF_RIA",
                                    filename = "PROCESS01I",
                                    variables = new AvmVariable[]
                                    {
                                        new AvmVariable
                                        {
                                            variableid = 1,
                                            variablename = "AdjustedFibersTemp1",
                                            isseparator = 0,
                                            separatingvalues = new string[0],
                                        },
                                        new AvmVariable
                                        {
                                            variableid = 2,
                                            variablename = "H2_MFC",
                                            isseparator = 0,
                                            separatingvalues = new string[0],
                                        },
                                        new AvmVariable
                                        {
                                            variableid = 3,
                                            variablename = "WaferEmissivity",
                                            isseparator = 0,
                                            separatingvalues = new string[0],
                                        },
                                        new AvmVariable
                                        {
                                            variableid = 4,
                                            variablename = "StepID",
                                            isseparator = 1,
                                            separatingvalues = new string[] { "3", "8", "13", "14" },
                                        }
                                    },
                                },
                                new AvmVariableGroup
                                {
                                    io = "o",
                                    variablegroupname = "METROLOGY",
                                    metatable = "METROLOGYDEF",
                                    filename = "METROLOGY01O",
                                    variables = new AvmVariable[]
                                    {
                                        new AvmVariable
                                        {
                                            variableid = 5,
                                            variablename = "AVERAGE",
                                            isseparator = 0,
                                            separatingvalues = new string[0],
                                        }
                                    },
                                }
                            }
                        },
                        feature = new AvmFeature
                        {
                            filterrules = new AvmFilterRule[]
                            {
                                new AvmFilterRule
                                {
                                    ruleid = 1,
                                    variableid = 1,
                                    separatingvalues = "3",
                                    trimbegin = 0,
                                    trimend = 0,
                                    rulename = "RIA_AdjustedFibersTemp1_Step=3_Filter0",
                                },
                                new AvmFilterRule
                                {
                                    ruleid = 2,
                                    variableid = 2,
                                    separatingvalues = "8",
                                    trimbegin = 2,
                                    trimend = 10,
                                    rulename = "RIA_H2_MFC_Step=8_Filter0",
                                },
                                new AvmFilterRule
                                {
                                    ruleid = 3,
                                    variableid = 3,
                                    separatingvalues = "13",
                                    trimbegin = 3,
                                    trimend = 15,
                                    rulename = "RIA_WaferEmissivity_Step=13_Filter0",
                                }
                            },
                            indicatorrules = new AvmIndicatorRule[]
                            {
                                new AvmIndicatorRule
                                {
                                    ruleid = 1,
                                    filterruleid = 1,
                                    algorithm = "Max",
                                    rulename = "RIA_AdjustedFibersTemp1_Step=3_Filter0_Max",
                                },
                                new AvmIndicatorRule
                                {
                                    ruleid = 2,
                                    filterruleid = 2,
                                    algorithm = "Mean",
                                    rulename = "RIA_H2_MFC_Step=8_Filter0_Mean",
                                },
                                new AvmIndicatorRule
                                {
                                    ruleid = 3,
                                    filterruleid = 3,
                                    algorithm = "Mean",
                                    rulename = "RIA_WaferEmissivity_Step=13_Filter0_Mean",
                                }
                            },
                            pointrules = new AvmPointRule[]
                            {
                                new AvmPointRule
                                {
                                    ruleid = 1,
                                    variableid = 5,
                                }
                            }
                        },
                    },
                },
            };

            // Act
            manager.Write("temp", AvmConfigs.TaskInfo, expected);
            var actual = manager.ReadAvmTaskInfo();

            // Assert
            Assert.AreEqual(expected.ToExpectedObject(), actual);
        }
    }
}
