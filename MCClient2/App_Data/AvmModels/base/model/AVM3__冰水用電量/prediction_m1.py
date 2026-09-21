#%% 載入模組
import torch
import numpy as np
import pandas as pd
import joblib
import os
import json
from modules.shared import *
import warnings

set_seed(42)
warnings.filterwarnings('ignore') 
os.makedirs('weights', exist_ok=True)
os.makedirs('prediction', exist_ok=True)

#%% 讀取所有模型超參數
with open('hyper_parameters/model_config.json', 'r') as f:
    config = json.load(f)

split = config['split']                                   # 建立母模/重新訓練之驗證集占比
fine_tune_split = config['fine_tune_split']               # 微調之驗證集占比
model_set_proportion = config['model_set_proportion']     # 微調時取用建模資料占比
fine_tune_lr_m1 = config['fine_tune_lr_m1']               # 微調時transformer的學習率
fine_tune_lr_m2 = config['fine_tune_lr_m2']               # 微調時lstm的學習率
fine_tune_lr_gsi = config['fine_tune_lr_gsi']             # 微調時gsi的學習率
fine_tune_len = config['fine_tune_len']                   # 微調資料長度
seq_len = config['seq_len']                               # 歷史資料長度
forecasting_len = config['forecasting_len']               # 預測長度
n_trials = config['n_trials']                             # 超參數搜尋次數
patience = config['patience']                             # 早停機制的耐心參數
scheduler_patience = config['scheduler_patience']         # 退火排程的耐心參數
num_epoches_search = config['num_epoches_search']         # 超參數尋優時的epoch數
num_epoches = config['num_epoches']                       # 完整訓練時的epoch數
param_grid = config['param_grid']                         # 預測模型超參數搜尋設定
gsi_param_grid = config['gsi_param_grid']                 # gsi模型超參數搜尋設定

#%% 讀取X, Y變數名稱
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
with open('feature_name/numerical_cols.txt', 'r', encoding='utf-8') as f:
    numerical_cols = f.read().strip().split(',')
with open('feature_name/target_col.txt', 'r', encoding='utf-8') as f:
    target_col = f.read().strip().split(',')
    
#%% 預處理資料
file_path = 'InputData/prediction_data_m1.csv'
data = pd.read_csv(file_path, encoding='utf-8')
raw_feature = list(numerical_cols) + list(target_col)
data = data[['Date'] + raw_feature]
data, _, time_features = basic_feature_engineering(
    data = data,
    datetime_col = 'Date',
    numerical_cols = numerical_cols,
    target_col = target_col[0]
)

feature_columns = np.load("weights/feature_columns.npy")
scaler = joblib.load('weights/scaler_m1.pkl')
yScaler = joblib.load('weights/yScaler_m1.pkl')

'''feature scaling'''
features = data[feature_columns].values
features_scaled = scaler.transform(features)

'''label scaling'''
label = data[target_col].values.reshape(-1, 1)
label_scaled = yScaler.transform(label)
       
x = features_scaled[:seq_len]
xf = features_scaled[seq_len:seq_len+forecasting_len, -len(time_features):]
y = label_scaled[seq_len:seq_len+forecasting_len]
x = torch.tensor(x, dtype=torch.float32).to(device)
xf = torch.tensor(xf, dtype=torch.float32).to(device)
y = torch.tensor(y, dtype=torch.float32).to(device)

#%% phase I
model_list = ['Transformer']
model_alias = {'Transformer': 'm1', 'LSTM': 'm2'}

for model_name in model_list:


    alias = model_alias[model_name]

    # 直接產生假預測資料 (長度 = forecasting_len)
    y_pred_original = np.zeros((forecasting_len, 1))

    # 輸出結果
    output_csv_path = f'prediction/pred_{alias}.csv'
    pd.DataFrame(y_pred_original, columns=['prediction']).to_csv(output_csv_path, index=False)

    print(f"Test output generated: {output_csv_path}")