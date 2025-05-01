const crearteWebhook = document.querySelector(".webhook_create");
crearteWebhook.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  fetch("http://127.0.0.1:8000/api/webhook_url", {
    method: "POST",
    body: formData,
  })
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      console.log(res);
      if (res.ok) {
        alert("資料創建成功");
      } else if (res.error) {
        alert(`${res.message}`);
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

const updateWebhook = document.querySelector(".webhook_update");
updateWebhook.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  fetch("http://127.0.0.1:8000/api/webhook_url/update", {
    method: "POST",
    body: formData,
  })
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      console.log(res);
      if (res.ok) {
        alert("資料更新成功");
      } else if (res.error) {
        alert(`${res.message}`);
      }
    })
    .catch((e) => {
      console.log(e);
    });
});
