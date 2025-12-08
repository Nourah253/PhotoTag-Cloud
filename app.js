// ===============================
// CONFIG
// ===============================
const PRESIGN_ENDPOINT =
  "https://7hycjmevn73etpygzuw2v4y5ri0acyyk.lambda-url.us-east-2.on.aws/";

const IMAGE_BUCKET = "phototag-cloud-nnm-images";

const TAGS_AI_ENDPOINT =
  "https://bxlrmhatlg6l7agejgaaxg7fdu0oifmo.lambda-url.us-east-2.on.aws/";

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const status = document.getElementById("status");
const gallery = document.getElementById("gallery");


// ===============================
// UPLOAD IMAGE TO S3
// ===============================
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Choose a file first.");

  const filename = Date.now() + "-" + file.name;
  status.innerText = "Requesting upload URL...";

  // 1️⃣ Get presigned URL (read the body ONCE)
  const presignRes = await fetch(PRESIGN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: filename })
  });

  const bodyText = await presignRes.text();
  console.log("PRESIGN LAMBDA RESPONSE:", bodyText);

  let url;
  try {
    ({ url } = JSON.parse(bodyText));
  } catch (e) {
    return alert("Failed to parse presign response: " + bodyText);
  }

  // 2️⃣ Upload image to S3
status.innerText = "Uploading...";
const uploadRes = await fetch(url, {
  method: "PUT",
  headers: { "Content-Type": file.type },
  body: file,
});

const uploadText = await uploadRes.text();
console.log("UPLOAD STATUS:", uploadRes.status);
console.log("UPLOAD RESPONSE:", uploadText);

if (!uploadRes.ok) {
  alert("Upload failed with status " + uploadRes.status + "\n" + uploadText);
  return;
}


  status.innerText = "Uploaded! Fetching tags...";

  // 3️⃣ Request image labels
  const labels = await getLabels(filename);

  // 4️⃣ Refresh gallery
  loadGallery(filename, labels);
});


// ===============================
// CALL REKOGNITION LAMBDA
// ===============================
async function getLabels(key) {
  try {
    const res = await fetch(TAGS_AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket: IMAGE_BUCKET, key })
    });

    const data = await res.json();
    return data.labels ?? [];
  } catch (err) {
    console.error("Label fetch error:", err);
    return [];
  }
}


// ===============================
// LIST IMAGES IN S3 (only the images bucket)
// ===============================
async function listImages() {
  const xml = await fetch(
    `https://${IMAGE_BUCKET}.s3.us-east-2.amazonaws.com/`
  ).then(r => r.text());

  const doc = new DOMParser().parseFromString(xml, "application/xml");

  return [...doc.getElementsByTagName("Key")]
    .map(n => n.textContent)
    .filter(k => /\.(jpg|jpeg|png|gif)$/i.test(k));
}


// ===============================
// RENDER GALLERY
// ===============================
async function loadGallery(latestKey = null, latestLabels = null) {
  gallery.innerHTML = "Loading images...";

  const keys = await listImages();
  gallery.innerHTML = "";

  for (const key of keys) {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = `https://${IMAGE_BUCKET}.s3.us-east-2.amazonaws.com/${key}`;
    img.alt = key;

    const labelsDiv = document.createElement("div");
    labelsDiv.className = "labels";

    const labels =
      key === latestKey && latestLabels
        ? latestLabels
        : await getLabels(key);

    labelsDiv.innerText = "Tags: " + labels.join(", ");

    card.appendChild(img);
    card.appendChild(labelsDiv);
    gallery.appendChild(card);
  }
}


// Render gallery on page load
loadGallery();
