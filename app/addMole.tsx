"use client"; // Tambahkan ini di baris pertama file addMole.tsx
import { SyntheticEvent, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function AddMole() {
  const [hero, setHero] = useState("");
  const [release, setRelease] = useState("");
  const [role, setRole] = useState("");
  const [lane, setLane] = useState("");
  const [image, setImage] = useState<File | null>(null); // Tambahkan tipe untuk image
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    setIsMutating(true);

    // Buat formData untuk mengirim file
    const formData = new FormData();
    formData.append("hero", hero);
    formData.append("release", release);
    formData.append("role", role);
    formData.append("lane", lane);
    if (image) {
      formData.append("image", image); // Image ditambahkan ke formData jika ada
    }

    await fetch("http://localhost:5555/create", {
      method: "POST",
      body: formData, // Mengirim formData
    });

    setIsMutating(false);

    setHero("");
    setRelease("");
    setRole("");
    setLane("");
    setImage(null); // Kosongkan image setelah proses selesai
    router.refresh();
    setModal(false);
  }

  function handleChangeImage(e: ChangeEvent<HTMLInputElement>) {
    // Mengambil file gambar dari input file
    const file = e.target.files ? e.target.files[0] : null;
    // Menyimpan file gambar ke state
    setImage(file);
  }

  function handleChange() {
    setModal(!modal);
  }

  return (
    <div>
      <button className="btn" onClick={handleChange}>
        Add New
      </button>

      <input
        type="checkbox"
        checked={modal}
        onChange={handleChange}
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Mole</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label font-bold">Hero</label>
              <input
                type="text"
                value={hero}
                onChange={(e) => setHero(e.target.value)}
                className="input w-full input-bordered"
                placeholder="Hero Name"
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Release</label>
              <input
                type="text"
                value={release}
                onChange={(e) => setRelease(e.target.value)}
                className="input w-full input-bordered"
                placeholder="Release Date"
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input w-full input-bordered"
                placeholder="Role"
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Lane</label>
              <input
                type="text"
                value={lane}
                onChange={(e) => setLane(e.target.value)}
                className="input w-full input-bordered"
                placeholder="Lane"
              />
            </div>
            {/* Ganti input gambar dengan input file */}
            <div className="form-control">
              <label className="label font-bold">Image</label>
              <input
                type="file"
                onChange={handleChangeImage} // Tangani perubahan input file
                className="input w-full input-bordered"
              />
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleChange}>
                Close
              </button>
              {!isMutating ? (
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              ) : (
                <button type="button" className="btn loading">
                  Saving...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
