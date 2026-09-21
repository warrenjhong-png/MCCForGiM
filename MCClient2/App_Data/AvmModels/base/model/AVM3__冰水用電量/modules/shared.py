#%% 載入模組
import numpy as np
import pandas as pd
import random
import torch
from torch import nn
import torch.nn.functional as F
from itertools import combinations

#%% 工具函數
def set_seed(seed: int = 42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)  # for multi-GPU
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

def basic_feature_engineering(
    data,
    datetime_col,
    numerical_cols,
    target_col,
    drop_na=True
):
    data = data.copy()

    # 時間欄位轉換
    data[datetime_col] = pd.to_datetime(data[datetime_col])
    data['day_of_week'] = data[datetime_col].dt.dayofweek
    data['hour'] = data[datetime_col].dt.hour

    eps = 1e-5

    # 差分與 log 特徵
    for col in numerical_cols:
        data[f'{col}_diff'] = data[col].diff()
        data[f'log_{col}'] = np.log1p(data[col])

    # 差分統計
    diff_cols = [f'{col}_diff' for col in numerical_cols]
    data['diff_sum'] = data[diff_cols].sum(axis=1)
    data['diff_mean'] = data[diff_cols].mean(axis=1)
    data['diff_std'] = data[diff_cols].std(axis=1)

    # 數值間組合特徵（兩兩交互）
    comb_features = []
    for col1, col2 in combinations(numerical_cols, 2):
        data[f'{col1}_x_{col2}'] = data[col1] * data[col2]
        data[f'{col1}_div_{col2}'] = data[col1] / (data[col2] + eps)
        data[f'{col2}_div_{col1}'] = data[col2] / (data[col1] + eps)
        data[f'{col1}_minus_{col2}'] = data[col1] - data[col2]
        data[f'{col2}_minus_{col1}'] = data[col2] - data[col1]
        comb_features += [
            f'{col1}_x_{col2}',
            f'{col1}_div_{col2}',
            f'{col2}_div_{col1}',
            f'{col1}_minus_{col2}',
            f'{col2}_minus_{col1}'
        ]

    # 處理 target 特徵
    usage_features = []
    usage_interactions = []
    if target_col in data.columns:
        data['target_diff'] = data[target_col].diff()
        data['log_target'] = np.log1p(data[target_col])
        data['sqrt_target'] = np.sqrt(np.abs(data[target_col]) + eps)
        data['inv_target'] = 1 / (data[target_col] + eps)
        data['inv_sq_target'] = 1 / (np.square(data[target_col] + eps))
        data['exp_neg_target'] = np.exp(-data[target_col])
        data['sigmoid_target'] = 1 / (1 + np.exp(-data[target_col]))
        data['tanh_target'] = np.tanh(data[target_col])

        usage_features += [
            'target_diff', 'log_target', 'sqrt_target', 'inv_target',
            'inv_sq_target', 'exp_neg_target', 'sigmoid_target', 'tanh_target'
        ]

        for col in numerical_cols:
            data[f'target_diff_x_{col}'] = data['target_diff'] * data[col]
            data[f'log_target_x_{col}'] = data['log_target'] * data[col]
            data[f'target_diff_div_{col}'] = data['target_diff'] / (data[col] + eps)
            data[f'{col}_div_target_diff'] = data[col] / (data['target_diff'] + eps)
            usage_interactions += [
                f'target_diff_x_{col}',
                f'log_target_x_{col}',
                f'target_diff_div_{col}',
                f'{col}_div_target_diff'
            ]

    # 整理所有特徵名稱
    diff_features = diff_cols + ['diff_sum', 'diff_mean', 'diff_std']
    log_features = [f'log_{col}' for col in numerical_cols]
    time_features = ['day_of_week', 'hour']

    all_features = (
        numerical_cols + diff_features + log_features +
        comb_features + usage_features + usage_interactions + time_features
    )

    # 去除 NA
    if drop_na:
        data = data[1:]
        
    #去除極值特徵
    tooBig_feat = [col for col in all_features if data[col].abs().max(0)>1e5]
    data.drop(columns = tooBig_feat, inplace = True)
    all_features = [f for f in all_features if f not in tooBig_feat]
    
    return data, all_features, time_features

def sliding_window(data, a, b, seq_len, forecasting_len, f):
    x, xf, y = [], [], []
    for i in range(len(data) - seq_len - forecasting_len):
        x.append(a[i:i+seq_len])
        xf.append(a[i+seq_len:i+seq_len+forecasting_len, -f:])
        y.append(b[i+seq_len:i+seq_len+forecasting_len])
    if len(data) - seq_len - forecasting_len == 0:
        x.append(a[:seq_len])
        xf.append(a[seq_len:seq_len+forecasting_len, -f:])
        y.append(b[seq_len:seq_len+forecasting_len])
    return np.asarray(x), np.asarray(xf), np.asarray(y)
    
def robust_error_metrics(y_pred, y_true):
    smape = np.mean(
        2.0 * np.abs(y_pred - y_true) /
        (np.abs(y_pred) + np.abs(y_true))
    ) * 100
    mdape = np.median(np.abs((y_pred - y_true) / y_true)) * 100
    mae = np.mean(np.abs(y_pred - y_true))
    return smape, mdape, mae

#%% 預測模型定義
class TimesBlock(nn.Module):
    def __init__(self, in_channels):
        super().__init__()
        self.conv1 = nn.Conv1d(in_channels, in_channels, kernel_size=3, padding=1)
        self.conv2 = nn.Conv1d(in_channels, in_channels, kernel_size=5, padding=2)
        self.conv3 = nn.Conv1d(in_channels, in_channels, kernel_size=7, padding=3)
        self.projection = nn.Conv1d(in_channels * 3, in_channels, kernel_size=1)

    def forward(self, x):
        x1 = self.conv1(x)
        x2 = self.conv2(x)
        x3 = self.conv3(x)
        out = torch.cat([x1, x2, x3], dim=1)
        out = self.projection(out)
        return out + x  

class Transformer(nn.Module):
    def __init__(self, input_size_p, input_size_f, hidden_size, output_size, num_layers=1, num_heads=1):
        super().__init__()
        self.hidden_size = hidden_size

        # Embedding
        self.embedding_p = nn.Linear(input_size_p, hidden_size)
        self.embedding_f = nn.Linear(input_size_f, hidden_size)

        # TimesBlock
        self.blocks_p = nn.ModuleList([TimesBlock(hidden_size) for _ in range(num_layers)])
        self.blocks_f = nn.ModuleList([TimesBlock(hidden_size) for _ in range(num_layers)])

        # Attention
        self.attn_p = nn.MultiheadAttention(embed_dim=hidden_size, num_heads=num_heads, batch_first=True)
        self.attn_f = nn.MultiheadAttention(embed_dim=hidden_size, num_heads=num_heads, batch_first=True)

        # Layer Norm
        self.norm_p = nn.LayerNorm(hidden_size)
        self.norm_f = nn.LayerNorm(hidden_size)

        # regressor
        self.fc1 = nn.Linear(hidden_size * 2, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size // 2)
        self.fc3 = nn.Linear(hidden_size // 2, output_size)

    def generate_causal_mask(self, seq_len, device):
        mask = torch.triu(torch.ones(seq_len, seq_len, device=device), diagonal=1)
        mask = mask.masked_fill(mask == 1, float('-inf'))
        return mask

    def forward(self, x, xf, return_attn=False):

        x = self.embedding_p(x)
        xf = self.embedding_f(xf)

        x = x.permute(0, 2, 1)
        xf = xf.permute(0, 2, 1)

        for block in self.blocks_p:
            x = block(x)
        for block in self.blocks_f:
            xf = block(xf)

        x = x.permute(0, 2, 1)
        xf = xf.permute(0, 2, 1)

        # Attention masks
        mask_p = self.generate_causal_mask(x.size(1), x.device)
        mask_f = self.generate_causal_mask(xf.size(1), xf.device)

        # Multi-head attention
        attn_out_p, attn_weights_p = self.attn_p(x, x, x, attn_mask=mask_p, need_weights=True, average_attn_weights=False)
        attn_out_f, attn_weights_f = self.attn_f(xf, xf, xf, attn_mask=mask_f, need_weights=True, average_attn_weights=False)
        attn_out_p = self.norm_p(attn_out_p + x)
        attn_out_f = self.norm_f(attn_out_f + xf)

        # Pooling (max pooling over time)
        pooled_p = attn_out_p[:, -1, :]
        pooled_f = attn_out_f[:, -1, :]
        pooled = torch.cat((pooled_p, pooled_f), dim=1)

        # Prediction head
        out = F.gelu(self.fc1(pooled))
        out = F.gelu(self.fc2(out))
        out = self.fc3(out)

        if return_attn:
            return out, attn_weights_p, attn_weights_f, attn_out_p, attn_out_f
        else:
            return out

class LSTM(nn.Module):
    def __init__(self, input_size_p, input_size_f, hidden_size, output_size, num_layers=3, num_heads=1):
        super(LSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_heads = num_heads

        self.lstm_p = nn.LSTM(input_size_p, hidden_size, num_layers, batch_first=True)
        self.lstm_f = nn.LSTM(input_size_f, hidden_size, num_layers, batch_first=True)

        self.attn_p = nn.MultiheadAttention(embed_dim=hidden_size, num_heads=num_heads, batch_first=True)
        self.attn_f = nn.MultiheadAttention(embed_dim=hidden_size, num_heads=num_heads, batch_first=True)

        self.norm_p = nn.LayerNorm(hidden_size)
        self.norm_f = nn.LayerNorm(hidden_size)

        self.fc1 = nn.Linear(hidden_size * 2, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size // 2)
        self.fc3 = nn.Linear(hidden_size // 2, output_size)

    def generate_causal_mask(self, seq_len, device):
        mask = torch.triu(torch.ones(seq_len, seq_len, device=device), diagonal=1)
        mask = mask.masked_fill(mask == 1, float('-inf'))
        return mask

    def forward(self, x, xf, return_attn=False):
        batch_size, seq_len_p, _ = x.shape
        _, seq_len_f, _ = xf.shape

        # LSTM encoding
        output_p, _ = self.lstm_p(x)
        output_f, _ = self.lstm_f(xf)

        # Generate causal masks
        attn_mask_p = self.generate_causal_mask(seq_len_p, x.device)
        attn_mask_f = self.generate_causal_mask(seq_len_f, xf.device)

        # Attention with weights
        attn_out_p, attn_weights_p = self.attn_p(
            output_p, output_p, output_p,
            attn_mask=attn_mask_p,
            need_weights=True,
            average_attn_weights=False
        )
        attn_out_p = self.norm_p(attn_out_p + output_p)

        attn_out_f, attn_weights_f = self.attn_f(
            output_f, output_f, output_f,
            attn_mask=attn_mask_f,
            need_weights=True,
            average_attn_weights=False
        )
        attn_out_f = self.norm_f(attn_out_f + output_f)

        # Take last timestep
        pooled_p = attn_out_p[:, -1, :]
        pooled_f = attn_out_f[:, -1, :]
        pooled = torch.cat((pooled_p, pooled_f), dim=1)

        out = F.gelu(self.fc1(pooled))
        out = F.gelu(self.fc2(out))
        out = self.fc3(out)

        if return_attn:
            return out, attn_weights_p, attn_weights_f, attn_out_p, attn_out_f
        else:
            return out

#%% gsi模型定義
def cyclical_annealing(epoch, cycle_length=10, beta=1.0): # cycle_length原本是30 2026/1/11
    cycle_position = epoch % cycle_length
    beta = beta * cycle_position / (cycle_length-1)
    return beta

def cyclical_annealing_gsi_fine_tune(epoch, cycle_length=30, beta=1.0):
    cycle_position = epoch % cycle_length
    beta = beta * cycle_position / (cycle_length-1)
    return beta

def sliding_window_gsi(data, a, seq_len, forecasting_len):
    x = []
    for i in range(len(data) - seq_len - forecasting_len):
        x.append(a[i:i+seq_len])
    return np.asarray(x)

class CausalAttention(nn.Module):
    def __init__(self, embed_dim, num_heads, key_dim=None):
        super(CausalAttention, self).__init__()
        self.mha = nn.MultiheadAttention(embed_dim=embed_dim, num_heads=num_heads, batch_first=True)
        
    def forward(self, query, key, value):
        seq_len = query.size(1)
        causal_mask = torch.triu(torch.full((seq_len, seq_len), float('-inf')), diagonal=1).to(query.device)
        output, _ = self.mha(query, key, value, attn_mask = causal_mask)
        return output

class VAEModel(nn.Module):
    def __init__(self, hidden_size, mha_heads, encoder_dropout, decoder_dropout,
                 timesteps, features, latent_dim, mha_key_dim=None): 
        super(VAEModel, self).__init__()
        self.timesteps = timesteps
        self.features = features
        self.latent_dim = latent_dim
        self.encoder_gru = nn.GRU(features, hidden_size, batch_first=True)
        self.encoder_dropout = nn.Dropout(encoder_dropout)
        self.z_fc = nn.Linear(hidden_size, hidden_size)
        self.attention = CausalAttention(embed_dim=hidden_size, num_heads=mha_heads, key_dim=mha_key_dim)
        self.norm = nn.LayerNorm(hidden_size)
        self.decoder_gru = nn.GRU(hidden_size + latent_dim, hidden_size, batch_first=True)
        self.decoder_dropout = nn.Dropout(decoder_dropout)
        self.decoder_out = nn.Linear(hidden_size, features)
        self.mean = nn.Linear(hidden_size, latent_dim)
        self.log_std = nn.Linear(hidden_size, latent_dim)
        
    def forward(self,x):
        enc_seq, enc_last = self.encoder_gru(x)
        enc_last = self.encoder_dropout(enc_last.squeeze(0))
        z_dist = self.z_fc(enc_last)
        mean = self.mean(z_dist)
        log_std = self.log_std(z_dist).clamp(-4, 15)
        std = torch.exp(log_std)
        z = mean + std * torch.randn_like(std)
        repeated_z = z.unsqueeze(1).repeat(1, self.timesteps, 1)
        attn_out = self.attention(enc_seq, enc_seq, enc_seq)
        attention_output = self.norm(attn_out + enc_seq)
        decoder_input = torch.cat([attention_output, repeated_z], dim=-1)
        decoder_output, _ = self.decoder_gru(decoder_input)
        decoder_output = self.decoder_dropout(decoder_output)
        out = self.decoder_out(decoder_output)
        return out, mean, std

    def loss_function(self, recon_x, x, mean, std, beta = 1.0):
        recon_loss = F.mse_loss(recon_x, x, reduction='mean')
        kl_loss = 0.5 * torch.mean(std**2 + mean.pow(2) - torch.log(std**2+ 1e-8) - 1)
        kl_loss = torch.clamp(kl_loss, min=0.1)
        return recon_loss +  beta * kl_loss
    