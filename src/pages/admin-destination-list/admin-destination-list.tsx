import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/admin-sidebar";
import {
  createDestination,
  updateDestination,
  getDestinationById,
  getCategories,
  type Category,
  type DestinationDetail,
} from "../../services/api";
import "./admin-destination-list.css";
import "./admin-shared.css";
import { useNavigate } from "react-router-dom";

type DestinationForm = {
  title: string;
  category_id: string;
  price: string;
  location: string;
  descriptions: string;
  start_date: string;
  end_date: string;
  status: "active" | "inactive";
  addons: string[];
};

function emptyForm(): DestinationForm {
  return {
    title: "",
    category_id: "",
    price: "",
    location: "",
    descriptions: "",
    start_date: "",
    end_date: "",
    status: "active",
    addons: [],
  };
}

type AdminDestinationDetail = DestinationDetail & {
  status?: "active" | "inactive";
  addons?: string[];
  start_date?: string;
  end_date?: string;
};

type DestinationItem = {
  id: number;
  title: string;
  category: string;
  dateVenue: string;
  time: string;
  price: number;
};

const dummyDestinations: DestinationItem[] = [
  {
    id: 1,
    title: "PAKET 1",
    category: "Kegiatan & Kerajinan",
    dateVenue: "Date | Venue",
    time: "00:00 AM - 00:00 PM",
    price: 200000,
  },
  {
    id: 2,
    title: "PAKET 1",
    category: "Kegiatan & Kerajinan",
    dateVenue: "Date | Venue",
    time: "00:00 AM - 00:00 PM",
    price: 200000,
  },
];

function formatRupiah(value: number) {
  return `Rp. ${value.toLocaleString("id-ID")}`;
}

export default function AdminDestinasiPage() {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [addonInput, setAddonInput] = useState("");
  const [form, setForm] = useState<DestinationForm>(emptyForm());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (!isAddModalOpen) return;

    setLoadingCategories(true);
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setApiError("Gagal mengambil data kategori."))
      .finally(() => setLoadingCategories(false));
  }, [isAddModalOpen]);

  useEffect(() => {
    if (!isAddModalOpen) {
      document.body.style.overflow = "auto";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isAddModalOpen]);

  function combineToDatetimeLocal(date?: string, time?: string) {
    if (!date) return "";
    const safeTime = (time || "00:00").slice(0, 5);
    return `${date}T${safeTime}`;
  }

  const openAddModal = () => {
    setModalMode("create");
    setEditingId(null);
    setApiError("");
    setForm(emptyForm());
    setImageFile(null);
    setImagePreview("");
    setIsAddModalOpen(true);
  };

  const openEditModal = async (id: number) => {
    setModalMode("edit");
    setEditingId(id);
    setApiError("");
    setLoadingDetail(true);
    setIsAddModalOpen(true);

    try {
      const detail = (await getDestinationById(id)) as AdminDestinationDetail;

      setForm({
        title: detail.name ?? "",
        category_id: String(detail.category_id ?? detail.category?.id ?? ""),
        price: String(detail.price ?? ""),
        location: detail.address ?? "",
        descriptions: detail.descriptions ?? "",
        start_date:
          detail.start_date ??
          combineToDatetimeLocal(detail.date, detail.start_time),
        end_date:
          detail.end_date ??
          combineToDatetimeLocal(detail.date, detail.end_time),
        status: detail.status === "inactive" ? "inactive" : "active",
        addons: Array.isArray(detail.addons) ? detail.addons : [],
      });

      setImageFile(null);
      setImagePreview(detail.image_url ?? "");
      setLoadingDetail(false);
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil detail destinasi.",
      );
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSubmit = async () => {
    setApiError("");

    if (
      !form.title ||
      !form.category_id ||
      !form.price ||
      !form.location ||
      !form.descriptions ||
      !form.start_date ||
      !form.end_date
    ) {
      setApiError("Mohon lengkapi seluruh field.");
      return;
    }

    if (new Date(form.end_date) < new Date(form.start_date)) {
      setApiError("End Date tidak boleh lebih kecil dari Start Date.");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: form.title,
      category_id: Number(form.category_id),
      price: Number(form.price),
      address: form.location,
      descriptions: form.descriptions,
      start_date: form.start_date,
      end_date: form.end_date,
      status: form.status,
      addons: form.addons,
      image: imageFile,
    };

    try {
      if (modalMode === "edit" && editingId) {
        await updateDestination(editingId, payload);
      } else {
        await createDestination(payload);
      }

      closeAddModal();

      // reload list destinasi kalau kamu sudah punya function fetchDestinations()
      // await fetchDestinations();
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : modalMode === "edit"
            ? "Gagal memperbarui destinasi."
            : "Gagal menambahkan destinasi.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAddon = () => {
    const value = addonInput.trim();

    if (!value) return;

    const exists = form.addons.some(
      (item) => item.toLowerCase() === value.toLowerCase(),
    );

    if (exists) {
      setAddonInput("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      addons: [...prev.addons, value],
    }));

    setAddonInput("");
  };

  const handleRemoveAddon = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      addons: prev.addons.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAddonKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAddon();
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setApiError("");
  };

  const handleChange = (field: keyof DestinationForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);

    if (!file) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  return (
    <div className="adminPage">
      <div className="adminShell">
        <AdminSidebar />

        <main className="adminContent">
          <div className="adminContent__topbar">
            <h1 className="adminContent__title">Destinasi</h1>

            <button
              type="button"
              className="adminContent__addButton"
              onClick={openAddModal}
            >
              Tambah Destinasi
            </button>
          </div>

          <section className="adminDestinationGrid">
            {dummyDestinations.map((item) => (
              <article key={item.id} className="adminDestinationCard">
                <button
                  type="button"
                  className="adminDestinationCard__editBtn"
                  onClick={() => openEditModal(item.id)}
                  aria-label="edit destinasi"
                  title="Edit destinasi"
                >
                  ✎
                </button>

                <div className="adminDestinationCard__imageWrap">
                  <div className="adminDestinationCard__image">
                    <span className="adminDestinationCard__placeholder">
                      🖼
                    </span>
                  </div>

                  <button
                    type="button"
                    className="adminDestinationCard__fav"
                    aria-label="favorite"
                  >
                    ☆
                  </button>
                </div>

                <div className="adminDestinationCard__body">
                  <div className="adminDestinationCard__title">
                    {item.title}
                  </div>
                  <div className="adminDestinationCard__category">
                    {item.category}
                  </div>
                  <div className="adminDestinationCard__meta">
                    {item.dateVenue}
                  </div>
                  <div className="adminDestinationCard__time">{item.time}</div>
                  <div className="adminDestinationCard__price">
                    💚 {formatRupiah(item.price)}
                  </div>

                  <button
                    type="button"
                    className="adminDestinationCard__button"
                    onClick={() =>
                      navigate(`/admin/destinasi/${item.id}/pembeli`, {
                        state: { name: `${item.title} ${item.category}` },
                      })
                    }
                  >
                    Lihat Data Pembeli
                  </button>
                </div>
              </article>
            ))}
          </section>

          {/* isi list card destinasi kamu yang sekarang di sini */}

          {isAddModalOpen && (
            <div className="destinationModal__overlay" onClick={closeAddModal}>
              <div
                className="destinationModal"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="destinationModal__close"
                  onClick={closeAddModal}
                >
                  ✕
                </button>

                <div className="destinationModal__uploadWrap">
                  <label className="destinationModal__uploadCircle">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="destinationModal__uploadPreview"
                      />
                    ) : (
                      <span className="destinationModal__uploadIcon">📷</span>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="destinationModal__fileInput"
                      onChange={(e) =>
                        handleImageChange(e.target.files?.[0] ?? null)
                      }
                    />
                  </label>

                  <div className="destinationModal__heading">
                    <div className="destinationModal__uploadText">
                      Unggah Foto
                    </div>
                  </div>
                </div>

                <div className="destinationModal__grid">
                  <div className="destinationModal__left">
                    <div className="destinationFieldRow">
                      <label className="destinationFieldRow__label">
                        Judul:
                      </label>
                      <input
                        type="text"
                        className="destinationFieldRow__input"
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="Masukkan judul destinasi"
                      />
                    </div>

                    <div className="destinationFieldRow">
                      <label className="destinationFieldRow__label">
                        Kategori:
                      </label>
                      <select
                        className="destinationFieldRow__input"
                        value={form.category_id}
                        onChange={(e) =>
                          handleChange("category_id", e.target.value)
                        }
                        disabled={loadingCategories}
                      >
                        <option value="">
                          {loadingCategories
                            ? "Memuat kategori..."
                            : "Pilih kategori"}
                        </option>
                        {categories.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="destinationFieldRow">
                      <label className="destinationFieldRow__label">
                        Harga:
                      </label>
                      <input
                        type="number"
                        className="destinationFieldRow__input"
                        value={form.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        placeholder="Masukkan harga"
                      />
                    </div>

                    <div className="destinationFieldRow">
                      <label className="destinationFieldRow__label">
                        Location:
                      </label>
                      <input
                        type="text"
                        className="destinationFieldRow__input"
                        value={form.location}
                        onChange={(e) =>
                          handleChange("location", e.target.value)
                        }
                        placeholder="Enter location address"
                      />
                    </div>

                    <div className="destinationFieldRow">
                      <label className="destinationFieldRow__label">
                        Status:
                      </label>
                      <select
                        className="destinationFieldRow__input destinationFieldRow__input--small"
                        value={form.status}
                        onChange={(e) =>
                          handleChange(
                            "status",
                            e.target.value as "active" | "inactive",
                          )
                        }
                      >
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                      </select>
                    </div>
                    <div className="destinationFieldRow destinationFieldRow--addons">
                      <label className="destinationFieldRow__label">
                        Add on:
                      </label>

                      <div className="destinationAddon">
                        <div className="destinationAddon__inputRow">
                          <input
                            type="text"
                            className="destinationFieldRow__input"
                            value={addonInput}
                            onChange={(e) => setAddonInput(e.target.value)}
                            onKeyDown={handleAddonKeyDown}
                            placeholder="Tulis add on lalu tekan Tambah"
                          />

                          <button
                            type="button"
                            className="destinationAddon__addBtn"
                            onClick={handleAddAddon}
                          >
                            Tambah
                          </button>
                        </div>

                        {form.addons.length > 0 && (
                          <div className="destinationAddon__list">
                            {form.addons.map((addon, index) => (
                              <div
                                key={`${addon}-${index}`}
                                className="destinationAddon__chip"
                              >
                                <span>{addon}</span>
                                <button
                                  type="button"
                                  className="destinationAddon__removeBtn"
                                  onClick={() => handleRemoveAddon(index)}
                                  aria-label={`Hapus ${addon}`}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="destinationModal__right">
                    <div className="destinationFieldColumn">
                      <label className="destinationFieldColumn__label">
                        Deskripsi:
                      </label>
                      <textarea
                        className="destinationFieldColumn__textarea"
                        value={form.descriptions}
                        onChange={(e) =>
                          handleChange("descriptions", e.target.value)
                        }
                        placeholder="Masukkan deskripsi"
                      />
                    </div>

                    <div className="destinationFieldColumn">
                      <label className="destinationFieldColumn__label">
                        Start Date:
                      </label>
                      <input
                        type="datetime-local"
                        className="destinationFieldColumn__input"
                        value={form.start_date}
                        onChange={(e) =>
                          handleChange("start_date", e.target.value)
                        }
                      />
                    </div>

                    <div className="destinationFieldColumn">
                      <label className="destinationFieldColumn__label">
                        End Date:
                      </label>
                      <input
                        type="datetime-local"
                        className="destinationFieldColumn__input"
                        value={form.end_date}
                        onChange={(e) =>
                          handleChange("end_date", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {apiError && (
                  <div className="destinationModal__error">{apiError}</div>
                )}

                <div className="destinationModal__actions">
                  <button
                    type="button"
                    className="destinationModal__saveBtn"
                    onClick={handleSubmit}
                    disabled={submitting || loadingDetail}
                  >
                    {loadingDetail
                      ? "Memuat..."
                      : submitting
                        ? modalMode === "edit"
                          ? "Mengupdate..."
                          : "Menyimpan..."
                        : modalMode === "edit"
                          ? "UPDATE"
                          : "SIMPAN"}
                  </button>

                  <button
                    type="button"
                    className="destinationModal__deleteBtn"
                    onClick={closeAddModal}
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
