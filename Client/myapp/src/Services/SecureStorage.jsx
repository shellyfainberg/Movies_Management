import secureLocalStorage from "react-secure-storage";

//  function to handle local storage settter and getter
export const getFromLocalStorage = (key) => {
  let data = secureLocalStorage.getItem(key);
  if (data === undefined) {
    console.log("item is undifined");
    return;
  }
  data = JSON.parse(data);
  return data;
};

export const setInLocalStorage = (key, obj) => {
  if (!obj) {
    throw new Error("item is undifined");
  }
  obj = JSON.stringify(obj);
  secureLocalStorage.setItem(key, obj);
};
