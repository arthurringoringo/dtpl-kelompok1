import { useEffect, useState } from "react";
import { getSessionUser, setSession } from "../../utils/auth";
import { updateProfile } from "../../services/api";

export default function ProfileInfo() {
  const [user, setUser] = useState<Awaited<ReturnType<typeof getSessionUser>>>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const sessionUser = await getSessionUser();
      setUser(sessionUser);
      setName(sessionUser?.name || "");
      setPhone(sessionUser?.phone || "");
      setLoading(false);
    };

    void loadUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>Unauthorized</p>;

  const save = async () => {
    try {
      const updated = await updateProfile({
        full_name: name,
        phone_number: phone,
      });

      setSession(updated);
      setUser({
        name: updated.full_name ?? updated.name ?? "",
        email: updated.email,
        password: user.password,
        phone: updated.phone_number ?? updated.phone ?? undefined,
      });
      setName(updated.full_name ?? updated.name ?? "");
      setPhone(updated.phone_number ?? updated.phone ?? "");
      alert("Profil berhasil disimpan");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan profil");
    }
  };

  return (
    <>
      <h2>Informasi Akun</h2>

      <label>Nama Lengkap</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <label>Nomor Telepon</label>
      <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      <br />
      <button onClick={save}>Simpan Profil Saya</button>
    </>
  );
}
