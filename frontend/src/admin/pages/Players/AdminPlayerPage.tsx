import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayer, updatePlayer } from "../../../api/players";
import { getMedia, createMedia } from "../../../api/media";
import type { MediaAsset } from "../../../api/media";
import { MediaLibraryModal } from "../../components/Media/MediaLibraryModal/MediaLibraryModal";
import { getPlayerGallery, addGalleryItem, deleteGalleryItem } from "../../../api/playerGallery";
import type {PlayerGalleryItem} from "../../../api/playerGallery";
import { updatePlayerStatistic, addToPlayerStatistic } from "../../../api/playerStatistics";

// Типы на основе ответа API
interface PlayerData {
  id: number;
  first_name: string;
  last_name: string;
  number: number;
  slug: string;
  position: string;
  height: number;
  birth_date: string;
  sport_rank: string;
  age: number;
  is_current?: boolean;
  weight?: number;
  avatar: MediaAsset | null;
  background: MediaAsset | null;
  statistics: Array<{
    id: number;
    player_id: number;
    matches_played: number;
    sets_played: number;
    total_points: number;
    blocks: number;
    attacks: number;
    aces: number;
    errors: number;
    season: { id: number; name: string };
  }>;
  gallery_items: PlayerGalleryItem[];
}

function AdminPlayerPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(player?.avatar?.id ?? null);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<number | null>(player?.background?.id ?? null);
  // Состояния
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);

  // Обработчики выбора
  const handleSelectAvatar = (mediaId: number | null) => {
    setSelectedAvatarId(mediaId);
    setIsAvatarModalOpen(false);
  };

  const handleSelectBackground = (mediaId: number | null) => {
    setSelectedBackgroundId(mediaId);
    setIsBackgroundModalOpen(false);
  };

  useEffect(() => {
    if (!slug) return;
    async function loadAll() {
      try {
        setLoading(true);
        const [playerData, media] = await Promise.all([
          getPlayer(slug),
          getMedia(),
        ]);
        setPlayer(playerData);
        setMediaList(media);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [slug]);
  
  useEffect(() => {
    if (player) {
      setSelectedAvatarId(player.avatar?.id ?? null);
      setSelectedBackgroundId(player.background?.id ?? null);
    }
  }, [player]);


  const handleBasicUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!player) return;
    setUpdating(true);
    try {
      const formData = new FormData(e.currentTarget);
      const payload = {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        number: parseInt(formData.get("number") as string),
        position: formData.get("position"),
        birth_date: formData.get("birth_date"),
        height: parseInt(formData.get("height") as string),
        weight: parseInt(formData.get("weight") as string),
        sport_rank: formData.get("sport_rank"),
        is_current: formData.get("is_current") === "on",
        avatar_media_id: selectedAvatarId,
        background_media_id: selectedBackgroundId,
      };
      const updated = await updatePlayer(player.id, payload);
      setPlayer((prev) => ({ ...prev!, ...updated }));
      /* alert("Основные данные обновлены"); */
    } catch (err) {
      console.error(err);
      alert("Ошибка обновления");
    } finally {
      setUpdating(false);
    }
  };

  // Загрузка медиа с дополнительным полем "name"
  const handleUploadMedia = async (file: File) => {
    const name = prompt("Введите название медиафайла", file.name) || file.name;
    try {
      const newMedia = await createMedia(file, name);
      setMediaList((prev) => [...prev, newMedia]);
      alert("Файл загружен");
      return newMedia;
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки");
      return null;
    }
  };

  const handleAddToGallery = async (mediaAssetId: number) => {
    if (!player) return;
    try {
      const sortOrder = player.gallery_items.length;
      await addGalleryItem({
        player_id: player.id,
        media_asset_id: mediaAssetId,
        sort_order: sortOrder,
      });
      const updatedGallery = await getPlayerGallery(player.id);
      setPlayer((prev) => ({ ...prev!, gallery_items: updatedGallery }));
      alert("Изображение добавлено в галерею");
    } catch (err) {
      console.error(err);
      alert("Ошибка добавления");
    }
  };

  const handleRemoveFromGallery = async (playerGalleryId: number) => {
    if (!player) return;
    try {
      await deleteGalleryItem(playerGalleryId);
      setPlayer((prev) => ({
        ...prev!,
        gallery_items: prev!.gallery_items.filter((item) => item.id !== playerGalleryId),
      }));
    } catch (err) {
      console.error(err);
      alert("Ошибка удаления");
    }
  };

  const handleStatisticReplace = async (statId: number, data: any) => {
    try {
      await updatePlayerStatistic(statId, data);
      if (slug) {
        const refreshed = await getPlayer(slug);
        setPlayer(refreshed);
      }
      alert("Статистика обновлена");
    } catch (err) {
      console.error(err);
      alert("Ошибка обновления статистики");
    }
  };

  const handleStatisticAdd = async (statId: number, delta: any) => {
    try {
      await addToPlayerStatistic(statId, delta);
      if (slug) {
        const refreshed = await getPlayer(slug);
        setPlayer(refreshed);
      }
      alert("Статистика изменена");
    } catch (err) {
      console.error(err);
      alert("Ошибка изменения статистики");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!player) return <div>Игрок не найден</div>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h1>Редактирование игрока: {player.first_name} {player.last_name}</h1>
      <button onClick={() => navigate("/admin/players")}>Назад к списку</button>

      {/* Основная форма */}
      <section style={{ marginTop: 30, border: "1px solid #ccc", padding: 20 }}>
        <h2>Основные данные</h2>
        <form onSubmit={handleBasicUpdate}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label>Имя: <input name="first_name" defaultValue={player.first_name} required /></label>
            <label>Фамилия: <input name="last_name" defaultValue={player.last_name} required /></label>
            <label>Номер: <input name="number" type="number" defaultValue={player.number} required /></label>
            <label>Позиция: 
              <select name="position" defaultValue={player.position}>
                <option value="SETTER">Связующий</option>
                <option value="LIBERO">Либеро</option>
                <option value="OUTSIDE_HITTER">Доигровщик</option>
                <option value="OPPOSITE">Диагональный</option>
                <option value="MIDDLE_BLOCKER">Центральный блокирующий</option>
              </select>
            </label>
            <label>Дата рождения: <input name="birth_date" type="date" defaultValue={player.birth_date} /></label>
            <label>Рост (см): <input name="height" type="number" defaultValue={player.height} /></label>
            <label>Вес (кг): <input name="weight" type="number" defaultValue={player.weight || ""} /></label>
            <label>Спортивный разряд: <input name="sport_rank" defaultValue={player.sport_rank} /></label>
            <label style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <input name="is_current" type="checkbox" defaultChecked={player.is_current} /> Действующий игрок
            </label>
          </div>
          <div style={{ marginTop: 15 }}>
            <label>Аватар (Media ID): 
              <button type="button" onClick={() => setIsAvatarModalOpen(true)}>Заменить аватар</button>
              <MediaLibraryModal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                onSelect={handleSelectAvatar}
                title="Выберите аватар"
                currentSelectedId={selectedAvatarId}
              />
            </label>
            <label style={{ marginLeft: 20 }}>Фон (Media ID): 
              <button type="button" onClick={() => setIsBackgroundModalOpen(true)}>Заменить фон</button>
              <MediaLibraryModal
                isOpen={isBackgroundModalOpen}
                onClose={() => setIsBackgroundModalOpen(false)}
                onSelect={handleSelectBackground}
                title="Выберите фоновое изображение"
                currentSelectedId={selectedBackgroundId}
              />
            </label>
          </div>
          <button type="submit" disabled={updating} style={{ marginTop: 20 }}>Сохранить основное</button>
        </form>
      </section>

      {/* Загрузка новых медиафайлов */}
      <section style={{ marginTop: 30, border: "1px solid #ccc", padding: 20 }}>
        <h2>Загрузить новый медиафайл</h2>
        <input type="file" onChange={async (e) => {
          if (e.target.files?.[0]) await handleUploadMedia(e.target.files[0]);
        }} />
      </section>

      {/* Галерея */}
      <section style={{ marginTop: 30, border: "1px solid #ccc", padding: 20 }}>
        <h2>Галерея игрока</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {player.gallery_items.map((item) => (
            <div key={item.id} style={{ position: "relative", border: "1px solid gray", padding: 5 }}>
              <img src={`http://localhost:8000${item.media_asset.url}`} alt="gallery" width={100} height={100} style={{ objectFit: "cover" }} />
              <button onClick={() => handleRemoveFromGallery(item.id)} style={{ marginTop: 5, background: "red", color: "white" }}>Удалить</button>
            </div>
          ))}
        </div>
        <h3>Добавить из загруженных медиа</h3>
        <select onChange={(e) => handleAddToGallery(parseInt(e.target.value))} value="">
          <option value="">Выберите медиа</option>
          {mediaList.map((m) => (
            <option key={m.id} value={m.id}>ID {m.id}</option>
          ))}
        </select>
      </section>

      {/* Статистика по сезонам */}
      <section style={{ marginTop: 30, border: "1px solid #ccc", padding: 20 }}>
        <h2>Статистика по сезонам</h2>
        {player.statistics.map((stat) => (
          <div key={stat.id} style={{ borderTop: "1px solid #aaa", marginTop: 20, paddingTop: 10 }}>
            <h3>Сезон: {stat.season.name}</h3>
            <div style={{ display: "flex", gap: 40 }}>
              {/* Форма полной замены */}
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const data = {
                  season_id: stat.season.id,
                  matches_played: parseInt(fd.get("matches_played") as string),
                  sets_played: parseInt(fd.get("sets_played") as string),
                  total_points: parseInt(fd.get("total_points") as string),
                  blocks: parseInt(fd.get("blocks") as string),
                  attacks: parseInt(fd.get("attacks") as string),
                  aces: parseInt(fd.get("aces") as string),
                  errors: parseInt(fd.get("errors") as string),
                };
                handleStatisticReplace(stat.id, data);
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5 }}>
                  <label>Матчи: <input name="matches_played" type="number" defaultValue={stat.matches_played} /></label>
                  <label>Сеты: <input name="sets_played" type="number" defaultValue={stat.sets_played} /></label>
                  <label>Очки: <input name="total_points" type="number" defaultValue={stat.total_points} /></label>
                  <label>Блоки: <input name="blocks" type="number" defaultValue={stat.blocks} /></label>
                  <label>Атаки: <input name="attacks" type="number" defaultValue={stat.attacks} /></label>
                  <label>Эйсы: <input name="aces" type="number" defaultValue={stat.aces} /></label>
                  <label>Ошибки: <input name="errors" type="number" defaultValue={stat.errors} /></label>
                </div>
                <button type="submit">Заменить статистику</button>
              </form>

              {/* Форма добавления/вычитания */}
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const delta = {
                  matches_played: parseInt(fd.get("delta_matches") as string) || 0,
                  sets_played: parseInt(fd.get("delta_sets") as string) || 0,
                  total_points: parseInt(fd.get("delta_points") as string) || 0,
                  blocks: parseInt(fd.get("delta_blocks") as string) || 0,
                  attacks: parseInt(fd.get("delta_attacks") as string) || 0,
                  aces: parseInt(fd.get("delta_aces") as string) || 0,
                  errors: parseInt(fd.get("delta_errors") as string) || 0,
                };
                handleStatisticAdd(stat.id, delta);
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5 }}>
                  <label>+/- Матчи: <input name="delta_matches" type="number" defaultValue={0} /></label>
                  <label>+/- Сеты: <input name="delta_sets" type="number" defaultValue={0} /></label>
                  <label>+/- Очки: <input name="delta_points" type="number" defaultValue={0} /></label>
                  <label>+/- Блоки: <input name="delta_blocks" type="number" defaultValue={0} /></label>
                  <label>+/- Атаки: <input name="delta_attacks" type="number" defaultValue={0} /></label>
                  <label>+/- Эйсы: <input name="delta_aces" type="number" defaultValue={0} /></label>
                  <label>+/- Ошибки: <input name="delta_errors" type="number" defaultValue={0} /></label>
                </div>
                <button type="submit">Прибавить/Вычесть</button>
              </form>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default AdminPlayerPage;