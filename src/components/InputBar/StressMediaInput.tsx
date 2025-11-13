export function useStressMedia({ onSend }: { onSend: (data: any) => void }) {
    const toBase64 = (file: Blob) =>
      new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
  
    const handleAudioUpload = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const base64 = await toBase64(file);
      onSend({ base64Audio: base64 });
    };
  
    const render = (
      mode: string,
      setSelectedFileName: (name: string) => void,
      selectedFileName: string
    ) => {
      if (mode !== "audio") return null;
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label
            style={{
              border: "1.5px solid #D2B48C",
              borderRadius: 8,
              padding: "6px 12px",
              background: "#FAF3E0",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            음성 파일 선택
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => {
                setSelectedFileName(e.target.files?.[0]?.name || "");
                handleAudioUpload(e);
              }}
              style={{ display: "none" }}
            />
          </label>
          {selectedFileName && (
            <span style={{ fontSize: 13, color: "#6B4E2E" }}>{selectedFileName}</span>
          )}
        </div>
      );
    };
  
    return { render };
  }
  