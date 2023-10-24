const $$$ = document.querySelector.bind(document);
const name = "open_html_page";
document.dispatchEvent(
  new CustomEvent("immersiveTranslateDocumentMessageEventUpload", {
    detail: { name },
  }),
);

const open = (file) => {
  document.body.removeChild($$$("#drop-target"));
  if (file) {
    // check is txt file
    // check file name is ended with .txt

    if (file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt) {
        document.open();

        let txtContent = reader.result;
        if (!/(\r\n\r\n)|(\n\n)/.test(txtContent)) {
          txtContent = txtContent.replace(/(\r\n)|(\n)/g, "\n\n");
        }
        const html =
          `<html><head><meta name="color-scheme" content="light dark"></head><body><pre style="word-wrap: break-word; white-space: pre-wrap; font-size:16px;">${txtContent}</pre></body></html>`;
        document.write(html);
        document.close();
      };
      reader.onerror = function (evt) {
        alert("error reading file");
        window.location.reload();
      };
    } else {
      // html

      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt) {
        document.open();
        document.write(reader.result);
        document.close();
      };
      reader.onerror = function (evt) {
        alert("error reading file");
        window.location.reload();
      };
    }
  }
};

const dragOverHandler = (e) => e.preventDefault();
const dropHandler = (e) => {
  e.preventDefault();
  const item = Array.from(e.dataTransfer.items).find(
    (item) => item.kind === "file",
  );
  if (item) {
    const entry = item.webkitGetAsEntry();
    open(entry.isFile ? item.getAsFile() : entry).catch((e) =>
      console.error(e)
    );
  }
};
const dropTarget = $$$("#drop-target");
dropTarget.addEventListener("drop", dropHandler);
dropTarget.addEventListener("dragover", dragOverHandler);

$$$("#file-input").addEventListener("change", (e) => open(e.target.files[0]));
$$$("#file-button").addEventListener("click", () => {
  const inputElement = document.querySelector("#file-input");
  inputElement.click();
});

function escapeHTML(htmlStr) {
  return htmlStr
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\//g, "&#x2F;");
}