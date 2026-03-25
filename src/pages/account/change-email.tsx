import { useEffect, useState } from "react";
import { getSessionUser, setSession } from "../../utils/auth";
import { updateProfile } from "../../services/api";

export default function ChangeEmail() {
  const [user, setUser] = useState<Awaited<ReturnType<typeof getSessionUser>>>(null);
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const sessionUser = await getSessionUser();
      setUser(sessionUser);
      setLoading(false);
    };

    void loadUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>Unauthorized</p>;

  const save = async () => {
    if (email !== confirm) {
      alert("Email tidak sama");
      return;
    }

    try {
      const updated = await updateProfile({ email });
      setSession(updated);
      setUser({
        name: updated.full_name ?? updated.name ?? user.name,
        email: updated.email,
        password: user.password,
        phone: updated.phone_number ?? updated.phone ?? user.phone,
      });
      setEmail("");
      setConfirm("");
      alert("Email berhasil diubah");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengubah email");
    }
  };

  return (
    <>
      <h2>Ubah Email</h2>

      <p>
        Email Saat Ini: <b>{user.email}</b>
      </p>

      <label>Email Baru</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Konfirmasi Email</label>
      <input value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      <br />
      <button onClick={save}>Simpan Email Baru</button>
    </>
  );
}
