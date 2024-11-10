import React, { useEffect, useState } from "react";
import "./App.css";
import * as wasm from "my_wasm";

function App() {
  const [key, setKey] = useState<string>("35741467c0b5a39a6b2c04bfb023b8b2");
  const [nonce, setNonce] = useState<string>("cf3bbe02a713058dc7636b9c");
  const [plaintext, setPlaintext] = useState<string>(
    "test for SM4-GCM using Rust Wasm"
  );
  const [ciphertext, setCiphertext] = useState<string | null>(null);
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // 初始化 wasm 模块
    initializeWasm();
  }, []);

  const initializeWasm = async () => {
    try {
      await wasm.default();
      console.log("WebAssembly initialized");
      setIsWasmLoaded(true);
    } catch (error) {
      console.error("WebAssembly initialization failed:", error);
      setErrorMessage(
        `WebAssembly initialization failed: ${(error as Error)?.message}`
      );
    }
  };

  const checkWasmLoaded = () => {
    if (!isWasmLoaded) {
      alert("WebAssembly is not loaded yet. Please wait.");
      return false;
    }
    return true;
  };

  const generateKeyAndNonce = async () => {
    if (!checkWasmLoaded()) return;
    try {
      const generatedKey = await wasm.generate_key();
      const generatedNonce = await wasm.generate_nonce();
      setKey(generatedKey);
      setNonce(generatedNonce);
    } catch (error) {
      setErrorMessage(
        `Key and Nonce generation failed: ${(error as Error)?.message}`
      );
    }
  };

  const encryptText = async () => {
    if (!checkWasmLoaded()) return;
    if (!plaintext || !key || !nonce) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const encryptedData = await wasm.rust_encrypt_sm4_gcm(
        stringToHex(plaintext),
        key,
        nonce
      );
      setCiphertext(encryptedData);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(`Encryption failed: ${(error as Error)?.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          SM4 GCM Encryption
        </h1>
        <button
          onClick={generateKeyAndNonce}
          disabled={!isWasmLoaded}
          className={`w-full py-2 px-4 rounded-lg mb-4 ${
            isWasmLoaded
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Generate Key and Nonce
        </button>
        <p className="mb-2">Key: {key}</p>
        <p className="mb-4">Nonce: {nonce}</p>
        <label htmlFor="plaintext" className="block mb-2">
          Plaintext:
        </label>
        <input
          id="plaintext"
          type="text"
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <button
          onClick={encryptText}
          disabled={!isWasmLoaded || !key || !nonce || !plaintext}
          className={`w-full py-2 px-4 rounded-lg mb-4 ${
            !isWasmLoaded || !key || !nonce || !plaintext
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green-500 text-white"
          }`}
        >
          Encrypt
        </button>
        <p className="mb-4">
          Ciphertext:
          <div>
            <textarea
              readOnly
              value={ciphertext ?? "Not encrypted"}
              className="ciphertext-textarea"
            />
          </div>
        </p>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
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
