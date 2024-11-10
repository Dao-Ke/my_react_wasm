use hex::FromHex;
use rand::Rng;
use sm4_gcm::*;

fn generate_nonce() -> [u8; 12] {
    let mut rng = rand::thread_rng();
    let mut nonce = [0u8; 12];
    rng.fill(&mut nonce);
    nonce
}

fn generate_key() -> [u8; 16] {
    let mut rng = rand::thread_rng();
    let mut key = [0u8; 16];
    rng.fill(&mut key);
    key
}

fn nonce_to_hex(nonce: [u8; 12]) -> String {
    hex::encode(nonce)
}

fn main() {
    let nonce = generate_nonce();
    let nonce_hex = nonce_to_hex(nonce);
    println!("Generated Nonce (hex): {}", nonce_hex);
    let key = generate_key();
    println!("Generated Key (hex): {}", hex::encode(key));
}
