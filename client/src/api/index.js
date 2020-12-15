export const _post = (url, data) =>
  new Promise((resolve, reject) => {
    fetch(url, {
      method: "post",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((r) => {
        return r.json();
      })
      .then((res) => {
        resolve(res);
        res.message && alert(res.message);
      })
      .catch((er) => reject(er));
  });

export const _get = (url, data) =>
  new Promise((resolve, reject) => {
    let query;
    if (data) {
      query = Object.keys(data)
        .map((key) => {
          return key + "=" + data[key];
        })
        .join("&");
    }

    if (query) {
      url = url + "?" + query;
    }
    fetch(url, {
      query: data,
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((r) => {
        return r.json();
      })
      .then((res) => {
        res.message && alert(res.message);
        resolve(res);
      })
      .catch((e) => {
        console.log(e);
      });
  });
