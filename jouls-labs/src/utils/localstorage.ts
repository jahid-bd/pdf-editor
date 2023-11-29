export const injectItem = (item: any) => {
  const items = getItems("item") || [];
  items.push(item);

  setItems("item", items);
};
export const updateItem = (id: string, item: any) => {
  const items = getItems("item") || [];
  const mapItems = items.map((v: any) => (v.id === id ? { ...v, ...item } : v));
  setItems("item", mapItems);
};
export const deleteItem = (id: string) => {
  const items = getItems("item") || [];
  const mapItems = items.filter((v: any) => v.id !== id);
  setItems("item", mapItems);
};

export const getItems = (key: string) => {
  try {
    const str = localStorage.getItem(key);
    const parse = JSON.parse(str || "");
    return parse;
  } catch (error) {
    return null;
  }
};
export const getItemsByPage = (page: string) => {
  try {
    const str = localStorage.getItem("item");
    const parse = JSON.parse(str || "");
    return parse.filter((v: any) => v.page == page);
  } catch (error) {
    return null;
  }
};
export const setItems = (key: string, items: any) => {
  try {
    const str = JSON.stringify(items);
    localStorage.setItem(key, str);
  } catch (error) {
    return null;
  }
};

export const storePdf = (pdfs: any) => {
  try {
    const items = getItems("pdfs") || [];
    items.push(pdfs);

    setItems("pdfs", items);
  } catch (error) {
    return null;
  }
};

export const clearStore = (key: string) => {
  localStorage.removeItem(key);
};

export const clearPdfStore = () => {
  clearStore("pdfs");
};
