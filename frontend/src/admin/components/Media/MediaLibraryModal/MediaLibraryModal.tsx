import { useState, useEffect, useRef } from "react";
import { getMedia, createMedia, deleteMedia } from "../../../../api/media";
import type { MediaAsset } from "../../../../api/media";
import "./MediaLibraryModal.css";

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mediaId: number | null) => void;
  title?: string;
  currentSelectedId?: number | null; // текущее значение аватара/фона
}

type TabType = "upload" | "library";

function getDisplayName(storageKey: string): string {
  // Берём имя файла после последнего '\/'
  const parts = storageKey.split(/[\/\\]/);
  const fullFileName = parts.pop() || storageKey;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i;
  if (uuidPattern.test(fullFileName)) {
    return fullFileName.replace(uuidPattern, '');
  }
  return fullFileName;
}


export function MediaLibraryModal({ isOpen, onClose, onSelect, title = "Выберите изображение", currentSelectedId = null}: MediaLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("library");
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "image">("image");
  const [filterDate, setFilterDate] = useState<"all" | "today" | "week" | "month">("all");
  const [uploading, setUploading] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(currentSelectedId);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (isOpen) {
      setSelectedMediaId(currentSelectedId);
    }
  }, [isOpen, currentSelectedId]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await getMedia();
      setMediaList(data);
    } catch (err) {
      console.error("Ошибка загрузки медиа", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === "library") {
      loadMedia();
    }
  }, [isOpen, activeTab]);

  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const newMedia = await createMedia(file, file.name);
      setMediaList(prev => [newMedia, ...prev]);
      alert("Файл загружен");
    } catch (err) {
      console.error("Ошибка загрузки", err);
      alert("Ошибка загрузки файла");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить навсегда?")) return;
    try {
      await deleteMedia(id);
      setMediaList(prev => prev.filter(m => m.id !== id));
      if (selectedMediaId === id) setSelectedMediaId(null);
    } catch (err) {
      console.error("Ошибка удаления", err);
      alert("Ошибка удаления");
    }
  };

  const handleConfirm = () => {
    onSelect(selectedMediaId);
    onClose();
  };

  const filteredMedia = mediaList.filter(media => {
    if (filterType === "image" && !media.mime_type.startsWith("image/")) return false;
    if (filterDate !== "all" && media.created_at) {
      const date = new Date(media.created_at);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (filterDate === "today" && date < today) return false;
      if (filterDate === "week" && date < weekAgo) return false;
      if (filterDate === "month" && date < monthAgo) return false;
    }
    return true;
  });

  const formatDate = (media: MediaAsset) => {
    if (!media.created_at) return "Дата неизвестна";
    return new Date(media.created_at).toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="media-modal-overlay" onClick={onClose}>
      <div className="media-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="media-modal-header">
          <h2>{title}</h2>
          <button className="media-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="media-tabs">
          <button
            className={`media-tab ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            Загрузить файлы
          </button>
          <button
            className={`media-tab ${activeTab === "library" ? "active" : ""}`}
            onClick={() => setActiveTab("library")}
          >
            Библиотека файлов
          </button>
        </div>

        <div className="media-content">
          {activeTab === "upload" && (
            <div
              className="upload-area"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleUpload(file);
              }}
            >
              <p>Перетащите файл сюда или нажмите для выбора</p>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleUpload(e.target.files[0]);
                }}
                accept="image/*"
              />
              {uploading && <p>Загрузка...</p>}
            </div>
          )}

          {activeTab === "library" && (
            <>
              <div className="filters-bar">
                <div className="filter-group">
                  <label>Фильтр по типу:</label>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
                    <option value="image">Изображения</option>
                    <option value="all">Все файлы</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Фильтр по дате:</label>
                  <select value={filterDate} onChange={(e) => setFilterDate(e.target.value as any)}>
                    <option value="all">Все даты</option>
                    <option value="today">Сегодня</option>
                    <option value="week">За неделю</option>
                    <option value="month">За месяц</option>
                  </select>
                </div>
              </div>

              {loading && <div className="loading-text">Загрузка...</div>}
              {!loading && filteredMedia.length === 0 && <div className="empty-text">Нет файлов</div>}

              <div className="media-grid">
                {filteredMedia.map((media) => (
                  <div key={media.id} className={`media-card ${selectedMediaId === media.id ? "selected" : ""}`} onClick={() => setSelectedMediaId(media.id)}>
                    <img src={`http://localhost:8000${media.url}`} alt="" className="media-image" />
                    <div className="media-info">
                      <div className="media-name">
                        {getDisplayName(media.storage_key)}
                      </div>
                      <div className="media-meta">
                        <span>{formatDate(media)}</span>
                      </div>
                      <div className="media-actions">
                        <button
                          className="media-btn media-btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(media.id);
                          }}
                        >
                          Удалить навсегда
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            <div className="modal-buttons">
                <button className="btn-confirm" onClick={handleConfirm} type="button">Подтвердить</button>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}