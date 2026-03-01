import { useState } from "react";
import { getSessionUser, updateUser } from "../../utils/auth";

export default function ProfileInfo() {
  const user = getSessionUser();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  if (!user) return <p>Unauthorized</p>;

  const save = () => {
    updateUser({ ...user, name, phone });
    alert("Profil berhasil disimpan");
  };

  return (
    <>
      <h2>Informasi Akun</h2>

      <label>Nama Lengkap</label>
      <input value={name} onChange={e => setName(e.target.value)} />

      <label>Nomor Telepon</label>
      <input value={phone} onChange={e => setPhone(e.target.value)} />

      <button onClick={save}>Simpan Profil Saya</button>
    </>
  );
}