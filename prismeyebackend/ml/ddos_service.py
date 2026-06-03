from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'ddos_model.joblib')
PREP_PATH  = os.path.join(BASE_DIR, 'ddos_preprocessor.joblib')

print('Loading DDoS ML model...')
model        = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREP_PATH)

THRESHOLD = 0.035

RAW_FEATURES = [
    'ACK Flag Count', 'Active Max', 'Active Mean', 'Active Min', 'Active Std',
    'Avg Bwd Segment Size', 'Avg Fwd Segment Size', 'Avg Packet Size',
    'Bwd Avg Bulk Rate', 'Bwd Avg Bytes/Bulk', 'Bwd Avg Packets/Bulk',
    'Bwd Header Length', 'Bwd IAT Max', 'Bwd IAT Mean', 'Bwd IAT Min',
    'Bwd IAT Std', 'Bwd IAT Total', 'Bwd PSH Flags', 'Bwd Packet Length Max',
    'Bwd Packet Length Mean', 'Bwd Packet Length Min', 'Bwd Packet Length Std',
    'Bwd Packets Length Total', 'Bwd Packets/s', 'Bwd URG Flags',
    'CWE Flag Count', 'Down/Up Ratio', 'ECE Flag Count', 'FIN Flag Count',
    'Flow Bytes/s', 'Flow Duration', 'Flow IAT Max', 'Flow IAT Mean',
    'Flow IAT Min', 'Flow IAT Std', 'Flow Packets/s', 'Fwd Act Data Packets',
    'Fwd Avg Bulk Rate', 'Fwd Avg Bytes/Bulk', 'Fwd Avg Packets/Bulk',
    'Fwd Header Length', 'Fwd IAT Max', 'Fwd IAT Mean', 'Fwd IAT Min',
    'Fwd IAT Std', 'Fwd IAT Total', 'Fwd PSH Flags', 'Fwd Packet Length Max',
    'Fwd Packet Length Mean', 'Fwd Packet Length Min', 'Fwd Packet Length Std',
    'Fwd Packets Length Total', 'Fwd Packets/s', 'Fwd Seg Size Min',
    'Fwd URG Flags', 'Idle Max', 'Idle Mean', 'Idle Min', 'Idle Std',
    'Init Bwd Win Bytes', 'Init Fwd Win Bytes', 'PSH Flag Count',
    'Packet Length Max', 'Packet Length Mean', 'Packet Length Min',
    'Packet Length Std', 'Packet Length Variance', 'Protocol', 'RST Flag Count',
    'SYN Flag Count', 'Subflow Bwd Bytes', 'Subflow Bwd Packets',
    'Subflow Fwd Bytes', 'Subflow Fwd Packets', 'Total Backward Packets',
    'Total Fwd Packets', 'URG Flag Count'
]

print(f'Model loaded | Raw Features: {len(RAW_FEATURES)} | Threshold: {THRESHOLD}')

def safe(val):
    if val is None or (isinstance(val, float) and (np.isinf(val) or np.isnan(val))):
        return 0.0
    return float(val)


def engineer_features(r: dict) -> dict:
    total_fwd    = safe(r.get('Total Fwd Packets'))
    total_bwd    = safe(r.get('Total Backward Packets'))
    fwd_mean     = safe(r.get('Fwd Packet Length Mean'))
    bwd_mean     = safe(r.get('Bwd Packet Length Mean'))
    avg_pkt      = safe(r.get('Avg Packet Size'))
    fwd_min      = safe(r.get('Fwd Packet Length Min'))
    bwd_min      = safe(r.get('Bwd Packet Length Min'))
    flow_bytes   = safe(r.get('Flow Bytes/s'))
    flow_pkts    = safe(r.get('Flow Packets/s'))
    fwd_pkts_s   = safe(r.get('Fwd Packets/s'))
    bwd_pkts_s   = safe(r.get('Bwd Packets/s'))
    downup       = safe(r.get('Down/Up Ratio'))
    protocol     = safe(r.get('Protocol'))
    fwd_iat_std  = safe(r.get('Fwd IAT Std'))
    fwd_iat_mean = safe(r.get('Fwd IAT Mean'))
    flow_iat_std  = safe(r.get('Flow IAT Std'))
    flow_iat_mean = safe(r.get('Flow IAT Mean'))
    fwd_iat_total = safe(r.get('Fwd IAT Total'))
    bwd_iat_total = safe(r.get('Bwd IAT Total'))
    init_fwd     = safe(r.get('Init Fwd Win Bytes'))
    init_bwd     = safe(r.get('Init Bwd Win Bytes'))
    urg_count    = safe(r.get('URG Flag Count'))
    cwe_count    = safe(r.get('CWE Flag Count'))
    psh_count    = safe(r.get('PSH Flag Count'))
    fwd_bytes    = safe(r.get('Fwd Packets Length Total'))
    subflow_fwd  = safe(r.get('Subflow Fwd Packets'))

    return {
        'pkt_size_asymmetry':     (fwd_mean - bwd_mean) / (avg_pkt + 1e-9),
        'min_pkt_asymmetry':      (fwd_min - bwd_min) / (avg_pkt + 1e-9),
        'bytes_per_pkt_flow':     flow_bytes / (flow_pkts + 1e-9),
        'fwd_bwd_pkt_rate_ratio': fwd_pkts_s / (bwd_pkts_s + 1e-9),
        'total_pkt_rate':         flow_pkts,
        'downup_x_pktrate':       downup * flow_pkts,
        'downup_x_byterate':      downup * flow_bytes,
        'proto_x_byterate':       protocol * flow_bytes,
        'proto_x_fwd_pkt_mean':   protocol * fwd_mean,
        'iat_ratio':              fwd_iat_total / (bwd_iat_total + 1e-9),
        'iat_total':              fwd_iat_total + bwd_iat_total,
        'fwd_iat_cv':             fwd_iat_std / (fwd_iat_mean + 1e-9),
        'flow_iat_cv':            flow_iat_std / (flow_iat_mean + 1e-9),
        'init_win_ratio':         init_fwd / (init_bwd + 1e-9),
        'init_win_total':         init_fwd + init_bwd,
        'init_win_zero':          1.0 if (init_fwd == 0 or init_bwd == 0) else 0.0,
        'urg_cwe_combined':       urg_count + cwe_count,
        'psh_x_fwd_size':         psh_count * fwd_bytes,
        'subflow_fwd_ratio':      subflow_fwd / (total_fwd + 1e-9),
    }


def build_feature_vector(raw: dict) -> pd.DataFrame:
    # step 1 — raw features as DataFrame for preprocessor
    row = {feat: safe(raw.get(feat)) for feat in RAW_FEATURES}
    df_raw = pd.DataFrame([row])

    # step 2 — scale the 77 raw features
    scaled = preprocessor.transform(df_raw)
    df_scaled = pd.DataFrame(scaled, columns=RAW_FEATURES)

    # step 3 — compute 19 engineered features from original raw values
    eng = engineer_features(raw)

    # step 4 — append engineered features
    for col, val in eng.items():
        df_scaled[col] = val

    return df_scaled


@app.route('/health', methods=['GET'])
def health():
    return jsonify({ 'status': 'ok', 'model': 'ddos_xgboost', 'threshold': THRESHOLD })


@app.route('/predict', methods=['POST'])
def predict():
    try:
        raw      = request.get_json(force=True) or {}
        X        = build_feature_vector(raw)
        prob     = float(model.predict_proba(X)[0][1])
        is_ddos  = prob >= THRESHOLD

        if prob >= 0.08:   severity = 'high'
        elif prob >= 0.05: severity = 'medium'
        else:             severity = 'low'

        return jsonify({
            'is_ddos':     is_ddos,
            'probability': round(prob, 4),
            'severity':    severity if is_ddos else 'low',
            'threshold':   THRESHOLD,
        })
    except Exception as e:
        return jsonify({ 'error': str(e) }), 500


if __name__ == '__main__':
    print('\n' + '='*50)
    print('PRISMEYE — DDoS ML Detection Service')
    print(f'Port: 5001 | Features: 77 raw + 19 engineered | Threshold: {THRESHOLD}')
    print('='*50 + '\n')
    app.run(host='0.0.0.0', port=5001, debug=False)