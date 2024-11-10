use hex::FromHex;
use sm4_gcm::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub async fn rust_encrypt_sm4_gcm(
    plaintext_hex: String,
    key_hex: String,
    nonce_hex: String,
) -> Result<JsValue, JsValue> {
    // 十六进制字符串转换为字节数组
    let plaintext = <Vec<u8>>::from_hex(&plaintext_hex)
        .map_err(|_| JsValue::from_str("Invalid plaintext hex"))?;
    let key = <Vec<u8>>::from_hex(&key_hex).map_err(|_| JsValue::from_str("Invalid key hex"))?;
    let nonce =
        <Vec<u8>>::from_hex(&nonce_hex).map_err(|_| JsValue::from_str("Invalid nonce hex"))?;

    // 检查密钥和nonce的长度
    if key.len() != 16 {
        return Err(JsValue::from_str("Key must be 16 bytes long"));
    }
    if nonce.len() != 12 {
        return Err(JsValue::from_str("Nonce must be 12 bytes long"));
    }

    // 创建Sm4Key实例
    let sm4_key =
        Sm4Key::from_slice(&key).map_err(|_| JsValue::from_str("Key must be 16 bytes long"))?;

    // 调用sm4_gcm_encrypt函数
    let ciphertext = sm4_gcm_encrypt(&sm4_key, &nonce, &plaintext);

    // 将密文转换为十六进制字符串
    let ciphertext_hex = hex::encode(ciphertext);
    Ok(JsValue::from_str(&ciphertext_hex))
}
