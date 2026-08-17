using fst.Toolkit;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace MCClient2.Models
{
    public static class DBInfo
    {

        public static List<string> GetBuckets(DbAgent dbAgent)
        {
            var currentDb = dbAgent.Driver.ExecuteList<string>("SELECT DB_NAME()");
            string sql = "SELECT AVMNAME FROM SYSDEF WHERE ORDERNUMBER IS NOT NULL ORDER BY ORDERNUMBER"; // 取得建模資料順序
            return dbAgent.Driver.ExecuteList<string>(sql); 
        }
        public static Dictionary<string, string> GetCombinationKey(DbAgent dbAgent)
        { 
            string sql = "SELECT * FROM SYSDEF WHERE COMBINATIONKEY IS NOT NULL ORDER BY ORDERNUMBER"; // 取得建模資料順序
            //return dbAgent.Driver.ExecuteList<string>(sql);
            DataTable defTable = dbAgent.Driver.ExecuteDataTable(sql);
            var variableNames = new Dictionary<string, string>();
            foreach (DataRow dataRow in defTable.Rows)
            {
                string variableName = dataRow["AVMNAME"].ToString();
                string defField = dataRow["DEFFIELD"].ToString();
                //if (!defField.Contains("FIELD_"))
                //{
                //    continue;
                //}
                variableNames.Add(variableName, defField);
            }
            return variableNames;
        }

        internal static Dictionary<string, Dictionary<string, string>> GetStdbDefFields(DbAgent dbAgent)
        {
            Dictionary<string, Dictionary<string, string>> DefFields = new Dictionary<string, Dictionary<string, string>>();//存放X資料庫定義欄位 { get; set; } 
            try
            {

                string sql = "SELECT TABLENAME FROM VARDEF";
                List<string> tableNames = dbAgent.Driver.ExecuteList<string>(sql);
                tableNames.Add("SYSDEF"); //ADD SYSDEF
                AppConstant.Logger.Info("Get TableNames : " + sql);
                foreach (var tableName in tableNames)
                {
                    sql = "SELECT * FROM " + tableName;
                    DataTable defTable = dbAgent.Driver.ExecuteDataTable(sql);
                    var variableNames = new Dictionary<string, string>();
                    foreach (DataRow dataRow in defTable.Rows)
                    {
                        
                        string variableName = string.Empty;
                        if (tableName == "SYSDEF")
                        {
                            variableName = dataRow["AVMNAME"].ToString();
                        }
                        else //PROCESSDEF/METROLOGYDEF
                        {
                            variableName = dataRow["VARIABLENAME"].ToString();
                        }
                        string defField = dataRow["DEFFIELD"].ToString();
                        if (!defField.Contains("FIELD_"))
                        {
                            continue;
                        }
                        variableNames.Add(variableName, defField);
                        //AppConstant.Logger.Info("VariableName : " + variableName);
                    }
                    DefFields.Add(tableName, variableNames);
                }
                return DefFields;
            }catch(Exception ex)
            {
                AppConstant.Logger.Error("Error:" + ex.Message);
                return DefFields;
            }
        }

        //拆片:取得是否拆片
        internal static string GetDataLinkField(DbAgent dbAgent, string defTableName) // Get GetDataLinkField from table
        {
            string sql = string.Empty;
            var fieldExists = IsDataLinkFieldExist(dbAgent);
            switch (fieldExists)
            {
                case 0:
                    sql = $"SELECT 'CONTEXTID' FROM VARDEF WHERE TABLENAME = {dbAgent.SqlMaker.ToConditionValue(defTableName)}; ";
                    break;
                case 1: //NULL寫CONTEXTID
                    sql = $"SELECT ISNULL(DATALINKFIELD,'CONTEXTID') FROM VARDEF WHERE TABLENAME = {dbAgent.SqlMaker.ToConditionValue(defTableName)};";
                    break;
                default:
                    break;
            }
            var result = dbAgent.Driver.ExecuteScalar(sql);
            return result.ToString();
        }
        private static int IsDataLinkFieldExist(DbAgent dbAgent)
        {
            string sql = $"SELECT CASE WHEN EXISTS(SELECT* FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'VARDEF' AND COLUMN_NAME = 'DATALINKFIELD') THEN 1 ELSE 0 END ";
            var output = int.TryParse(dbAgent.Driver.ExecuteScalar(sql).ToString(),out int result);
            if (output) return result; else return -1;
        }
    }
}