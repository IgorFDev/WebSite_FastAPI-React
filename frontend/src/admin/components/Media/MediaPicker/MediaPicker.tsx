import type { MediaAsset } from "../../../../api/media";

interface MediaPickerProps {
  mediaList: MediaAsset[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  label: string;
  currentPreviewUrl?: string | null;
}

export function MediaPicker({ mediaList, selectedId, onSelect, label, currentPreviewUrl }: MediaPickerProps) {
  return (
    <div style={{ marginTop: 15 }}>
      <strong>{label}</strong>
      {currentPreviewUrl && (
        <div style={{ margin: "10px 0" }}>
          <img src={`http://localhost:8000${currentPreviewUrl}`} alt="Текущий" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
          <div style={{ fontSize: 12 }}>Текущее изображение</div>
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10, maxHeight: 200, overflowY: "auto", border: "1px solid #ddd", padding: 8 }}>
        <div
          onClick={() => onSelect(null)}
          style={{
            width: 80,
            height: 80,
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: selectedId === null ? "3px solid blue" : "1px solid gray",
            borderRadius: 4,
          }}
        >
          Без фото
        </div>
        {mediaList.map((media) => (
          <div
            key={media.id}
            onClick={() => onSelect(media.id)}
            style={{
              width: 80,
              height: 80,
              border: selectedId === media.id ? "3px solid blue" : "1px solid gray",
              borderRadius: 4,
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            <img src={`http://localhost:8000${media.url}`} alt={media.storage_key} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </div>
  );
}