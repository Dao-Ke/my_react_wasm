import React, { useEffect, useState } from "react";
import "./App.css";
import * as wasm from "my_wasm";

function App() {
  const [ciphertext, setCiphertext] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeWasm = async () => {
      try {
        await wasm.default();

        const plaintext_hex = stringToHex("test for SM4-GCM using Rust Wasm");
        const key_hex = "35741467c0b5a39a6b2c04bfb023b8b2";
        const nonce_hex = "cf3bbe02a713058dc7636b9c";

        const result = await wasm.rust_encrypt_sm4_gcm(
          plaintext_hex,
          key_hex,
          nonce_hex
        );

        setCiphertext(result);
      } catch (err) {
        setError(`Error: ${err}`);
      }
    };

    initializeWasm();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <h1>WebAssembly with Rust and React</h1>
        {ciphertext && <p>Ciphertext: {ciphertext}</p>}
        {error && <p>Error: {error}</p>}
      </header>
    </div>
  );
}

function stringToHex(str: string): string {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const hexCharCode = charCode.toString(16).padStart(2, "0");
    hex += hexCharCode;
  }
  return hex;
}

export default App;
