"use client";

import { SyntheticEvent, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

type Mole = {
  id: string;
  hero: string;
  release: number;
  role: string;
  lane: string;
  image: string;
};

export default function UpdateMole(mole: Mole) {
  const [hero, setHero] = useState(mole.hero);
  const [release, setRelease] = useState(mole.release.toString());
  const [role, setRole] = useState(mole.role);
  const [lane, setLane] = useState(mole.lane);
  const [image, setImage] = useState<File | null>(null);
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const router = useRouter();

  async function handleUpdate(e: SyntheticEvent) {
    e.preventDefault();

    setIsMutating(true);

    const formData = new FormData();
    formData.append("hero", hero);
    formData.append("release", release);
    formData.append("role", role);
    formData.append("lane", lane);

    if (image) {
      formData.append("image", image);
    }

    try {
      await fetch(`http://localhost:5555/update/${mole.id}`, {
        method: "PATCH",
        body: formData,
      });

      setIsMutating(false);

      router.refresh();
      setModal(false);
    } catch (error) {
      console.error("Error updating mole:", error);
      setIsMutating(false);
    }
  }

  function handleChange() {
    setModal(!modal);
  }

  function handleChangeImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  }

  return (
    <div>
      <button className="btn btn-info btn-sm" onClick={handleChange} id={mole.id}>
        Edit
      </button>

      <input
        type="checkbox"
        checked={modal}
        onChange={handleChange}
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit {mole.hero}</h3>
          <form onSubmit={handleUpdate}>
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
            <div className="form-control">
              <label className="label font-bold">Image</label>
              <input
                type="file"
                onChange={handleChangeImage}
                className="input w-full input-bordered"
              />
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleChange}>
                Close
              </button>
              {!isMutating ? (
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              ) : (
                <button type="button" className="btn loading">
                  Updating...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
