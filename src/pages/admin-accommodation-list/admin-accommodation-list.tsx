import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin-sidebar";
import {
  getAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
  uploadImage,
  type Accommodation,
} from "../../services/api";
import "../admin-destination-list/admin-shared.css";
import "./admin-accommodation-list.css";

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatCurrencyInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("id-ID");
}

function parseCurrencyInput(formatted: string): string {
  return formatted.replace(/\D/g, "");
}

type AccommodationForm = {
  name: string;
  price: string;
  facilities: string; // newline-separated
  image_url: string;
};

function emptyForm(): AccommodationForm {
  return { name: "", price: "", facilities: "", image_url: "" };
}

export default function AdminAccommodationPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AccommodationForm>(emptyForm());
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [apiError, setApiError] = useState("");

  const fetchAccommodations = async () => {
    setLoadingList(true);
    setListError("");
    try {
      const data = await getAccommodations();
      setAccommodations(data);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Gagal mengambil data penginapan.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      document.body.style.overflow = "auto";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [isModalOpen]);

  const openAddModal = () => {
    setModalMode("create");
    setEditingId(null);
    setApiError("");
    setForm(emptyForm());
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = async (id: number) => {
    setModalMode("edit");
    setEditingId(id);
    setApiError("");
    setLoadingDetail(true);
    setIsModalOpen(true);
    try {
      const detail = await getAccommodationById(id);
      setForm({
        name: detail.name ?? "",
        price: String(detail.price ?? "").replace(/\D/g, ""),
        facilities: (detail.facilities ?? []).join("\n"),
        image_url: detail.image_url ?? "",
      });
      setImagePreview(detail.image_url ?? "");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Gagal mengambil detail penginapan.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setApiError("");
  };

  const handleChange = (field: keyof AccommodationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async (file: File | null) => {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Gagal mengunggah gambar.");
      setImagePreview(form.image_url || "");
    }
  };

  const handleSubmit = async () => {
    setApiError("");
    if (!form.name || !form.price) {
      setApiError("Nama dan harga wajib diisi.");
      return;
    }
    setSubmitting(true);
    const payload = {
      name: form.name,
      price: Number(form.price),
      facilities: form.facilities
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      image_url: form.image_url,
    };
    try {
      if (modalMode === "edit" && editingId) {
        await updateAccommodation(editingId, payload);
      } else {
        await createAccommodation(payload);
      }
      closeModal();
      await fetchAccommodations();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Gagal menyimpan penginapan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number | null) => {
    if (!id) return;
    if (!window.confirm("Hapus penginapan ini?")) return;
    try {
      await deleteAccommodation(id);
      closeModal();
      await fetchAccommodations();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Gagal menghapus penginapan.");
    }
  };

  return (
    <div className="adminPage">
      <div className="adminShell">
        <AdminSidebar />

        <main className="adminContent">
          <div className="adminContent__topbar">
            <h1 className="adminContent__title">Penginapan</h1>
            <button type="button" className="adminContent__addButton" onClick={openAddModal}>
              Tambah Penginapan
            </button>
          </div>

          {listError && <div className="accomModal__error">{listError}</div>}

          <section className="accomGrid">
            {loadingList ? (
              <div>Memuat...</div>
            ) : accommodations.length === 0 ? (
              <div>Belum ada penginapan.</div>
            ) : (
              accommodations.map((item) => (
                <article key={item.id} className="accomCard">
                  <button
                    type="button"
                    className="accomCard__editBtn"
                    onClick={() => openEditModal(item.id)}
                    aria-label="edit penginapan"
                  >
                    ✎
                  </button>

                  <div className="accomCard__imageWrap">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="accomCard__image" />
                    ) : (
                      <span className="accomCard__imagePlaceholder">🏠</span>
                    )}
                  </div>

                  <div className="accomCard__body">
                    <div className="accomCard__name">{item.name}</div>
                    <div className="accomCard__price">💚 {formatRupiah(Number(item.price))}</div>
                    {item.facilities.length > 0 && (
                      <div className="accomCard__facilities">
                        {item.facilities.slice(0, 3).map((f, i) => (
                          <span key={i} className="accomCard__facilityTag">{f}</span>
                        ))}
                        {item.facilities.length > 3 && (
                          <span className="accomCard__facilityTag accomCard__facilityTag--more">
                            +{item.facilities.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))
            )}
          </section>

          {isModalOpen && (
            <div className="accomModal__overlay" onClick={closeModal}>
              <div className="accomModal" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="accomModal__close" onClick={closeModal}>✕</button>

                <div className="accomModal__uploadWrap">
                  <label className="accomModal__uploadCircle">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="accomModal__uploadPreview" />
                    ) : (
                      <span className="accomModal__uploadIcon">📷</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="accomModal__fileInput"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        e.target.value = "";
                        handleImageChange(file);
                      }}
                    />
                  </label>
                  <div className="accomModal__uploadText">Unggah Foto</div>
                </div>

                <div className="accomModal__grid">
                  <div className="accomModal__left">
                    <div className="accomField">
                      <label className="accomField__label">Nama Penginapan</label>
                      <input
                        type="text"
                        className="accomField__input"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Masukkan nama penginapan"
                      />
                    </div>

                    <div className="accomField">
                      <label className="accomField__label">Harga per Malam</label>
                      <div className="accomCurrencyWrap">
                        <span className="accomCurrencyPrefix">Rp</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          className="accomField__input accomCurrencyInput"
                          value={formatCurrencyInput(form.price)}
                          onChange={(e) => handleChange("price", parseCurrencyInput(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="accomModal__right">
                    <div className="accomField">
                      <label className="accomField__label">
                        Fasilitas
                        <span className="accomField__hint"> — satu per baris</span>
                      </label>
                      <textarea
                        className="accomField__textarea"
                        value={form.facilities}
                        onChange={(e) => handleChange("facilities", e.target.value)}
                        placeholder={"WiFi\nKolam Renang\nSarapan"}
                        rows={6}
                      />
                    </div>
                  </div>
                </div>

                {apiError && <div className="accomModal__error">{apiError}</div>}

                <div className="accomModal__actions">
                  <button
                    type="button"
                    className="accomModal__saveBtn"
                    onClick={handleSubmit}
                    disabled={submitting || loadingDetail}
                  >
                    {loadingDetail ? "Memuat..." : submitting
                      ? (modalMode === "edit" ? "Mengupdate..." : "Menyimpan...")
                      : (modalMode === "edit" ? "UPDATE" : "SIMPAN")}
                  </button>

                  <button
                    type="button"
                    className="accomModal__deleteBtn"
                    disabled={modalMode !== "edit" || submitting}
                    onClick={() => handleDelete(editingId)}
                  >
                    HAPUS
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
