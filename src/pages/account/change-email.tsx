import { useState } from "react";
import { getSessionUser, updateUser } from "../../utils/auth";

export default function ChangeEmail() {
  const user = getSessionUser();
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState("");

  if (!user) return <p>Unauthorized</p>;

  const save = () => {
    if (email !== confirm) {
      alert("Email tidak sama");
      return;
    }

    updateUser({ ...user, email });
    alert("Email berhasil diubah (login ulang)");
  };

  return (
    <>
      <h2>Ubah Email</h2>

      <p>Email Saat Ini: <b>{user.email}</b></p>

      <label>Email Baru</label>
      <input value={email} onChange={e => setEmail(e.target.value)} />

      <label>Konfirmasi Email</label>
      <input value={confirm} onChange={e => setConfirm(e.target.value)} />

      <button onClick={save}>Simpan Email Baru</button>
    </>
  );
}