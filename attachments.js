const Attachments = (() => {
  function db() {
    return new Promise((resolve, reject) => {
      const r = indexedDB.open("sj-files", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("files");
      r.onerror = () => reject(Error("Penyimpanan lampiran tidak tersedia."));
      r.onblocked = () => reject(Error("Tutup tab lama agar penyimpanan lampiran dapat dibuka."));
      r.onsuccess = () => resolve(r.result);
    });
  }
  async function op(mode, action) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const tx = d.transaction("files", mode), r = action(tx.objectStore("files"));
      tx.oncomplete = () => { d.close(); resolve(r.result); };
      tx.onabort = tx.onerror = () => { d.close(); reject(Error("Lampiran gagal dibaca/disimpan. Periksa izin dan kuota browser.")); };
    });
  }
  async function save(file) {
    const error = Core.fileError(file); if (error) throw Error(error);
    const id = crypto.randomUUID(); await op("readwrite", s => s.put(file, id));
    return { id, name: file.name, size: file.size };
  }
  const remove = id => op("readwrite", s => s.delete(id));
  async function open(id) {
    const file = await op("readonly", s => s.get(id));
    if (!file) throw Error("Lampiran tidak ditemukan di browser ini.");
    const url = URL.createObjectURL(file), a = document.createElement("a");
    a.href = url; a.download = file.name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  return { save, remove, open };
})();
